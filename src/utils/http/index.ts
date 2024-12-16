import axios, { AxiosResponse } from "axios"

export class Http {
  private client
  constructor (url: string){
    this.client = axios.create({
      baseURL: url
    })
  }

  async get<T>(path: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(path)
    return response.data
  }
}