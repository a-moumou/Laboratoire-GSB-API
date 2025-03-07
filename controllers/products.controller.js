const db = require("../database/database.acces")
const fs = require('fs')
const JSONbig = require('json-bigint')

exports.getAllProducts = async (req,res) => {
    try{
        let data = []
        conn = await db.connexion;
        const allProducts = await conn.query( "SELECT * FROM Product" );
        if (allProducts.length > 0) {
            for(const product of allProducts){
                const productImages = await conn.query("SELECT * from Image WHERE product_id=" + product.id)
                data.push({
                        ...product,
                        image: productImages,
                })
            }
            return res.status(200).json(data)
        }
        return res.status(400).json({ message: "Something wron happened while retreving data" })
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
        const productImages = await conn.query("SELECT * from Image WHERE product_id="+id)
        if (singleProduct.length > 0) {
            const product = singleProduct[0]
            return res.status(200).json({
                ...product,
                image: productImages,
            })
        }
        return res.status(400).json({ message: "That product doen't exist in the database" })
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

exports.addNewOneProduct = async ()=>{
    try {
        const { name, price, desc ,category_id, store_id, bestseller } = req.body

        if (!name) {
            return res.status(400).json({ message: "name is required." });
        }

        if (!price) {
            return res.status(400).json({ message: "price is required." });
        }
        const parsePrice = price.parseFloat(price)

        if (!category_id) {
            return res.status(400).json({ message: "category_id is required." });
        }

        if (!desc) {
            return res.status(400).json({ message: "desc is required." });
        }

        if (!store_id) {
            return res.status(400).json({ message: "store_id id is required." });
        }

        if (!bestseller) {
            return res.status(400).json({ message: "bestseller is required." });
        }

        const conn = await db.connexion;
        const productChecker = await conn.query(`SELECT * FROM Product WHERE name = '${ name }' `);

        if (productChecker.length === 0) {
            return res.status(404).json({ message: "Product already exist" })
        }

        if (req.files) {
            
        }

        res.status(200).json(JSONbig.stringify(updatedProduct));
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "[PRODUCT_PATCH] Something wrong happened : " + error });
    }
}




exports.putSingleProduct = async (req, res) => {
    try {
        const id = req.params.id
        const { name, price, category_id, image, bestseller, description } = req.body
  
        const requiredFields = { name, price, category_id, description, bestseller, image }
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
        
        const query = "UPDATE Product SET  name=?, price =?,description=? , image=?, bestseller=?, category_id=?  WHERE id =?"
        const updatedProduct = await conn.query(query,[ name, price, description, image, bestseller, category_id, id ]);
  
        res.status(200).json(JSONbig.stringify(updatedProduct));
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "[PRODUCT_PUT] Something wrong happened" });
    }
}