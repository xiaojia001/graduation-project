<template>
	<section>
		<el-col :span="24" class="toolbar" >
		<el-button type="primary" size="large" @click="handleAdd" style="width: 100%"><i class="fa fa-plus">&nbsp;</i>新增入库单</el-button>
		</el-col>
		
		<el-table :data="queryInboundData"  highlight-current-row v-loading="queryInboundLoading"  border style="width: 100%;">
			<el-table-column prop="inboundId" v-show:"show" label="ID" width="100" align="center">
			</el-table-column>
			<el-table-column prop="inboundCode" label="入库单号" width="220" align="center" sortable>
			</el-table-column>
			<el-table-column prop="inboundDate" label="入库时间" :formatter="formatDatetime" width="210" align="center" sortable>
			</el-table-column>
			<el-table-column prop="vendorCode" label="供货商编号" width="250" align="center" sortable>
			</el-table-column>
			<el-table-column prop="name" label="填单员工" min-width="200" align="center" >
			</el-table-column>
			<el-table-column label="入库单详情" min-width="100" align="center">
				<template scope="scope">
					<el-button size="small" @click="queryDetail(scope.$index, scope.row)">查看</el-button>
				</template>
			</el-table-column>
		
		</el-table>
		<el-col :span="24" class="toolbar" style="padding: 5px;border:1px solid #dfe6ec;margin-top: 2px;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		
		<el-dialog  v-model="dialogTableVisible" >
			<span slot="title" class="title">{{inboundTitle}}</span>
		  <el-table :data="queryDetailData" border>
		   <el-table-column prop="isChecking" v-show:"show" label="审核否" width="100" align="center">
			</el-table-column>
			<el-table-column prop="inboundDetailId" v-show:"show" label="" width="100" align="center">
			</el-table-column>
			<el-table-column prop="goodsCode" label="商品编号" width="100" align="center" >
			</el-table-column>
			<el-table-column prop="goodsName" label="商品名称"  width="100" align="center" >
			</el-table-column>
			<el-table-column prop="buyingPrice" label="进价" width="80" align="center" >
			</el-table-column>
			<el-table-column prop="quantity" label="数量" min-width="80" align="center" >
			</el-table-column>
			<el-table-column prop="depotName" label="预存仓库" min-width="100" align="center" >
			</el-table-column>
			<el-table-column label="审核入库" min-width="100" align="center">
				<template scope="scope">
					<span v-if="scope.row.isChecking" class="checkingspan">已审核</span>
					<el-button v-else type="danger"  size="small" @click="checkingDetail(scope.$index, scope.row)">审核</el-button>
				</template>
			</el-table-column>
			</el-table>
		</el-dialog>
		
		
		<el-dialog title="新增" v-model="addVisible">
			<el-form :model="addForm" label-width="100px"  ref="addForm">
				<fieldset>
					<legend>入库单</legend>
				<el-form-item label="入库单号:" prop="inboundCode">
					<el-input v-model="addForm.inboundCode" auto-complete="off" 
					placeholder="请输入入库单号"	></el-input>
				</el-form-item>
				<el-form-item label="入库时间:" prop="inboundDate">
					 <el-date-picker style="width: 100%;"
				      v-model="addForm.inboundDate"
				      type="datetime"
				      placeholder="选择日期时间">
				    </el-date-picker>
			    </el-form-item>
				<el-form-item label="供货人">
					<el-select placeholder="请选择供货人" v-model="addForm.vendorValue" style="width: 100%;">
      					<el-option v-for="item in vendor" :label="item.vendorName" :value="item.vendorCode">
    					</el-option>
   					</el-select>
				</el-form-item>	
				</fieldset>
			</el-form>
			
			<el-form :model="addDetail" label-width="100px" ref="addDetail">
				<fieldset>
					<legend>详情添加</legend>
					<el-form-item label="商品编号">
						<el-input v-model="addDetail.goodscode" auto-complete="off" placeholder="请输入商品编号"></el-input>
					</el-form-item>
					<el-form-item label="进价">
						<el-input v-model="addDetail.buyingPrice" auto-complete="off" placeholder="请输入进价"></el-input>
					</el-form-item>
					<el-form-item label="数量">
						<el-input-number placeholder="请填写数量"
							 v-model="addDetail.quantity" :min="0" :max="10000" style="width: 100%;">
						</el-input-number>
					</el-form-item>
					<el-form-item label="预存仓库">
						<el-select placeholder="请选择预存仓库" v-model="addDetail.stockValue" style="width: 100%;">
							<el-option v-for="item in stock" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-button type="primary" @click="handleDetailAdd" style="width: 100%"><i class="fa fa-plus">&nbsp;</i>添加详情</el-button>
				</fieldset>
			</el-form>
		  <el-table :data="addDetailGrid">
		    <el-table-column property="goodscode" label="商品编号" width="150"></el-table-column>
		    <el-table-column property="buyingPrice" label="进价" width="100"></el-table-column>
		    <el-table-column property="quantity" label="数量"></el-table-column>
		    <el-table-column property="stockValue" label="预存仓库" width="100" :formatter="formatStock"></el-table-column>
		    <el-table-column label="操作" width="150" align="center">
				<template scope="scope">
					<el-button type="danger" size="small" @click="handleDelDetail(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		  </el-table>
		  <div slot="footer" class="dialog-footer">
				<el-button @click.native="addVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
		  </div>
		</el-dialog>
	</section>
</template>

<script>
	import moment from 'moment'
	export default {
	data() {
		return {
			addVisible:false,
			addForm:{
				inboundCode: '',
				inboundDate:'',
				vendorValue:'',
				userId:JSON.parse(localStorage.getItem('user')).id
			},
			addDetail:{
				goodscode: '',
				buyingPrice:'',
				quantity:1,
				stockValue:1
			},
			vendor:[],
			stock:[{name:'A仓',id:1},{name:'B仓',id:2}],
			addDetailGrid:[],
			addLoading:false,
			queryInboundLoading:false,
			queryInboundData:[],
			queryDetailData:[],
			dialogTableVisible:false,
			total: 0,
			page: 1,
			show:false,
			inboundTitle:''
		}
	},
	methods:{
		formatStock: function (row, column) {
				return row.stockValue == 1 ? 'A仓' : 'B仓';
			},
		formatDatetime:function(row,column){
			return moment(row.inboundDate).format('YYYY/MM/DD HH:mm:ss')
		},
		handleAdd(){
			this.addVisible=true;
			//console.log(this.addForm.userId);
		},
		handleDetailAdd(){
			this.addDetailGrid.push(this.addDetail);

			this.addDetail = {goodscode: '',
							  buyingPrice:'',
							  quantity:1,
						      stockValue:''};
			//console.log(this.addDetailGrid);
		},
		handleDelDetail: function (index, row) {
			this.addDetailGrid.splice(index,1);
		},
		getCommonVendor(){
			this.$http.get('/api/common/getCommonVendor'
       				).then((response) => 
			{
				this.vendor = response.data
			})
		},
		addSubmit:function(){
			this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							var add = this.addForm;
							var addlist = Object.assign({}, add);
          				this.$http.post('/api/inbound/addInbound', 
          				addlist).then((response) => {
          					this.addLoading = false
          					var inboundId =  response.data[0].inboundId
          					var detailData = this.addDetailGrid
          					for (let i=0;i<detailData.length;i++) {
          						this.addDetailData(inboundId,detailData[i]);
          					}
          					
//        					this.$notify({
//									title: '成功',
//									message: '提交成功',
//									type: 'success'
//								});
//								this.editFormVisible = false;

          				}, response => {
    							// error callback
	    							
	    							this.$notify({
						          	title: '警告',
						          	message: '网络连接错误!',
						          	type: 'warning'
						            })
  								})
						});
		},
		addDetailData(inboudId,detailData){
			let detail = detailData;
			detail.inboundId = inboudId
			console.log(detail)
			this.$http.post('/api/inbound/addInboundDetail', 
          				detail).then((response) => {
          					this.addDetailGrid=[];
          					this.addForm={
								inboundCode: '',
								inboundDate:'',
								vendorValue:'',
								userId:JSON.parse(localStorage.getItem('user')).id
							};
							this.addVisible=false;
							this.getallInbound();

          				}, response => {
    							// error callback
	    							
	    							this.$notify({
						          	title: '警告',
						          	message: '网络连接错误!',
						          	type: 'warning'
						            })
  								})
		},
		handleCurrentChange(val) {
				this.page = val;
				this.getallInbound();

		},
		getallInbound(){
			this.$http.get('/api/inbound/queryAllInbound').then((response) => 
			{
				this.total=response.data.length
          		this.queryInboundData = response.data
          		this.queryInboundData = this.queryInboundData.filter((u, index) => index < 10 * this.page && index >= 10 * (this.page - 1)) //分页		
			})
		},
		queryDetail: function (index, row) {
			this.inboundTitle ='入库单号 ' + row.inboundCode +' 详情'
			this.dialogTableVisible=true
			this.$http.get('/api/inbound/getInboundDetail', 
					{params: {inboundId:row.inboundId}}
       				).then((response) => 
			{
				this.queryDetailData = response.data
			})
		},
		checkingDetail: function (index, row) {
			this.$confirm('确认提交吗？', '提示', {}).then(() => {						
							var data = row;
							var checkingData = Object.assign({}, row);
          				this.$http.post('/api/inbound/checkingInboundDetail', 
          				checkingData).then((response) => {
          					
          					this.$notify({
									title: '成功',
									message: '审核入库成功',
									type: 'success'
								});
								//this.dialogTableVisible = false;
								setTimeout(()=>{
								    row.isChecking = 1;
								  },1000)
						
          				}, response => {
    							// error callback
	    							
	    							this.$notify({
						          	title: '警告',
						          	message: '网络连接错误!',
						          	type: 'warning'
						            })
  								})
						});
		}
	},
	mounted() {
			this.getCommonVendor();
			this.getallInbound();
		}
	}
</script>

<style lang="less" scoped>
	
	.title {
    line-height: 1;
    font-size: 16px;
    font-weight: 700;
    color: #1f2d3d;
}
.checkingspan{
	font-size: 16px;
    font-weight: 700;
    color: #20A0FF;
}
</style>