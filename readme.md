# @rinkuto/koishi-plugin-pixiv

[![npm](https://img.shields.io/npm/v/@rinkuto/koishi-plugin-pixiv?style=flat-square)](https://www.npmjs.com/package/@rinkuto/koishi-plugin-pixiv)

从pixiv中随机获取一张图片

| 参数        |               作用                | 默认值                   |
|-----------|:-------------------------------:|-----------------------|
| isR18     |            是否随机R18图片            | false                 |
| isProxy   |             是否启用代理              | false                 |
| R18P      | 随机图片中R18的概率，别开太高哦~，仅在isR18为真时有效 | 0.1                   |
| proxyHost |     代理服务器的地址，仅在isProxy为真时有效     | http://127.0.0.1:7890 |

### 使用方法

指令为来张色图，输入来张色图即可，后面可以跟上关键词
如
```
来张色图 黑丝
```
即可随机获取一张黑丝的图片

-n 选项为指定获取的图片数量，默认为一张，最大不超过10张，如
```
来张色图 -n 5 黑丝
```
即可随机获取5张黑丝的图片，关键词一定要放在最后面
