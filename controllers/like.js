import { db } from "../connect.js";

export const addLike = async (req, res) => {
  const { likes_userid, likes_postid } = req.body;
  try {
    await db`
      INSERT INTO likes (likes_userid, likes_postid)
      VALUES (${likes_userid}, ${likes_postid})
    `;

    return res.status(200).json({ message: "Like adicionado com sucesso" });
  } catch (err) {
    console.error("Erro ao adicionar like:", err);  // Corrigido `error` para `err`
    return res.status(500).json({ message: "Ocorreu um erro ao adicionar like. Por favor, tente novamente mais tarde." });
  }
};




export const deleteLike = async (req, res) => {
  const { likes_userid, likes_postid } = req.query;

  try {
    await db`
      DELETE FROM likes
      WHERE likes_userid = ${likes_userid} AND likes_postid = ${likes_postid}
    `;
    return res.status(200).json({ message: "Like removido com sucesso" });
  } catch (error) {
    console.error("Erro ao remover like:", error);  // Corrigido `error`
    return res.status(500).json({ message: "Ocorreu um erro ao remover like. Por favor, tente novamente mais tarde." });
  }
};


export const getLike = async (req, res) => {
  try {
   
    const data = await db`
      SELECT likes.*, users.username
      FROM likes
      JOIN users ON users.id = likes.likes_userid
      WHERE likes.likes_postid = ${req.query.likes_postid}
    `;

    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ocorreu um erro ao recuperar likes. Por favor, tente novamente mais tarde." });
  }
};
