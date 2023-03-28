"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.name = void 0;
const jsx_runtime_1 = require("@satorijs/element/jsx-runtime");
const koishi_1 = require("koishi");
const HttpUtil_1 = require("./util/HttpUtil");
exports.name = '@rinkuto/pixiv';
let date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
__exportStar(require("./config"), exports);
// r18	int	0	        0为非 R18，1为 R18，2为混合（在库中的分类，不等同于作品本身的 R18 标识）
// num	int	1         一次返回的结果数量，范围为1到20；在指定关键字或标签的情况下，结果数量可能会不足指定的数量
// uid	int[]		      返回指定uid作者的作品，最多20个
// keyword	string		返回从标题、作者、标签中按指定关键字模糊匹配的结果，大小写不敏感，性能和准度较差且功能单一，建议使用tag代替
// tag	string[]		  返回匹配指定标签的作品，详见下文
// size	string[]	    ["original"]	返回指定图片规格的地址，详见下文
// proxy	string	    i.pixiv.re	设置图片地址所使用的在线反代服务，详见下文
// dateAfter	int		  返回在这个时间及以后上传的作品；时间戳，单位为毫秒
// dateBefore	int		  返回在这个时间及以前上传的作品；时间戳，单位为毫秒
// dsc	boolean	false	禁用对某些缩写keyword和tag的自动转换，详见下文
// excludeAI	boolean	false	排除 AI 作品
const pixivUrl = {
    url: 'https://api.lolicon.app/setu/v2'
};
let _config;
function apply(ctx, config) {
    const logger = ctx.logger('pixiv');
    _config = config;
    ctx.command('来张色图 [tag:text]', '随机一张色图')
        .option('n', '-n <value:number>', {
        fallback: 1,
    })
        .alias('色图')
        .action(async ({ session, options }, tag) => {
        let image;
        await session.send('不可以涩涩哦~');
        const messages = [];
        for (let i = 0; i < Math.min(10, options.n); i++) {
            try {
                image = await getPixivImage(ctx, tag);
                if (image.urls === undefined) {
                    messages.push((0, jsx_runtime_1.jsx)("message", { children: (0, jsx_runtime_1.jsx)("text", { content: '没有获取到喵\n' }) }));
                }
                else {
                    messages.push((0, jsx_runtime_1.jsxs)("message", { children: [(0, jsx_runtime_1.jsx)("image", { url: image.urls.original }), (0, jsx_runtime_1.jsx)("text", { content: `\ntitle：${image.title}\n` }), (0, jsx_runtime_1.jsx)("text", { content: `id：${image.pid}\n` }), (0, jsx_runtime_1.jsx)("text", { content: `tags：${image.tags.map((item) => {
                                    return '#' + item;
                                }).join(' ')}\n` })] }));
                }
            }
            catch (e) {
                messages.push((0, jsx_runtime_1.jsx)("message", { children: (0, jsx_runtime_1.jsx)("text", { content: `图片获取失败了喵~，code:${e.code}` }) }));
            }
        }
        session.send((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("message", { forward: true, children: messages }) })).then(res => {
            if (res.length === 0) {
                logger.error(`消息发送失败，账号可能被风控`);
                session.send((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("at", { id: session.userId }), (0, jsx_runtime_1.jsx)("text", { content: '消息发送失败了喵，账号可能被风控\n' })] }));
            }
        });
    });
}
exports.apply = apply;
async function getPixivImage(ctx, tag) {
    const params = {};
    if (_config.isR18) {
        params['r18'] = koishi_1.Random.bool(_config.r18P) ? 1 : 0;
    }
    else {
        params['r18'] = 0;
    }
    if (tag !== undefined) {
        params['tag'] = tag.split(' ').join('|');
    }
    const res = await ctx.http.get(HttpUtil_1.HttpUtil.setParams(pixivUrl.url, params), getAxiosConfig());
    return res.data[0];
}
const getAxiosConfig = () => {
    if (_config.isProxy === false) {
        return undefined;
    }
    const proxyUrl = new URL(_config.proxyHost);
    return {
        proxy: {
            host: proxyUrl.hostname,
            port: Number(proxyUrl.port),
            protocol: proxyUrl.protocol,
        }
    };
};
