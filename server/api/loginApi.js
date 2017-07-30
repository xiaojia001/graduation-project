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
			code: 1,
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
};
// 增加登录接口
router.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

router.post('/userLogin', (req, res) => {
	var sql = $sql.user.login;
	
	var params = req.body;
	console.log(params);
	conn.query(sql, [params.userName, params.passWord], function(err, result) {
		if (err) {
			console.log("err");
		}
		if (result[0]) {
			var resultData=result[0]
			res.json({
			username:params.userName,
			code:200,
			msg:'登录成功',
			id:resultData.id,
			name: resultData.name,
			lastlogintime: moment(resultData.lastlogintime).format('YYYY/MM/DD,HH:mm:ss'),
			avatar:resultData.avatar
		});	
		}else{
			res.json({
			code:404,
			msg:'登录失败,用户名或密码错误'
		});	
		}
	})
});
router.post('/editPwd', (req, res) => {
	var sql = $sql.user.editPwd;
	var params = req.body;
	console.log(params);
	conn.query(sql, [ params.newpassword,params.username],
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