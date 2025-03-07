const db = require("../database/database.acces")
const JSONbig = require('json-bigint')

exports.getAllCommand = async ( req, res) => {
    try{
        const conn = await db.connexion
        const allOrders = await conn.query(`SELECT * FROM Command`)
        res.status(200).json(allOrders)
    }
    catch(error){
        console.log(error)
        res.status(400).json({ message: "[COMMAND_GET] something went wrong" })
    }
}

exports.getSingleCommand = async (req, res) => {
    try{
        const id = req.params.id
        if (!id) {
            res.status(400).json({ message: "Id is required" })
        }
        const conn = await db.connexion
        const singleOrder = await conn.query(`SELECT * FROM Command WHERE id=${id}`)
        res.status(200).json(singleOrder)
    }
    catch(error){
        console.log(error)
        res.status(400).json({ message: "[COMMAND_GET] Something went wrong" })
    }
}


exports.createNewCommand = async (req, res) => {

    try{
        const { client_id, total, productsList } = req.body
        const requiredFields = { client_id, total, productsList  }
        let command;

        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).json({ message: `<< ${field} >> field is required` });
            }
            if (typeof value === 'string' && value.trim() === '') {
              return res.status(400).json({ message: `<< ${field} >> must have a proper value` });
            }
        }

        try{
            const conn = await db.connexion
            const created_at = Date.now()
            command = await conn.query(
                "INSERT INTO Command (client_id ,created_at, total) VALUES (?,?,?)", 
                [client_id, created_at, total]
              );
    
            console.log(command)
        }catch(err){
            console.log(`An unexpected error appered while inserting command: ${err}`)
        }
  
        for (const item of productsList) {
            if (!item) {
                return res.status(400).json({ message: `At least one product is required` });
            }
            
            for(const [field, value] of Object.entries(item)){
                if (!value) {
                    return res.status(400).json({ message: `Ensure that all your products don't miss one field` });
                }
                if (typeof value === 'string' && value.trim() === '') {
                  return res.status(400).json({ message: `<< ${field} >> must have a proper value(string)` });
                }
            }
            
            await conn.query(
                `INSERT INTO Product_Command (command_id,product_id, quantite_produit) VALUES (?,?,?) WHERE client_id = ${command.insertId}`, 
                [command[0].command_id, item.product_id , item.product_quantity ]
            );
        }

        res.status(201).json({ message: "order added successfully" });
    }
    catch(error){
        console.log(error)
        res.status(400).json({ message: "[ORDER_POST] Something went wrong" })
    }
}


exports.deleteSingleOrders = async (req, res) => {
    try{
        const id = req.params.id
        if (!id) {
            res.status(400).json({ message: "Command Id is required" })
        }
        const conn = await db.connexion
        const results = await conn.query(`DELETE FROM Command WHERE id = ${id}`)
        res.status(201).json(JSONbig.stringify(results))
    }
    catch(error){
        console.log(error)
        res.status(400).json({ message: "[ORDER_GET] Something went wrong" })
    }
}

exports.getAllCommandFromUser = async (req, res) => {
    try{
        const { clientId } = req.params;
        const conn = await db.connexion
        const userCommand = await conn.query(
            "SELECT id, delivery_id, created_at, total FROM Command WHERE client_id=?",
            [clientId]
        );
        if( userCommand.length > 0){
          return  res.status(200).json(userCommand)
        }
        return  res.status(400).json({ message: "Something went wrong while deaing with the database query" })

    }
    catch(error){
        console.log(error)
        res.json({message: "Something went wrong"})
    } 
}

exports.getAllProductsRelatedToCommand = async (req, res) => {
    try {
        const data = [];
        const conn = await db.connexion;
        const { commandId } = req.params;

        const productCommandData = await conn.query(
            "SELECT * FROM product_command WHERE command_id = ?",
            [commandId]
        );

        if (productCommandData.length > 0) {
            for (const item of productCommandData) {
                const productFromCommand = await conn.query(
                    "SELECT * FROM product WHERE id = ?",
                    [item.product_id]
                );

                if (productFromCommand.length > 0) {
                    const product = productFromCommand[0];
                    product.quantities = item.produit_quantity; 
                    data.push(product); 
                }
            }
            return res.status(200).json(data);
        }
        else{
            return res.status(404).json({ message: "No products found for this command" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong during retrieving data from the database" });
    }
};
