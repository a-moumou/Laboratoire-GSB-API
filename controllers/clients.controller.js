const db = require("../database/database.acces")
const JSONbig = require('json-bigint')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { token } = require("morgan");
const ENV = require("../config");
const { use } = require("../routes/products.routes");



exports.getAllClients = async (req,res) => {
    try{
        const conn = await db.connexion
        const oneProduct = await conn.query("SELECT clientId, lastName, firstName, address FROM clients");
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
      const allClients = await conn.query("SELECT clientId, lastName, firstName, address FROM clients WHERE clientId= ?",[id]);
      res.status(200).json(allClients)
    }catch( error ){
        console.log(error)
        res.status(409).json({ message: "[CLIENT_GET] something went wrong"  })
    }
}




exports.createNewClient = async (req,res) => {
      try{
        const { lastName, firstName, address, password, siren } = req.body
        const isFieldsNoEmpty = lastName && firstName && address && password && siren

        if (!isFieldsNoEmpty) {
          return res.status(400).json({ message: "some fields are missing." });
        }


        const conn = await db.connexion
        const result = await conn.query(`SELECT * FROM clients WHERE address = '${ address }'`)
        if (result.length > 0) {
          res.status(400).json({ message: "User already exists" })
        }
        
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        await conn.query(
          "INSERT INTO clients (lastName, firstName, address, password, siren) VALUES (?, ?, ?, ?, ?)", 
          [lastName, firstName, address, hashedPassword, siren]
        );
    
        res.status(201).json({ message: "Client added successfully" });

      }
      catch(error){
        console.log(error)
        res.status(409).json({ message:"[CLIENT_POST] something went wrong" })
      }
}




exports.patchSingleClient = async (req,res)=>{
  try{
    const id = req.params.id;
    const body = req.body;
    const { lastName, firstName, address, password } = body
    const isFieldsNoEmpty = lastName && firstName && address && password

    if (!isFieldsNoEmpty) {
        return res.status(400).json({ message: "some fields are missing." });
    }

    const conn = await db.connexion;
    const sqlQuery = "UPDATE clients SET lastName=?, firstName=?, address=?, password=? WHERE clientId =?"
    const client = await conn.query(sqlQuery,[lastName, firstName, address, password, id]);

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
          res.status(400).json({ message:"[CLIENT_DELETE] operation is failed"})
      }
      const conn = await db.connexion
      await conn.query(`DELETE FROM clients WHERE clientId = ${id}`)
      res.status(200).json({ message: "Operation is successfully"})
    }
    catch(error){
      console.log(error)
      res.status(400).json({ message:"[CLIENT_DELETE] something went wrong"})
    }
}

exports.openUserLogin = async (req, res) => {

  try{
    const id = req.params
    const { address, password } = req.body
    
    const conn = await db.connexion
    const user = await conn.query(`SELECT clientId, firstName, password FROM clients WHERE address='${address} '`)
    if (user.length === 1) {

       const passwordCheck = await bcrypt.compare(password, user[0].password)

       if(!passwordCheck) return res.status(200).json({ message: "Unauthorized request"})

        const token = jwt.sign({
            userId: user.clientId,
            username: user.firstName
          }, ENV.JWT_SECERT,{expiresIn: "24h"})


        return res.status(200).json({
          message: "Login successfully...!",
          username: user[0].firstName,
          token
        })  
    }

    res.status(200).json({ message: "User doesn't exist, change the field values and retry"})
  }
  catch(error){
    console.log(error)
    res.status(400).json({ message:"[LOGIN_SESSION] something went wrong"})
  }
  
}

exports.closeUserLogout = async (req, res) =>{
  try{
    const { id } = req.params.id
    const token  = req.body.token
    if (!token) {
      res.status(201).json("Unauthorized request")
    }
    
    res.status(201).json("resolve")
  }
  catch(error){
    console.log(error)
    res.status(400).json({ message:"[LOGOUT_SESSION] something went wrong"})
  }
}