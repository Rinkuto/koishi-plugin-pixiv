import {Context, Random, Schema} from 'koishi'
import {HttpUtil} from "./util/HttpUtil";
import {AxiosRequestConfig} from "axios";

export const name = '@rinkuto/pixiv'

// import schedule from 'node-schedule';
import {Lolicon, Pixivic, Vilipix} from "./util/Interface";

let date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

import Config from "./config";

export * from './Config'


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
}

let _config: Config;

export function apply(ctx: Context, config: Config) {
  const logger = ctx.logger('pixiv');
  _config = config
  ctx.command('来张色图 [tag:text]', '随机一张色图')
    .alias('色图')
    .action(async ({session}, tag) => {
      let image: Lolicon;
      await session.send('不可以涩涩哦~');
      try {
        image = await getPixivImage(ctx, tag);
        if (image.urls === undefined) {
          await session.send(
            <>
              <at id={session.userId}></at>
              <text content={'没有获取到喵\n'}></text>
            </>
          );
        } else {
          session.send(
            <>
              <at id={session.userId}/>
              <image url={image.urls.original}></image>
              <text content={`title：${image.title}\n`}></text>
              <text content={`id：${image.pid}\n`}></text>
              <text content={`tags：${image.tags.map((item) => {
                return '#' + item
              }).join(' ')}\n`}></text>
            </>
          ).then(res => {
            if (res.length === 0) {
              logger.error(`消息发送失败，账号可能被风控，失败图片url：${image.urls.original}`);
              session.send(
                <>
                  <at id={session.userId}></at>
                  <text content={'图片发送失败了喵\n'}></text>
                  <text content={image.urls.original}></text>
                </>
              );
            }
          })
        }
      } catch (e) {
        logger.error(e);
        await session.send(
          <>
            <at id={session.userId}></at>
            <text content={'图片发送失败了喵\n'}></text>
          </>
        );
      }
    })
}

async function getPixivImage(ctx: Context, tag: string) {
  const params = {};
  if (_config.isR18) {
    params['r18'] = Random.bool(_config.r18P) ? 1 : 0;
  } else {
    params['r18'] = 0;
  }

  if (tag !== undefined) {
    params['tag'] = tag.split(' ').join('|');
  }

  const res = await ctx.http.get(HttpUtil.setParams(pixivUrl.url, params), getAxiosConfig());
  return res.data[0];
}

const getAxiosConfig = (): AxiosRequestConfig => {

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
  }
}

