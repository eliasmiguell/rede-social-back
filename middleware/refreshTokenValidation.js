import jwt from 'jsonwebtoken'

export const checkRefreshToken = (req, res, next) => {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) {
      return res.status(401).json({ message: "Acesso negado." });
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
      return res.status(401).json({ message: "Acesso negado." });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Token invalido" });
  }
}