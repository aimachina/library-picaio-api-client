"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PicaioClient = void 0;
exports.createPicaioClient = createPicaioClient;
const axios_1 = __importDefault(require("axios"));
class PicaioClient {
    constructor(picaioClientConfig) {
        this.baseUrl = picaioClientConfig.baseUrl;
        this.bearerToken = picaioClientConfig.bearerToken;
        this.axiosInstance = axios_1.default.create({
            baseURL: this.baseUrl
        });
    }
}
exports.PicaioClient = PicaioClient;
function createPicaioClient(picaioClientConfig) {
    const picaioClient = new PicaioClient(picaioClientConfig);
    picaioClient.axiosInstance.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${picaioClient.bearerToken}`;
        return config;
    });
    return picaioClient;
}
