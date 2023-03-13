const express = require('express');
const app = express();
const fetch = require('./fetch');

const arr = [
  'sh113648', // juxing
  'sh113582', // huoju
  'sz128111', // zhongkuang
  'sh113016', // xiaokang
  'sh113537', // wencan
  'sz127007', // huguang
  'sz123138', // silu
  'sh110055', // yinli
  'sz123140', // tiandi
  'sz128140', // runjian
  'sz123039', // kairun
  'sz123013', // henghe
  'sh113618', // meinuo
  'sz127057', // panlong
  'sz123031', // jingrui
  'sh113621', // tongcheng
  'sz128101', // lianchuang
];

// const total = arr.map((ele) => `s_${ele}`).join();
const total = arr.join();

fetch(total);
setInterval(() => {
  const hour = new Date().getHours();
  if ([9, 10, 11, 13, 14].includes(hour)) {
    fetch(total);
  }
  // console.log('---敬畏市场，控制回撤---');
}, 20000);

app.listen(7888, () => {
  console.log('开启服务，端口7888');
});
