// sql语句
var sqlMap = {
	// 用户
	user: {
		//add: 'insert into user(id, name, age) values (0, ?, ?)',
		login:'SELECT * from `user` WHERE `username` = ? and `password`= ?',
		editPwd:`update user set 
						password=?					
						where username = ?`,
		queryStaff:`SELECT
						name,
						age,
						avatar
						FROM
						 user`
	},
	//商品
	goods: {
		getAll:`SELECT
				goods.goodsCode,
				goods.goodsName,
				goods.sellingPrice,				
				category.AttributeDetailName as category,
				unit.AttributeDetailName as unit,
				location.AttributeDetailName as location
				FROM
				goods,
				attributedetail AS category ,
				attributedetail AS unit ,
				attributedetail AS location
				WHERE
				goods.categoryId = category.AttributeDetailId AND 
				unit.AttributeDetailId = goods.unitId AND 
				location.AttributeDetailId = goods.locationId AND 
				goods.goodsName like ?`,
		addGoods:`insert into goods values (?,?,?,?,?,?)`,
		delGoods:`DELETE from goods where goods.goodsCode = ?`,
		editGoods:`update goods set 
						goods.goodsName=?,
						goods.sellingPrice=?,
						goods.categoryId=?,
						goods.unitId=?,
						goods.locationId=?
						where goods.goodsCode = ?`,	
		getOneGoods:`SELECT
						goods.goodsName,
						goods.sellingPrice,
						goods.categoryId,
						goods.unitId,
						goods.locationId
						FROM
						goods
						where goods.goodsCode = ?`
	},
	//公共数据获取
	common:{
		attribute:`SELECT
					attributedetail.AttributeDetailName as name,
					attributedetail.AttributeDetailId as id
					FROM
					attribute
					INNER JOIN attributedetail ON attributedetail.AttributeId = attribute.AttributeId
					WHERE attribute.AttributeId = ?`,
		vendor:`SELECT
					vendor.vendorCode,
					vendor.vendorName
					FROM
					vendor`,
		getIDENTITY:`select @@IDENTITY`
	},
	vendor: {
		getAll:`SELECT * from vendor where vendor.vendorName like ?`,
		addVendor:`insert into vendor values (?,?,?,?,?,?,?)`,
		delVendor:`DELETE from vendor where vendor.vendorCode = ?`,
		editVendor:`update vendor set 
						vendor.vendorName=?,
						vendor.corporateRepresentative=?,
						vendor.inCharge=?,
						vendor.phoneNumber=?,
						vendor.fax=?,
						vendor.address = ?
						where vendor.vendorCode=?`
	},
	stock:{
		getAll:`SELECT
					goods.goodsCode,
					goods.goodsName,
					Sum(stock.quantity) AS quantity
				FROM
					(goods, depot)
				INNER JOIN stock ON goods.goodsCode = stock.goodsCode
				AND stock.depotId = depot.depotId
				GROUP BY
					goods.goodsCode`,
		getDetail:`SELECT
						depot.depotName,
						stock.quantity
						FROM
						(depot ,goods)
						INNER JOIN stock ON stock.goodsCode = goods.goodsCode 
						AND stock.depotId = depot.depotId
						WHERE goods.goodsCode = ?`
	},
	inbound:{
		addInbound:`insert into inbound values (0,?,?,?,?)`,
		addInboundDetail:`insert into inbounddetail values (0,?,?,?,?,0,?)`,
		queryAllInbound:`SELECT
							inbound.inboundId,
							inbound.inboundCode,
							inbound.inboundDate,
							inbound.vendorCode,
							user.name
							FROM
							(inbound
							INNER JOIN user ON inbound.userId = user.id)`,
		getInboundDetail:`SELECT
								inbounddetail.inboundDetailId,
								inbounddetail.goodsCode,
								goods.goodsName,
								inbounddetail.buyingPrice,
								inbounddetail.quantity,
								inbounddetail.isChecking,
								depot.depotName
								
								FROM
								inbounddetail
								INNER JOIN depot ON depot.depotId = inbounddetail.preDepotId
								INNER JOIN goods ON inbounddetail.goodsCode = goods.goodsCode
								where inbounddetail.inboundId = ?`,
		queryStockID:`SELECT
						stock.stockId
						FROM
						stock
						where goodsCode=? AND depotId=?`,
		stockUpdata:`update stock set 
						quantity=quantity + ?
						where stock.stockId = ?`,
		stockAdd:`insert into stock values (0,?,?,?)`,
		checkingUpdata:`update inbounddetail set 
						isChecking=1
						where inboundDetailId = ?`
							},
	chart:{
		queryChartStock:`SELECT
							goods.goodsName,
							Sum(stock.quantity) as quantity
							FROM
							stock
							INNER JOIN goods ON goods.goodsCode = stock.goodsCode
							GROUP BY
							goods.goodsCode
							ORDER BY
							quantity DESC
							LIMIT 0, ?`,
		queryLocationQuantity:`SELECT
								Count(goods.goodsCode) as value,
								attributedetail.AttributeDetailName AS name
								FROM
								attributedetail
								INNER JOIN goods ON attributedetail.AttributeDetailId = goods.locationId
								GROUP BY
								goods.locationId`
	}
}
module.exports = sqlMap;