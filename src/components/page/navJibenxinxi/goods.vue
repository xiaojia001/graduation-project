<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getGoods"><i class="fa fa-search">&nbsp;</i>查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd"><i class="fa fa-plus">&nbsp;</i>新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="goodsData" highlight-current-row v-loading="listLoading" @selection-change="selsChange"  border style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			
			<el-table-column prop="goodsCode" label="商品编号" width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="goodsName" label="商品名称" width="210" align="center" sortable>
			</el-table-column>
			<el-table-column prop="sellingPrice" label="售价(¥)" width="110" align="center" sortable>
			</el-table-column>
			<el-table-column prop="category" label="商品类型" width="130" align="center" sortable>
			</el-table-column>
			<el-table-column prop="unit" label="单位" width="130" align="center" sortable>
			</el-table-column>
			<el-table-column prop="location" label="货架区" min-width="120" align="center" sortable>
			</el-table-column>
			<!--<el-table-column prop="quantity" label="数量" width="100" align="center" sortable>
			</el-table-column>-->
			<el-table-column label="操作" width="150" align="center">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-col :span="24" class="toolbar" style="padding: 5px;">
			<el-button type="danger" @click="batchRemove"  :disabled="this.sels.length===0">
				<i class="fa fa-trash" aria-hidden="true"></i>&nbsp;批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

	<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
				<el-form-item label="商品编号" prop="goodscode">
					<el-input v-model="addForm.goodscode" auto-complete="off" 
					placeholder="请输入商品编号"	></el-input>
				</el-form-item>
				<el-form-item label="商品名称" >
					<el-input v-model="addForm.goodsname" auto-complete="off" 
					placeholder="请输入商品名称"	></el-input>
				</el-form-item>
				<el-form-item label="售价" >
					<el-input-number v-model="addForm.sellingprice"  :min="0" :max="10000" style="width: 100%;">
					</el-input-number>
				</el-form-item>
				<!--<el-form-item label="数量" >
					<el-input-number v-model="addForm.quantity"  :min="0" :max="10000" style="width: 100%;">
					</el-input-number>
				</el-form-item>-->
				<el-form-item label="商品类型">
					<el-select placeholder="请选择类型" v-model="addForm.categoryValue" style="width: 100%;">
      					<el-option v-for="item in addForm.category" :label="item.name" :value="item.id">
    					</el-option>
   					</el-select>
				</el-form-item>
				<el-form-item label="单位">
					<el-select placeholder="请选择单位" v-model="addForm.unitValue" style="width: 100%;">
      					<el-option v-for="item in addForm.unit" :label="item.name" :value="item.id">
    					</el-option>
   					</el-select>
				</el-form-item>
				<el-form-item label="货架区">
					<el-select placeholder="请选择货架区" v-model="addForm.locationValue" style="width: 100%;">
      					<el-option v-for="item in addForm.location" :label="item.name" :value="item.id">
    					</el-option>
   					</el-select>
				</el-form-item>				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-form-item label="商品编号" prop="goodscode">
					<el-input v-model="editForm.goodscode" auto-complete="off" disabled
					placeholder="请输入商品编号"	></el-input>
				</el-form-item>
				<el-form-item label="商品名称" >
					<el-input v-model="editForm.goodsname" auto-complete="off" 
					placeholder="请输入商品名称"	></el-input>
				</el-form-item>
				<el-form-item label="售价" >
					<el-input-number v-model="editForm.sellingprice"  :min="0" :max="10000" style="width: 100%;">
					</el-input-number>
				</el-form-item>
				<!--<el-form-item label="数量" >
					<el-input-number v-model="editForm.quantity"  :min="0" :max="10000" style="width: 100%;">
					</el-input-number>
				</el-form-item>-->
				<el-form-item label="商品类型">
					<el-select placeholder="请选择类型" v-model="editForm.categoryValue" style="width: 100%;">
      					<el-option v-for="item in editForm.category" :label="item.name" :value="item.id">
    					</el-option>
   					</el-select>
				</el-form-item>
				<el-form-item label="单位">
					<el-select placeholder="请选择单位" v-model="editForm.unitValue" style="width: 100%;">
      					<el-option v-for="item in editForm.unit" :label="item.name" :value="item.id">
    					</el-option>
   					</el-select>
				</el-form-item>
				<el-form-item label="货架区">
					<el-select placeholder="请选择货架区" v-model="editForm.locationValue" style="width: 100%;">
      					<el-option v-for="item in editForm.location" :label="item.name" :value="item.id">
    					</el-option>
   					</el-select>
				</el-form-item>				
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
export default {
		data() {
			return {
				filters: {
					name: ''
				},
				goodsData: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					goodscode: [
						{ required: true, message: '请输入商品编号', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					goodscode: '',
					goodsname: '',
					sellingprice:0,
//					quantity:0,
					category:[],
					unit:[],
					location:[],
					categoryValue:'',
					unitValue:'',
					locationValue:'',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					goodscode: [
						{ required:true, message: '请输入商品编号!', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					goodscode: '',
					goodsname: '',
					sellingprice:0,
//					quantity:0,
					category:[],
					unit:[],
					location:[],
					categoryValue:'',
					unitValue:'',
					locationValue:'',
				}

			}
		},
		methods:{
			handleCurrentChange(val) {
				this.page = val;
				this.getGoods();
			},
			getGoods(){
				console.log(this.filters.name)
				this.$http.get('/api/goods/getAllGoods', 
					{params: {name:this.filters.name}}
       				).then((response) => {
          				this.total=response.data.length
          				this.goodsData = response.data
          				this.goodsData = this.goodsData.filter((u, index) => index < 10 * this.page && index >= 10 * (this.page - 1)) //分页
          				}, response => {
    							// error callback
	    							this.logining = false
	    							this.$notify({
						          	title: '警告',
						          	message: '网络连接错误!',
						          	type: 'warning'
						            })
	    							this.quit()
  								})
          			
			},
			selsChange: function (val) {
				this.sels = val
				//console.log(this.sels)
			},
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.$http.get('/api/goods/getOneGoods', 
					{params: {code:row.goodsCode}}
       				).then((response) => {
       					var data = response.data[0]
       					//console.log(response.data[0])
          				this.editForm= {
							goodscode: row.goodsCode,
							goodsname: data.goodsName,
							sellingprice:data.sellingPrice,
//							quantity:data.quantity,
							categoryValue:data.categoryId,
							unitValue:data.unitId,
							locationValue:data.locationId,
							category:[],
							unit:[],
							location:[]
						}
          				this.getattr(1,"e");
						this.getattr(2,"e");
						this.getattr(3,"e");
          				})
			},
			batchRemove: function () {
				var codes = this.sels.map(x => x.goodsCode);
				console.log(codes);
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let count = 0;
					for(let i=0;i<codes.length;i++){
						let para = { goodscode: codes[i] };
						this.$http.post('/api/goods/delGoods', para).then(
						(response)=>{
							if(response.data.affectedRows){
								count++	
							}
						}
					)
					}
					this.listLoading = false
					this.$notify({
									title: '成功',
									message: '删除成功',
									type: 'success'
								});
					this.getGoods()
				}).catch(() => {

				});
			},
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { goodscode: row.goodsCode };
					this.$http.post('/api/goods/delGoods', para).then(
						(response)=>{
							if(response.data.affectedRows){
								console.log(response.data.affectedRows)
								this.listLoading = false
								this.$notify({
									title: '成功',
									message: '删除成功',
									type: 'success'
								});
								this.getGoods()
							}
						}
					)
				}).catch(() => {

				});
			},
			
			
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					goodscode: '',
					goodsname: '',
					sellingprice:0,
//					quantity:0,
					categoryValue:'',
					unitValue:'',
					locationValue:'',
					category:[],
					unit:[],
					location:[]
				};
				this.getattr(1,"a");
				this.getattr(2,"a");
				this.getattr(3,"a");
			},
			getattr(typeid,aoe){
				var tool = (aoe=="a")?this.addForm:this.editForm
				 this.$http.get('/api/common/getCommonAttr', 
					{params: {id:typeid}}
       			).then((response) => {
          				switch (typeid){
          					case 1:
          						tool.category = response.data
          						break;
          					case 2:
          						tool.unit = response.data
          						break;
          					case 3:
          						tool.location = response.data
          						break;
          					default:
          						break;
          				}
          		})
			},
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							var add = this.addForm;
          				this.$http.post('/api/goods/addGoods', {
          					goodscode: add.goodscode,
							goodsname: add.goodsname,
							sellingprice:add.sellingprice,
//							quantity:add.quantity,
							categoryValue:add.categoryValue,
							unitValue:add.unitValue,
							locationValue:add.locationValue,
          				}).then((response) => {
          					this.addLoading = false
          					this.$notify({
									title: '成功',
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getGoods();
          				}, response => {
    							// error callback
	    							this.logining = false
	    							this.$notify({
						          	title: '警告',
						          	message: '网络连接错误!',
						          	type: 'warning'
						            })
  								})
						});
					}else {
           				this.$notify({
			          	title: '警告',
			          	message: '请检查填写数据!',
			          	type: 'warning'
			            })
            			return false
          						}
				});
			},
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							var edit = this.editForm;
          				this.$http.post('/api/goods/editGoods', {	
							goodsname: edit.goodsname,
							sellingprice:edit.sellingprice,
//							quantity:edit.quantity,
							categoryValue:edit.categoryValue,
							unitValue:edit.unitValue,
							locationValue:edit.locationValue,
							goodscode:edit.goodscode,
          				}).then((response) => {
          					this.editLoading = false
          					this.$notify({
									title: '成功',
									message: '提交成功',
									type: 'success'
								});
								this.editFormVisible = false;
								this.getGoods();
          				}, response => {
    							// error callback
	    							this.logining = false
	    							this.$notify({
						          	title: '警告',
						          	message: '网络连接错误!',
						          	type: 'warning'
						            })
  								})
						});
					}else {
           				this.$notify({
			          	title: '警告',
			          	message: '请检查填写数据!',
			          	type: 'warning'
			            })
            			return false
          			}
				});
			},
			quit(){
				setTimeout(() => { 
				localStorage.removeItem('user');
				this.$router.push('/login');
				}, 1000)
			}
		},
		mounted() {
			this.getGoods();
			
		}
	}

</script>

<style scoped>
.el-button + .el-button {
    margin-left: 0px;
}
</style>