
const express = require("express")
const cors = require("cors")
const app = express() 

const allowedOrigins = ["http://localhost:3000/"]

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, origin);
    } else {
      callback(new Error('Unauthorized along with politique')); 
    }
  }
}

const productsRoutes = require('./routes/products.routes')
const clientsRoutes = require('./routes/clients.routes')
const ordersRoutes = require('./routes/orders.routes')

app.use(cors(corsOptions));
app.use(express.json());



app.use( "/api/products" , productsRoutes)

app.use("/api/clients", clientsRoutes )

app.use("/api/orders", ordersRoutes )



app.listen(3000,()=>{
  console.log("serveur à l'écoute")
})


// //ORDERS

// app.get("/orders",async (req,res) => {
//   const id = req.params.id
//   const connexion = await pool.getConnection()
//   const orders = await connexion.query("SELECT * FROM clients");
//   res.status(200).json(orders)
// })

// app.get("/orders/:id",async (req,res) => {
//     const id = req.params.id
//     const connexion = await pool.getConnection()
//     const oneOrder = await connexion.query("SELECT * FROM orders WHERE orderID="+id);
//     res.status(200).json(oneOrder)
// })

// // test 
// app.put('/order/:id',async (req,res)=>{
//   try{
//     const id = req.params.id
//     const { firstname,lastName, email, password } = req.body
//     sqlQuery = "UPDATE clients SET firstName =?, lastName = ?, email=?, password =?"
//     const connexion = await pool.getConnection()
//     connexion.query(sqlQuery,[ firstname,lastName,email,password ])
//   }catch(err){
//       console.log(err)
//   }
// })

