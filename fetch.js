'use strict';
const request = require('request');
const iconv = require('iconv-lite');
const colors = require('colors');

exports = module.exports = fetch;
function fetch(total) {
  return new Promise((resolve, reject) => {
    const url = `http://qt.gtimg.cn/r=${Math.random()}q=${total}`;
    request({ url: url, encoding: null }, (err, response, body) => {
      console.clear();  // 可以清屏防止卡顿
      try {
        const data = iconv.decode(body, 'gb2312');
        data
          .replace(/\n/gi, '')
          .split(';')
          .forEach((ele) => {
            if (ele) {
              try {
                const list = ele.split('~');
                const num = Number(list[3]);

                const list1 = ele.split('~~');
                const item1 = list1[1] || '';
                const list2 = item1.split('~');

                const name = list[1] || '';
                const shortName = name.includes('ETF') ? name : name.slice(0, 4);
                // const shortName = name.includes('ETF') ? name : (name.length === 3 ? name : (name.slice(0, 2) + '  '));
                // const shortName = name.includes('ETF') ? name : name.slice(0, 2);

                const percent = list2[2] ? Number(list2[2]) : 0;
                const shortPer = percent.toFixed(1);

                const max = list2[3] ? Number(list2[3]) : num;
                const discount = !max ? 0 : (((max - num) / max) * 100).toFixed(1);
                const show = discount > 50 ? '' : `-${discount}%`;

                console.log(shortName, list[3], percent >= 3 ? `${shortPer}%`.yellow : `${shortPer}%`, discount > 1 ? show.red : show);
              } catch (error) {}
            }
          });
        resolve();
      } catch (error) {
        // reject(error);
      }
    });
  });
};