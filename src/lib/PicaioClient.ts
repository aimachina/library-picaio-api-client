import {PicaioClientConfig} from "../types/PicaioClientConfig";
import axios, {AxiosInstance} from "axios";

export class PicaioClient {
	baseUrl: string;
	axiosInstance: AxiosInstance;
	bearerToken?: string;
	maxRetries: number = 3;

	constructor(picaioClientConfig: PicaioClientConfig) {
		this.baseUrl = picaioClientConfig.baseUrl;
		this.bearerToken = picaioClientConfig.bearerToken;
		if (picaioClientConfig.maxRetries) {
			this.maxRetries = picaioClientConfig.maxRetries;
		}
		this.axiosInstance = axios.create({
			baseURL: this.baseUrl
		});
	}
}

export function createPicaioClient(picaioClientConfig: PicaioClientConfig) {
	const picaioClient = new PicaioClient(picaioClientConfig);

	picaioClient.axiosInstance.defaults.timeout = picaioClientConfig.timeout ? picaioClientConfig.timeout : 60000;

	picaioClient.axiosInstance.interceptors.request.use(config => {
		if (picaioClient.bearerToken) {
			config.headers.Authorization = `Bearer ${picaioClient.bearerToken}`
		}
		return config
	});

	picaioClient.axiosInstance.interceptors.response.use(response => response,
		async error => {
			if (error.code == 'ERR_NETWORK' || error.response?.status > 500) {
				const config = error.config;
				if (config && !config.__retryCount) {
					config.__retryCount = 0;
				}
				if (config && config.__retryCount < 3) {
					config.__retryCount += 1;
					console.log(`Retry attempt ${config.__retryCount}/${picaioClient.maxRetries}`);

					await new Promise(resolve => setTimeout(resolve, 1000 * config.__retryCount));
					return picaioClient.axiosInstance(config);
				}
			}
			return Promise.reject(error)
		});

	return picaioClient;
}
