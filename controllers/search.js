import { db } from '../connect.js'

export const searchUser = async (req, res)=>{
  const params ="%" + req.query.params + "%";

  if(!params){
    return res.status(422).json({message: 'Precisamos do parâmetro'})
  }


  try {
    const data =await db`SELECT username, userimg, id FROM users WHERE  username LIKE ${params}`

    return res.status(200).json({data})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: "Ocorreu algum erro no servidor, tente novamente mais tarde!"})
  }
  
}

export const searchPost = async (req, res)=>{
  const params = "%" + req.query.params + "%";

  if(!params){
    return res.status(422).json({message: 'Precisamos do parâmetro'})
  }


  try {
    const data = await db`SELECT posts.*, users.username, userimg
    FROM posts JOIN users ON users.id = posts.userid WHERE post_desc LIKE ${params} 
    OR users.username LIKE ${params} ORDER BY created_at DESC`;

    return res.status(200).json({data})
  } catch (error) {
      console.log(error)
    return res.status(500).json({message: "Ocorreu algum erro no servidor, tente novamente mais tarde!"})
  }
  
}

