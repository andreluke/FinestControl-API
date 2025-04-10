import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const registerPrefix = (
  routes: FastifyPluginAsyncZod[],
  prefix: string
): FastifyPluginAsyncZod => {
  return async app => {
    for (const route of routes) {
      app.register(route, { prefix })
    }
  }
}
