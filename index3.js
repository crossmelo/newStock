const express = require('express');
const request = require('request');
const iconv = require('iconv-lite');
const colors = require('colors');
const app = express();

function fetch() {
  return new Promise((resolve, reject) => {
    // const url = 'https://xueqiu.com/service/v5/stock/screener/quote/list?page=1&size=40&order=desc&orderby=percent&order_by=percent&exchange=CN&market=CN&industry=%E5%8F%AF%E8%BD%AC%E5%80%BA&type=convert&_=1658927040039';
    const url = `https://xueqiu.com/service/v5/stock/screener/quote/list?page=1&size=40&order=desc&orderby=percent&order_by=percent&exchange=CN&market=CN&industry=%E5%8F%AF%E8%BD%AC%E5%80%BA&type=convert&_=${Date.now()}`;
    request({ url: url, encoding: null }, (err, response, body) => {
      console.clear();  // 可以清屏防止卡顿
      try {
        const mapList = [...Array.from({ length: 20 }).keys()].map(() => []);
        const data = iconv.decode(body, 'utf8');
        const list = JSON.parse(data).data.list;
        
        list.forEach((ele, index) => {
          // const a = Math.floor(index / length);
          const b = index % 20;
          const num = ele.current.toFixed(2);
          const numStr = String(num);
          mapList[b].push({
            name: ele.name,
            num: numStr.length > 5 ? num : (numStr.length > 4 ? ` ${num}` : `  ${num}`),
            percent: ele.percent,
          });
        });
        
        mapList.forEach(ele => {
          try {
            console.log(
              ele[0].name, ele[0].num, `${ele[0].percent}%`
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

fetch();
setInterval(() => {
  console.log('---敬畏市场，控制回撤---');
  fetch();
}, 20000);

app.listen(8666, () => {
  console.log('开启服务，端口8666');
});
