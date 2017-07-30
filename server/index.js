// node 后端服务器
const userApi = require('./api/userApi');
const loginApi = require('./api/loginApi');
const goodsApi = require('./api/goodsApi');
const commonApi = require('./api/commonApi');
const vendorApi = require('./api/vendorApi');
const stockApi = require('./api/stockApi');
const inboundApi = require('./api/inboundApi');
const chartApi = require('./api/chartApi');

const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// 后端api路由
app.use('/api/user', userApi);
app.use('/api/login', loginApi);
app.use('/api/goods', goodsApi);
app.use('/api/common', commonApi);
app.use('/api/vendor', vendorApi);
app.use('/api/stock', stockApi);
app.use('/api/inbound', inboundApi);
app.use('/api/chart', chartApi);
// 监听端口
app.listen(3000);
console.log('success listen at port:3000......');