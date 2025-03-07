const db = require("../database/database.acces")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECERT

async function getLogin(req,res){


try{
    const { email, password } = req.body

    if(typeof email == "string" && !email.trim()){
        return res.json({ message: "The email field is missing!!" })
    }

    if(typeof password == "string" && !password.trim()){
        return res.json({ message: "The password field is missing!!" })
    }

    
    const conn = await db.connexion
    const user = await conn.query(`SELECT id, password FROM Admin WHERE email='${email}'`)
   
    console.log(user)
    console.log(password)
    
    if (user.length === 1) {
        const passwordChecker = await bcrypt.compare(password, user[0].password)

        if(!passwordChecker) return res.status(200).json({ message: "Unauthorized request"})

        const token = jwt.sign({
            userId: user[0].id,
            username: user[0].firstname
          }, 
          jwtSecret,{expiresIn: "24h"})

        console.log(user[0].id,)

        return res.header('Authorization', `Bearer ${token}`).status(200).json({
            client_id: user[0].id,
            message: 'Login successful',
        });
    }
   return res.status(200).json({ message: "User doesn't exist, change the field values and retry"})
  }
catch(error){
    console.log(error)
    return res.status(400).json({ message:"[LOGIN_SESSION] something went wrong"})
  }
}


async function getLogout(req,res){
  try{
    
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    const query = "INSERT INTO Blacklisted_Token(token, revoked_at) VALUES( ?, NOW() )"
    const conn = await db.connexion
    conn.query(query,[token])

    res.json({message:"successfully logout "})
  }
  catch(error){
    console.log(error)
    res.status(400).json({ message:"[LOGOUT_SESSION] something went wrong"})
  }
}

   
module.exports = {
    getLogin,
    getLogout
}