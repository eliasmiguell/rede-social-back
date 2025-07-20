import { db } from '../connect.js'
export const creacteConversation = async (req, res)=>{
  const { user1_id, user2_id } = req.body;

  if (!user1_id || !user2_id) {
    return res
      .status(400)
      .json({ message: 'A conversa deve conter pelo menos dois participantes.' });
  }

  try {
    // Verifica se já existe uma conversa entre os dois usuários
    const existingConversation = await db`
      SELECT id 
      FROM conversations 
      WHERE 
        (user1_id = ${user1_id} AND user2_id = ${user2_id}) OR 
        (user1_id = ${user2_id} AND user2_id = ${user1_id})
    `;

    if (existingConversation.length > 0) {
      // Se a conversa já existe, retorna o ID dela
      return res.status(200).json({
        message: 'Conversa já existente.',
        conversationId: existingConversation[0].id,
      });
    }

    // Se não existe, cria uma nova conversa
    const newConversation = await db`
      INSERT INTO conversations (user1_id, user2_id) 
      VALUES (${user1_id}, ${user2_id}) 
      RETURNING id
    `;

    return res.status(201).json({
      message: 'Conversa criada com sucesso.',
      conversationId: newConversation[0].id,
    });
  } catch (error) {
    console.error('Erro ao criar conversa:', error);
    return res.status(500).json({
      message: 'Ocorreu algum erro no servidor, tente novamente mais tarde!',
    });
  }

}

export const getUserConversation = async (req, res) => {
  const userid = req.query.userid;

  if (!userid || isNaN(userid)) {
    return res.status(400).json({ message: 'ID inválido ou ausente.' });
  }

  try {
    const data = await db`
      SELECT conversations.id, 
             CASE 
               WHEN conversations.user1_id = ${userid} THEN users2.username 
               ELSE users1.username 
             END AS other_username,
             CASE 
               WHEN conversations.user1_id = ${userid} THEN users2.userimg 
               ELSE users1.userimg 
             END AS other_userimg,
             CASE 
               WHEN conversations.user1_id = ${userid} THEN conversations.user2_id 
               ELSE conversations.user1_id 
             END AS other_user_id
      FROM conversations
      LEFT JOIN users AS users1 ON users1.id = conversations.user1_id
      LEFT JOIN users AS users2 ON users2.id = conversations.user2_id
      LEFT JOIN friendship AS f1 ON (f1.follower_id = ${userid} AND f1.followed_id = conversations.user2_id AND f1.status = 'accepted')
      LEFT JOIN friendship AS f2 ON (f2.follower_id = ${userid} AND f2.followed_id = conversations.user1_id AND f2.status = 'accepted')
      WHERE (conversations.user1_id = ${userid} OR conversations.user2_id = ${userid})
        AND (f1.follower_id IS NOT NULL OR f2.follower_id IS NOT NULL);
    `;

    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: 'Ocorreu algum erro no servidor, tente novamente mais tarde!' });
  }
};

export const getConversationById = async (req, res) => {
  const { currentUserId, idUser } = req.query;
 
  if(!currentUserId || !idUser){
    res.status(400).json({message:"Os ids são obrigatórios."})
  }

  try {
    const data = await db`
      SELECT users.id, users.username, users.userimg
      FROM conversations JOIN users ON users.id = conversations.user1_id
      OR users.id = conversations.user2_id WHERE conversations.id = ${currentUserId} AND users.id != ${idUser};
    `;
    
    if (!data) {
      return res.status(404).json({ message: 'Conversa não encontrada' });
    }
 
    res.status(200).json(data); // Retorna apenas os dados do outro usuário
  } catch (error) {
    console.error('Erro ao buscar conversa:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const deleteConversation = async (req, res)=>{
  const {conversation_id} = req.query;
  
  if(!conversation_id ){
   return res.status(400).json({message: 'Id é obrigatório.'})
  }
  
  try {
    await db`DELETE FROM conversations WHERE id=${conversation_id}`;
                        
   return res.status(200).json({message: "Conversa exclida com sucesso com sucesso."})
  } catch (error) {
     console.log(error)
      return res.status(500).json({message: "Ocorreu algum erro no servidor, tente novamente mais tarde!"})
  }
  }