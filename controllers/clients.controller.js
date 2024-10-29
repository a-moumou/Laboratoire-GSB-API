const db = require("../database/database")

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


exports.patchSingleClient = async (req,res)=>{
    try{
      const id  = req.params
      const body  = req.body
      const { firstname, lastName, address, password } = body
      sqlQuery = "UPDATE clients SET firstName =?, lastName = ?, address=?, password =? WHERE clientId = ?"
      const conn = await db.connexion
      const result = conn.query(sqlQuery,[ firstname, lastName, address, password , id ])
      res.status(200).json(result)
    }
    catch(error){
      console.log(error)
      res.status(409).json({ message:"[CLIENT_PATCH] something went wrong: " + error })
    }
}

exports.deleteSingleClient = async () => {

}