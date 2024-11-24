import { db } from '../connect.js';

export const creaPost = async (req, res) => {
  const { post_desc, img, userid } = req.body;

  if (!userid) {
    return res.status(400).json({ message: "Usuário não identificado." });
  }

  if (!post_desc && !img) {
    return res.status(422).json({ message: "O post precisa ter um texto ou uma imagem." });
  }

  try {

    await db`
      INSERT INTO posts(post_desc, img, userid) 
      VALUES(${post_desc || null}, ${img || null}, ${userid})
    `;

    return res.status(201).json({ message: "Post criado com sucesso!" });

  } catch (error) {
    console.error("Erro ao criar o post:", error); // Melhorar a depuração com log mais detalhado
    return res.status(500).json({ message: "Ocorreu um erro ao criar o post. Por favor, tente novamente mais tarde." });
  }
};


export const getPost = async (req, res) => {

  //post só do usuário do perfil
  if(req.query.id){
    try {
      const data = await db`
        SELECT posts.*, users.username, userimg
        FROM posts
        JOIN users ON users.id = posts.userid WHERE users.id=${req.query.id} ORDER BY created_at DESC;
      `;
  
      return res.status(200).json({data});  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Ocorreu um erro ao recuperar os posts. Por favor, tente novamente mais tarde." });
    }

  }else{
    //post de rodos usuários 
    try {
      const data = await db`
        SELECT posts.*, users.username, userimg
        FROM posts
        JOIN users ON users.id = posts.userid ORDER BY created_at DESC;
      `;
  
      return res.status(200).json({data});  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Ocorreu um erro ao recuperar os posts. Por favor, tente novamente mais tarde." });
    }

  }
  
};