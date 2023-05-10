import jwt, { decode } from 'jsonwebtoken';

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret123');

      req.userId = decoded._id;

      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: 'no way' });
    }
  } else {
    return res.status(403).json({ message: 'we didnt get token' });
  }
};
