import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const redirects = await prisma.redirect.findMany();
        res.status(200).json(redirects);
    }
    else if (req.method === 'POST') {
        const { source, destination, permanent } = req.body;
        const redirect = await prisma.redirect.create({
            data: {
                source,
                destination,
                permanent
            }
        });
        res.status(201).json(redirect);
    }
    else if (req.method === 'PUT') {
        const { id, source, destination, permanent } = req.body;
        const redirect = await prisma.redirect.update({
            where: { id: parseInt(id) },
            data: { source, destination, permanent }
        });
        res.status(200).json(redirect);
    }
    else if (req.method === 'DELETE') {
        const { id } = req.query;
        await prisma.redirect.delete({
            where: { id: parseInt(id) }
        });
        res.status(200).json({
            message: 'Redirect rule was deleted successfully.'
        });
    }
}