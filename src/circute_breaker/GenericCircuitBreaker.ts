import CircuitBreaker from "opossum";

export abstract class GenericCircuitBreaker <TI extends unknown[] = unknown[], TR = unknown> extends CircuitBreaker<TI, TR>{

  private failFallback: TR
  constructor(
    options: CircuitBreaker.Options<TI> = {
      errorThresholdPercentage: 10,
      resetTimeout: 10000
    }
  ) {
    super(
      async(...args: TI): Promise<TR> => {
        return this.execute(args)
      },
      options
    )

    this.fallback(this.fallbackd)
  }

  abstract execute(params: TI): Promise<TR>

  private async fallbackd(): Promise<TR> {
    return this.failFallback
  }
}
/**
 * this.addListener('fallback', ()=> console.log('fallback'))
      this.addListener('reject', ()=> console.log('reject'))
      this.addListener('failure', ()=> console.log('failure'))
 */