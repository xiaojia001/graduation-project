<template>
	<el-tabs v-model="activeName" type="border-card" @tab-click="setting">
	    <el-tab-pane  name="first">
	    	<span slot="label"><i class="fa fa-pencil-square-o"></i>密码修改</span>
	    	<el-steps space="40%" :active="active" finish-status="success"
	    		:align-center="true" :center="true" class="steps">
				<el-step title="请输入原密码">
					<span slot="icon"><i class="fa fa-unlock"></i> </span>
				</el-step>
				<el-step title="请输入新密码">
					<span slot="icon"><i class="fa fa-pencil"></i> </span>
				</el-step>
				<el-step title="密码修改成功">
					<span slot="icon"><i class="fa fa-check"></i> </span>
				</el-step>
			</el-steps>	
			<el-row >
			  <el-col :span="12" :offset="6">
			  	<div class="inputs">
				  	<el-input type="password" v-model="oldpwd" v-show="showold" auto-complete="off" placeholder="旧密码">
				      	<template slot="append"><i class="fa fa-lock"></i></template>
				      </el-input>
				      <el-input type="password" v-model="newpwd" v-show="shownew" auto-complete="off" placeholder="新密码">
				      	<template slot="append"><i class="fa fa-lock"></i></template>
				      </el-input>
				      <el-input type="password" v-model="newcheck" v-show="shownew" auto-complete="off" placeholder="确认新密码">
				      	<template slot="append"><i class="fa fa-lock"></i></template>
				      </el-input>
					<el-button v-show="!showok" style="margin-top: 12px;"  @click="next" :loading="loading">下一步</el-button>
			  	</div>
			  </el-col>
			</el-row>
			
	    </el-tab-pane>
	    <el-tab-pane name="second" >
	    	<span slot="label"><i class="fa fa-tasks"></i>配置管理</span>
	    	<div style="width: 100%;height: 400px;">
	    		<el-col :span="12" :offset="5">
	    			<el-input v-model="keywords"></el-input>
	    		</el-col>
	    		 <el-button @click="getsong" style="margin-bottom: 6px;">查找歌曲</el-button>
	    		 <el-col :span="12" :offset="7">
	    		<audio id="player" :src="songsrc" v-if="showpl" controls="controls" @timeupdate="seek" ref="player"></audio>
	    		</el-col>
	    		<el-col :span="12" :offset="9">
				<pre>{{currentlrc +" "}}</pre>
				</el-col>
				<el-col :span="12" :offset="5">
	    		<div style=" margin-top: 5px; height: 300px;overflow-y:scroll;">
	    		<pre>{{lrc}}</pre>
	    		
	    		</div>
	    		</el-col>
	    	</div>
	    </el-tab-pane>
	</el-tabs>
</template>
<script>
	
	var unescapeHTML = function(lrc) {　　
		var t = document.createElement("div");　　
		t.innerHTML = lrc;
		return t.innerHTML;
	};
	function parseLyric(lrc) {
    var lyrics = lrc.split("\n");
    var lrcObj = {};
    for(var i=0;i<lyrics.length;i++){
        var lyric = lyrics[i];
        var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
        var timeRegExpArr = lyric.match(timeReg);
        if(!timeRegExpArr)continue;
        var clause = lyric.replace(timeReg,'');
        for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
            var t = timeRegExpArr[k];
            var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                sec = Number(String(t.match(/\:\d*\.\d/i)).slice(1));
            var time = min * 60 + sec;
            lrcObj[time] = clause;
        }
    }
    return lrcObj;
	}
export default {
	data() {
		return {
			active: 0,
			activeName:'first',
        showold:true,
        shownew:false,
        showok:false,
        username:JSON.parse(localStorage.getItem('user')).username,
		oldpwd:'',
		newpwd:'',
		newcheck:'',
		loading:false,
		lrc:'加载歌词中。。。',
		showpl:false,
		songsrc:'',
		timearr:[],
		lastlrctime:0,
		nextlrcindex:1,
		songid:0,
		currentlrc:'歌词加载中...',
		keywords:''
      };
    },

    methods: {
      next() {
      	 switch (this.active){
      	 	case 0:
      	 	if(true){
      	 		this.$http.post('/api/login/userLogin', {
          					userName: this.username,
          					passWord:this.oldpwd
          			}).then((response) => {
          				console.log(response.data.code)
          					if (response.data.code!==200) {
          						this.$notify({
                  				title: '错误',
                  				message: '原密码错误',
                 				type: 'error'
                		})
          					} else{
								this.active=1;
				      	 		this.showold=false;
				      	 		this.shownew=true;
				      	 		
          					}
          				}, response => {
	    							this.$notify({
						          	title: '警告',
						          	message: '无法连接服务器,请稍后再试!',
						          	type: 'warning'
						            })
  								})
          			break;
      	 	}
      	 		
      	 	case 1:
      	 		if (this.newpwd==this.newcheck&&this.newpwd!='') {
      	 			this.active=2;
      	 			this.next();
      	 			break;	
      	 		} else{
      	 			this.$message({
			          message: '两次输入不一致!',
			          type: 'warning'
			        });
			        this.newpwd='';
			        this.newcheck='';
			        break;
      	 		}
      	 	case 2:
      	 		this.$http.post('/api/login/editPwd', {
          					username: this.username,
          					newpassword:this.newpwd
          		}).then((response) => {
          				setTimeout(()=>{
          					this.active=3;
          		     		this.next();
          				},2000)
          				}, response => {
	    							this.$notify({
						          	title: '警告',
						          	message: '无法连接服务器,请稍后再试!',
						          	type: 'warning'
						            })
  								})
          			break;
      	 	case 3: 	 	
	        	this.shownew=false;
	        	this.showok=true;
	        	setTimeout(()=>{
	        		this.$message({
			          message: '密码修改成功,请重新登录!',
			          type: 'success'
			        });
			        localStorage.removeItem('user');
			        this.$router.push({ path: '/login' })
	        	},3000)
      	 		break;
      	 }
      },
      setting(){
      	if(this.activeName=='second'){
//    			this.$message({
//			          message: '您无权进行此项操作!',
//			          type: 'warning'
//			        });
//			    setTimeout(()=>{
//			    	this.activeName='first'
//			    },1000)
		
		
      	}
      
     },
     getsong(){
     	this.currentlrc="";
     	var keywords = this.keywords;
     	this.$http.get(
			`http://route.showapi.com/213-1?showapi_appid=41911&showapi_sign=a1c59e895a3e47bb80f8f71af6ee594b&keyword=${keywords}&page=1&`
		).then((response)=>{
			this.showpl=true;
			this.songsrc=response.data.showapi_res_body.pagebean.contentlist[1].m4a;
			this.songid= response.data.showapi_res_body.pagebean.contentlist[1].songid;
			this.getlrc();
		});
     },
     getlrc(){
     	var songid=this.songid;
     	this.$http.get(
			`http://route.showapi.com/213-2?showapi_appid=41911&showapi_sign=a1c59e895a3e47bb80f8f71af6ee594b&musicid=${songid}&`
		).then((response)=>{
			this.lrc=unescapeHTML(response.data.showapi_res_body.lyric);
			//console.log(parseLyric(this.lrc));
			var parselrc = parseLyric(this.lrc);
//			for(var p in parseLyric(this.lrc))
//			{
//				this.timearr.push(p);
//			}
			this.timearr=Object.keys(parselrc);
			function sortNumber(a,b)
			{
				return a - b
			}		
			this.timearr=this.timearr.sort(sortNumber);
			console.log(this.lrc.split('[')
              .slice(5)
              .map(str => {
                let t = str.split(']')
                //var obj={}
                //obj[t[0]]=t[1]
                //return obj
                return {[t[0]]: t[1]}
              })
              .reduce((a, b) => {
                return {...a, ...b}
              }))
		});
     },
     seek(){
     	var crtime=this.$refs.player.currentTime;
     	//console.log(crtime);
     	for(let i=this.nextlrcindex;i<this.timearr.length;i++){
     		//console.log(crtime);
     		if(crtime>=this.lastlrctime&&crtime<this.timearr[i]){
     			this.currentlrc = parseLyric(this.lrc)[this.timearr[i-1]];
     			this.lastlrctime = this.timearr[i];
     			this.nextlrcindex++;
     			break;
     		}else if(crtime>=this.timearr[i]){
     			this.currentlrc = parseLyric(this.lrc)[this.timearr[i]];
     		}
     	}
     	/*if(this.$refs.player.currentTime>5){
     		//alert("111");
     	}*/
     }
   },
   mounted(){
   	
   }
  }
</script>


<style>
	.steps{
		margin-top: 30px;
	}
	.inputs{
		margin-top: 20px;
		margin-bottom: 200px;
	}
</style>