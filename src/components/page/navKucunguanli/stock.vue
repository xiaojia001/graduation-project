<template>
	<section>
		<el-table :data="stockData" highlight-current-row v-loading="listLoading"  border style="width: 100%;">
			<el-table-column type="index" width="100" align="center">
			</el-table-column>	
			<el-table-column prop="goodsCode" label="商品编号" width="320" align="center" sortable>
			</el-table-column>
			<el-table-column prop="goodsName" label="商品名称" width="310" align="center" sortable>
			</el-table-column>
			<el-table-column prop="quantity" label="总数量" min-width="100" align="center" sortable>
				<template scope="scope" >
					<span v-if="scope.row.quantity < 50" class="outofstock">
						{{scope.row.quantity+'（缺货）'}}
					</span>
					<span v-else >
						{{scope.row.quantity}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="库存详情" width="150" align="center">
				<template scope="scope">
					<el-button size="small" @click="Detail(scope.$index, scope.row)">查看</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-col :span="24" class="toolbar" style="padding: 5px;border:1px solid #dfe6ec;margin-top: 2px;">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		
		<el-dialog title="商品库存详情" v-model="dialogTableVisible" >
		  <el-table :data="detailData" border>
		    <el-table-column property="depotName" label="库房" width="300" align="center">
		    </el-table-column>
		    <el-table-column property="quantity" label="数量" min-width="300" align="center">
		    </el-table-column>
		    <!--<el-table-column property="buyingPrice" label="进价" align="center">		    	
		    </el-table-column>-->
		  </el-table>
		</el-dialog>
		
	</section>
</template>

<script>
export default {
	data() {
		return {
			detailData:[],
			stockData:[],
			listLoading: false,
			total: 0,
			page: 1,
			dialogTableVisible:false
		}
	},
	methods:{
		getallstock(){
			this.$http.get('/api/stock/getAllStock').then((response) => 
			{
				this.total=response.data.length
          		this.stockData = response.data
          		this.stockData = this.stockData.filter((u, index) => index < 10 * this.page && index >= 10 * (this.page - 1)) //分页		
			})
		},
		handleCurrentChange(val) {
				this.page = val;
				this.getallstock();
		},
		Detail:function(index, row){
			this.dialogTableVisible=true;
			this.$http.get('/api/stock/getDetailStock', 
					{params: {goodsCode:row.goodsCode}}
       				).then((response) => 
			{
				this.detailData = response.data
			})
		}
	},
	mounted() {
			this.getallstock();		
		}
}
</script>

<style scoped>
	.outofstock{
		color: red;
	}
</style>