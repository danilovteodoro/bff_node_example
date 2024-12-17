import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { setTimeout } from 'timers/promises'
import { TimeoutException } from "../exceptions"

export type TimeoutOptions = {
  timeout: number
}

type Calcelation = {
  cancelTimeout: AbortController
  cancelRequest: AbortController
}

export class Http {
  private client
  constructor (url: string){
    this.client = axios.create({
      baseURL: url
    })
  }

  async request<T> (request: AxiosRequestConfig, timeout: TimeoutOptions = {timeout : 300}): Promise<T> {
    const cancelation: Calcelation = {
      cancelTimeout: new AbortController(),
      cancelRequest: new AbortController()
    }

    const response: T = await Promise.race([
      this.makeRquest(request, cancelation),
      this.timeout(timeout.timeout, cancelation)
    ])

    return response
  }

  // async get<T>(
  //   path: string, 
  //   queryParams: Record<string, any> | undefined = undefined,
  //   timeout: number = 300
  // ): Promise<T> {
  //   console.log('timeout '+ timeout)
  //   // const response: AxiosResponse<T> = await this.client.get(path, {params: queryParams})
   
  //   const cancelTimeout = new AbortController()
  //   const cancelRequest = new AbortController()

  //   const response: T = await Promise.race([
  //      this.makeRquest({
  //       url: path,
  //       params: queryParams
  //     }, cancelTimeout, cancelRequest),

  //     this.timeout(timeout, cancelTimeout, cancelRequest)
  //   ])
  //   return response
  // }

  private async makeRquest<T>(
    requestConfig: AxiosRequestConfig,
    cancelation: Calcelation
  ) {
   
    try {
      const response = await this.client.request({
        ...requestConfig,
        signal: cancelation.cancelRequest.signal
      })

      return response.data
    } finally {
      cancelation.cancelTimeout.abort()
    }
  }

  private async timeout(
    delay: number,
    cancelation: Calcelation
  ) {
    try {
      await setTimeout(delay, undefined, {signal: cancelation.cancelTimeout.signal})
      cancelation.cancelRequest.abort()
    }catch(error) {
      return
    }
    throw new TimeoutException()
  }
}