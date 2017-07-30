var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
// 连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();
var jsonWrite = function(res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code: '1',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
};

router.get('/getAllStock', (req, res) => {
	var sql = $sql.stock.getAll;
	conn.query(sql, function(err, result) {
		if (err) {
			console.log(err);
		}
		if (result) {
			jsonWrite(res, result);
		}
	})
});

router.get('/getDetailStock', (req, res) => {
	var sql = $sql.stock.getDetail;
	var params = req.query;
	//console.log(params);
	conn.query(sql, params.goodsCode,
		function(err, result) {
		if (err) {
			console.log(err);
		}
		if (result) {
			jsonWrite(res, result);
		}
	});
	})

module.exports = router;