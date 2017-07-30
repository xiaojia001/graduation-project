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
router.get('/getAllGoods', (req, res) => {
	var sql = $sql.goods.getAll;
	var param = req.query;
	var query ="%" + param.name + "%"; 
	//onsole.log(query);
	conn.query(sql,query, function(err, result) {
		if (err) {
			console.log(err);
		}
		if (result) {
			jsonWrite(res, result);
		}
	})
});
router.post('/addGoods', (req, res) => {
	var sql = $sql.goods.addGoods;
	var params = req.body;
	//console.log(params);
	conn.query(sql, [params.goodscode, params.goodsname,params.sellingprice,params.categoryValue,params.unitValue,params.locationValue],
		function(err, result) {
		if (err) {
			console.log(err);
		}
		if (result) {
			jsonWrite(res, result);
		}
	});
	})
router.post('/delGoods', (req, res) => {
	var sql = $sql.goods.delGoods;
	var params = req.body;
	//console.log(params);
	conn.query(sql, [params.goodscode],
		function(err, result) {
		if (err) {
			console.log(err);
		}
		if (result) {
			jsonWrite(res, result);
		}
	});
	})
router.get('/getOneGoods', (req, res) => {
	var sql = $sql.goods.getOneGoods;
	var params = req.query;
	//console.log(params);
	conn.query(sql, params.code,
		function(err, result) {
		if (err) {
			console.log(err);
		}
		if (result) {
			jsonWrite(res, result);
		}
	});
	})
router.post('/editGoods', (req, res) => {
	var sql = $sql.goods.editGoods;
	var params = req.body;
	console.log(params);
	conn.query(sql, [ params.goodsname,params.sellingprice,params.categoryValue,params.unitValue,params.locationValue,params.goodscode],
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