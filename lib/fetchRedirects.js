import { PrismaClient } from '@prisma/client';

async function fetchRedirects() {
    const prisma = new PrismaClient();
    const redirects = await prisma.redirect.findMany();
    return redirects.map(redirect => {
        const { source, destination, permanent } = redirect;
        return {
            source,
            destination,
            permanent
        };
    });
}

export default fetchRedirects;