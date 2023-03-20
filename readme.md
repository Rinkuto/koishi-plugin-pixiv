# @rinkuto/koishi-plugin-pixiv

[![npm](https://img.shields.io/npm/v/@rinkuto/koishi-plugin-pixiv?style=flat-square)](https://www.npmjs.com/package/@rinkuto/koishi-plugin-pixiv)

从pixiv中随机获取一张图片

| 参数        |               作用                | 默认值                   |
|-----------|:-------------------------------:|-----------------------|
| isR18     |            是否随机R18图片            | false                 |
| isProxy   |             是否启用代理              | false                 |
| R18P      | 随机图片中R18的概率，别开太高哦~，仅在isR18为真时有效 | 0.1                   |
| proxyHost |     代理服务器的地址，仅在isProxy为真时有效     | http://127.0.0.1:7890 |
