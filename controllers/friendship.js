import {db} from '../connect.js'
import { createNotification } from './notification.js'

export const addFriendship = async (req, res)=>{
  const {follower_id, followed_id}=req.body;

  if (!follower_id || !followed_id) {
    return res.status(400).json({ message: 'Os campos follower_id e followed_id são obrigatórios.' });
  }

  if (isNaN(follower_id) || isNaN(followed_id)) {
    return res.status(400).json({ message: 'Os IDs devem ser números válidos.' });
  }

  if (follower_id === followed_id) {
    return res.status(400).json({ message: 'Você não pode seguir a si mesmo.' });
  }

  try {
    // Verificar se já existe a amizade
    const existingFriendship = await db`
      SELECT id FROM friendship 
      WHERE follower_id = ${follower_id} AND followed_id = ${followed_id}
    `;

    if (existingFriendship.length > 0) {
      return res.status(400).json({ message: 'Você já está seguindo este usuário.' });
    }

    // Buscar informações do usuário que está seguindo
    const followerUser = await db`
      SELECT username FROM users WHERE id = ${follower_id}
    `;

    if (followerUser.length === 0) {
      return res.status(404).json({ message: 'Usuário que está seguindo não encontrado.' });
    }

    // Inserir a amizade
    await db`INSERT INTO friendship(follower_id, followed_id) VALUES(${follower_id}, ${followed_id})`;
    
    // Criar notificação para o usuário que foi seguido
    const notificationMessage = `${followerUser[0].username} começou a seguir você`;
    await createNotification(followed_id, follower_id, 'follow', null, notificationMessage);
    
    return res.status(201).json({message: 'Você está seguindo esse usuário.'})
  } catch (error) {
    console.error("Erro ao seguir usuário:", error);  
    return res.status(500).json({ message: "Ocorreu um erro ao seguir usuário. Por favor, tente novamente mais tarde." });
  }
}

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

export const getFriendship = async (req, res)=>{

  const { follower_id } = req.query;

  if (!follower_id || isNaN(follower_id)) {
    return res.status(400).json({ message: "follower_id inválido" });
  }
  try {
 
    const data = await db`SELECT friendship.*, users.username, users.userimg
    FROM friendship
    JOIN users ON users.id = followed_id
    WHERE follower_id = ${follower_id};
    `;
   
    return res.status(200).json( {data} )

    
  } catch (error) {
      console.error("Erro ao mostrar os seguidores:", error);  
    return res.status(500).json({ message: "Ocorreu um erro ao mostrar os seguidores. Por favor, tente novamente mais tarde." });
  }
}