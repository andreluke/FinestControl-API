import { fastify } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { portSettings, registerPlugins, registerRoutes } from '#/config'
import { env } from '#/settings/env'

const app = fastify({logger: {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
},}).withTypeProvider<ZodTypeProvider>()

registerPlugins(app)
registerRoutes(app)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP server running on port ${portSettings.PORT}`)
  console.log(`See the documentation on ${portSettings.BASE_URL}/docs`)
})
