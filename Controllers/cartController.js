import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function addTocart(req, res){
    try {
        const { productId, quantity } = req.body
        const userId = req.user.user.Id

        const product = await prisma.product.findUnique({ where: { id: productId } })

        if (!product) {
            return res.status(404).json({ error: "Prodotto non trovato" })
        }

        const cartItem = await prisma.cartItem.create({
            data: {
                userId,
                productId,
                quantity

            }
        })
        res.json(cartItem)
    } catch (error) {
        console.error("Errore durante l'aggiunta del prodotto", error)
        res.status(500).json({ error: "Errore durante l'aggiunta del prodotto" })
    }
}

export async function updateCartItem(req, res){
    try{
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        const cartItem = await prisma.cartItem.findUnique({
            where: {id: parseInt(cartItemId)},
        })

        if(!cartItem) {
            return res.status(404).json({error: "elemento non trovato"})
        }

        const updatedItem = await prisma.cartItem.update({
            where: {id: parseInt(cartItemId)},
            data: {quantity},
        })
        res.json({message: "Quantità del prodotto modificata", cartItem: updatedItem})

    }catch(error){
        console.error("Errore durante la modifica del carrello", error)
        res.status(500).json({ error: "Errore durante la modifica del carrello" })
    }
}


export async function removeCartItem(req, res){
    try {
        const { cartItemId } = req.params;

        const cartItem = await prisma.user.findUnique({
            where: { id: parseInt(cartItemId) }
        })
        if (!cartItem) {
            return res.status(404).json({ error: "Elemento non trovato nel carrello" })
        }

        await prisma.cartItem.delete({
            where: { id: parseInt(cartItemId) }
        })
        res.status(204).end()

    } catch (error) {
        console.error("Errore durante cancellazione del prodotto nel carrello", error)
        res.status(500).json({ error: "Errore durante cancellazione del prodotto nel carrello" })
    }
}


export async function viewCart(req, res){
    try {
        const userId = req.user.userId

        const cartItems = await prisma.cartItem.findMany({
            where: { userId },
            include: {
                product: true
            }
        })
        res.json(cartItems)

    } catch (error) {
        console.error("Errore durante il recupero del carrello", error)
        res.status(500).json({ error: "Errore durante il recupero del carrello" })
    }
}

