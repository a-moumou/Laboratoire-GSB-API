const db = require("../database/database.acces")
const JSONbig = require('json-bigint')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECERT



exports.getAllClients = async (req,res) => {
    try{
        const conn = await db.connexion
        const oneProduct = await conn.query("SELECT * FROM Client");
        res.status(200).json(oneProduct)
    }catch( error ){
        console.log(error)
        res.status(409).json({ message:"[CLIENTS_GET] something went wrong" })
    }
}




exports.getSingleClient = async (req,res) => {
    try{
      const id = req.params.id
      const conn = await db.connexion
      if (!id) {
        res.json("Id is required")
      }
      const client = await conn.query("SELECT * FROM Client WHERE id= ?",[id]);
      res.status(200).json(client)
    }catch( error ){
        console.log(error)
        res.status(409).json({ message: "[CLIENT_GET] something went wrong"  })
    }
}




exports.createNewClient = async (req,res) => {
      try{
        const { lastname, firstname, address, password, city, postal_code, siren } = req.body

        const requiredFields = { lastname, firstname, address, password, city, postal_code,siren }
        for (const [field, value] of Object.entries(requiredFields)) {
          if (!value) {
              return res.status(400).json({ message: `<< ${field} >> field is required` });
          }
          if (typeof value === 'string' && value.trim() === '') {
            return res.status(400).json({ message: `<< ${field} >> must have a proper value` });
          }
         }

        const conn = await db.connexion

        const sirenChecker = await conn.query(`SELECT * FROM Client WHERE siren = ?`, [siren]);
        if (sirenChecker.length > 0) {
            return res.status(400).json({ message: "Siren already exists" });
        }

        const addressChecker = await conn.query(`SELECT * FROM Client WHERE address = ?`, [address]);
        if (addressChecker.length > 0) {
            return res.status(400).json({ message: "Address already exists" });
        }

        const postalCodeChecker = await conn.query(`SELECT * FROM Client WHERE postal_code = ?`, [postal_code]);
        if (postalCodeChecker.length > 0) {
            return res.status(400).json({ message: "Postal code already exists" });
        }
        
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        await conn.query(
          "INSERT INTO Client (lastname, firstname, address, password, siren, city, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?)", 
          [lastname, firstname, address, hashedPassword, siren, city, postal_code ]
        );
    
        res.status(201).json({ message: "Client successfully added" });

      }
      catch(error){
        console.log(error)
        res.status(409).json({ message:"[CLIENT_POST] something went wrong" })
      }
}




exports.patchSingleClient = async (req,res)=>{
  try{
    const body = req.body
    const {id} = req.params
    const { lastname, firstname, address, password, city } = body

    const requiredFields = { lastname, firstname, address, password, city }
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
          return res.status(400).json({ message: `<< ${field} >> field is required` });
      }
      if (typeof value === 'string' && value.trim() === '') {
        return res.status(400).json({ message: `<< ${field} >> must have a proper value` });
      }
     }

    const conn = await db.connexion;

    const userChecker = await conn.query(`SELECT * FROM Client WHERE id = '${ id }'`)
    if (userChecker.length == 0) {
      return res.status(400).json({ message: "User doesn't exist" })
    }
    
    const addressChecker = await conn.query(`SELECT * FROM Client WHERE address = ?`, [address]);
    if (addressChecker.length > 0) {
        return res.status(400).json({ message: "Address already exists" });
    }

    const sqlQuery = "UPDATE Client SET lastname=?, firstName=?, address=?, password=?, city=? WHERE id =?"

    const client = await conn.query(sqlQuery,[lastname, firstname, address, password,city, id]);

    res.status(200).json(JSONbig.stringify(client));
  }
  catch(error){
      console.log(error)
      res.status(404).json({ message:"[CLIENT_PATCH] something went wrong" })
  }
}




exports.deleteSingleClient = async (req, res) => {
    try{
      const id = req.params.id

      if(!id){
        return res.status(400).json({ message:"Id is required"})
      }
      const conn = await db.connexion

      const userChecker = await conn.query(`SELECT * FROM Client WHERE id = '${ id }'`)
      if (userChecker.length == 0) {
        return res.status(400).json({ message: "User doesn't exist" })
      }

      await conn.query(`DELETE FROM Client WHERE id = ${id}`)
      res.status(200).json({ message: "Operation is successfully"})
    }
    catch(error){
      console.log(error)
      res.status(400).json({ message:"[CLIENT_DELETE] something went wrong"})
    }
}



exports.openUserLogin = async (req, res) => {

  try{
    const { address, password } = req.body
    
    const conn = await db.connexion
    const user = await conn.query(`SELECT id, firstname, password FROM Client WHERE address='${address} '`)
   
    if (user.length === 1) {
       const passwordChecker = await bcrypt.compare(password, user[0].password)

       if(!passwordChecker) return res.status(200).json({ message: "Unauthorized request"})

        const token = jwt.sign({
            userId: user[0].id,
            username: user[0].firstname
          }, jwtSecret,{expiresIn: "24h"})

        return res.header('Authorization', `Bearer ${token}`).status(200).json({
            client_id: user[0].id,
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


exports.logout = async (req, res) =>{
  try{
    
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
     return res.status(201).json("Unauthorized request")
    }
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