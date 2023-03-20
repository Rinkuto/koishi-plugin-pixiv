import { Schema } from "koishi";
export interface Config {
    isR18: boolean;
    isProxy: boolean;
    proxyHost: string;
    r18P: number;
}
export declare const Config: Schema<Config>;
export default Config;
