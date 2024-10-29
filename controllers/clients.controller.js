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
        res.status(409).json({ message: "[CLIENT_GET] something went wrong"  })
    }
}




exports.addNewClient = async (req,res) => {
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
      res.status(400).json({ message:"[CLIENT_DELETE] something went wrong: " + error })
    }
}