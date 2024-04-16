const fs = require('fs').promises;

class ProductManager {

    constructor() {
        this.products = [];
        this.path = "productos.json";
    }

    async readProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error("se produjo un error: ", error)
            return [];

        }
    }

    async writeProducts(products) {
        try {
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            console.log("añadido exitosamente")
        } catch (error) {
            console.error("se produjo un error: ", error)
        }

    }


    async addProduct(title, description, price, thumbnail, code, stock) {
        let products = await this.readProducts(); 
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        if (!products.some(product => product.code === code) && title && description && price && thumbnail && code && stock) {
            const producto = {
                id: newId,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };
    
            products.push(producto);
            await this.writeProducts(products); 
        } else {
            console.log("El producto no es válido o el código se repite");
        }
    }

    async getProducts() {
        const products = await this.readProducts(); 
        return products.length > 0 ? products : [];
    }
    

    async getProductById(id) {
        const products = await this.readProducts(); 
        const productoEncontrado = products.find((prod) => prod.id === id);
        if (!productoEncontrado) {
            console.log("Error: Not found, producto no encontrado");
            return undefined;
        }
        return productoEncontrado;
    }
    
    async updateProduct(id, newData) {
        let products = await this.readProducts();
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...newData, id: products[productIndex].id };
            await this.writeProducts(products);
            return products[productIndex];
        } else {
            console.log("Producto no encontrado.");
            return null;
        }
    }

    async deleteProduct(id) {
        let products = await this.readProducts();
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            products.splice(productIndex, 1);
            await this.writeProducts(products);
            console.log(`Producto con id ${id} ha sido eliminado.`);
        } else {
            console.log("Producto no encontrado para eliminar.");
        }
    }
}

module.exports = ProductManager;

//(async () => {
//     const productManager = new ProductManager(); 
//     const miSegundoManager = new productManager();
//     // Agregar productos
//     await productManager.addProduct("Cafetera", "Cafetera con capacidad de 12 tazas", 300, "/imgs/cafetera.jpg", "CAF123", 15); 
//     // Obtener todos los productos
//      console.log("Todos los productos:", await productManager.getProducts()); 
//    //  // Obtener un producto por ID
//      console.log("Producto con ID 1:", await productManager.getProductById(1)); 
//    //  // Actualizar un producto
//      await productManager.updateProduct(1, { price: 350, stock: 10 });
//    //  console.log("Producto actualizado con ID 1:", await productManager.getProductById(1)); 
//    //  // Eliminar un producto
//    //  await productManager.deleteProduct(1);
//    //  console.log("Todos los productos después de eliminar:", await productManager.getProducts());
// })();

