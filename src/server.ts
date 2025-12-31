import Fastify from 'fastify';
import proxy from '@fastify/http-proxy';

export const buildServer = () => {
  const fastify = Fastify({
    logger: true,
  });

  fastify.addHook('onRequest', async (request) => {
    request.log.info(
      {
        method: request.method,
        url: request.url,
      },
      'request received',
    );
  });

  //This is where auth, rate limits, policies belong
  fastify.addHook('preHandler', async (request, reply) => {
    const apiKey = request.headers['x-api-key'];

    if (!apiKey || typeof apiKey !== 'string') {
      reply.code(401).send({ error: 'Missing API key' });
      return;
    }

    request.headers['x-tenant-id'] = apiKey;
  });

  fastify.register(proxy, {
    upstream: 'https://httpbin.org',
    prefix: '/proxy',
    rewritePrefix: '',
  });

  return fastify;
};
