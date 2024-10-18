require('dotenv').config()

const express = require("express")
const mariadb = require("mariadb")
const cors = require("cors")
const app = express()
const allowedOrigins = ["http://localhost:3000/"]

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, origin);
    } else {
      callback(new Error('Non autorisé par CORS')); 
    }
  }
}

app.use(cors(corsOptions));

const dbHost = process.env.DB_HOST
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME
const dbPort = process.env.DB_PORT
  
//BDD

const pool = mariadb.createPool({
    host:dbHost,
    database: dbName,
    user:dbUser, 
    password: dbPass,
    port: dbPort
})

//PRODUCTS

app.get("/products",async (req,res) => {
  const connexion = await pool.getConnection()
  const allProducts = await connexion.query("SELECT * FROM products");
  res.status(200).json(allProducts)
})


app.get("/products/:id",async (req,res) => {
    const id = req.params.id
    const connexion = await pool.getConnection()
    const oneProduct = await connexion.query("SELECT * FROM products WHERE productId="+id);
    res.status(200).json(oneProduct)
})


//ClIENTS

app.get("/clients",async (req,res) => {
  const id = req.params.id
  const connexion = await pool.getConnection()
  const oneProduct = await connexion.query("SELECT * FROM clients");
  res.status(200).json(oneProduct)
})

app.get("/clients/:id",async (req,res) => {
    const id = req.params.id
    const connexion = await pool.getConnection()
    const oneProduct = await connexion.query("SELECT * FROM clients WHERE clientId="+id);
    res.status(200).json(oneProduct)
})

// test 
app.put('/client/:id',async (req,res)=>{
    try{
      const id = req.params.id
      const { firstname,lastName, email, password } = req.body
      sqlQuery = "UPDATE clients SET firstName =?, lastName = ?, email=?, password =?"
      const connexion = await pool.getConnection()
      connexion.query(sqlQuery,[ firstname,lastName,email,password ])
    }catch(err){
        console.log(err)
    }
})

//ORDERS

app.get("/orders",async (req,res) => {
  const id = req.params.id
  const connexion = await pool.getConnection()
  const orders = await connexion.query("SELECT * FROM clients");
  res.status(200).json(orders)
})

app.get("/orders/:id",async (req,res) => {
    const id = req.params.id
    const connexion = await pool.getConnection()
    const oneOrder = await connexion.query("SELECT * FROM orders WHERE orderID="+id);
    res.status(200).json(oneOrder)
})

// test 
app.put('/order/:id',async (req,res)=>{
  try{
    const id = req.params.id
    const { firstname,lastName, email, password } = req.body
    sqlQuery = "UPDATE clients SET firstName =?, lastName = ?, email=?, password =?"
    const connexion = await pool.getConnection()
    connexion.query(sqlQuery,[ firstname,lastName,email,password ])
  }catch(err){
      console.log(err)
  }
})

//Postman test

app.post( '/postman' ,(req,res)=>{
  console.log( "request : "+ req.body )
  try{
      const { theme, question, response } = req.body
      sqlStatement = "insert into requests( theme, question, response) values (?,?,?,?)"
      const connexion = pool.getConnection()
      connexion.query( sqlStatement,[ theme, question, response ] )
      res.status( 200 ).send( { message: "operation successed" } )
  }catch(err){
      console.log(err)
      res.status(200).send({message: "operation not successed"})
  }
})

app.listen(port,()=>{
  console.log("server is connected")
})

//LISTENER

app.listen(3000,()=>{
    console.log("serveur à l'écoute")
})