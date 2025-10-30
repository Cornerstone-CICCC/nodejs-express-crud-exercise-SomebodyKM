import { Router, Request, Response } from 'express'
import { Product } from '../types/product'
import { v4 as uuidv4 } from 'uuid'

const productRouter = Router()

// In-memory database
const products: Product[] = []

/**
 * Get all products
 * 
 * @route GET /todos
 * @param { Request } req - Express request object.
 * @param { Response } res - Express response object.
 * @returns { void } - Responds with product list items.
 */
productRouter.get('/', (req: Request, res: Response) => {
    res.status(200).json(products)
})

/**
 * Add product
 * 
 * @route POST /
 * @param { Request } req - Express request object containing product object.
 * @param { Response } res - Express response object.
 * @returns { void } - Responds with created product.
 */
productRouter.post("/", (req: Request<{}, {}, Omit<Product, 'id'>>, res: Response) => {
    const { product_name, product_description, product_price } = req.body
    const newProduct: Product = {
        id: uuidv4(),
        product_name,
        product_description,
        product_price
    }
    products.push(newProduct)
    res.status(201).json(newProduct)
})

/**
 * Get product by id
 * 
 * @route GET /products/:id
 * @param { Request } req - Express request object containing id.
 * @param { Response } res - Express response object.
 * @returns { void } - Responds with product by id.
 */
productRouter.get('/:id', (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params
    const found = products.find(p => p.id === id)
    if (!found) {
        res.status(404).send("Product not found")
        return
    }
    res.status(200).json(found)
})

/**
 * Update product by id
 * 
 * @route PUT /products/:id
 * @param { Request } - Express request object which contains id param and product object.
 * @param { Response } - Express response object.
 * @returns { void } - Respond with updated product object.
 */
productRouter.put("/:id", (
    req: Request<{ id: string }, {}, Partial<Product>>,
    res: Response
) => {
    const { id } = req.params
    const foundIndex = products.findIndex(p => p.id === id)
    if (foundIndex === -1) {
        res.status(404).send("Product not found.")
        return
    }
    const updatedProduct: Product = {
        ...products[foundIndex],
        product_name: req.body.product_name ?? products[foundIndex].product_name,
        product_description: req.body.product_description ?? products[foundIndex].product_description,
        product_price: req.body.product_price ?? products[foundIndex].product_price
    }
    products[foundIndex] = updatedProduct
    res.status(201).json(updatedProduct)
})

/**
 * Delete product by id
 * 
 * @route DELETE /products/:id
 * @param { Request } req - Express request object.
 * @param { Response } res - Express response object.
 * @returns { void } - Responds with deletion message.
 */
productRouter.delete('/:id', (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params
    const index = products.findIndex(p => p.id === id)
    if (index === -1) {
        res.status(404).send("Product not found")
        return
    }
    products.splice(index, 1)
    res.status(200).send("Product deleted.")
})

export default productRouter