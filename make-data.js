const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const DB_LIST = [
  {dbId:"db0", name:"真题外补充题库",   file:"真题外补充题库.csv"},
  {dbId:"db1", name:"西哲背诵题库",     file:"西哲背诵题库.csv"},
  {dbId:"db2", name:"西哲论述题",       file:"西哲论述题.csv"},
  {dbId:"db3", name:"马哲原理背诵题库", file:"马哲原理背诵题库.csv"},
  {dbId:"db4", name:"马哲原理论述题",   file:"马哲原理论述题.csv"},
  {dbId:"db5", name:"预测复习大纲",     file:"预测复习大纲.csv"}
];

const out = {};
for (const item of DB_LIST) {
  const fp = path.join(__dirname, 'web', item.file);
  if (!fs.existsSync(fp)) { console.warn('找不到：' + item.file); continue; }
  let text = fs.readFileSync(fp, 'utf8');
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const parsed = Papa.parse(text, {header:true, skipEmptyLines:true});
  out[item.dbId] = { name: item.name, rows: parsed.data };
  console.log(item.name + '：' + parsed.data.length + ' 题');
}
fs.writeFileSync(path.join(__dirname, 'web', 'data.js'),
  'window.DB_DATA = ' + JSON.stringify(out) + ';\n');
console.log('已生成 web/data.js');