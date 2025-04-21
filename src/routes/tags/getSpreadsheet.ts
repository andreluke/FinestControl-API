import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { ExcelUtil } from '#/class/Excel'
import { db } from '#/drizzle/client'
import { StatusCodes } from '#/enums/status-code'

export const downloadTagsWithSpendsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/with-spends/download',
    {
      schema: {
        summary:
          'Exporta os gastos por tag até o mês atual como planilha Excel',
        tags: ['Tags'],
        operationId: 'downloadTagsWithSpends',
        querystring: z.object({
          year: z
            .string()
            .optional()
            .refine(
              val => {
                if (!val) return true
                const num = Number(val)
                return !Number.isNaN(num) && num > 0
              },
              { message: 'O ano deve ser um número válido.' }
            )
            .transform(val => (val ? Number(val) : undefined)),
        }),
        responseDescriptions: {
          [StatusCodes.OK]: {
            description: 'Planilha Excel com os gastos por tag',
            content: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                {
                  schema: { type: 'string', format: 'binary' },
                },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { year } = request.query
      const now = new Date()
      const currentYear = year ?? now.getFullYear()
      const currentMonth = now.getMonth() + 1

      const excelInstance = new ExcelUtil(db)

      const [error, workbook] = await excelInstance.generateTagsWorkbook(
        currentYear,
        currentMonth
      )

      if (error) {
        return reply.status(error.statusCode ?? 500).send({
          name: error.name ?? 'InternalServerError',
          message: error.message ?? 'Erro ao gerar planilha.',
        })
      }

      const buffer = await workbook.xlsx.writeBuffer()

      reply
        .header(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        .header(
          'Content-Disposition',
          `attachment; filename=gastos-tags-${currentYear}.xlsx`
        )
        .send(buffer)
    }
  )
}
