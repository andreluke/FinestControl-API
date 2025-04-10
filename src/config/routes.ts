import type { FastifyInstance } from 'fastify'
import { routes } from '#/routes/index'

export function registerRoutes(app: FastifyInstance) {
  for (const route of routes) {
    app.register(route)
  }

  app.setNotFoundHandler((req, res) => {
    res.status(404).send({
      message: 'Página não encontrada. Verifique a URL e tente novamente.',
    })
  })
}
