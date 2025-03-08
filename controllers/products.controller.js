const db = require("../database/database.acces")
const fs = require('fs')
const path = require('path')
const JSONbig = require('json-bigint')

exports.getAllProducts = async (req,res) => {
    try{
        let data = []
        conn = await db.connexion;
        const allProducts = await conn.query( "SELECT * FROM Product" );
        if (allProducts.length > 0) {
            for(const product of allProducts){
                const productImages = await conn.query("SELECT * from Product_Image WHERE product_id=" + product.id)
                data.push({
                        ...product,
                        image: productImages,
                })
            }
            return res.status(200).json(data)
        }
        console.log("None items in product")
        return res.status(200).json(data)
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
        const productImages = await conn.query("SELECT * from Product_Image WHERE product_id="+id)
        if (singleProduct.length > 0) {
            const product = singleProduct[0]
            return res.status(200).json({
                ...product,
                image: productImages,
            })
        }
        return res.status(400).json({ message: "That product dosen't exist in the database" })
    }
    catch( error ){
        console.log(error)
        res.status( 404 ).json( { message:  "[PRODUCT_GET] Something wrong happened : " + error  } )
    }
}



exports.getBestsellerProducts = async (req, res) => {
    try {
        let data = []
        conn = await db.connexion;
        const bestsellerProduct = await conn.query( "SELECT * FROM Product where bestseller = 1" );
        if (bestsellerProduct.length > 0) {
            for(const product of bestsellerProduct){
                const productImages = await conn.query("SELECT * from Product_Image WHERE product_id=" + product.id)
                data.push({
                        ...product,
                        image: productImages,
                })
            }
            return res.status(200).json(data)
        }
        console.log("None bestseller founded")
        return res.status(400).json(data)
      }catch( error ){
          console.log( error )
          res.status( 404 ).json( { message:  "[PRODUCTS_GET] Something wrong happened"} )
      }
};



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


exports.addNewOneProduct = async (req, res)=>{
    try {
        /*---------Dealing with retreiving body data----------------*/

        const { name, price, description ,category_id, store_id, bestseller } = req.body

        /*--------- Control of fields----------------*/

        if (!name) {
            return res.status(400).json({ message: "name is required." });
        }

        if (!price) {
            return res.status(400).json({ message: "price is required." });
        }
        const parsePrice = parseFloat(price)

        if (!category_id) {
            return res.status(400).json({ message: "category_id is required." });
        }

        if (!description) {
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

        if (productChecker.length > 0) {
            return res.status(404).json({ message: "Product already exist" })
        }

        /*---------End----------------*/

        /*---------Insert Product into bdd----------------*/

        await conn.beginTransaction()

        const productResponse = await conn.query(
            "INSERT INTO PRODUCT(name, price, description, bestseller ,category_id) VALUES(?,?,?,?,?)",
            [name, parsePrice, description, bestseller ,category_id]
        )

        if(!productResponse.insertId) return res.status(500).json({ message: "Something went wrong while inserting product table's date" })
        
        const storeProductResponse = await conn.query(
                "INSERT INTO Store_Product(product_id, store_id) VALUES(?,?)",
                [ productResponse.insertId ,store_id ]
        )
        console.log(storeProductResponse)
        if (JSONbig.parse(storeProductResponse.insertId)) {
            await conn.rollback();
            return res.status(500).json({ message: "Something went wrong while inserting into the Store_Product table" });
        }

        await conn.commit();
        /*---------End----------------*/

        /*---------Insert product images into bdd----------------*/

        if (req.files.length > 0) {
            await conn.beginTransaction()
            for( const file of req.files ){
                const fileName = Date.now() + path.extname(file.originalname)
                const created_at = new Date(Date.now()).toISOString().slice(0, 19).replace("T", " ");
                const imageResponse = await conn.query(
                    "INSERT INTO Product_Image(name, product_id, created_at) VALUES(?,?,?)",
                    [fileName, productResponse.insertId, created_at ]
                )          
                if(imageResponse.insertId){
                    const fileFolder = path.join(__dirname, "../uploads/images/products/")
                    const filePath = path.join(fileFolder, fileName)
                    fs.writeFileSync(filePath, file.buffer)
                }else{
                    await conn.rollback();
                    console.log("Something went wrong while inserting the image:${file.originalname} in database")
                    return res.status(500).json({ message: `Product added but not any image`});
                }
            }
            await conn.commit()
            return res.status(200).json({ message: "Operation sucessfull" })
        }


        /*---------End----------------*/

        res.status(200).json({ message: "Operation sucessfull" });

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "[PRODUCT_POST] Something wrong happened : " + error });
    }
}




//To consult soon
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





exports.deleteSingleProduct = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
          return res.status(400).json({ message: "Id is required"});
        }
        const conn = await db.connexion;

        await conn.beginTransaction()


        const storeProductDeleteResult = await conn.query(`DELETE FROM Store_Product WHERE product_id=${id}`);
        
        if (!storeProductDeleteResult.affectedRows) {
            await conn.rollback()
            console.log("Something went wrong while executing delete from store_product table")
            return res.status(400).json({ message: "Something went wrong while deleting the product" })
        }

        const imagesSelectedResult = await conn.query(`SELECT name FROM Product_Image WHERE product_id=${id}`);

        if (imagesSelectedResult.length > 0) {

            const deleteImagesResult = await conn.query(`DELETE FROM Product_Image WHERE product_id=${id}`)
            if (!deleteImagesResult.affectedRows) {
                await conn.rollback()
                console.log("Something went wrong while executing delete from product_image table")
                return res.status(400).json({ message: "Something went wrong while deleting the product" })
            }

            for(const lastImages of imagesSelectedResult){
                const filePath = path.join(__dirname,`../uploads/images/products/${lastImages.name}`)
                try{
                    fs.unlinkSync(filePath)
                }
                catch(err){
                    await conn.rollback()
                    console.log(`Something went wrong while deleying the image named ${lastImages.name}, The error object is : ${err} `)
                    return res.status(400).json({ message: "Something went wrong while deleting the product" })
                }
            }

        }

        const productDeleteResult = await conn.query(`DELETE FROM Product WHERE id=${id}`);

        if ( !productDeleteResult.affectedRows ){
            await conn.rollback()
            console.log("Something went wrong while executing delete from procdut table")
            return res.status(400).json({ message: "Something went wrong while deleting the product" })
        }


        await conn.commit()

        return res.status(200).json({ message: "Product successfully deleted" });

    } catch (error) {
        console.log(error);
        return res.status(409).json({ message: "[PRODUCTS_DELETE] Something wrong happened" });
    }
}

