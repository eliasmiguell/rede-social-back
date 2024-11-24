import {db} from '../connect.js'

export const getNotification = async (req, res)=>{

  const { id_user } = req.query;

  if (!id_user || isNaN(id_user)) {
    return res.status(400).json({ message: "follower_id inválido" });
  }
  try {
 
    const data = await db`SELECT messages.*, users.username, users.userimg
      FROM messages JOIN users ON 
          users.id = messages.sender_id
      WHERE 
          messages.recipient_id = ${id_user} 
          AND messages.is_read = FALSE
    `;
   
    return res.status(200).json( {data} )

    
  } catch (error) {
      console.error("Erro ao mostrar os seguidores:", error);  
    return res.status(500).json({ message: "Ocorreu um ao mostrar os seguidores. Por favor, tente novamente mais tarde." });
  }
}

