const db = require("../database/database.acces")
const JSONbig = require('json-bigint')

exports.getAllProducts = async (req,res) => {
    try{
        conn = await db.connexion;
        const allProducts = await conn.query( "SELECT * FROM Product" );
        res.status( 200 ).json( allProducts )
      }catch( error ){
          console.log( error )
          res.status( 404 ).json( { message:  "[PRODUCTS_GET] Something wrong happened"} )
      }
}



exports.getSingleProduct = async (req,res) => {
    try{
        const id = req.params.id
        const conn = await db.connexion
        const singleProduct = await conn.query( "SELECT * FROM Product WHERE id=" +id );
        res.status(200).json(singleProduct)

    }
    catch( error ){
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
        const result = await conn.query(`DELETE FROM Product WHERE id=${id}`);
        res.status(200).json(JSONbig.stringify(result));
    } catch (error) {
        console.log(error);
        res.status(409).json({ message: "[PRODUCTS_DELETE] Something wrong happened" });
    }
}




exports.patchSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const { name, price, category_id } = req.body

        if (!name) {
            return res.status(400).json({ message: "Name  are required." });
        }

        if (!price) {
            return res.status(400).json({ message: "Category id are required." });
        }
        const parsePrice = price.parseFloat(price)

        if (!category_id) {
            return res.status(400).json({ message: "Category id are required." });
        }

        const conn = await db.connexion;
        const productChecker = await conn.query(`SELECT * FROM Product WHERE id = '${ id }' `);

        if (productChecker.length === 0) {
            return res.status(404).json({ message: "Product does not exist" })
        }

        const updatedProduct = await conn.query(`UPDATE Product SET price = ${parsePrice}, category_id = ${ category_id } WHERE id = ${id}`);

        res.status(200).json(JSONbig.stringify(updatedProduct));
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "[PRODUCT_PATCH] Something wrong happened : " + error });
    }
}




exports.putSingleProduct = async (req, res) => {
    try {
        const id = req.params.id
        const { name, price, expiration_date, category_id, description } = req.body
  
        const requiredFields = { name, price, expiration_date, category_id, description }
        for (const [field, value] of Object.entries(requiredFields)) {
          if (!value) {
              return res.status(400).json({ message: `<< ${field} >> field is required` });
          }
          if (typeof value === 'string' && value.trim() === '') {
            return res.status(400).json({ message: `<< ${field} >> must have a proper value` });
          }
         }

        const conn = await db.connexion;

        const productChecker = await conn.query(`SELECT * FROM Product WHERE id = '${ id }' `);
        if (productChecker.length > 0) {
            return res.status(404).json({ message: "Product does exist" })
        }
        
        const query = "UPDATE Product SET  name=?, price =?,description=? , expiration_date=?, category_id=?  WHERE id =?"
        const updatedProduct = await conn.query(query,[ name, price, description, expiration_date, category_id, id ]);
  
        res.status(200).json(JSONbig.stringify(updatedProduct));
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "[PRODUCT_PUT] Something wrong happened" });
    }
}