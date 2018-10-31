<template>
<div class="loginContent">
   <div class="bsHeader">
      <el-row type="flex" class="bsHeader_content">
      <el-col :span="3" style="position:relative;margin-left: -100px;">
        <img  class="index-logo" src="@/assets/images/logo.png" alt="" width="26" height="26">
      </el-col>
      <el-col :span="9" style="position:relative">
            <router-link target="_blank" to="/map"  class="link_logo">Soyomics</router-link>
        <span style="width: 300px;height: 16px;line-height: 16px;color:#8a8f99">Intergrating multiple soybean genomic data</span>
      </el-col>
        <!-- <el-col :span="14" style="position:relative;  text-align: right;">
            <span style="width: 300px;height: 16px;line-height: 16px;color:#8a8f99">Welcome,admin</span>&nbsp;&nbsp;
            <span style="width: 300px;height: 16px;line-height: 16px;color:#8a8f99">Logout</span>
      </el-col> -->
    </el-row>
   </div>
  <div class='loginMain'>
  <div class="loginC">
        <div class="login-h">
            <p>账号密码登录</p>
        </div>
        <div class="login-b">
            <form method="POST" name="loginForm" class="form">
                <div class="er"></div>
                <label class="user" for="u-mail">
                    <img src="@/assets/images/i-u.png" alt="" width="16" height="16">
                    <input type="text" id="u-mail" name="username" value=""  placeholder="请输入用户名" v-model="username" style="line-height:36px;" onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9@._-]/g,'')"  @keyup.enter="loginBtn">
                </label>
                <label class="pwd" for="pwd">
                    <img src="@/assets/images/i-p.png" alt="" width="16" height="16">
                    <input type="password" id="pwd" name="password" placeholder="请输入密码" v-model="password" style="line-height:36px;"  @keyup.enter="loginBtn">
                </label>
                <button type="button" href="javascript:;" class="loginbox" @click="loginBtn" >登录</button>
            </form>
        </div>
    </div>
  </div>
   </div>
</template>
<script>
export default {
    data() {
        return {
            username:"",
            password:""
        };
    },
    mounted() {
        $('.header').hide();
        this.pUrl = window.g.ApiUrl;//获取全局接口访问URL
        var WHeight=$(window).height()-129 ;
        $(".loginMain").height(WHeight)
    },
    methods: {
        loginBtn(){
            if(this.username==""){
                this.$message({
                        showClose: true,
                        message: "用户名不能为空",
                        type: "warning"
                    });
                    return false;
            }else if(this.password==""){
                this.$message({
                        showClose: true,
                        message: "密码不能为空",
                        type: "warning"
                    });
                    return false;
            }else if(this.username!=="admin"||this.password!=="123456"){
                        this.$message({
                        showClose: true,
                        message: "用户名密码不正确",
                        type: "warning"
                    });
                    return false;
            }else{
                this.$router.push({path: '/backStage'});
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.loginContent{
    .bsHeader{
        font-family: 'ArialMT';
        width: 100%;
        height: 80px;
        background: #ffffff;
        border-bottom: 1px solid #ddd;
        box-shadow: 1px 1px 5px #ddd;
        line-height: 80px;
    }
    select, input, button {
        outline: none;
    }
    .bsHeader_content{
        width: 1200px;
        margin: 0 auto;
        height: 80px;
    }
    .index-logo{
        float:right;
        margin: auto;
        flex-basis:200px;
        margin: 25px 6px 0 20px;
    }

    .link_logo{
        font-size: 24px;
        color: #5c8ce6;
        text-align: left;
        height: 40px;
        line-height: 40px;
        padding-right: 10px;
        border-right: 1px solid #eee;
    }

    .loginC {
        width: 334px;
        height: 300px;
        background: #fff;
        box-shadow: 0 0px 8px 4px rgba(0, 0, 0, 0.1);
        padding: 15px 20px;
        margin:0 auto;
        position: absolute;
        top:50%;
        left: 50%;
        margin-left: -185px;
        margin-top: -165px;
        }

        .login-h {
            text-align: center;
            padding: 20px 0 15px 0;
            font-size: 18px;
            border-bottom: 2px solid #5c8ce6;
        }
        .form {
            position: relative;
        }


    .form label {
        display:flex;
        /* width: 100%; */
        height: 38px;
        line-height: 38px;
        margin-top: 30px;
        position: relative;
    }
    .form label img {
        position: absolute;
        top: 11px;
        left: 10px;
    }
    .form label.user input {
        background-repeat: no-repeat;
        background-position: 8px center;
    }
    .form label input {
        width: 335px;
        height: 37px;
        border: 1px solid #e6e6e6;
        padding-left: 35px;
        padding-right: 22px;
        background: #fff;
    }
    .user .clear {
        position: absolute;
        top: 42px;
        right: 5px;
        z-index: 10;
    }

    .clear {
        display: none;
        width: 20px;
        text-align: center;
        color: #b9b9b9;
        float: right;
    }
    .m-unlogin {
        margin-top: 16px;
        margin-bottom: 16px;
    }

    .loginbox {
        display: block;
        clear: both;
        text-align: center;
        margin-top: 30px;
        margin-bottom: 30px;
        height: 40px;
        line-height: 40px;
        background: #5c8ce6;
        color: #fff;
        font-size: 16px;
        width: 100%;
        border: 1px solid#5c8ce6;
        cursor: pointer
    }
}
</style>
