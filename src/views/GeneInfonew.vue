<template>
    <div class="sidebar">
        <div class="detail-name">
            <p>{{geneid}}</p>
        </div>
        <div class="basecontent">
            <el-tabs tabPosition="left" style="height: 100%;">
                <el-tab-pane label="base"><template>
                    <div class="explains">
                        <div class="explain-list" id="basic">
                                <div class="explain-h">
                                    <p>Basic information</p>
                                </div>
                                <div class="explain-b">
                                    <template v-for="(item,index) in baseList">
                                        <el-row type="flex" :key="index" height="50" justify="center">
                                            <el-col :span="8"><div class="itemtitle">{{Object.keys(item)[0]}}</div></el-col>
                                            <el-col :span="16"><div class="itemcontent">{{Object.values(item)[0]}}</div></el-col>
                                        </el-row>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane label="配置管理">配置管理</el-tab-pane>
                <el-tab-pane label="角色管理">角色管理</el-tab-pane>
                <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
            </el-tabs>
        </div>
        
    </div>
</template>

<script>
import {geneBaseInfo} from "@/api/index"; //页面调用的事件方法
export default {
    data () {
        return {
            geneid: '',
            baseList: []
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
              //base页面请求参数
              geneBaseInfo({geneId:this.geneid})
                .then(res =>{
                    var tmpbaseList = [];
                    Object.keys(res).forEach(function(key){
                        if(key !== 'geneOtherInfo') {
                            tmpbaseList.push(
                                {['GeneId(' + key + ')']:key}
                            )
                        }
                    });
                    tmpbaseList.push({'Gene name':res.geneOtherInfo.geneName});
                    tmpbaseList.push({'Gene type':res.geneOtherInfo.geneType});
                    tmpbaseList.push({'Locus':res.geneOtherInfo.locus});
                    tmpbaseList.push({'Lenght':res.geneOtherInfo.length});
                    tmpbaseList.push({'Species':res.geneOtherInfo.species});
                    tmpbaseList.push({'description':res.geneOtherInfo.description});
                    this.baseList = tmpbaseList;
                })
                .catch(error => {
                    console.log(error);
                });
            },
        },
        mounted() {
          // 组件创建完后获取数据，
          // 此时 data 已经被 observed 了
          this.fetchDate();
        },
        watch: {
          // 如果路由有变化，会再次执行该方法
          "$route": "fetchDate"
        }
}
</script>
<style>
.basecontent .el-tabs__header{
    width: 200px;
}
</style>
<style lang="scss" scoped>
.sidebar{
    width: 1200px;
    min-height: 500px;
    margin: 0 auto;
    margin-bottom: 50px
}
.detail-name{
    height: 70px;
    line-height: 70px;
    font-size: 20px;
    background: #fff;
    padding-left: 24px;
    margin: 15px 0;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
}
.basecontent{
    min-height: 500px;
}
.explain-list{
    min-height: 671px;
    background: #fff;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
}
.explain-h{
    font-size: 16px;
    height: 54px;
    line-height: 50px;
    padding-left: 30px;
    background: #f5f8ff;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
}
.explain-b {
    padding: 28px 28px 28px 28px;
    overflow: auto;
}
.el-col>div{
    border: 1px solid #e6e6e6;
    text-align:center;
    height: 100%;
    width: 100%;
    line-height: 50px;
}
.el-row--flex{
    height: 50px;
}
.itemtitle{
    background: #f5f8ff;
}
.itemcontent{
    background: #fff;
}
</style>


