import { db } from '../connect.js'


export const getUsers = async (req, res)=>{
  const id = req.query.id

  if(!id){
    return res.status(422).json({message: 'Precisamos do id do usuario'})
  }

  try {
    const data =await db`SELECT username, userimg, bgimg, users.id FROM users WHERE id=${id}`

    return res.status(200).json(data)
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Ocorreu algum erro no servidor, tente novamente mais tarde!"})
  }
  
}
export const updateUsers = async (req,res)=>{
  const { username,userimg, bgimg, id } = req.body

  if(!username || !userimg || !bgimg || !id ){
    return res.status(422).json({message: 'Todos os campos precisam ser preenchidos para atualizar usuário'})
  }

  try {
    await  db`UPDATE users 
      SET username = ${username}, userimg = ${userimg}, bgimg = ${bgimg} 
      WHERE id = ${id}`;

    return res.status(200).json({message: "Usuário atualizado com sucesso!"});
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Ocorreu algum erro no servidor, tente novamente mais tarde!"})
  }
  
}