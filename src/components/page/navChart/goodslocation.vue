<template>
    <section class="chart-container">
            		<!--<el-row :gutter="20">
					  <el-col :span="5" >
					  	<el-button type="primary" @click.native="query" >统计</el-button>
					  </el-col>
					</el-row>          	-->
        <el-row>
            <el-col :span="16" :offset="4">
            	
                <div id="chartPie" style="width:100%; height:400px;"></div>
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
                arrName:[]
            
            }
        },
        methods:{
        	query(){
        		this.$http.get('/api/chart/queryLocationQuantity',
        		).then((response) => 
				{
					var arrName=[];					
				 for(var i=0;i<response.data.length;i++){
                    arrName.push(response.data[i].name);
                    }
				 this.arrName = arrName;
				 //console.log(arrName)
				this.chartPie.setOption({
                title: {
                    text: '货架商品种类数量分布',
                    subtext: '饼状图',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: arrName
                },
                series: [
                    {
                        name: '数量',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data:response.data,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            });
		            
		        	this.chartPie.hideLoading();
				})

            
              
        	}
        },
        mounted: function () {
           
            //基于准备好的dom，初始化echarts实例
           this.chartPie = echarts.init(document.getElementById('chartPie'));
           this.chartPie.showLoading();
           this.query();

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