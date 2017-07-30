<template>
    <section class="chart-container">
            		<el-row :gutter="20">
            			<el-col :span="3" :offset="5">
            				<span class="label">请选择统计数量:</span>
            			</el-col>
					  <el-col :span="10" >
					  	<el-slider v-model="value"  :min="1" :max="10">
				   		 </el-slider>
					  </el-col>
					  <el-col :span="5" >
					  	<el-button type="primary" @click.native="query" >统计</el-button>
					  </el-col>
					</el-row>          	
        <el-row>
            <el-col :span="16" :offset="4">
            	
                <div id="chartColumn" style="width:100%; height:400px;"></div>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'

    export default {
        data() {
            return {
                chartColumn: null,
                value:1,
                arrName:[],
				arrQuan:[]
            
            }
        },
        methods:{
        	query(){
        		this.$http.get('/api/chart/queryChartStock',
        		{params: {maxQuantity:this.value}}
       				).then((response) => 
				{
					var arrName=[];
					var arrQuan=[];
				 for(var i=0;i<response.data.length;i++){
                    arrName.push(response.data[i].goodsName);
                    arrQuan.push(response.data[i].quantity);
                    }
				 this.arrName = arrName;
				 this.arrQuan = arrQuan;
				this.chartColumn.setOption({
	                title: { text: '库存量排行' },
		                tooltip: {},
		                xAxis: {
		                    data: arrName
		                },
		                yAxis: {},
		                series: [{
		                    name: '数量',
		                    type: 'bar',
		                    data: arrQuan
		                }]
		            });
		            
		        	this.chartColumn.hideLoading();
				})

            
              
        	}
        },
        mounted: function () {
           
            //基于准备好的dom，初始化echarts实例
            this.chartColumn = echarts.init(document.getElementById('chartColumn'));
           this.chartColumn.showLoading();
            

          }
        

    }

</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/
    .label{
    	font-size: 14px;
	    color: #8492a6;
	    line-height: 36px;
    }
    .el-col {
        padding: 30px 20px;
    }
</style>