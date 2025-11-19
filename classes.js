import fs from 'fs'

export class Product{
    constructor(title, description, price, thumbnail, code, stock){
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
    }
}

export class ProductManager{
    constructor(file){
        this.file = file
    }
    async addProduct(product){
        try{
            //chequeo si el archivo con la lista de productos existe y si no existe la creo vacia
            if(!fs.existsSync(this.file)){
                await fs.promises.writeFile(`${this.file}`, '[]')
            }

            //leo los datos guardados en el archivo
            let products = await fs.promises.readFile(`${this.file}`, 'utf-8')
            //Lo parseo para poder trabajar con los objetos del array en formato JS
            let productsArray = JSON.parse(products)

            //chequeo que no exista el producto con el mismo codigo
            let codeObjectExists = productsArray.find(item => item.code === product.code)
            if(codeObjectExists === undefined){

                if(productsArray.length === 0){
                    product.id = 1
                }else{

                    product.id = productsArray[productsArray.length -1].id + 1 
                }

                productsArray.push(product)
                
                await fs.promises.writeFile(`${this.file}`, JSON.stringify(productsArray))

        }else{
            return 'the code for this product already exists'
        }

        }catch(err){
            throw err
        }
        
    }

    async getProducts(){
        try{
            //si existe el archivo lo lee y lo parsea para que se pueda trabajar con el donde sea que lo invoquemos, sino, se devuelve un array vacio
            if(fs.existsSync(this.file)){
                let products = await fs.promises.readFile(`${this.file}`, 'utf-8')
                return JSON.parse(products)
            }
            return []
        }catch(err){
            throw new err
        }
    }
    
    async getProductById(id){
        try{

            if(fs.existsSync(this.file)){
                let products = await this.getProducts()
                let productById = products.find(item => item.id === id)

                if (productById !== undefined){
                    return productById
                }else{
                    return "this product doesn't exist"
                }

            }
            return "this product doesn't exist"

        }catch(err){
            throw err
        }
    }

    async updateById(newProduct, id){
        try{

            if(fs.existsSync(this.file)){
                
                //me traigo el array de productos
                let products = await this.getProducts()

                //busco el producto a modificar via su id
                let productById = products.find(item => item.id === id)

                if (productById !== undefined){
                    
                    //le coloco al nuevo objeto el id, si vimos que exisitia anteriormente
                    newProduct.id = id

                    //remuevo el producto con el id corresp para luego colocar el nuevo (con mismo id)
                    let productsWithoutProductById = products.filter(item => item.id !== id)

                    //coloco el nuevo producto con id incluido en el array de productos
                    productsWithoutProductById.push(newProduct)

                    await fs.promises.writeFile(`${this.file}`, JSON.stringify(productsWithoutProductById))
                    
                    return "updated product"

                }else{
                    return "this product doesn't exist"
                }


            }
            return "this product doesn't exist"

        }catch(err){
            throw err
        }
    }
    async deleteById(id){

        try{

            if(fs.existsSync(this.file)){
                
            //me traigo el array de productos
            let products = await this.getProducts()

            //filtro los productos que no tienen el id indicado
            let arrayWithoutProduct = products.filter(item => item.id !== id)
    
            //guardo el array sin el producto con id indicado
            await fs.promises.writeFile(`${this.file}`, JSON.stringify(arrayWithoutProduct))

            }
            return []

        }catch(err){
            throw err
        }

    }
}

export class CartManager{
    constructor(file){
        this.file = file
    }

    async createCart(products){
          try{

            //Creo un objeto con los productos pasados que hara referencia al carrito
            let cart = {products: products} //la idea es que products sera el array the productos a poner en el carrito

            //chequeo si el archivo con la lista de productos existe y si no existe la creo vacia
            if(!fs.existsSync(this.file)){
                await fs.promises.writeFile(`${this.file}`, '[]')
            }

            //leo los datos guardados en el archivo
            let carts = await fs.promises.readFile(`${this.file}`, 'utf-8')
            //Lo parseo para poder trabajar con los objetos del array en formato JS
            let cartsArray = JSON.parse(carts)

            //doy un id al carrito a agergar
            if(cartsArray.length === 0){
                cart.id = 1
            }else{

                cart.id = cartsArray[cartsArray.length -1].id + 1 
            }

            cartsArray.push(cart)
            
            await fs.promises.writeFile(`${this.file}`, JSON.stringify(cartsArray))

        }catch(err){
            throw err
        }
    }

    async getAllCarts(){
        try{
            //si existe el archivo lo lee y lo parsea para que se pueda trabajar con el donde sea que lo invoquemos, sino, se devuelve un array vacio
            if(fs.existsSync(this.file)){
                let carts = await fs.promises.readFile(`${this.file}`, 'utf-8')
                return JSON.parse(carts)
            }
            return []
        }catch(err){
            throw new err
        }
    }

    async getCartById(id){
        try{

            if(fs.existsSync(this.file)){
                let carts = await this.getAllCarts()
                let cartById = carts.find(item => item.id === id)

                if (cartById !== undefined){
                    return cartById
                }else{
                    return "this cart doesn't exist"
                }

            }
            return "this cart doesn't exist"

        }catch(err){
            throw err
        }
    }

}