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
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        id: user[0].id,
      },
      process.env.REFRESH,
      { algorithm: "HS256" }
    );

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 3600,
        id: user[0].id,
      },
      process.env.TOKEN,
      { algorithm: "HS256" }
    );

    const userWithoutPassword = { ...user[0] };
    delete userWithoutPassword.password;
    
    return res
      .cookie('accessToken', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
      })
      .cookie('refreshToken', refreshToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
      })
      .status(200)
      .json({ message: "Usuário logado com sucesso!", user: userWithoutPassword });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ocorreu algum erro no servidor, tente novamente mais tarde!" });
  }
};

export const logout = (req, res) => {
  return res
    .clearCookie("accessToken", { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    })
    .clearCookie("refreshToken", { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    })
    .status(200)
    .json({ message: "Logout efetuado com sucesso." });
};

export const refresh = async (req, res) => {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) {
      return res.status(400).json({ message: "Token invalido" });
    }

    const cookieArray = cookies.split(';');
    let refreshToken = null;
    
    for (const cookie of cookieArray) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'refreshToken') {
        refreshToken = value;
        break;
      }
    }

    if (!refreshToken) {
      return res.status(400).json({ message: "Token invalido" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH);
    
    const newRefreshToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        id: decoded.id,
      },
      process.env.REFRESH,
      { algorithm: "HS256" }
    );

    const newToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 3600,
        id: decoded.id,
      },
      process.env.TOKEN,
      { algorithm: "HS256" }
    );

    return res
      .cookie('accessToken', newToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
      })
      .cookie('refreshToken', newRefreshToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
      })
      .status(200)
      .json({ message: "Token atualizado com sucesso!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Token invalido" });
  }
};
