export class HttpUtil{
  static setParams(url: string, params?: object): string {
    if (params) {
      const keys = Object.keys(params);
      const values = Object.values(params);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = values[i];
        if (i === 0) {
          url += `?${key}=${value}`;
        } else {
          url += `&${key}=${value}`;
        }
      }
    }
    return url;
  }
}
