import { PicaioClientConfig } from "../types/PicaioClientConfig";
import { AxiosInstance } from "axios";
export declare class PicaioClient {
    baseUrl: string;
    axiosInstance: AxiosInstance;
    bearerToken: string;
    constructor(picaioClientConfig: PicaioClientConfig);
}
export declare function createPicaioClient(picaioClientConfig: PicaioClientConfig): PicaioClient;
