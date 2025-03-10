const db = require("../database/database.acces")
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECERT


async function  userAuthentificate(req,res,next){
  try{
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return res.status(400).json("Unathorized action")
    }
    
    const query = "SELECT * FROM Blacklisted_token WHERE token=?"

    const conn = await db.connexion
    const result = await conn.query(query, [token])

    if (result.length > 0) {
      return res.status(401).json({ message: 'Token has been revoked.' });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded; 
      next(); 
    } 
    catch (error) {
      console.log(error)
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
    
  }
  catch(error){
    console.log(error)
    return res.status(401).json({ message: '[AUTHENTIFICATION] Something went wrong' });
  }
}
