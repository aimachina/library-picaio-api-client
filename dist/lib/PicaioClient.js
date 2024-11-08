"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PicaioClient = void 0;
exports.createPicaioClient = createPicaioClient;
const axios_1 = __importDefault(require("axios"));
class PicaioClient {
    constructor(picaioClientConfig) {
        this.maxRetries = 3;
        this.baseUrl = picaioClientConfig.baseUrl;
        this.bearerToken = picaioClientConfig.bearerToken;
        if (picaioClientConfig.maxRetries) {
            this.maxRetries = picaioClientConfig.maxRetries;
        }
        this.axiosInstance = axios_1.default.create({
            baseURL: this.baseUrl
        });
    }
}
exports.PicaioClient = PicaioClient;
function createPicaioClient(picaioClientConfig) {
    const picaioClient = new PicaioClient(picaioClientConfig);
    picaioClient.axiosInstance.defaults.timeout = picaioClientConfig.timeout ? picaioClientConfig.timeout : 60000;
    picaioClient.axiosInstance.interceptors.request.use(config => {
        if (picaioClient.bearerToken) {
            config.headers.Authorization = `Bearer ${picaioClient.bearerToken}`;
        }
        return config;
    });
    picaioClient.axiosInstance.interceptors.response.use(response => response, (error) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (error.code == 'ERR_NETWORK' || ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) > 500) {
            const config = error.config;
            if (config && !config.__retryCount) {
                config.__retryCount = 0;
            }
            if (config && config.__retryCount < 3) {
                config.__retryCount += 1;
                console.log(`Retry attempt ${config.__retryCount}/${picaioClient.maxRetries}`);
                yield new Promise(resolve => setTimeout(resolve, 1000 * config.__retryCount));
                return picaioClient.axiosInstance(config);
            }
        }
        return Promise.reject(error);
    }));
    return picaioClient;
}
