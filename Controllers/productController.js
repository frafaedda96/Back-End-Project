import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProducts = async (req, res) => {

    try {
        const products = await prisma.product.findMany({
            where: { id }
        })
        res.json(products)

    } catch (error) {
        console.error("Errore durante il recupero dei prodotti")
        res.status(500).json({ error: "Errore nel recupero dei prodotti" })

    }
}


export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        })

        if (!product) {
            return res.status(404).json({ error: "Errore durante il recupero dell'id" })
        }
        res.json(product)

    } catch (error) {
        console.error("Errore durante il recupero dei prodotti")
        res.status(500).json({ error: "Errore nel recupero dei prodotti" })

    }
}


export async function createProduct(req, res) {
    const { name, description, price } = req.body
    try {
        if (req.user.role !== "admin") {
            return res.status(401).json({ error: "Accesso negato" })
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price
            }
        });
        res.json(newProduct)

    } catch (error) {
        console.error("Errore nella creazione del prodotto")
        res.status(500).json({ error: "Errore nella creazione del prodotto" })

    }

}

export async function updateProduct(req, res) {
    const productId = parseInt(req.params.id)
    const { name, description, price } = req.body

    try {
        if (req.user.role !== "admin") {
            return res.status(401).json({ error: "Accesso negato" })
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                description,
                price
            }
        });
        res.json(updatedProduct)

    } catch (error) {
        console.error("Errore nella modifica del prodotto")
        res.status(500).json({ error: "Errore nella modifica del prodotto" })

    }
}


export async function deleteProduct(req, res) {
    const productId = parseInt(req.params.id)
    
    try {
        if (req.user.role !== "admin") {
            return res.status(401).json({ error: "Accesso negato" })
        }

        await prisma.product.delete({
            where: { id: productId }
        });
        res.status(204).end()

    } catch (error) {
        console.error("Errore nella cancellazione del prodotto")
        res.status(500).json({ error: "Errore nella cancellazione del prodotto" })

    }
}