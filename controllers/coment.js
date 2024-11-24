import { db } from '../connect.js';

export const createComent = async (req, res) => {
  const { coment_desc, coment_userid, postid } = req.body;
  console.log(req.params)
  // Verificar se o userid foi enviado corretamente
  if (!coment_desc) {
    return res.status(400).json({ message: "O comentário precisa ter um texto." });
  }

  try {
    // Inserir o post na base de dados
    await db`
      INSERT INTO coments(coment_desc, coment_userid, postid) 
      VALUES(${coment_desc}, ${coment_userid}, ${postid})
    `;

    // Retornar sucesso
    return res.status(201).json({ message: "Comentário criado com sucesso!" });

  } catch (error) {
    console.error("Erro ao criar o comentário:", error); // Melhorar a depuração com log mais detalhado
    return res.status(500).json({ message: "Ocorreu um erro ao criar o comentário. Por favor, tente novamente mais tarde." });
  }
};


export const getComent = async (req, res) => {
 
  try {
    const data = await db`
      SELECT coments.*, users.username, userimg
      FROM coments
      JOIN users ON users.id = coments.coment_userid WHERE postid = ${req.query.postid} ORDER BY created_at DESC;
    `;

    return res.status(200).json({data});  
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ocorreu um erro ao recuperar os comentários. Por favor, tente novamente mais tarde." });
  }
};