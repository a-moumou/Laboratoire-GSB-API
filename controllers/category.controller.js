
const db = require('../database/database.acces')

exports.getAllCategories = async (req, res) => {

}

//Create sngle category
exports.createSingleCategories = async (req, res) => {
    try{
        const conn = await db.connexion;
        const { name, years } = req.body;
        const response = await conn.query(
            "INSERT INTO Category(name, years) VALUES (?,?)",
            [name, years]
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