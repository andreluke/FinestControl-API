export class Money {
  private cents: number

  constructor(amount: number) {
    this.cents = Math.round(amount * 100)
  }

  static fromCents(cents: number): Money {
    return new Money(cents / 100)
  }

  getCents(): number {
    return this.cents
  }

  getReais(): number {
    return this.cents / 100
  }

  format(locale = 'pt-BR', currency = 'BRL'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(this.getReais())
  }

  add(other: Money): this {
    this.cents += other.getCents()
    return this
  }

  subtract(other: Money): this {
    this.cents -= other.getCents()
    return this
  }

  multiply(factor: number): this {
    this.cents = Math.round(this.cents * factor)
    return this
  }

  equals(other: Money): boolean {
    return this.cents === other.getCents()
  }
}
