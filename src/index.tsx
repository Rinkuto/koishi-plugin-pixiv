import {Context, Random, Schema} from 'koishi'
import {HttpUtil} from "./util/HttpUtil";

export const name = '@rinkuto/pixiv'

// import schedule from 'node-schedule';
import {Lolicon, Pixivic, Vilipix} from "./util/Interface";

export interface Config {

}

const pixivicRankMap = new Map<number, Pixivic[]>();

const vilipixRankMap = new Map<number, Vilipix[]>();
const vilipixPublicMap = new Map<number, Vilipix[]>();

let date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

// function scheduleCronstyle() {
//   schedule.scheduleJob('0 0 0 * * *', function () {
//     pixivicRankMap.clear();
//     date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
//   });
// }

export const Config: Schema<Config> = Schema.object({});

// const pixivicRankApi = {
//   url: "https://api.bbmang.me/ranks",
//   search: "https://i.pximg.net/",
//   replace: 'https://proxy.pixivel.moe/',
// };
//
// const vilipixRankApi = {
//   url: "https://www.vilipix.com/api/v1/picture/ranking",
// };
//
// const vilipixPublicApi = {
//   url: "https://www.vilipix.com/api/v1/picture/public",
// }


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


export function apply(ctx: Context) {
  ctx.command('来张色图 [tag:text]', '随机一张色图,后面为tag，用空格隔开(最多三个tag)')
    .alias('今日色图')
    .alias('色图')
    .action(async ({session}, tag) => {
      await session.send('正在获取中...');
      let image: Lolicon;

      try {
        image = await getPixivImage(ctx, tag);
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
            console.info('失败图片url：' + image.urls.original);
            session.send(
              <>
                <at id={session.userId}>
                  <text content={`图片发送失败了喵\n${image.urls.original}`}></text>
                </at>
              </>
            );
            session.send(image.urls.original);
          }
        })
      } catch (e) {
        await session.send('图片发送失败了喵');
      }
    })
}

// async function getPixivicImage(ctx: Context) {
//   const page = Math.floor(Math.random() * 10) + 1;
//   let res: { data: Pixivic[] };
//   if (pixivicRankMap.has(page)) {
//     res = {data: pixivicRankMap.get(page)};
//   } else {
//     res = await ctx.http.get(HttpUtil.setParams(pixivicRankApi.url,
//       {page, date, mode: 'day', pageSize: 30}));
//     pixivicRankMap.set(page, res.data);
//   }
//   const data = res.data;
//   return data[Random.int(0, data.length)].imageUrls[0].original.replace(pixivicRankApi.search, pixivicRankApi.replace);
// }
//
// async function getVilipixImage(ctx: Context, random: number) {
//   const page = Math.floor(Math.random() * 10) + 1;
//   let res: { data: { rows: Vilipix[] } };
//   if (random === 1) {
//     if (vilipixRankMap.has(page)) {
//       res = {data: {rows: vilipixRankMap.get(page)}};
//     } else {
//       res = await ctx.http.get(HttpUtil.setParams(vilipixRankApi.url,
//         {offset: (page - 1) * 16, limit: 16, type: 0}));
//       vilipixRankMap.set(page, res.data.rows);
//     }
//
//   } else {
//     if (vilipixPublicMap.has(page)) {
//       res = {data: {rows: vilipixPublicMap.get(page)}};
//     } else {
//       res = await ctx.http.get(HttpUtil.setParams(vilipixPublicApi.url,
//         {offset: (page - 1) * 16, limit: 16, type: 0}));
//       vilipixPublicMap.set(page, res.data.rows);
//     }
//   }
//
//   const data = res.data.rows;
//   return data[Random.int(0, data.length)].original_url;
// }

async function getPixivImage(ctx: Context, tag: string) {
  const params = {};
  if (Math.random() < 0.85) {
    params['r18'] = 0;
  } else if (Math.random() < 0.9) {
    params['r18'] = 1;
  } else {
    params['r18'] = 2;
  }

  if (tag !== undefined) {
    params['tag'] = tag.split(' ').join('|');
  }

  const res = await ctx.http.get(HttpUtil.setParams(pixivUrl.url, params));
  return res.data[0];
}

