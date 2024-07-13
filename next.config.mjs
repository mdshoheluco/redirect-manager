import { PrismaClient } from '@prisma/client';

async function fetchRedirects() {
  const prisma = new PrismaClient();
  const redirects = await prisma.redirect.findMany();
  return redirects.map(redirect => {
    const { source, destination, permanent } = redirect;
    return {
      source: `/${source}`,
      destination: `/${destination}`,
      permanent
    };
  });
}

export default async function config() {
  const redirects = await fetchRedirects();
  return {
    async redirects() {
      return redirects;
    }
  };
}
