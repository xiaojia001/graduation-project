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
//将对象转为数组
function transform(obj,type){
    var arr = [];
    for(var item in obj){
        arr.push(obj[item]);
    }
    if(type=="edit")
    {
    	var arrdata0=arr.shift();
    	arr.push(arrdata0);
    }
    return arr;
}

router.get('/getAllVendor', (req, res) => {
	var sql = $sql.vendor.getAll;
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
router.post('/addVendor', (req, res) => {
	var sql = $sql.vendor.addVendor;
	var params = transform(req.body,"add");
	//console.log(params);
	conn.query(sql, params,
		function(err, result) {
		if (err) {
			console.log(err);
		}
		if (result) {
			jsonWrite(res, result);
		}
	});
	})
router.post('/delVendor', (req, res) => {
	var sql = $sql.vendor.delVendor;
	var params = req.body;
	//console.log(params);
	conn.query(sql, [params.vendorcode],
		function(err, result) {
		if (err) {
			console.log(err);
		}
		if (result) {
			jsonWrite(res, result);
		}
	});
	})

router.post('/editVendor', (req, res) => {
	var sql = $sql.vendor.editVendor;
	var params = transform(req.body,"edit");
	//console.log(params);
	conn.query(sql, params,
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