<template>
  <div class="jbrowse">
      <div class="banner">
        <iframe :src="JBrowseUrl+'/index.html?data=data/json/' + version + otherUrl" name="jbrowse"></iframe>
      </div>
  </div>
</template>

<script>
import { versionBaseinfo  } from "@/api/index"; //页面调用的事件方法

export default {
    name: 'JBrowse',
    data () {
        return {
            JBrowseUrl: window.g.JBrowseUrl,
            version: "",
            otherUrl : "&loc=Chr01:1..1090351&tracks=DNA,WM82_v2.0,GCContent,GCContentXY,repeat dna,repeat line,repeat ltrc,repeat ltrg,repeat ltro,repeat sine,repeat tr&highlight=",
        }
    },
    methods: {
        fetchDate() {
            if(this.$route.query.version){
                this.version = this.$route.query.version;
            }
            if(this.$route.query.otherUrl){
                let otherUrl = this.$route.query.otherUrl;
                this.otherUrl = otherUrl;
            }
                versionBaseinfo()
                    .then(res =>{
                    this.options = res;
                    })
                    .catch(error => {
                    console.log(error);
                    });
        },
        handleCommand(command) {
            this.version = command;
      }
    },
    created() {
          // 组件创建完后获取数据，
          // 此时 data 已经被 observed 了
          this.fetchDate();
    },
    watch: {
          // 如果路由有变化，会再次执行该方法
          "$route": "fetchDate"
    },
//     computed:{
//         url_replace: function () {
//             if(this.otherUrl === ""){
//                 return "";
//             }else{
//                 return this.otherUrl.replace(/\s/g,"%2F");
//             }
//   }
//     }
}
</script>

<style lang="scss" scoped>
.el-checkbox-group{
    width:66px;
    margin: 10px 20px;
}
.el-checkbox{
    margin-left:0;
}
.jbrowse{
    width: 1200px;
    min-height: 778px;
    margin: 0 auto;
    .banner {
        -webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
        background-color: #fff;
        margin-bottom: 30px;
        position: relative;
        iframe {
        margin: 20px 0;
        width: 1200px;
        height: 750px;
        border: none;
        }
    }

}
</style>

