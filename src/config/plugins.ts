import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import type { FastifyInstance } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { style } from '#/themes/style'
import { portSettings, version } from './base-config'
import { logger } from './logger'

export function registerPlugins(app: FastifyInstance) {
  app.register(fastifyCors, {
    origin: [portSettings.BASE_URL, portSettings.WEB_URL],
    methods: ['*'],
  })

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Finest API',
        version: version,
      },
      // components: {
      //   securitySchemes: {
      //     bearerAuth: {
      //       type: 'http',
      //       scheme: 'bearer',
      //       bearerFormat: 'JWT',
      //     },
      //   },
      // },
      // security: [{ bearerAuth: [] }],
    },
    transform: jsonSchemaTransform,
  })

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    theme: {
      css: [{ filename: 'theme.css', content: style }],
    },
  })

  logger(app)

  app.setSerializerCompiler(serializerCompiler)
  app.setValidatorCompiler(validatorCompiler)
}
