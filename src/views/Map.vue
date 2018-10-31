<template>

    <div class="home">
        <div class="contain">
            <div class="contain-pic">
                <!-- <img src="@/assets/images/contain-pic.jpg" alt="" width="1050" height="494"> -->
                <div class='zoom-pic'>
                    <img src="@/assets/images/add.png" alt="" @click="changeZoom(0.1)">
                    <img src="@/assets/images/sub.png" alt="" @click="changeZoom(-0.1)">
                </div>
                <!-- <mapCharts :zoom='mapZoom' @changeGeoroam='georoam'></mapCharts> -->
                <mapCharts :zoom='mapZoom'></mapCharts>
            </div>
            <div class="contain-search">
                <el-input v-model.trim="searchInput" placeholder="Input gene ID or Name/Function" @keyup.enter.native="searchgene" maxlength="256" @keyup.native="inputLimit"></el-input>
                <el-button  type="primary" @click="searchgene"><i class="el-icon-search" style="position:relative; left: -5px;"></i><span class="search">{{$t("common.search")}}</span></el-button>
                <p class="example">Example:
                    <ul>
                        <li v-for="(item,index) in example" :key="index"><span @click="searchgene(item)" class="examplelink">{{item}}; </span></li>
                    </ul>
                </p>
            </div>
        </div>
        <div v-show="!hasResult" class="dataBaseInfo">
            <p class="center-t"><img src="@/assets/images/info.png" alt=""><span>About Soyomics</span></p>
            <ul class="center-b">
                <li v-for="item in PublicationsInfo" :key="item.id"><span v-html="item.introduction"></span></li>
            </ul>            
        </div>
        <div v-show="!hasResult && newList.length > 0" class="dataBaseInfo">
            <p class="center-t"><img src="@/assets/images/news.png" alt=""><span>News</span></p>
            <ul class="center-b">
                <li v-for="item in newList" :key="item.id">{{item}}</li>
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
                        <el-col :span="23">
                            <p> 
                                <span class="idnum">{{item.id}}.</span>
                                <span class="titleInfo" ><router-link tag="a" class="link-btn" target="_blank" :to="{name:'geneInfo',query:{'geneid':item.geneid}}">{{item.geneid}}</router-link></span>
                                <b title="View in BLAST" @click="urlblast(item.geneid)">B</b>
                                <b title="View in JBrowse" @click="urlJump(item.version,item.jBrowseParam)">J</b>
                            </p>
                            <div class="genecontent">
                                <p>Gene name : <span>{{item.name}}</span></p>
                                <p>Genomes :
                                    <template v-for="item1 in item.genelist">
                                        <span class="geneversion"> {{item1.version}}, </span>
                                        <span class="genename"><router-link tag="a" class="link-btn" target="_blank" :to="{name:'geneInfo',query:{'geneid':item1.genename}}">{{item1.genename}}</router-link>;</span>
                                    </template>
                                </p>
                                <p>Description : <span>{{item.description}}</span></p>
                            </div>
                        </el-col>
                        </el-row>
                    </li>
                </ul>
            </div>
            <div v-show="total === 0" class="noData">{{$t("common.nodata")}}</div>
            <tableFooter ref="pagination" @getTableData="toGetTableData" :tableTotal="total" v-show="total !== 0"></tableFooter>
        </div>
    </div>
</template>

<script>
import GeneOntology from '@/components/geneOntology'
import tableFooter from "@/components/table_footer"; //table分页
import mapCharts from '@/components/mapChartsNew' //世界地图
import { Geneinfo,versionBaseinfo,mapInfo,newInfo,blastInfo } from "@/api/index"; //页面调用的事件方法
// import {MapChart} from '@/assets/js/map'

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
            newList: [],
            example: ['Glyma.01G014900','CLE','vascular'],
            mapZoom: 1.1,
            roamZoom: 1.1,
        }
    },
    mounted(){
        window.localStorage.setItem('blastData', "");
        versionBaseinfo("homeInfo")
             .then(res =>{
                this.PublicationsInfo = res;
             })
            .catch(error => {
            console.log(error);
            });
        newInfo().then(res => {
            var tmpnews = [];
            for(var i = 0; i < res.length; i++) {
                var year = new Date(res[i].createtime).getFullYear();
                var month = new Date(res[i].createtime).getMonth() + 1;
                var day = new Date(res[i].createtime).getDay();
                tmpnews.push('(' + year + '-' + month + '-' + day + ') ' + res[i].content );
            }
            this.newList = tmpnews;
        }).catch(error => {
            console.log(error);
            });
    },
    methods:{
          fetchDate() {
            if(this.$route.query.secInput){
                this.searchInput = this.$route.query.secInput;
            }
            if(this.searchInput!==""){
                 this.searchgene(-2)
            }
        },
        searchgene(val){
            if (this.example.indexOf(val) !== -1) {
                this.tiaojian = val;
                this.searchInput = val;
            } else if (this.searchInput !== "") {
                this.tiaojian = this.searchInput;
            } else {
                this.$alert(this.$t("common.tip1"), this.$t("common.tip"), {
                        confirmButtonText: this.$t("common.confirm"),
                        });
                return;
            }
            // this.tiaojian = this.searchInput;
            this.loading = true;
            if(val===-2){
                var data = {
                        entity:{keyword:this.tiaojian},
                        pageNum:1,
                        pageSize:10
                    }
                }else{
                    var data = {
                        entity:{keyword:this.tiaojian},
                        pageNum:val.pageNum || 1,
                        pageSize:val.pageSize || 10
                    }
            }
            Geneinfo(data)
             .then(res =>{
                //  let dataList =  getlist(data);
                // this.searchList = res.maps;
                //对maps进行遍历处理
                var tmplist = [];
                for(var i = 0; i< res.maps.length; i++) {
                    var item = {};
                    item.name = res.maps[i].name;
                    item.description = res.maps[i].description;
                    item.id = res.maps[i].index;
                    item.geneid = "";
                    item.version = "";
                    item.jBrowseParam = '';
                    item.genelist = [];
                    Object.keys(res.maps[i].dataList[0]).forEach(function(key){
                        if(res.maps[i].dataList[0][key] !== ""){
                            if(item.geneid === ""){
                                item.geneid = res.maps[i].dataList[0][key];
                                item.version = key;
                                item.jBrowseParam = res.jbrowseList[item.geneid];
                            }
                        }
                        item.genelist.push({version:key,genename:res.maps[i].dataList[0][key]});
                    })
                    tmplist.push(item);
                }
                this.searchList = tmplist;

                this.total = res.total;
                this.hasResult = true ;
                this.loading = false;
                this.$nextTick(() => 
                {
                    //调用子组件的隐藏页首页脚方法
                    this.$refs.pagination.hidePage();
                })
             })
            .catch(error => {
            console.log(error);
            });
        },
        geneInfo(geneid){
            //跳转基因详情页
            var _this = this;
            this.$router.push({name: "geneInfo", query: {geneId: geneid}})
        },
        toGetTableData(v){
            this.searchgene(v);
        },
        urlJump(val,url){
            this.$router.push({name: "jbrowse", query: {version: val,otherUrl:url}})
        },
        urlblast(val){//点击blast
            blastInfo({ geneId: val }).then(res => {
            var sequence=res.sequenceObject.sequence;
            let databases=res.databaseObject;
                var blastData={
                    sequence:sequence,
                    databases:databases,
                }
                localStorage.setItem('blastData',JSON.stringify(blastData));
            });
            let routeData = this.$router.resolve({ path: '/blast', query: {uid: 1} });
            window.open(routeData.href, '_blank');
        },
        inputLimit() {
            //输入框字符限制(仅允许数字字母. _ / ，空格)
            this.searchInput=this.searchInput.replace(/[^\w\d\.,_/\s]/g,'');
        },
        //改变地图缩放等级
        changeZoom(val) {
            this.mapZoom += val;
        },
        //接收子组件滑轮的缩放参数，并对zoom属性进行相应的修改
        // georoam(roam) {
        //     if(roam <　1){
        //         this.mapZoom -= 0.1
        //     } else {
        //         this.mapZoom += 0.1
        //     }
        // }   
    },
    components:{
        GeneOntology,
        tableFooter,
        mapCharts
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
    color: #333;
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
        position: relative;
        display: block;
        margin:0 75px;
        .zoom-pic{
            position: absolute;
            top: 20px;
            right: 20px;
            z-index:10;
            img{
                width: 30px;
                height:30px;
            }
        }
    }
     .contain-search{
         font-family: 'ArialMT';
         font-size: 14px;
         color: #b3b3b3;
         margin:0 75px;
         background: #edf2fa;
         text-align: center;
         height: 90px;
         line-height: 70px;
     }
     .search{
         margin: 0;
         font-family: 'MicrosoftYahei';
         color: #fff;
     }
     .example {
        height: 25px;
        line-height: 13px;
        font-size: 13px;
        text-align: left;
        color: #999;
        margin-left: 135px;
     }
     .example ul {
         display: inline;
     }
     .example ul li {
         list-style: none;
         display: inline;
     }
     .examplelink{
        text-align: lfet;
        font-family: 'MicrosoftYahei';
        line-height: 13px;
        font-size: 13px;
        color: #5c8ce6;
        cursor: pointer;
     }
}
.dataBaseInfo{
    background: #fff;
    width: 1200px;
    margin: 10px auto 10px;
    .center-t {
      color: #5c8ce6;
      padding: 20px 0 0 30px;
      font-size: 20px;
      img {
        margin-right: 12px;
      }
      span {
        position: relative;
        top: -5px;
        font-size: 20px;
      }
    }
    .center-b {
        padding: 0px 30px 30px 30px;
        font-size: 16px;
        color: #808080;
      li {
        margin: 5px 0;
        line-height: 25px;
      }
    }
    .center-t span{
        font-family: 'ArialMT';
        font-size: 20px;
        line-height: 20px;
        color: #5c86e6;
        text-align: left;
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
                    font-family: 'ArialMT';
                    font-size: 14px;
                    display: inline-block;
                    text-align: center;
                    width: 36px;
                    height: 22px;
                    line-height: 22px;
                    background: #5c8ce6;
                    margin-left: 10px;
                    color: #fff;
                    border-radius: 5px;
                    font-weight: normal;
                    cursor: pointer;
                }
                .titleInfo{
                    margin-left: 16px;
                    color: #5c8ce6;
                    cursor: pointer;
                    .link-btn{
                        color: #5c8ce6;
                        cursor: pointer;
                    }
                }
                p{
                    margin-bottom:6px;
                }
            }
        }
        .orderList{
            display: inline-block;
            margin-top: 3px;
            float: left;
            margin-right: 4px;
            margin-left: 12px;
        }
        .genecontent {
            margin:0 20px 0 30px;
            font-size: 14px;
            line-height: 14px;
            border: 1px solid #e6e6e6;
            padding: 10px;
            background: #f7f8fa;
            p {
               margin-bottom: 14px; 
            }
            p:last-child{
                    margin-bottom: 0;
                }
            .geneversion{
                margin-left: 5px;
            }
            .genename{
                color: #5c8ce6;
                .link-btn{
                    color: #5c8ce6;
                    cursor: pointer;
                }
            }
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
