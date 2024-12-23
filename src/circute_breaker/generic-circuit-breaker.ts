import Redis from 'ioredis'
import CircuitBreaker from 'opossum'

const CACHE_TTL = 5
const STALE_CACHE_TTL = 6000
export abstract class GenericCircuitBreaker<TI extends unknown[] = unknown[], TR = unknown> extends CircuitBreaker<
  TI,
  TR
> {
  private label: string
  private failFallback: TR
  private redis: Redis

  constructor(
    label: string,
    redis: Redis,
    options: CircuitBreaker.Options<TI> = {
      errorThresholdPercentage: 10,
      resetTimeout: 10000,
    }
  ) {
    super(async (...args: TI): Promise<TR> => {
      const cacheKey = this.getKey(args)
      const staleCacheKey = this.getStaleKey(args)

      const dataFromCache = await redis.get(cacheKey)
      if (dataFromCache) {
        return JSON.parse(dataFromCache)
      }

      const result: TR = await this.execute(args)

      if (result) {
        const data = JSON.stringify(result)
        await redis
          .pipeline()
          .set(cacheKey, data, 'EX', CACHE_TTL)
          .set(staleCacheKey, data, 'EX', STALE_CACHE_TTL)
          .exec()
      }

      return result
    }, options)

    this.label = label
    this.redis = redis
    this.fallback(async (...args: TI): Promise<TR> => await this.fallbackd(...args))
    this.registerListeners()
  }

  abstract execute(params: TI): Promise<TR>

  private async fallbackd(...args: TI): Promise<TR> {
    const staleCacheKey = this.getStaleKey(args)
    const dataFromCache = await this.redis.get(staleCacheKey)
    if (dataFromCache) {
      return JSON.parse(dataFromCache)
    }
    return this.failFallback
  }

  private getKey(args: unknown[]): string {
    let key: string = this.label
    if (args.length > 0) {
      key += `:${args.join('-')}`
    }
    return key
  }

  private getStaleKey(args: TI): string {
    return this.getKey(args.slice(0, args.length - 1)).concat(':stale')
  }

  private registerListeners() {
    // this.addListener('fallback', () => console.log('fallback'))
    // this.addListener('reject', () => console.log('reject'))
    // this.addListener('failure', (args) => console.log(`API ${this.label} result in failure, ${JSON.stringify(args)}`))
    // this.addListener('success', (args: any) => console.log(`API ${this.label} result in success, ${JSON.stringify(args)}`))
  }
}
/**
 * this.addListener('fallback', ()=> console.log('fallback'))
      this.addListener('reject', ()=> console.log('reject'))
      this.addListener('failure', ()=> console.log('failure'))
 */
