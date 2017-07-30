<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getvendor"><i class="fa fa-search">&nbsp;</i>查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd"><i class="fa fa-plus">&nbsp;</i>新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="vendorData" highlight-current-row v-loading="listLoading" @selection-change="selsChange"  border style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			
			<el-table-column prop="vendorCode" label="供货商编号" width="120" align="center" >
			</el-table-column>
			<el-table-column prop="vendorName" label="供货商名称" width="180" align="center" >
			</el-table-column>
			<el-table-column prop="corporateRepresentative" label="法人代表" width="110" align="center" >
			</el-table-column>
			<el-table-column prop="inCharge" label="联系人" width="120" align="center" >
			</el-table-column>
			<el-table-column prop="phoneNumber" label="电话号码" width="95" align="center">
			</el-table-column>
			<el-table-column prop="fax" label="传真" width="120" align="center" >
			</el-table-column>
			<el-table-column prop="address" label="地址" min-width="100" align="center" >
			</el-table-column>
			<el-table-column label="操作" width="140" align="center">
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
				<el-form-item label="供货商编号" prop="vendorCode">
					<el-input v-model="addForm.vendorCode" auto-complete="off" 
					placeholder="请输入供货商编号"	></el-input>
				</el-form-item>
				<el-form-item label="供货商名称" >
					<el-input v-model="addForm.vendorName" auto-complete="off" 
					placeholder="请输入供货商名称"	></el-input>
				</el-form-item>
				<el-form-item label="法人代表" >
					<el-input v-model="addForm.corporateRepresentative" auto-complete="off" 
					placeholder="请输入法人代表"	></el-input>
				</el-form-item>
				<el-form-item label="联系人" >
					<el-input v-model="addForm.inCharge" auto-complete="off" 
					placeholder="请输入联系人"	></el-input>
				</el-form-item>
				<el-form-item label="联系电话" >
					<el-input v-model="addForm.phoneNumber" auto-complete="off" 
					placeholder="请输入联系电话"	></el-input>
				</el-form-item>
				<el-form-item label="传真" >
					<el-input v-model="addForm.fax" auto-complete="off" 
					placeholder="请输入传真"	></el-input>
				</el-form-item>
				<el-form-item label="地址" >
					<el-input v-model="addForm.address" auto-complete="off" 
					placeholder="请输入地址"	></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-form-item label="供货商编号" prop="vendorCode">
					<el-input v-model="editForm.vendorCode" auto-complete="off" disabled
					placeholder="请输入供货商编号"	></el-input>
				</el-form-item>
				<el-form-item label="供货商名称" >
					<el-input v-model="editForm.vendorName" auto-complete="off" 
					placeholder="请输入供货商名称"	></el-input>
				</el-form-item>
				<el-form-item label="法人代表" >
					<el-input v-model="editForm.corporateRepresentative" auto-complete="off" 
					placeholder="请输入法人代表"	></el-input>
				</el-form-item>
				<el-form-item label="联系人" >
					<el-input v-model="editForm.inCharge" auto-complete="off" 
					placeholder="请输入联系人"	></el-input>
				</el-form-item>
				<el-form-item label="联系电话" >
					<el-input v-model="editForm.phoneNumber" auto-complete="off" 
					placeholder="请输入联系电话"	></el-input>
				</el-form-item>
				<el-form-item label="传真" >
					<el-input v-model="editForm.fax" auto-complete="off" 
					placeholder="请输入传真"	></el-input>
				</el-form-item>
				<el-form-item label="地址" >
					<el-input v-model="editForm.address" auto-complete="off" 
					placeholder="请输入地址"	></el-input>
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
				vendorData: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					vendorCode: [
						{ required: true, message: '请输入供货商编号', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					vendorCode: '',
					vendorName: '',
					corporateRepresentative:'',
					inCharge:'',
					phoneNumber:'',
					fax:'',
					address:'',
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					vendorCode: [
						{ required:true, message: '请输入供货商编号!', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					vendorCode: '',
					vendorName: '',
					corporateRepresentative:'',
					inCharge:'',
					phoneNumber:'',
					fax:'',
					address:'',
				}

			}
		},
		methods:{
			handleCurrentChange(val) {
				this.page = val;
				this.getvendor();
			},
			getvendor(){
				console.log(this.filters.name)
				this.$http.get('/api/vendor/getAllvendor', 
					{params: {name:this.filters.name}}
       				).then((response) => {
          				this.total=response.data.length
          				this.vendorData = response.data
          				this.vendorData = this.vendorData.filter((u, index) => index < 10 * this.page && index >= 10 * (this.page - 1)) //分页
          				}, response => {
    							// error callback
	    							this.logining = false
	    							this.$notify({
						          	title: '警告',
						          	message: '网络连接错误!',
						          	type: 'warning'
						            })
  								})
          			
			},
			selsChange: function (val) {
				this.sels = val
				//console.log(this.sels)
			},
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			batchRemove: function () {
				var codes = this.sels.map(x => x.vendorCode);
				console.log(codes);
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let count = 0;
					for(let i=0;i<codes.length;i++){
						let para = { vendorcode: codes[i] };
						this.$http.post('/api/vendor/delVendor', para).then(
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
					this.getvendor()
				}).catch(() => {

				});
			},
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { vendorcode: row.vendorCode };
					this.$http.post('/api/vendor/delVendor', para).then(
						(response)=>{
							if(response.data.affectedRows){
								console.log(response.data.affectedRows)
								this.listLoading = false
								this.$notify({
									title: '成功',
									message: '删除成功',
									type: 'success'
								});
								this.getvendor()
							}
						}
					)
				}).catch(() => {

				});
			},
			
			
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					vendorCode: '',
					vendorName: '',
					corporateRepresentative:'',
					inCharge:'',
					phoneNumber:'',
					fax:'',
					address:'',
				};
				
			},
			
			
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							var add = this.addForm;
							var addlist = Object.assign({}, add);
							//console.log(addlist)
          				this.$http.post('/api/vendor/addVendor', 
						addlist).then((response) => {
          					this.addLoading = false
          					this.$notify({
									title: '成功',
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getvendor();
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
							var editlist = Object.assign({}, edit);
          				this.$http.post('/api/vendor/editVendor', 
          				editlist).then((response) => {
          					this.editLoading = false
          					this.$notify({
									title: '成功',
									message: '提交成功',
									type: 'success'
								});
								this.editFormVisible = false;
								this.getvendor();
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
		},
		mounted() {
			this.getvendor();
			
		}
	}

</script>

<style scoped>
.el-button + .el-button {
    margin-left: 0px;
}
</style>