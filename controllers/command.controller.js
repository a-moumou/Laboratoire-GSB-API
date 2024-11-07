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
        const { created_at,  orderDate, totalCost } = req.body
        const isFieldsNoEmpty = clientId && productId && orderDate && totalCost

        if (!isFieldsNoEmpty) {
          return res.status(400).json({ message: "some fields are missing." });
        }

        const conn = await db.connexion

        await conn.query(
          "INSERT INTO orders (client_id ,created_at, total) VALUES (?,?,?,?)", 
          [clientId, productId, orderDate, totalCost]
        );

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
            res.status(400).json({ message: "Id is required" })
        }
        const conn = await db.connexion
        const results = await conn.query(`DELETE FROM orders WHERE orderId = ${id}`)
        res.status(201).json(JSONbig.stringify(results))
    }
    catch(error){
        console.log(error)
        res.status(400).json({ message: "[ORDER_GET] Something went wrong" })
    }
}

