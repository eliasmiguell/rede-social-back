import {db} from '../connect.js'


export const addFriendship = async (req, res)=>{
  const {follower_id, followed_id}=req.body;

  if (!follower_id || !followed_id) {
    return res.status(400).json({ message: 'Os campos follower_id e followed_id são obrigatórios.' });
  }

  if (isNaN(follower_id) || isNaN(followed_id)) {
    return res.status(400).json({ message: 'Os IDs devem ser números válidos.' });
  }
  try {
    const data = await db`INSERT INTO friendship(follower_id, followed_id) VALUES(${follower_id}, ${followed_id})`;
    
    return res.status(201).json({message: 'Você esta seguindo esse usuário.'})
  } catch (error) {
    console.error("Erro ao seguir usuário:", error);  
    return res.status(500).json({ message: "Ocorreu um erro ao seguir usuário. Por favor, tente novamente mais tarde." });
  }
}

export const deleteFriendship = async (req, res)=>{
  const {follower_id, followed_id}=req.query;

  try {
    await db`DELETE FROM friendship WHERE follower_id=${follower_id} AND followed_id=${followed_id} `;
   return res.status(200).json({message: 'Você não esta mais seguindo esse usuário.'})
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
    return res.status(500).json({ message: "Ocorreu um ao mostrar os seguidores. Por favor, tente novamente mais tarde." });
  }
}