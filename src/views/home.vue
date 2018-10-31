<template>
    <div class="home">
        <div class="contain">
            <div class="contain-pic">
                <img src="@/assets/images/contain-pic.jpg" alt="" width="1050" height="494">
            </div>
            <div class="contain-search">
                <el-input v-model.trim="searchInput" placeholder="Input gene ID/Name/Function" @keyup.enter.native="search" maxlength="100"></el-input>
                <el-button  type="primary" @click="search"><i class="el-icon-search" style="position:relative; left: -5px;"></i>{{$t("common.search")}}</el-button>
            </div>
        </div>
        <div v-show="!hasResult" class="dataBaseInfo">
            <p class="center-t"><img src="@/assets/images/info.png" alt=""><span>Introduction</span></p>
            <ul class="center-b">
                <li v-for="item in PublicationsInfo" :key="item.id" v-html="item.introduction"></li>
            </ul>
            
        </div>
        <div class="contain-result" v-show="hasResult">
            <div class="contain-result-header">
                <span>{{$t("common.SearchResult")}}</span>
                <span>{{$t("common.SearchCriteria")}}:
                    <el-tooltip class="item" effect="dark" :content="tiaojian" placement="top">
                        <b class="fifter">{{tiaojian}}</b>
                    </el-tooltip>
                     {{$t("common.tip2")}} 
                    <b>{{total}}</b> {{$t("common.tip3")}}.</span>
            </div>
            <div class="contain-result-contain" v-loading="loading" >
                <ul>
                    <li v-for="(item,index) in searchList" :key="index">
                        <el-row :gutter="24">
                        <el-col :span="1">
                        <div class="orderList">{{item.id}}.</div>
                        </el-col>
                        <el-col :span="20" style="margin-left: 10px;">
                            <p> 
                                <span  class="titleInfo" @click="dialogTable(item.geneId,item.version)">{{item.geneId}}</span>
                                <b  @click="urlJump(item.version,item.jBrowseParam)">B</b>
                            </p>
                            <p>Version : <span>{{item.version}}</span></p>
                            <p>Gene name : <span>{{item.geneName}}</span></p>
                            <p>Gene annotation : <span>{{item.description}}</span></p>
                        </el-col>
                        </el-row>
                    </li>
                </ul>
            </div>
            <div v-show="total === 0" class="noData">{{$t("common.nodata")}}</div>
            <tableFooter @getTableData="toGetTableData" :tableTotal="total" :maxJump="maxjump" v-show="total !== 0"></tableFooter>
            </div>
         <el-dialog :title="dialogTitle" 
            :visible.sync="dialogTableVisible"
            center
            height="300"
            border
            v-dialogDrag
            :before-close="handlesClose"
            v-if="isrefresh"
            @open="handlesOpen"
            >
            <GeneOntology ref="dialogMSG"></GeneOntology>
            </el-dialog>
    </div>
</template>

<script>
import GeneOntology from '@/components/geneOntology'
import tableFooter from "@/components/table_footer"; //table分页
import { Geneinfo,versionBaseinfo  } from "@/api/index"; //页面调用的事件方法


export default {
    data(){
        return{
            hasResult:false,
            searchInput:'',
            tiaojian:'xxxxx',
            searchList:[],
            dialogTableVisible: false,
            dialogTitle:"",
            isrefresh:true,
            total:0,
            loading:true,
            dialogGroup:{},
            PublicationsInfo:[],
            maxjump: 1000
        }
    },
    mounted(){
        versionBaseinfo("homeInfo")
             .then(res =>{
                this.PublicationsInfo = res;
             })
            .catch(error => {
            console.log(error);
            });
    },
    methods:{
        search(val){
            if(this.searchInput === ""){
                this.$alert(this.$t("common.tip1"), this.$t("common.tip"), {
                        confirmButtonText: this.$t("common.confirm"),
                        });
            return;
            }
            this.tiaojian = this.searchInput;
            this.loading = true;
            let data = {
                entity:{keyword:this.searchInput},
                pageNum:val.pageNum || 1,
                pageSize:val.pageSize || 10
            }
            Geneinfo(data)
             .then(res =>{
                //  let dataList =  getlist(data);
                this.searchList = res.list;
                this.total = res.total;
                 this.hasResult = true ;
                 this.loading = false;
             })
            .catch(error => {
            console.log(error);
            });
        },
        dialogTable(val,id){
            this.dialogTitle = val + this.$t("common.tip5");
             this.dialogTableVisible = true;
             this.dialogGroup ={
                 genename : val,
                 genegroup : id
             } 
        },
        handlesClose(done) {
            this.isrefresh = this.isrefresh?false:true;
                this.$refs.SideBartable;
                    done(
                        this.$nextTick(function(){//DOM变化回调函数：重新渲染dialog
                        this.isrefresh = this.isrefresh?false:true;
                })
            );
        },
        handlesOpen(){
            this.$nextTick(() => {
                this.$refs.dialogMSG.getdialogInfo(this.dialogGroup);
            })
            
        },
        toGetTableData(v){
            this.search(v);
        },
            urlJump(val,url){
                this.$router.push({name: "jbrowse", query: {version: val,otherUrl:url}})
            }
    },
    components:{
        GeneOntology,
        tableFooter
    },
}
</script>

<style>
.contain-search .el-input--medium{
    width: 680px;
}
.contain-search .el-input--medium .el-input__inner{
    border-radius: 24px 0 0 24px;
    width: 680px;
    height: 48px;
    font-family:'ArialMT';
    font-size: 14px;
    color: #b3b3b3;
     padding-left: 20px!important;
}
.contain-search .el-button--primary{
    width: 140px;
    background: #5c8ce6;
    font-size: 15px;
    font-family: "微软雅黑";
    color:#fff;
    height: 48px;
    border-radius: 0 24px 24px 0;
    margin-left: -5px;
}
</style>

<style lang="scss" scoped>
.contain{
    background: #fff;
    width: 1200px;
    margin: 0 auto;
    padding: 24px 0;
    .contain-pic{
        display: block;
        margin-left: 75px;
    }
     .contain-search{
         background: #edf2fa;
         text-align: center;
         height: 70px;
         line-height: 70px;
     }
}
.dataBaseInfo{
    background: #fff;
    width: 1200px;
    margin: 10px auto 40px;
    .center-t {
      color: #5c8ce6;
      padding: 20px 0 0 30px;
      font-size: 20px;
      img {
        margin-right: 8px;
      }
      span {
        position: relative;
        top: -5px;
        font-size: 20px;
      }
    }
    .center-b {
        padding: 14px 30px 30px;
        font-size: 16px;
        color: #808080;
      li {
        margin-bottom: 24px;
        line-height: 25px;
      }
    }
}
.contain-result{
    width: 1200px;
    margin: 0 auto;
    margin-top:10px;
    margin-bottom:10px;
    background: #fff;
    .contain-result-header{
        height: 60px;
        line-height: 60px;
        background: #e9edf5;
        span{
            display: inline-block;
            font-family: "微软雅黑";
            font-size: 14px;
            color: #000e4d;
        }
       span:nth-child(1){
            width: 160px;
            font-size: 18px;
            color: #fff;
            font-family: "ArialMT";
            text-align: center;
            background: #5c8ce6;
       } 
       span:nth-child(2){
        margin-left: 20px;
        } 
    }
    .noData{
        height: 50px;
        font-size: 15px;
        text-align: center;
    }
    .contain-result-contain{
        padding: 30px 0 0 30px;
        overflow: hidden;
        ul{
            li{
                margin-bottom: 10px;
                b{
                    display: inline-block;
                    text-align: center;
                    width: 36px;
                    height: 22px;
                    line-height: 22px;
                    background: #5c8ce6;
                    margin-left: 20px;
                    color: #fff;
                    border-radius: 5px;
                    font-weight: normal;
                    cursor: pointer;
                }
                .titleInfo{
                    color: #5c8ce6;
                    cursor: pointer;
                }
                p{
                    margin-bottom: 20px;
                }
            }
        }
        .orderList{
            margin-top: 3px;
        }
    }
}
.fifter{
    max-width: 400px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 36px;
    line-height: 36px;
    position: relative;
    top: 13px;
}
</style>
