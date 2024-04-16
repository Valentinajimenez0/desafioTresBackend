const ProductManager = require('./productManager')
const express = require('express')
const productManager = new ProductManager();
const app = express()
const PORT = 8080
app.use(express.urlencoded({ extended: true }))


app.get('/products', async (req, res) => {
    try {
        const { limit } = req.query;
        let products = await productManager.getProducts();
        
        if (limit) {
            products = products.slice(0, Number(limit));
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getProductById(Number(pid));

        if (product) {
            res.status(200).json({ product });
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});


app.listen(PORT, ()=>{
    console.log("server running on port 8080")
})

