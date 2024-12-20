const db = require("../database/database.acces")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtSecret = process.env.JWT_SECERT

async function getLogin(req,res){

try{
    const {address,password,role} = req.body

    if(!address.trim()){
        return res.json({ message: "The address field is missing!!" })
    }

    if(!password.trim()){
        return res.json({ message: "The password field is missing!!" })
    }

    if(!role.trim()){
        if (role === "admin") {
            return res.json({ message: "Something went wrong with the role field!!" })
        }
    }
    
    const conn = await db.connexion
    const user = await conn.query(`SELECT password FROM Client WHERE address='${address} '`)
   
    
    if (user.length === 1) {
        const passwordChecker = await bcrypt.compare(password, user[0].password)

        if(!passwordChecker) return res.status(200).json({ message: "Unauthorized request"})

        const token = jwt.sign({
            userId: user[0].id,
            username: user[0].firstname
          }, 
          jwtSecret,{expiresIn: "24h"})

        return res.header('Authorization', `Bearer ${token}`).status(200).json({
            message: 'Login successful',
        });
    }
    res.status(200).json({ message: "User doesn't exist, change the field values and retry"})
  }
catch(error){
    console.log(error)
    res.status(400).json({ message:"[LOGIN_SESSION] something went wrong"})
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