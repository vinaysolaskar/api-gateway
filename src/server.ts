import Fastify from 'fastify';

export const buildServer = () => {
  const fastify = Fastify({
    logger: true,
  });

  // Example health route
  fastify.get('/health', async () => {
    return { status: 'ok' };
  });

  return fastify;
};
