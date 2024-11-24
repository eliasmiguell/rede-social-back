import { db } from '../connect.js'


export const sendMessage = async (req, res) => {
  const { sender_id, recipient_id, messages } = req.body;

  if (!sender_id || !recipient_id || !messages) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Verifica ou cria a conversa
    let conversation = await db`
      SELECT id 
      FROM conversations 
      WHERE 
        (user1_id = ${sender_id} AND user2_id = ${recipient_id}) OR
        (user1_id = ${recipient_id} AND user2_id = ${sender_id});
    `;

    let conversationId;

    if (conversation.length > 0) {
      conversationId = conversation[0].id;
    } else {
      const newConversation = await db`
        INSERT INTO conversations (user1_id, user2_id)
        VALUES (${sender_id}, ${recipient_id}) 
        RETURNING id;
      `;
      conversationId = newConversation[0].id;
    }

    // Insere a mensagem na conversa correspondente
    await db`
      INSERT INTO messages (conversations, sender_id, recipient_id, messages)
      VALUES (${conversationId}, ${sender_id}, ${recipient_id}, ${messages});
    `;

    return res.status(201).json({ message: 'Mensagem enviada com sucesso.', conversationId });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const  getConversationMessages = async (req, res)=>{
  const {conversationsId } = req.query;
if (!conversationsId || isNaN(conversationsId)) {
  return res.status(400).json({ message: 'O ID da conversa é obrigatório e deve ser um número válido.' });
}

try {
  
  const data = await db`SELECT messages .*, users.username, users.userimg 
  FROM messages JOIN users ON users.id= messages.sender_id
  WHERE messages.conversations = ${conversationsId} 
  ORDER BY messages.sent_at ASC`;
  
   return res.status(200).json({data})
  
} catch (error) {
  console.error('Erro ao criar mensagem:', error);
    return res.status(500).json({ message: 'Erro ao mostrar messagem.' });
}


  
}

export const markAllMessagesAsRead = async (req, res) => {
  const { conversation_id, user_id } = req.query;


  if (!conversation_id || !user_id) {
    return res.status(400).json({ message: 'IDs de conversa e usuário são obrigatórios.' });
  }

  try {
    const result = await db`
      UPDATE messages
      SET is_read = TRUE
      WHERE conversations = ${conversation_id}
        AND recipient_id = ${user_id}
        AND is_read = FALSE;
    `;
   
    return res.status(200).json({ message: `${result.count} mensagens marcadas como lidas.` });
  } catch (error) {
    console.error('Erro ao marcar mensagens como lidas:', error);
    return res.status(500).json({ message: 'Erro interno do servidor ao marcar mensagens como lidas.' });
  }
};
export const deletemessage = async (req, res)=>{
  const {message_id} = req.query;
  
  if(!message_id ){
   return res.status(400).json({message: 'Id é obrigatório.'})
  }
  
  try {
    await db`DELETE FROM messages WHERE id=${message_id}`;
                        
   return res.status(200).json({message: "Conversa exclida com sucesso com sucesso."})
  } catch (error) {
         console.log(error)
      return res.status(500).json({message: "Ocorreu algum erro no servidor, tente novamente mais tarde!"})
      
  }
  }
