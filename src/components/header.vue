<template>
    <div class="header">
    <el-row type="flex" class="header-content">
      <el-col :span="3" style="position:relative;margin-left: -100px;">
        <img  class="index-logo" src="@/assets/images/logo.png" alt="" width="26" height="26">
      </el-col>
      <el-col :span="9" style="position:relative">
        <router-link :to="{name:'map'}" class="link_logo">Soyomics</router-link>
        <!-- <a href="javascript:;" @click="jumpHome" class="link_logo">Soyomics</a> -->
        <span style="width: 300px;height: 16px;line-height: 16px;color:#8a8f99">Intergrating multiple soybean genomics</span>
      </el-col>
      <el-col :span="14">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-submenu index="1">
            <template slot="title">Genome</template>
            <el-menu-item v-for="(item,key) in versionList" :key="key" index= "1-key" ><a  @click="urlJump(item.versionName)">{{item.fullName}}</a></el-menu-item>
          </el-submenu>
          <el-menu-item index="2"><router-link :to="{name: 'jbrowse', query: {version: JBrowseDefulte}}">JBrowse</router-link></el-menu-item>
          <el-menu-item index="3"><router-link :to= "{name: 'blast'}">BLAST</router-link></el-menu-item>
          <el-menu-item index="4"><router-link :to= "{name:'primerDesign'}">Primer design</router-link></el-menu-item>
          <el-menu-item index="5"><router-link :to= "{name: 'download'}">Download</router-link></el-menu-item>
          <el-menu-item index="6"><router-link :to= "{name:'Acknowledgement'}">Acknowledgement</router-link></el-menu-item>
        </el-menu>
      </el-col>
      <!-- <el-col :span="3" style="width:110px">
        <el-select v-model="value" placeholder="language" @change="switchLanguage"  class="choose-language">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>
      </el-col> -->
    </el-row>
    </div>
</template>

<script>
import { versionBaseinfo  } from "@/api/index"; //页面调用的事件方法
export default {
  data() {
    return {
      options: [
        {
          value: "zh",
          label: "中文"
        },
        {
          value: "en",
          label: "English"
        }
      ],
      versionList:[],
      activeIndex: '1',
      dateType:'',
      value: "",
      honeUrl:'/',
      isActive: true,
      JBrowseDefulte:'',
    };
  },
  mounted(){
    versionBaseinfo()
      .then(res =>{
      this.versionList = res;
      this.JBrowseDefulte = this.versionList[0].versionName;

      })
      .catch(error => {
      console.log(error);
      });
  },
  methods: {
    handleSelect(key, keyPath) {
        // console.log(key, keyPath);
      },
    switchLanguage(lang) {
      this.$i18n.locale = lang;
      // this.$store.dispatch("setLanguage", lang);
      let body = document.getElementsByTagName("body")[0];
      switch(lang){
        case "en":
        body.classList.remove("zh");
        body.classList.add("en");
         break;
         case "zh":
         body.classList.remove("en");
         body.classList.add("zh");
         break;
         default: ;
      };
      this.$message({
        message: this.$t('common.msg1'),
        showClose: true,
        duration:2000,
        type: "success"
      });
    },
    urlJump(val){
      this.$router.push({name: 'version', query: {versionName: val}})
      // this.$router.go(0);
    },
    jumpHome(){
      this.$router.push({name:'map'});
      this.$router.go(0); 
    }
  }
};
</script>

<style lang="scss" scoped>
  // 头部样式
.header{
    font-family:'ArialMT';
    width: 100%;
    height: 80px;
    line-height: 80px;
    border-bottom: 1px solid #ddd;
    box-shadow: 1px 1px 5px #ddd;
    background: #fff;
    .header-content{
        width: 1200px;
        margin: 0 auto;
        height: 80px;
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
        .header-nav{
            flex:auto;
            li{
              font-family: ArialIMT;
              font-size: 14px;
              line-height: 14px;
              text-align:left;
              color: #525966;
            }
        }
    }
}
</style>


