
const db = require('../database/database.acces')

exports.getAllCategories = async (req, res) => {
    try{
        const conn = await db.connexion;
        const response = await conn.query("SELECT * from Category");
        if(response.length > 0 ) return res.status(200).json(response)
        return res.status(500).json({ message : "Sometthing went wrong while acessing to the data in the database" })
    }
    catch(error){
        console.log(error)
        return res.status(400).json("Something went wrong")
    }
}

//Create sngle category
exports.createSingleCategories = async (req, res) => {
    try{
        const conn = await db.connexion;
        const { name } = req.body;
        const response = await conn.query(
            "INSERT INTO Category(name) VALUES (?)",
            [name]
        )

        if (response.affectedRows > 0) {
            return res.status(200).json({ message: "Operation is successful" });
          }

        return res.status(400).json(
            { message: "Something went wrong while dealing with the database" }
        )
    }
    catch(err){
        console.log("Something went wrong : " + err)
    }
}