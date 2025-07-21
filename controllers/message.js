import { db } from '../connect.js'
import { createNotification } from './notification.js'
import { io } from '../index.js';
import nodemailer from 'nodemailer';


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
      INSERT INTO messages (conversations, sender_id, recipient_id, messages, sent_at)
      VALUES (${conversationId}, ${sender_id}, ${recipient_id}, ${messages}, NOW());
    `;

    // Emitir evento de nova mensagem via Socket.IO
    io.to(String(recipient_id)).emit('nova_mensagem', {
      conversationId,
      sender_id,
      recipient_id,
      messages,
      sent_at: new Date().toISOString()
    });

    // Buscar o nome do usuário que enviou a mensagem para a notificação
    const senderUser = await db`
      SELECT username, email FROM users WHERE id = ${sender_id}
    `;
    // Buscar o e-mail do destinatário
    const recipientUser = await db`
      SELECT email FROM users WHERE id = ${recipient_id}
    `;

    // Enviar e-mail para o destinatário
    if (recipientUser.length > 0 && senderUser.length > 0) {
      // Configure o transporter do Nodemailer (exemplo com Gmail, troque para seu provedor real)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // defina no .env
          pass: process.env.EMAIL_PASS  // defina no .env
        }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipientUser[0].email,
        subject: `Nova mensagem - Projeto Rede Social`,
        text: `Você recebeu uma nova mensagem de ${senderUser[0].username} na Projeto Rede Social: ${messages}\nAcesse: https://front-end-redes-sociais-sy53.vercel.app`,
        html: `<p>Você recebeu uma nova mensagem de <b>${senderUser[0].username}</b> na Projeto Rede Social:</p><p>${messages}</p><p><a href="https://front-end-redes-sociais-sy53.vercel.app">Acesse sua conta</a></p>`
      });
    }

    // Buscar o nome do usuário que enviou a mensagem para a notificação
    const senderUserForNotification = await db`
      SELECT username FROM users WHERE id = ${sender_id}
    `;

    // Criar notificação para o destinatário
    if (senderUserForNotification.length > 0) {
      // Verificar se já existe uma notificação não lida da mesma conversa
      const existingNotification = await db`
        SELECT id FROM notifications 
        WHERE user_id = ${recipient_id} 
          AND from_user_id = ${sender_id} 
          AND notification_type = 'message' 
          AND reference_id = ${conversationId}
          AND is_read = FALSE
      `;

      // Só criar nova notificação se não existir uma não lida da mesma conversa
      if (existingNotification.length === 0) {
        const notificationMessage = `${senderUserForNotification[0].username} enviou uma mensagem para você`;
        await createNotification(
          recipient_id,
          sender_id,
          'message',
          conversationId,
          notificationMessage
        );
      }
    }

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
  
  const data = await db`SELECT 
    messages.id,
    messages.conversations,
    messages.sender_id,
    messages.recipient_id,
    messages.messages,
    messages.is_read,
    EXTRACT(EPOCH FROM messages.sent_at) as sent_at,
    users.username,
    users.userimg 
  FROM messages 
  JOIN users ON users.id = messages.sender_id
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

  // Validação dos parâmetros
  if (isNaN(conversation_id) || isNaN(user_id)) {
    return res.status(400).json({ message: 'IDs devem ser números válidos.' });
  }

  try {
    // Verifica se a conversa existe
    const conversationExists = await db`
      SELECT id FROM conversations WHERE id = ${conversation_id}
    `;

    if (conversationExists.length === 0) {
      return res.status(404).json({ message: 'Conversa não encontrada.' });
    }

    // Verifica se o usuário existe
    const userExists = await db`
      SELECT id FROM users WHERE id = ${user_id}
    `;

    if (userExists.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const result = await db`
      UPDATE messages
      SET is_read = TRUE
      WHERE conversations = ${conversation_id}
        AND recipient_id = ${user_id}
        AND is_read = FALSE;
    `;
   
    return res.status(200).json({ 
      message: `${result.count} mensagens marcadas como lidas.`,
      updatedCount: result.count 
    });
  } catch (error) {
    console.error('Erro ao marcar mensagens como lidas:', error);
    return res.status(500).json({ 
      message: 'Erro interno do servidor ao marcar mensagens como lidas.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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
