const env = process.env.ENV_CONFIG;
// console.log(" out process.env=" + JSON.stringify(process.env))
// 获取虚拟币banner 链接地址
const urlConfigs = [
  {
    env: 'dev',
    coinsBannerUrl: 'http://vcmall-dev.payermax.com/index.html#/vcmall/goodsContent?'
  },
  {
    env: 'test',
    coinsBannerUrl: 'http://vcmall-dev.payermax.com/index.html#/vcmall/goodsContent?'
  },
  {
    env: 'sit',
    coinsBannerUrl: 'http://vcmall-uat.payermax.com/index.html#vcmall/goodsContent?'
  },
  {
    env: 'prod',
    coinsBannerUrl: 'http://vcmall.payermax.com/index.html#/vcmall/goodsContent?'
  }
];

export function getUrl(name) {
  let url;
  console.log('env=' + env);
  urlConfigs.forEach(item => {
    if (item.env === env) {
      for (const key in item) {
        if (key === name) {
          url = item[key];
          break;
        }
      }
    }
  });
  return url;
}
export function getCoinsBannerUrl(goodsNo) {
  return getUrl('coinsBannerUrl') + 'goodsNo=' + goodsNo;
}
