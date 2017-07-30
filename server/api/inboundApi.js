var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
var moment = require('moment');
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

router.post('/addInbound', (req, res) => {
	var sql = $sql.inbound.addInbound;
	var params = req.body;
	//console.log(params);
	params.inboundDate = moment(params.inboundDate).format('YYYY/MM/DD HH:mm:ss')
	conn.query(sql, [params.inboundCode, params.inboundDate,params.vendorValue,params.userId],
		function(err, result) {
			if (result) {
				conn.query(`select @@IDENTITY as inboundId`,function(err, result) {
			if (err) {
				console.log(err);
			}
			if (result) {
				jsonWrite(res, result);
			}
		})
			}if (err) {
				console.log(err);
			}
		
		
	});
	})
router.post('/addInboundDetail', (req, res) => {
	var sql = $sql.inbound.addInboundDetail;
	var params = req.body;
	conn.query(sql, [params.inboundId, params.goodscode,params.buyingPrice,params.quantity,params.stockValue],
		function(err, result) {
		if (err) {
			console.log(err);
		}
		if (result) {
			jsonWrite(res, result);
		}
	});
	})
router.get('/queryAllInbound', (req, res) => {	
	var sql = $sql.inbound.queryAllInbound;
	conn.query(sql, function(err, result) {
		if (err) {
			console.log(err);
		}
		if (result) {
			jsonWrite(res, result);
		}
	})
});
router.get('/getInboundDetail', (req, res) => {
	var sql = $sql.inbound.getInboundDetail;
	var params = req.query;
	//console.log(params);
	conn.query(sql, params.inboundId,
		function(err, result) {
		if (err) {
			console.log(err);
		}
		if (result) {
			jsonWrite(res, result);
		}
	});
	})
router.post('/checkingInboundDetail', (req, res) => {
	var sql1 = $sql.inbound.queryStockID;
	var sql2 = $sql.inbound.stockUpdata;
	var sql3 = $sql.inbound.stockAdd;
	var sql4 = $sql.inbound.checkingUpdata;
	var params = req.body;
	//console.log(params);
	var preDepotId = params.depotName=="A仓"?1:2
	conn.query(sql1, [params.goodsCode, preDepotId],
		function(err, result) {
		if (result) {
			jsonWrite(res, result);
			if(result[0]){
				conn.query(sql2, [params.quantity,result[0].stockId],
					function(err, result) {
						if (result) {
							conn.query(sql4,[params.inboundDetailId],
								function(err, result) {
								});
						}
					});
			}else{
				//console.log(result);
				conn.query(sql3, [params.goodsCode, preDepotId,params.quantity],
					function(err, result) {
						if (result) {
							conn.query(sql4,[params.inboundDetailId],
								function(err, result) {
								});
						}
						if (err) {
								console.log(err);
						}
					});
			}
		}
		if (err) {
			console.log(err);
		}
	});
	})
module.exports = router;