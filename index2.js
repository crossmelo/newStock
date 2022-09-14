const express = require('express');
const app = express();
const request = require('request');
const iconv = require('iconv-lite');
const colors = require('colors');
const filterList = require('./zhai');

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

const arr = [
  'sh113582', // huoju
  'sh118007', // shanshi
  'sh118006', // alading
  'sz123070', // penghui
  'sz123027', // lanxiao
  'sz128111', // zhongkuang
  'sh113016', // xiaokang
  'sh113537', // wencan
  'sz127007', // huguang
  'sz123138', // silu
  'sh113643', // fengyu
  'sh110055', // yinli
  'sh113630', // saiwu
  'sz123140', // tiandi
  'sz128140', // runjian
  'sz123039', // kairun
  'sz123013', // henghe
  'sh113618', // meinuo
  'sz127057', // panlong
  'sz123073', // tonghe
  'sz123031', // jingrui
  'sz123123', // jiangfeng
  'sh113621', // tongcheng
  'sz128101', // lianchuang
];

const length = 20;
const rowNum = 2;

const total = Array.from(new Set([...arr,...filterList])).join();

function fetch(total) {
  return new Promise((resolve, reject) => {
    const url = `http://qt.gtimg.cn/r=${Math.random()}q=${total}`;
    request({ url: url, encoding: null }, (err, response, body) => {
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

                const percent = list2[2] ? Number(list2[2]) : 0;
                const shortPer = percent.toFixed(1);

                const max = list2[3] ? Number(list2[3]) : num;
                const discount = !max ? 0 : (((max - num) / max) * 100).toFixed(1);
                const show = discount > 50 ? '' : (discount >= 10 ? ` -${Math.floor(discount) + 1}%` : `-${discount}%`);

                const mapItem = {
                  name: shortName,
                  num: list[3].length > 5 ?  Number(list[3]).toFixed(2) : (list[3].length > 4 ? ` ${Number(list[3]).toFixed(2)}` : `  ${Number(list[3]).toFixed(2)}`),
                  percent,
                  shortPer: (percent < 0 || percent > 9.98) ? (percent <= -9.99 ? ` ${Math.floor(shortPer)}` : shortPer) : ` ${shortPer}`,
                  discount,
                  show,
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
        mapList.forEach(ele => {
          try {
            console.log(
              ele[0].name, ele[0].num, `${ele[0].shortPer}%`, ele[0].discount > 1 ? ele[0].show.red : ele[0].show, '|',
              ele[1].name, ele[1].num, `${ele[1].shortPer}%`, ele[1].discount > 1 ? ele[1].show.red : ele[1].show
            );
          } catch {
            console.log('-----')
          }
        })
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
  
  const hour = new Date().getHours();
  if ([9, 10, 11, 13, 14].includes(hour)) {
    fetch(total);
  }
  // console.log('---敬畏市场，控制回撤---');
}, 5000);

app.listen(8666, () => {
  console.log('开启服务，端口8666');
});
