
const express = require("express")
const cors = require("cors")
const path = require('path')
const app = express()
const morgan = require('morgan')
require('dotenv').config()

const allowedOrigins = ["http://localhost:5173","http://localhost:5174"]

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
const commandRoutes = require('./routes/command.routes')
const adminRouter  = require('./routes/admin.routes')
const storeRouter  = require('./routes/store.routes')
const categoryRouter  = require('./routes/category.routes')

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('tiny'))

app.use( "/api/products" , productsRoutes)

app.use("/api/clients", clientsRoutes )

app.use("/api/commands", commandRoutes )

app.use("/api/admin", adminRouter )  

app.use("/api/category", categoryRouter )

app.use("/api/store", storeRouter )

app.use(
  "/api/store/image",
  express.static(path.join(__dirname, './uploads/images/store'))
);

app.use(
  "/api/product/image",
  express.static(path.join(__dirname, './uploads/images/products'))
);



app.listen(3000,()=>{
  console.log("serveur à l'écoute")
})
