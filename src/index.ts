import { fastify } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { portSettings, registerPlugins, registerRoutes } from '#/config'
import { env } from '#/settings/env'

const app = fastify().withTypeProvider<ZodTypeProvider>()

registerPlugins(app)
registerRoutes(app)

app.listen({ port: env.PORT }).then(() => {
  console.log(`HTTP server running on port ${portSettings.PORT}`)
  console.log(`See the documentation on ${portSettings.BASE_URL}/docs`)
})
