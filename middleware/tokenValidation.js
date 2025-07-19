import jwt from 'jsonwebtoken'

export const ckeckToken = (req, res, next) => {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) {
      return res.status(401).json({ message: "Acesso negado." });
    }

    const cookieArray = cookies.split(';');
    let accessToken = null;
    
    for (const cookie of cookieArray) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'accessToken') {
        accessToken = value;
        break;
      }
    }

    if (!accessToken) {
      return res.status(401).json({ message: "Acesso negado." });
    }

    const decoded = jwt.verify(accessToken, process.env.TOKEN);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Token invalido" });
  }
}