const db = require("../database/database")
const JSONbig = require('json-bigint')
const bcrypt = require('bcrypt');

exports.getAllClients = async (req,res) => {
    try{
        const conn = await db.connexion
        const oneProduct = await conn.query("SELECT * FROM clients");
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
      const allClients = await conn.query("SELECT * FROM clients WHERE clientId= ?",[id]);
      res.status(200).json(allClients)
    }catch( error ){
        console.log(error)
        res.status(409).json({ message:"[CLIENT_GET] something went wrong: " + error })
    }
}


exports.addNewClient = async (req,res) => {
      try{
        const { lastName, firstName, address, password} = req.body

      }
      catch(error){
        console.log(error)
        res.status(409).json({ message:"[CLIENT_POST] something went wrong: " + error })
      }
}


exports.patchSingleClient = async (req,res)=>{
  try{
    const id = req.params.id;
    const body = req.body;
    const { lastName, firstName, address, password } = body
    const onValidate = !lastName | !firstName| !address | !password
    console.log(body)
    if (onValidate) {
        return res.status(400).json({ message: "some fields are missing." });
    }

    const conn = await db.connexion;
    const sqlQuery = "UPDATE clients SET lastName=?, firstName=?, address=?, password=? WHERE clientId =?"
    const client = await conn.query(sqlQuery,[lastName, firstName, address, password, id]);

    res.status(200).json(JSONbig.stringify(client));
  }
  catch(error){
      console.log(error)
      res.status(404).json({ message:"[CLIENT_PATCH] something went wrong: " + error })
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
      res.status(400).json({ message:"[CLIENT_DELETE] something went wrong: " + error })
    }
}