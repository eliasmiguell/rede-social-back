import {db} from '../connect.js'
import { createNotification } from './notification.js'

// Enviar solicitação de amizade
export const sendFriendshipRequest = async (req, res)=>{
  const {follower_id, followed_id}=req.body;

  if (!follower_id || !followed_id) {
    return res.status(400).json({ message: 'Os campos follower_id e followed_id são obrigatórios.' });
  }

  if (isNaN(follower_id) || isNaN(followed_id)) {
    return res.status(400).json({ message: 'Os IDs devem ser números válidos.' });
  }

  if (follower_id === followed_id) {
    return res.status(400).json({ message: 'Você não pode enviar solicitação para si mesmo.' });
  }

  try {
    // Verificar se já existe uma solicitação
    const existingFriendship = await db`
      SELECT id, status FROM friendship 
      WHERE follower_id = ${follower_id} AND followed_id = ${followed_id}
    `;

    if (existingFriendship.length > 0) {
      const friendship = existingFriendship[0];
      if (friendship.status === 'pending') {
        return res.status(400).json({ message: 'Você já enviou uma solicitação para este usuário.' });
      } else if (friendship.status === 'accepted') {
        return res.status(400).json({ message: 'Você já está seguindo este usuário.' });
      } else if (friendship.status === 'rejected') {
        // Permitir reenviar solicitação se foi rejeitada
        await db`
          UPDATE friendship 
          SET status = 'pending' 
          WHERE id = ${friendship.id}
        `;
      }
    } else {
      // Buscar informações do usuário que está enviando a solicitação
      const followerUser = await db`
        SELECT username FROM users WHERE id = ${follower_id}
      `;

      if (followerUser.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      // Inserir nova solicitação
      await db`INSERT INTO friendship(follower_id, followed_id, status) VALUES(${follower_id}, ${followed_id}, 'pending')`;
      
      // Criar notificação para o usuário que recebeu a solicitação
      const notificationMessage = `${followerUser[0].username} enviou uma solicitação para seguir você`;
      await createNotification(followed_id, follower_id, 'follow_request', null, notificationMessage);
    }
    
    return res.status(201).json({message: 'Solicitação enviada com sucesso.'})
  } catch (error) {
    console.error("Erro ao enviar solicitação:", error);  
    return res.status(500).json({ message: "Ocorreu um erro ao enviar solicitação. Por favor, tente novamente mais tarde." });
  }
}

// Aceitar solicitação de amizade
export const acceptFriendshipRequest = async (req, res)=>{
  const {follower_id, followed_id}=req.body;

  if (!follower_id || !followed_id) {
    return res.status(400).json({ message: 'Os campos follower_id e followed_id são obrigatórios.' });
  }

  try {
    // Verificar se existe uma solicitação pendente
    const existingRequest = await db`
      SELECT id FROM friendship 
      WHERE follower_id = ${follower_id} AND followed_id = ${followed_id} AND status = 'pending'
    `;

    if (existingRequest.length === 0) {
      return res.status(404).json({ message: 'Solicitação não encontrada ou já foi processada.' });
    }

    // Aceitar a solicitação
    await db`
      UPDATE friendship 
      SET status = 'accepted' 
      WHERE follower_id = ${follower_id} AND followed_id = ${followed_id}
    `;

    // Buscar informações do usuário que aceitou
    const followedUser = await db`
      SELECT username FROM users WHERE id = ${followed_id}
    `;

    // Criar notificação para o usuário que enviou a solicitação
    const notificationMessage = `${followedUser[0].username} aceitou sua solicitação para seguir`;
    await createNotification(follower_id, followed_id, 'follow_accepted', null, notificationMessage);
    
    return res.status(200).json({message: 'Solicitação aceita com sucesso.'})
  } catch (error) {
    console.error("Erro ao aceitar solicitação:", error);  
    return res.status(500).json({ message: "Ocorreu um erro ao aceitar solicitação. Por favor, tente novamente mais tarde." });
  }
}

// Rejeitar solicitação de amizade
export const rejectFriendshipRequest = async (req, res)=>{
  const {follower_id, followed_id}=req.body;

  if (!follower_id || !followed_id) {
    return res.status(400).json({ message: 'Os campos follower_id e followed_id são obrigatórios.' });
  }

  try {
    // Verificar se existe uma solicitação pendente
    const existingRequest = await db`
      SELECT id FROM friendship 
      WHERE follower_id = ${follower_id} AND followed_id = ${followed_id} AND status = 'pending'
    `;

    if (existingRequest.length === 0) {
      return res.status(404).json({ message: 'Solicitação não encontrada ou já foi processada.' });
    }

    // Rejeitar a solicitação
    await db`
      UPDATE friendship 
      SET status = 'rejected' 
      WHERE follower_id = ${follower_id} AND followed_id = ${followed_id}
    `;
    
    return res.status(200).json({message: 'Solicitação rejeitada com sucesso.'})
  } catch (error) {
    console.error("Erro ao rejeitar solicitação:", error);  
    return res.status(500).json({ message: "Ocorreu um erro ao rejeitar solicitação. Por favor, tente novamente mais tarde." });
  }
}

// Deixar de seguir (remover amizade)
export const deleteFriendship = async (req, res)=>{
  const {follower_id, followed_id}=req.query;

  try {
    await db`DELETE FROM friendship WHERE follower_id=${follower_id} AND followed_id=${followed_id} `;
   return res.status(200).json({message: 'Você não está mais seguindo esse usuário.'})
  } catch (error) {
    console.error("Erro ao deixar de seguir usuário:", error);  
    return res.status(500).json({ message: "Ocorreu um erro ao deixar de seguir usuário. Por favor, tente novamente mais tarde." });
  }
}

// Buscar seguidores aceitos
export const getAcceptedFriendships = async (req, res)=>{
  const { follower_id } = req.query;

  if (!follower_id || isNaN(follower_id)) {
    return res.status(400).json({ message: "follower_id inválido" });
  }
  try {
    const data = await db`SELECT friendship.*, users.username, users.userimg
    FROM friendship
    JOIN users ON users.id = followed_id
    WHERE follower_id = ${follower_id} AND status = 'accepted';
    `;
   
    return res.status(200).json( {data} )
    
  } catch (error) {
    console.error("Erro ao mostrar os seguidores:", error);  
    return res.status(500).json({ message: "Ocorreu um erro ao mostrar os seguidores. Por favor, tente novamente mais tarde." });
  }
}

// Buscar solicitações pendentes recebidas
export const getPendingRequests = async (req, res)=>{
  const { followed_id } = req.query;

  if (!followed_id || isNaN(followed_id)) {
    return res.status(400).json({ message: "followed_id inválido" });
  }
  try {
    const data = await db`SELECT friendship.*, users.username, users.userimg
    FROM friendship
    JOIN users ON users.id = follower_id
    WHERE followed_id = ${followed_id} AND status = 'pending'
    ORDER BY friendship.created_at DESC;
    `;
   
    return res.status(200).json( {data} )
    
  } catch (error) {
    console.error("Erro ao mostrar solicitações pendentes:", error);  
    return res.status(500).json({ message: "Ocorreu um erro ao mostrar solicitações pendentes. Por favor, tente novamente mais tarde." });
  }
}

// Verificar status da amizade entre dois usuários
export const getFriendshipStatus = async (req, res)=>{
  const { follower_id, followed_id } = req.query;

  if (!follower_id || !followed_id || isNaN(follower_id) || isNaN(followed_id)) {
    return res.status(400).json({ message: "IDs inválidos" });
  }
  try {
    const data = await db`SELECT status FROM friendship
    WHERE follower_id = ${follower_id} AND followed_id = ${followed_id};
    `;
   
    if (data.length === 0) {
      return res.status(200).json({ status: 'none' });
    }
    
    return res.status(200).json({ status: data[0].status });
    
  } catch (error) {
    console.error("Erro ao verificar status da amizade:", error);  
    return res.status(500).json({ message: "Ocorreu um erro ao verificar status da amizade. Por favor, tente novamente mais tarde." });
  }
}