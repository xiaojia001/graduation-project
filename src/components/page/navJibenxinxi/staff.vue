<template>
	<section>
		<el-table :data="staffData" highlight-current-row v-loading="listLoading"  border style="width: 100%;">
			<el-table-column type="index" width="100" align="center">
			</el-table-column>	
			<el-table-column prop="name" label="姓名" width="320" align="center" sortable>
			</el-table-column>
			<el-table-column prop="age" label="年龄" width="310" align="center" sortable>
			</el-table-column>
			<el-table-column prop="avatar" label="头像" v-show:"show"  width="310" align="center" sortable>
			</el-table-column>
			<el-table-column label="头像" min-width="150" align="center">
				<template scope="scope">
					<img :src="'static/'+ scope.row.avatar" />
				</template>
			</el-table-column>
		</el-table>
		<el-col :span="24" class="toolbar" style="padding: 5px;border:1px solid #dfe6ec;margin-top: 2px;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		
		
	</section>
</template>

<script>
export default {
	data() {
		return {
			staffData:[],
			listLoading: false,
			total: 0,
			page: 1,
			show:false
		}
	},
	methods:{
		getstaff(){
			this.$http.get('/api/user/queryStaff').then((response) => 
			{
				this.total=response.data.length
          		this.staffData = response.data
          		this.staffData = this.staffData.filter((u, index) => index < 10 * this.page && index >= 10 * (this.page - 1)) //分页		
			})
		},
		handleCurrentChange(val) {
				this.page = val;
				this.getstaff();
		},
	},
	mounted() {
			this.getstaff();		
		}
}
</script>

<style>
	img {
			width: 40px;
			height: 40px;
			border-radius: 5px;
			margin: 10px 0px 10px 10px;
		}
</style>