import {PicaioClientConfig} from "../types/PicaioClientConfig";
import axios, {AxiosInstance} from "axios";

export class PicaioClient {
	baseUrl: string;
	axiosInstance: AxiosInstance;
	bearerToken?: string;

	constructor(picaioClientConfig: PicaioClientConfig) {
		this.baseUrl = picaioClientConfig.baseUrl;
		this.bearerToken = picaioClientConfig.bearerToken;
		this.axiosInstance = axios.create({
			baseURL: this.baseUrl
		});
	}
}

export function createPicaioClient(picaioClientConfig: PicaioClientConfig){
	const picaioClient = new PicaioClient(picaioClientConfig);

	picaioClient.axiosInstance.interceptors.request.use(config => {
		config.headers.Authorization = `Bearer ${picaioClient.bearerToken}`
		return config
	});

	return picaioClient;
}
