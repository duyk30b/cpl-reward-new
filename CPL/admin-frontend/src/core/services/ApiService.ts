import CONFIG from '@/config'
import JwtService from '@/core/services/JwtService'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElNotification } from 'element-plus'
import { App } from 'vue'
import VueAxios from 'vue-axios'
import { HttpStatus, SubErrorCode } from '../variables/common.enum'

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app
    ApiService.vueInstance.use(VueAxios, axios)
    ApiService.vueInstance.axios.defaults.baseURL = CONFIG.API_URL
    ApiService.vueInstance.axios.interceptors.response.use(
      (res) => {
        if (!res.data) res.data = null
        return res
      },
      (e) => {
        const res = e.response || {}
        if (res.status == HttpStatus.INTERNAL_SERVER_ERROR) {
          // ElNotification.error({ message: 'Server Error!' })
        } else if (res.status == HttpStatus.UNAUTHORIZED) {
          //
        } else if (res.status == HttpStatus.FORBIDDEN) {
          if (res?.data?.status_code == SubErrorCode.PERMISSION_DENIED) {
            ElNotification.error({
              message: `Permission Denied${
                res?.data.path ? `: ${res?.data.path}` : ''
              }`,
            })
          }
        }
        if (!res.data) res.data = null
        return res
      },
    )
  }

  /**
   * @description set the default HTTP request headers
   */
  public static setHeader(): void {
    ApiService.vueInstance.axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${JwtService.getToken()}`
    ApiService.vueInstance.axios.defaults.headers.common['Accept'] =
      'application/json'
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(
    resource: string,
    params: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, params)
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param config
   * @returns Promise<AxiosResponse>
   */
  public static get<T = any>(
    resource: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return ApiService.vueInstance.axios.get<T>(`${resource}`, config)
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param data
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static post<T = any>(
    resource: string,
    data: any,
    params?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {    
    return ApiService.vueInstance.axios.post(`${resource}`, data, params)
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static update(
    resource: string,
    slug: string,
    params: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params)
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param data
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static put(
    resource: string,
    data: any,
    params?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}`, data, params)
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param data
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static patch<T = any>(
    resource: string,
    data: any,
    params?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return ApiService.vueInstance.axios.patch(`${resource}`, data, params)
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @param config
   * @returns Promise<AxiosResponse>
   */
  public static delete<T = any>(
    resource: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return ApiService.vueInstance.axios.delete(resource, config)
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @param config
   * @returns Promise<AxiosResponse>
   */
  public static getAndDownload(
    resource: string,
    config: AxiosRequestConfig,
    fileName: string,
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance
      .axios({
        ...config,
        method: 'GET',
        url: resource,
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        return response
      })
  }
}

export default ApiService
