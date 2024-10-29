require('dotenv').config()

const mariadb = require("mariadb")

const dbHost = process.env.DB_HOST
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME
const dbPort = process.env.DB_PORT
  
//BDD CONNEXION

const connexion = mariadb.createConnection({
    host:dbHost,
    database: dbName,
    user:dbUser, 
    password: dbPass,
    port: dbPort
})

module.exports = { connexion: connexion }