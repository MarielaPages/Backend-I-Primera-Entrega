import express from 'express'
import {Product, ProductManager} from './classes.js'

//Creo mi app servidor
const app = express()

//middlewares
app.use(express.json())


const PORT = 8080

//Levantamos el servidor
const server = app.listen(PORT, () => {
    console.log(`http server listening on port ${PORT}`)
})

server.on('error', error => {
    console.log (`error on server ${error}`)
}) //Manejo de errores


let products = new ProductManager('./productos.json')

//Peticiones products
app.get('/products', async (req, res) => {

    res.send(await products.getProducts())

})

app.get('/products/:pid', async(req, res) => {
    
    const {pid} = req.params

    res.send(await products.getProductById(pid))

})

app.post('/products', async (req, res) => {

    let product = new Product(req.body.title, req.body.description, req.body.price, req.body.thumbnail, req.body.code, req.body.stock)

    await products.addProduct(product)

    res.send('the product has been saved')

})

app.put('/products/:pid', async (req, res) => {
    
    const {pid} = req.params

    //modifico el array, quitando el pod con ese id y colocando el nuevo con mismo id
    await products.updateById(req.body, pid)

    res.send('the product has been updated')

})

app.delete('/products/:pid', async (req, res) => {
    
    const {pid} = req.params

    await products.deleteById(parseInt(pid))

    res.send('the product has been deleted')

})

//Peticiones cart