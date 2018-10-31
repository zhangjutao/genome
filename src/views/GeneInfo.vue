<template>
    <div class="sidebar">
        <div class="detail-name">
            <p>{{geneid}}</p>
        </div>
<el-row>
  <el-col :span="6">
      <div class="grid-content bg-purple">
  <el-menu default-active="1">
                <template v-for="item in sideBar">
                    <el-menu-item :key="item.id" :index="item.id" @click="jump(item.path)">
                        <i :class="item.class"></i>
                        <span slot="title">{{item.name}}</span>
                    </el-menu-item>
                </template>
            </el-menu>
      </div>
      </el-col>
  <el-col :span="18"><div class="grid-content bg-purple-light">
      <router-view></router-view>
      
      </div>
      </el-col>
</el-row>
    </div>
</template>

<script>
export default {
    data () {
        return {
            sideBar: [{name:'Basic information',path:'base',imgsrc:'',id:'1',class:'icon iconfont icon-shuxie'},{name:'Reference sequences',path:'sequence',imgsrc:'',id:'2',class:'icon iconfont icon-shuji'},{name:'Gene structure',path:'structure',imgsrc:'',id:'3',class:'icon iconfont icon-21'},{name:'Gene annotation',path:'anno',imgsrc:'',id:'4',class:'icon iconfont icon-iconset0143'}],
            geneid: 'Glyma.01G004900'
        }
    },
    methods: {
          fetchDate() {
              if(this.$route.query.geneid){
                this.geneid = this.$route.query.geneid;
            //   }else{
            //       if(localStorage.getItem("geneid").split(",").length){
            //         this.geneId = localStorage.getItem("geneid").split(",")[0];
            //       }
              }
            },
            jump(val){                
                this.$router.replace({name: val, query: {geneid: this.geneid}});
            }
        },
    mounted() {
          // 组件创建完后获取数据，
          // 此时 data 已经被 observed 了
          this.fetchDate();
          //默认跳转基因基本信息页面
          this.$router.replace({name:'base',query: {geneid: this.geneid}})
        },
    watch: {
          // 如果路由有变化，会再次执行该方法
          "$route": "fetchDate"
        }
}
</script>

<style lang="scss" scoped>
.sidebar{
    width: 1200px;
    height: 100%;
    margin: 0 auto;
    margin-bottom: 50px;
    .el-col-6{
            padding-right: 20px;
            .el-menu{
              border-right:none;
            }
            .bg-purple{
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
                background: #fff;
                min-height: 756px;
            }
    }
.el-col-18 {
    min-height: 756px;
}
.el-row {
    width: 1200px;
}
.menubar{
       background: #fff;
       
}
.detail-name{
    height: 50px;
    line-height: 50px;
    font-size: 20px;
    background: #fff;
    padding-left: 24px;
    margin: 15px 0;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
}
}
</style>


