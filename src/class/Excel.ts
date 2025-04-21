import ExcelJS from 'exceljs'
import type { DbOrTx } from '#/@types/libs'
import { borderStyle, monthNames } from '#/constant/excel'
import { TagsController } from '#/controller/TagsController'
import { catchError } from '#/utils/catchError'

interface TagData {
  total: number
  id: number
  name: string
  color: string
  monthGoal: number
}

export class ExcelUtil {
  constructor(private readonly db: DbOrTx) {}

  async generateTagsWorkbook(year: number, untilMonth: number) {
    const now = new Date()
    const currentYear = now.getFullYear()
    const baseMonth = year !== currentYear ? 12 : untilMonth

    const tagsController = new TagsController(this.db)
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'FinestControl'

    for (let month = 1; month <= baseMonth; month++) {
      const [error, data] = await catchError(
        tagsController.getTagsWithExpenses({ month, year })
      )

      if (error) return [error, null] as const

      this.createMonthlySheet(workbook, month, data)
    }

    return [null, workbook] as const
  }

  private createMonthlySheet(
    workbook: ExcelJS.Workbook,
    month: number,
    data: TagData[]
  ) {
    const sheet = workbook.addWorksheet(monthNames[month - 1])
    this.addSheetHeader(sheet)
    this.addTableHeaders(sheet)
    this.addTagRows(sheet, data)
    if (data.length > 0) this.addTotalRow(sheet, data)
  }

  private addSheetHeader(sheet: ExcelJS.Worksheet) {
    sheet.getRow(1).height = 40
    sheet.mergeCells('A1', 'C1')

    const titleCell = sheet.getCell('A1')
    titleCell.value = 'CONTROLE DE DESPESAS'
    titleCell.font = { bold: true, size: 14 }
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    titleCell.border = borderStyle
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd9f2d1' },
    }
  }

  private addTableHeaders(sheet: ExcelJS.Worksheet) {
    const headerRow = sheet.getRow(2)
    headerRow.values = ['Nome da Despesa', 'Média Gasto', 'Real Gasto']
    headerRow.font = { bold: true }
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.height = 20

    const fillStyleHeader: ExcelJS.Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'c2e4f5' },
    }

    for (const col of ['A', 'B', 'C']) {
      const cell = sheet.getCell(`${col}2`)
      cell.border = borderStyle
      cell.fill = fillStyleHeader
    }

    sheet.columns = [{ width: 30 }, { width: 30 }, { width: 30 }]
  }

  private addTagRows(sheet: ExcelJS.Worksheet, tags: TagData[]) {
    tags.forEach((tag, index) => {
      const rowIndex = 3 + index
      const row = sheet.getRow(rowIndex)

      row.getCell('A').value = tag.name
      row.getCell('B').value = tag.monthGoal / 100
      row.getCell('C').value = tag.total / 100

      row.getCell('B').numFmt = 'R$ #,##0.00'
      row.getCell('C').numFmt = 'R$ #,##0.00'

      row.eachCell((cell, colNumber) => {
        if (colNumber <= 3) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
        }
      })

      const isLast = index === tags.length - 1

      for (const col of ['A', 'B', 'C']) {
        const cell = row.getCell(col)
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: isLast ? { style: 'thin' } : undefined,
        }
      }
    })
  }

  private addTotalRow(sheet: ExcelJS.Worksheet, tags: TagData[]) {
    const totalRowIndex = 3 + tags.length
    const totalRow = sheet.getRow(totalRowIndex)

    const totalGoal = tags.reduce((sum, tag) => sum + tag.monthGoal, 0) / 100
    const totalReal = tags.reduce((sum, tag) => sum + tag.total, 0) / 100

    totalRow.getCell('A').value = 'TOTAL'
    totalRow.getCell('B').value = totalGoal
    totalRow.getCell('C').value = totalReal

    totalRow.getCell('B').numFmt = 'R$ #,##0.00'
    totalRow.getCell('C').numFmt = 'R$ #,##0.00'

    totalRow.eachCell((cell, colNumber) => {
      if (colNumber <= 3) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' }
        cell.font = { bold: true }
      }
    })

    for (const col of ['A', 'B', 'C']) {
      const cell = totalRow.getCell(col)
      cell.border = borderStyle
    }

    totalRow.getCell('C').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: totalReal > totalGoal ? 'ffc7ce' : 'c6efce' },
    }
  }
}
