const express = require('express');
const app = express();
const request = require('request');
const iconv = require('iconv-lite');
const colors = require('colors');
const filterList = require('./stock');

const getStringLen = (str) => {
  if (!str || str === null || str === '') { return 0; }
  let len = str.length;
  for (let i = 0; i < str.length; i++) {
    const code = str.codePointAt(i);
    if (code && code > 255) {
      len++;
    }
  }
  return len;
};

const getSliceString = (str, num) => {
  if (!str || str === null || str === '') { return str; }
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.codePointAt(i);
    len += code && code > 255 ? 2 : 1;
    if (len > num) {
      return str.slice(0, i);
    }
  }
  return str;
};

const arr = [
  'sz300122', // zhifei
  'sz300142', // wosen
  'sh600196', // fuxing
  'sz300363', // boteng
  'sh603127', // zhaoyan
  'sh688180', // junshi
  'sz300204', // shutaishen
  'sz300685', // aide
  'sh605116', // aoruite
  'sh600079', // renfu
  'sh603538', // meinuohua
  'sz300171', // dongfulong
  'sz300412', // jianan
  'sz002915', // zhongxin
  'sz000876', // xinxiwang
  'sh601689', // tuopu
  'sz300576', // rongda
  'sz300655', // jingrui
  'sz002617', // luxiao
  'sz300708', // jucan
  'sz000733', // zhenhua
  'sh600456', // baotai
  'sh688122', // chaodao
  'sz300124', // huichuang
  'sz301256', // huarong
  'sz002747', // aisidun
  'sz002026', // weida
  'sh603393', // xintian
  'sz002183', // yiyatong
  'sz000657', // zhongwu
  'sz300007', // hanwei
  'sh600549', // xiawu
  'sz300339', // runhe
  'sh601788', // guangda
  'sh600363', // lianchuangguangdian
  'sh603636', // nanwei
  'sz300831', // pairui
  'sh688261', // dongwei
  'sh603290', // sida
  'sh605111', // xinjieneng
  'sh688187', // shidai
  'sh688711', // hongwei
  'sh600460', // shilanwei
  'sz300373', // yangjie
  'sh688396', // huarun
  'sh605358', // liang
  'sh688206', // gailun
  'sz300623', // jiejie
  'sz300666', // jiangfeng
  'sh603078', // jianghuawei
  'sz002371', // huachuang
  'sh603986', // zhaoyi
  'sh600703', // sanan
  'sz002409', // yake
  'sz300671', // fuman
  'sz300327', // zhongying
  'sh603650', // tongcheng
  'sz300346', // nanda
  'sh688019', // anji
  'sz300223', // junzheng
  'sz300474', // jingjiawei
  'sz300661', // shengbang
  'sz002049', // ziguang
  'sh600096', // yuntianhua
  'sz300437', // qingshuiyuan
  'sz000422', // yihua
  'sz002176', // jiangte
  'sz002192', // rongjie
  'sz002466', // tianqi
  'sz000155', // chuanneng
  'sz002738', // zhongkuang
  'sz002497', // yahua
  'sz002240', // shengxi 
  'sz002245', // weilan
  'sz002460', // ganfeng
  'sz002756', // yongxing
  'sz000408', // zangge
  'sz300487', // lanxiao
  'sz000792', // yanhu
  'sh603799', // huayou
  'sh600111', // beixi
  'sz002812', // enjie
  'sz300568', // xingyuan
  'sh600110', // nuode
  'sh688388', // jiayuan
  'sz300496', // zhongke
  'sz002920', // desaixiwei
  'sh601689', // tuopu
  'sz300450', // xiandao
  'sz300457', // yinghe
  'sz300438', // penghui
  'sh688063', // paineng
  'sz002837', // yingweike
  'sz002518', // keshida
  'sz002335', // kehua
  'sz002922', // yigeer
  'sh688390', // gudewei
  'sh688303', // daquan
  'sh601137', // bowei
  'sh600732', // aixu
  'sh688223', // jingke
  'sz002459', // jingao
  'sz300118', // risheng
  'sh603185', // shangji
  'sz300751', // maiwei
  'sz300776', // dier
  'sz300274', // yangguang
  'sh600438', // tongwei
  'sz002129', // zhonghuan
  'sh603606', // dongfang
  'sz002487', // dajin
  'sh600522', // zhongtian
  'sh603169', // lanshi
  'sz000723', // meijin
  'sz300471', // houpu
  'sh600089', // tebian
  'sz300750',
  'sh601012', // longji
  'sh600519', // maotai
  'sh600030', // zhongxin
  'sz300059',
  'sh600036', 
  'sz000001', // pingyin
  'sh688981', // zhongxin
  'sz002594', // byd
  'sh601899', // zijin
  'sh600150', // zhongchuang
  'sh601628', // renshou
  'sh601088', // shenhua
  'sh600900', // changjiang
  'sz002241', // geer
  'sz002475', // lixun
  'sz002410', // guanglianda
  'sz002444', // juxing
];

const length = 20;
const rowNum = 4;

const timeRange = 6 * 60; // 一小时内最大拉升大于4%

const total = Array.from(new Set([...arr,...filterList])).join();

const codeMap = {};

function fetch(total) {
  return new Promise((resolve, reject) => {
    const url = `http://qt.gtimg.cn/r=${Math.random()}q=${total}`;
    request({ url: url, encoding: null }, (err, response, body) => {
      // console.clear(); // 可以清屏防止卡顿
      try {
        const totalList = [];
        const mapList = [...Array.from({ length }).keys()].map(() => []);
        const data = iconv.decode(body, 'gb2312');
        data
          .replace(/\n/gi, '')
          .split(';')
          .forEach((ele) => {
            if (ele) {
              try {
                const list = ele.split('~');
                const num = Number(list[3]);

                const codeItem = list[0] || '';
                const codeItemList = codeItem.split('_');
                const codePart = codeItemList[1] || '';
                const codePartList = codePart.split('=');
                const code = codePartList[0] || '';

                const list1 = ele.split('~~');
                const item1 = list1[1] || '';
                const list2 = item1.split('~');

                const name = list[1] || '';
                const nameLength = getStringLen(name);
                let shortName = '';
                if (nameLength > 8) {
                  shortName = name.slice(0, 4);
                } else if (nameLength === 8) {
                  shortName = name;
                } else {
                  const empty = [...Array.from({ length: 8 - nameLength }).keys()].map(() => ' ').join('');
                  shortName = `${name}${empty}`;
                }

                const shortNum = list[3].length > 5 ?  Number(list[3]).toFixed(2) : (list[3].length > 4 ? ` ${Number(list[3]).toFixed(2)}` : `  ${Number(list[3]).toFixed(2)}`);

                const percent = list2[2] ? Number(list2[2]) : 0;
                const shortPer = percent.toFixed(1);
                const shortPerStr = (percent < 0 || percent > 9.98) ? (percent <= -9.99 ? ` ${Math.floor(shortPer)}` : `${shortPer}`) : ` ${shortPer}`

                const max = list2[3] ? Number(list2[3]) : num;
                const discount = !max ? '0.0' : (((max - num) / max) * 100).toFixed(1);
                const show = discount > 50 ? '' : (discount >= 10 ? ` -${Math.floor(discount) + 1}%` : `-${discount}%`);

                const codeArr = codeMap[code] || [];
                codeArr.push(percent);
                const filterCodeArr = codeArr.slice(0, timeRange);
                codeMap[code] = filterCodeArr;
                const maxNum = Math.max(...filterCodeArr);
                const minNum = Math.min(...filterCodeArr);

                const mapItem = {
                  code,
                  name: shortName,
                  num: shortNum.slice(0, 6),
                  percent,
                  shortPer: shortPerStr.slice(0, 4),
                  discount,
                  show,
                  speed: (maxNum - minNum).toFixed(2),
                };

                totalList.push(mapItem);
              } catch (error) {}
            }
          });
        const sortList = totalList.sort((a, b) => b.percent - a.percent).slice(0, length * rowNum);
        sortList.forEach((ele, index) => {
          // const a = Math.floor(index / length);
          const b = index % length;
          mapList[b].push(ele);
        });
        console.clear(); // 可以清屏防止卡顿
        mapList.forEach(ele => {
          try {
            console.log(
              ele[0].speed > 4 ? ele[0].name.yellow : ele[0].name, ele[0].num, `${ele[0].shortPer}%`, ele[0].discount > 1 ? ele[0].show.red : ele[0].show, '|',
              ele[1].speed > 4 ? ele[1].name.yellow : ele[1].name, ele[1].num, `${ele[1].shortPer}%`, ele[1].discount > 1 ? ele[1].show.red : ele[1].show, '|',
              ele[2].speed > 4 ? ele[2].name.yellow : ele[2].name, ele[2].num, `${ele[2].shortPer}%`, ele[2].discount > 1 ? ele[2].show.red : ele[2].show, '|',
              ele[3].speed > 4 ? ele[3].name.yellow : ele[3].name, ele[3].num, `${ele[3].shortPer}%`, ele[3].discount > 1 ? ele[3].show.red : ele[3].show
            );
          } catch {
            console.log('-------------------------------------------------------------------------------------------------------------------')
          }
        })
        console.log('-------------------------------------------------------------------------------------------------------------------')
        const speedList = totalList.sort((a, b) => b.speed - a.speed).slice(0, 4);
        console.log(
          speedList[0].name, speedList[0].num, `${speedList[0].shortPer}%`, `${speedList[0].speed}%`, '|',
          speedList[1].name, speedList[1].num, `${speedList[1].shortPer}%`, `${speedList[1].speed}%`, '|',
          speedList[2].name, speedList[2].num, `${speedList[2].shortPer}%`, `${speedList[2].speed}%`, '|',
          speedList[3].name, speedList[3].num, `${speedList[3].shortPer}%`, `${speedList[3].speed}%`
        );
        resolve();
      } catch (error) {
        // reject(error);
      }
    });
  });
};

fetch(total);
setInterval(() => {
  // console.clear(); // 可以清屏防止卡顿
  // console.log('--------------------------敬畏市场，控制回撤--------------------------');
  fetch(total);
}, 10000);

app.listen(8668, () => {
  console.log('开启服务，端口8668');
});
