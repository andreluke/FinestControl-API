import { TagInvalidColor } from '#/errors/custom/TagError'

export class HexColor {
  private value: string

  constructor(color: string) {
    const normalized = HexColor.normalize(color)

    if (!HexColor.isValid(normalized)) {
      throw new TagInvalidColor(color)
    }

    this.value = normalized
  }

  static isValid(color: string): boolean {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color)
  }

  static normalize(color: string): string {
    return color.trim().toUpperCase()
  }

  getValue(): string {
    return this.value
  }

  toString(): string {
    return this.getValue()
  }
}
