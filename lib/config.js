"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const koishi_1 = require("koishi");
// @ts-ignore
exports.Config = koishi_1.Schema.intersect([
    koishi_1.Schema.object({
        isR18: koishi_1.Schema.boolean().default(false).description('是否开启R18'),
        isProxy: koishi_1.Schema.boolean().default(false).description('是否使用代理'),
    }),
    koishi_1.Schema.union([
        koishi_1.Schema.object({
            isProxy: koishi_1.Schema.const(false),
        }),
        koishi_1.Schema.object({
            isProxy: koishi_1.Schema.const(true),
            proxyHost: koishi_1.Schema.string().default('http://127.0.0.1:7890').description('代理地址'),
        })
    ]),
    koishi_1.Schema.union([
        koishi_1.Schema.object({
            isR18: koishi_1.Schema.const(false),
        }),
        koishi_1.Schema.object({
            isR18: koishi_1.Schema.const(true),
            r18P: koishi_1.Schema.percent().default(0.1).description('R18概率')
                .min(0).max(1).step(0.01),
        }),
    ])
]);
exports.default = exports.Config;
