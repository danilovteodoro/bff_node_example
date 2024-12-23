import CircuitBreaker from "opossum";

export abstract class GenericCircuitBreaker <TI extends unknown[] = unknown[], TR = unknown> extends CircuitBreaker<TI, TR>{

  private label: string
  private failFallback: TR
  constructor(
    label: string,
    options: CircuitBreaker.Options<TI> = {
      errorThresholdPercentage: 10,
      resetTimeout: 10000
    }
  ) {
    super(
      async(...args: TI): Promise<TR> => {
        console.log(`key: ${this.getKey(args)}, ${this.getStaleKey(args)} args: ${args.length}`)
        return this.execute(args)
      },
      options
    )

    this.label = label
    this.fallback(this.fallbackd)
  }

  abstract execute(params: TI): Promise<TR>

  private async fallbackd(): Promise<TR> {
    return this.failFallback
  }

  private getKey(args: unknown[]): string {
    let key: string = this.label
    if(args.length > 0) {
      key += `:${args.join('-')}`
    }
    return key
  }

  private getStaleKey(...args: unknown[]): string {
    return this.getKey(args).concat(':stale')
  }
}
/**
 * this.addListener('fallback', ()=> console.log('fallback'))
      this.addListener('reject', ()=> console.log('reject'))
      this.addListener('failure', ()=> console.log('failure'))
 */