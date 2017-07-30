<template>
  <el-form :model="loginForm" :rules="rules2" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h2 class="title">欢迎登录超市管理系统</h2>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginForm.account" auto-complete="on" placeholder="账号">
      	<template slot="append"><i class="fa fa-user-o"></i></template>
      </el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="loginForm.checkPass" auto-complete="off" placeholder="密码">
      	<template slot="append"><i class="fa fa-lock"></i></template>
      </el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked  class="remember">记住密码</el-checkbox>
    <el-button type="primary" size="mini" class="fr" icon="delete"  @click.native.prevent="deleteAll">清除密码</el-button>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="Submit" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  
 export default {
    data() {
      return {
        logining: false,
        loginForm: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
          },
          checked: true,
          };
          },
     created(){
      this.load()
      },
          methods: {
          	Submit() {
          		this.$refs.loginForm.validate((valid) => {
          			if(valid) {
          				this.logining = true
          				var username = this.loginForm.account
          				var checkPass = this.loginForm.checkPass
          				this.$http.post('/api/login/userLogin', {
          					userName: username,
          					passWord:checkPass
          				}).then((response) => {
          					this.logining = false
          					//console.log(response.data.code)
          					if (response.data.code!==200) {
          						this.$notify({
                  		title: '登录失败',
                  		message: response.data.msg,
                 			type: 'error'
                		})
          						this.loginForm.account=''
          						this.loginForm.checkPass=''
          					} else{
          						if(this.checked==true){
          							var remember = {
          							username:this.loginForm.account,
          							checkPass:this.loginForm.checkPass
          							}
          							
          							localStorage.setItem('remember', JSON.stringify(remember))
          						}
          						console.log(this.checked);
            					localStorage.setItem('user', JSON.stringify(response.body))
                  		this.$router.push({ path: '/goods' })
          					}
          				}, response => {
    							// error callback
	    							this.logining = false
	    							this.$notify({
				          	title: '警告',
				          	message: '无法连接服务器,请稍后再试!',
				          	type: 'warning'
				            })
  								})
          			}else {
           				this.$notify({
			          	title: '警告',
			          	message: '请检查用户名密码填写!',
			          	type: 'warning'
			            })
            			return false
          						}
          		})
          	},
          	deleteAll(){
          		localStorage.removeItem('remember')
          		this.load()
          	},
          	load(){
	          	let remember = JSON.parse(localStorage.getItem('remember'))
	          	this.loginForm.account = remember?remember.username:''
	          	this.loginForm.checkPass = remember?remember.checkPass:''
          	}
          }
         
        }</script>

<style lang="less"  scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    background-color: #F9FAFC;
    margin: 160px auto;
    border: 2px solid #8492A6;
    width: 350px;
    padding: 35px 35px 15px 35px;
    transition:0.6s; 
    &:hover{
    	box-shadow: 0px 0px 50px 20px #505458;
    }
  }
  .fr{float: right;}
  .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 25px 0px;
    }
</style>