
const db = require('../database/database.acces')
const path = require('path')
const fs = require('fs')

exports.getAllStore = async (req, res) =>{

}


exports.createStore = async (req, res) =>{
    try{
        let file;
        const { name } = req.body;
        const conn = await db.connexion;
        if (!name) {
            return res.status(500).json({ message: "The 'name' field is required" })
        }

        if (req.file) {
           file = req.file;
           const fileName = Date.now() + path.extname(file.originalname)
           const folderPath = path.join(__dirname,"../uploads/images/store/")
           const filepath = path.join(folderPath, fileName)
           const response = await conn.query(
            "INSERT INTO Store(name, image) VALUES(?,?)",
            [name, fileName]
           )
           if(response.affectedRows > 0){
              fs.writeFileSync(filepath, file.buffer)
              return res.status(200).json( { message: "The store is successfully added" } )
           }else{
             console.log("Something wrong happenned while inserting data in database")
           }
        }

        const response = await conn.query(
            "INSERT INTO Store(name) VALLUES(?)",
            [name]
        )
        if(response.affectedRows > 0){
            return res.status(200).json( { message: "The store is successfully added" } )
        }

        return res.json(500).json({ message: "Something wrong happened" })

    }
    catch(err){
        console.log("Something wrong happened: " + err)
        return res.status(400)
    }
}