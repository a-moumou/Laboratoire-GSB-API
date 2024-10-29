const db = require("../database/database.acces")
const JSONbig = require('json-bigint')

exports.getAllProducts = async (req,res) => {
    try{
        conn = await db.connexion;
        const allProducts = await conn.query( "SELECT * FROM products" );
        res.status( 200 ).json( allProducts )
      }catch( error ){
          console.log( error )
          res.status( 404 ).json( { message:  "[PRODUCTS_GET] Something wrong happened : " + error } )
      }
}



exports.getSingleProduct = async (req,res) => {
    try{
        const id = req.params.id
        const conn = await db.connexion
        const singleProduct = await conn.query( "SELECT * FROM products WHERE productId=" +id );
        res.status(200).json(singleProduct)

    }catch( error ){
        console.log(error)
        res.status( 404 ).json( { message:  "[PRODUCT_GET] Something wrong happened : " + error  } )
    }
}



exports.deleteSingleProduct = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
          res.status(400).json({ message: "Id is required"});
        }
        const conn = await db.connexion;
        const result = await conn.query(`DELETE FROM products WHERE productId=${id}`);
        res.status(200).json(JSONbig.stringify(result));
    } catch (error) {
        console.log(error);
        res.status(409).json({ message: "[PRODUCTS_DELETE] Something wrong happened: "+ error });
    }
}



exports.patchSingleProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        console.log(body)
        if (!body.price || !body.weight) {
            return res.status(400).json({ message: "Price and weight are required." });
        }

        const conn = await db.connexion;
        const productChanged = await conn.query(`UPDATE products SET price = ${body.price}, weight = ${body.weight} WHERE productID = ${id}`);

        res.status(200).json(JSONbig.stringify(productChanged));
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "[PRODUCT_PATCH] Something wrong happened : " + error });
    }
}



exports.putSingleProduct = async (req, res) => {
    try {
        const id = req.params.id
        const { productName, price, expirationDate, weight } = req.body
        const onValidateFields = !productName || !price || !weight || !expirationDate
  
        if (onValidateFields) {
            return res.status(400).json({ message: "Some of fields are missing." });
        }
  
        const conn = await db.connexion;
        const productChanged = await conn.query(`UPDATE products SET  productName= '${productName}', price = ${price}, weight = ${weight}, expirationDate='${expirationDate}'  WHERE productId = ${id}`);
  
        res.status(200).json(JSONbig.stringify(productChanged));
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "[PRODUCT_PUT] Something wrong happened: "+ error });
    }
}