import { setTimeout } from 'timers/promises'

import axios, { AxiosRequestConfig } from 'axios'

import { TimeoutException } from '../exceptions'

export type TimeoutOptions = {
  timeout: number
}

type Calcelation = {
  cancelTimeout: AbortController
  cancelRequest: AbortController
}

export class Http {
  private client
  constructor(url: string) {
    this.client = axios.create({
      baseURL: url,
    })
  }

  async request<T>(request: AxiosRequestConfig, timeout: TimeoutOptions = { timeout: 300 }): Promise<T> {
    const cancelation: Calcelation = {
      cancelTimeout: new AbortController(),
      cancelRequest: new AbortController(),
    }

    const response: T = await Promise.race([
      this.makeRquest(request, cancelation),
      this.timeout(timeout.timeout, cancelation),
    ])

    return response
  }

  private async makeRquest(requestConfig: AxiosRequestConfig, cancelation: Calcelation) {
    try {
      const response = await this.client.request({
        ...requestConfig,
        signal: cancelation.cancelRequest.signal,
      })

      return response.data
    } finally {
      cancelation.cancelTimeout.abort()
    }
  }

  private async timeout(delay: number, cancelation: Calcelation) {
    try {
      await setTimeout(delay, undefined, { signal: cancelation.cancelTimeout.signal })
      cancelation.cancelRequest.abort()
    } catch {
      return
    }
    throw new TimeoutException()
  }
}
