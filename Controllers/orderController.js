import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createOrder(req, res) {
    const { userId, products } = req.body
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(401).json({ error: "Accesso negato" })
        }

        const newOrder = await prisma.order.create({
            data: {
                userId,
                products
            }
        });
        res.json(newOrder)

    } catch (error) {
        console.error("Errore nella creazione dell'ordine")
        res.status(500).json({ error: "Errore nella creazione dell'ordine" })

    }

}

export async function updateOrder(req, res){
    const { id } = req.params;
    const { quantity } = req.body;
    try{
        const updatedOrder = await prisma.order.update({
            where : { id: parseInt(id) },
            data: { quantity }
        });
        res.json(updatedOrder);
    }catch (error){
        console.error("Errore durante l'aggiornamneto dell' ordine", error);
        res.status(500).json( { error: "Errore durante l'aggiornamento dell'ordine"})
    }
}

export const getUserAllOrders = async (req, res) => {
    const userId = req.user.userId

    try {
        const userOrders = await prisma.order.findMany({
            where: { userId },
            include: { products: true }
        })
        res.json(userOrders)

    } catch (error) {
        console.error("Errore durante il recupero degli ordini dell'utente")
        res.status(500).json({ error: "Errore nel recupero degli ordini dell'utente" })

    }
}


export async function getOrderById(req, res){
    const { id } = req.params;
    try {
        const order = await prisma.order.findUnique({
            where :{ id : parseInt(id) }
        });
        if( !order){
            res.status(401).json({ error: "Ordine non trovato" });
        }else{
            res.json(order)
        }
    } catch (error) {
        console.error("Errore durante il recupero ordine ");
        res.status(500).json( { message : "errore durante il recuper dell'ordine"});
    };
}


export async function deleteOrder(req, res) {
    const orderId = parseInt(req.params.id)

    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(401).json({ error: "Accesso negato" })
        }

        await prisma.order.delete({
            where: { id: orderId }
        });
        res.status(204).end()

    } catch (error) {
        console.error("Errore nella cancellazione del prodotto")
        res.status(500).json({ error: "Errore nella cancellazione del prodotto" })

    }
}
