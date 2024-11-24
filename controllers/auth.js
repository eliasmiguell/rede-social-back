import { db } from '../connect.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'O nome é obrigatório!' });
  }
  if (!email) {
    return res.status(400).json({ message: 'O email é obrigatório!' });
  }
  if (!password) {
    return res.status(400).json({ message: 'A senha é obrigatória!' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'As senhas não são iguais!' });
  }

  try {
    const emailExist = await db`SELECT email FROM users WHERE email = ${email}`;

    if (emailExist.length > 0) {
      return res.status(500).json({ message: 'Este email já está sendo utilizado!' });
    } else {
      const passwordHash = await bcrypt.hash(password, 8);
      await db`INSERT INTO users(username, email, password) VALUES(${username}, ${email}, ${passwordHash})`;

      return res.status(200).json("Cadastro efetuado com sucesso!");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ocorreu algum erro ao cadastrar o usuário, tente mais tarde!" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({ message: 'Usuário não encontrado!' });
  }

  try {
    const user = await db`SELECT * FROM users WHERE email=${email}`;
    if (user.length === 0) return res.status(200).json({ message: "Usuário não encontrado!" });

    const checkPassword = await bcrypt.compare(password, user[0].password);

    if (email !== user[0].email || checkPassword === false) {
      return res.status(404).json({ message: 'A senha ou o email é inválido!' });
    }

    const refreshToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 100) + 24 * 60 * 60,
        id: user[0].password,
      },
      process.env.REFRESH,
      { algorithm: "HS256" }
    );

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 100) + 3600,
        id: user[0].password,
      },
      process.env.TOKEN,
      { algorithm: "HS256" }
    );

    delete user.password;
    return res
      .cookie('accessToken', token, { httpOnly: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .status(200)
      .json({ message: "Usuário logado com sucesso!", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ocorreu algum erro no servidor, tente novamente mais tarde!" });
  }
};

export const logout = (req, res) => {
  return res
    .clearCookie("accessToken", { secure: true, sameSite: "none" })
    .clearCookie("refreshToken", { secure: true, sameSite: "none" })
    .status(200)
    .json({ message: "Logout efetuado com sucesso." });
};

export const refresh = async (req, res) => {
  const authHeader = req.headers.cookie?.split("; ")[1];
  const refresh = authHeader && authHeader.split("=")[1];

  const tokenStruct = refresh.split('.')[1];
  const payload = atob(tokenStruct);

  try {
    const refreshToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 100) + 24 * 60 * 60,
        id: JSON.parse(payload).id,
      },
      process.env.REFRESH,
      { algorithm: "HS256" }
    );

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 100) + 3600,
        id: JSON.parse(payload).id,
      },
      process.env.TOKEN,
      { algorithm: "HS256" }
    );

    return res
      .cookie('accessToken', token, { httpOnly: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .status(200)
      .json({ message: "Token atualizado com sucesso!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ocorreu algum erro no servidor, tente novamente mais tarde!" });
  }
};
