import {Context, Random, Schema} from 'koishi'
import {HttpUtil} from "./util/HttpUtil";

export const name = 'pixiv'

import schedule from 'node-schedule';
import {Pixivic, Vilipix} from "./util/Interface";

export interface Config {
}

const pixivicRankMap = new Map<number, Pixivic[]>();

const vilipixRankMap = new Map<number, Vilipix[]>();
const vilipixPublicMap = new Map<number, Vilipix[]>();

let date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

function scheduleCronstyle() {
  schedule.scheduleJob('0 0 0 * * *', function () {
    pixivicRankMap.clear();
    date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
}

export const Config: Schema<Config> = Schema.object({});

const pixivicRankApi = {
  url: "https://api.bbmang.me/ranks",
  search: "https://i.pximg.net/",
  replace: 'https://proxy.pixivel.moe/',
};

const vilipixRankApi = {
  url: "https://www.vilipix.com/api/v1/picture/ranking",
};

const vilipixPublicApi = {
  url: "https://www.vilipix.com/api/v1/picture/public",
}


export function apply(ctx: Context) {
  scheduleCronstyle();
  ctx.command('来张色图', '随机一张色图')
    .alias('今日色图')
    .action(async ({session}) => {
      await session.send('正在获取中...');
      const random = Random.int(0, 3);
      let url: string = '';
      try {
        switch (random) {
          case 0:
            url = await getPixivicImage(ctx);
            break;
          default:
            url = await getVilipixImage(ctx, random);
        }

        await session.send(
          <image url={url}></image>
        )
      } catch (e) {
        await session.send('获取失败')
      }
    })
}


async function getPixivicImage(ctx: Context) {
  const page = Math.floor(Math.random() * 10) + 1;
  let res: { data: Pixivic[] };
  if (pixivicRankMap.has(page)) {
    res = {data: pixivicRankMap.get(page)};
  } else {
    res = await ctx.http.get(HttpUtil.setParams(pixivicRankApi.url,
      {page, date, mode: 'day', pageSize: 30}));
    pixivicRankMap.set(page, res.data);
  }
  const data = res.data;
  return data[Random.int(0, data.length)].imageUrls[0].original.replace(pixivicRankApi.search, pixivicRankApi.replace);
}

async function getVilipixImage(ctx: Context, random: number) {
  const page = Math.floor(Math.random() * 10) + 1;
  let res: { data: { rows: Vilipix[] } };
  if (random === 1) {
    if (vilipixRankMap.has(page)) {
      res = {data: {rows: vilipixRankMap.get(page)}};
    } else {
      res = await ctx.http.get(HttpUtil.setParams(vilipixRankApi.url,
        {offset: (page - 1) * 16, limit: 16, type: 0}));
      vilipixRankMap.set(page, res.data.rows);
    }

  } else {
    if (vilipixPublicMap.has(page)) {
      res = {data: {rows: vilipixPublicMap.get(page)}};
    } else {
      res = await ctx.http.get(HttpUtil.setParams(vilipixPublicApi.url,
        {offset: (page - 1) * 16, limit: 16, type: 0}));
      vilipixPublicMap.set(page, res.data.rows);
    }
  }

  const data = res.data.rows;
  return data[Random.int(0, data.length)].original_url;
}

