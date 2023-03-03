"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpUtil = void 0;
class HttpUtil {
    static setParams(url, params) {
        if (params) {
            let flag = true;
            const keys = Object.keys(params);
            const values = Object.values(params);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = values[i];
                if (flag) {
                    // 如果value 是数组
                    if (Array.isArray(value)) {
                        url += `?${key}=${value[0]}`;
                        for (let j = 1; j < value.length; j++) {
                            url += `&${key}=${value[j]}`;
                        }
                    }
                    else {
                        url += `?${key}=${value}`;
                    }
                    flag = false;
                }
                else {
                    if (Array.isArray(value)) {
                        for (let j = 0; j < value.length; j++) {
                            url += `&${key}=${value[j]}`;
                        }
                    }
                    else {
                        url += `&${key}=${value}`;
                    }
                }
            }
        }
        return url;
    }
}
exports.HttpUtil = HttpUtil;
