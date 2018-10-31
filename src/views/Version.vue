<template>
    <div class="version"  style="min-height:782px">
        <el-row class="top" type="flex" justify="space-between">
            <el-col :span="8" class="top-l">
                {{fullName}}
            </el-col>
            <el-col :span="8" class="top-r">
                <el-button type="primary" @click="urlJump('blast')">BLAST</el-button>
                <el-button type="primary" @click="urlJump('primerDesign')">Primer design</el-button>
                <el-button type="primary" @click="jbrowseJump(versionName,otherUrl)">JBrowse</el-button>
            </el-col>
        </el-row>
        <div class="contain">
            <div class="contain-pic">
                <!-- <img src="@/assets/images/contain-pic.jpg" alt="" width="1050" height="494"> -->
                <img :src="imgsrc[versionName]" alt="" width="1050" height="494">
            </div>
            <div class="contain-search" ref="searchbtn">
                <el-input v-model.trim="searchInput" placeholder="Input gene ID or Name/Function" @keyup.enter.native="search" maxlength="100" @keyup.native="inputLimit" @focus="deleterr" class="errortip"></el-input>
                <el-button  type="primary" @click="search"><i class="el-icon-search" style="position:relative; left: -5px;"></i>{{$t("common.search")}}</el-button>
                <p class="example" v-show="this.searchtip.length > 0">{{searchtip}}</p>
            </div>
        </div>
        <div class="descri">
            <div class="center" v-show="!hasResult">
                <p class="center-t"><img src="@/assets/images/Introduction.png" alt=""><span>Cultivar Introduction</span></p>
                <span v-show="!introduction" v-text="this.$t('common.nodata')" class="nodata"></span>
                <p class="center-b" v-html="introduction"></p>
            </div>
            <div class="center" v-show="!hasResult">
                <p class="center-t"><img src="@/assets/images/genomedata.png" alt=""><span>Genome data</span></p>
                <span v-show="!genomeData" v-text="this.$t('common.nodata')" class="nodata"></span>
                <p class="center-b" v-html="genomeData"></p>
            </div>
            <div class="center" v-show="!hasResult">
                <span v-show="!publications" v-text="this.$t('common.nodata')" class="nodata"></span>
                <p class="center-b" v-html="publications" style="border-width:0;"></p>
            </div>
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
                        <!-- <div class="orderList">{{item.id}}.</div> -->
                        <el-col :span="23">
                            <p> 
                                <span class="idnum">{{item.id}}.</span>
                                <span class="titleInfo" ><router-link tag="a" class="link-btn" target="_blank" :to="{name:'geneInfo',query:{'geneid':item.geneid}}">{{item.geneid}}</router-link></span>
                                <b title="View in BLAST" @click="urlblast(item.geneid)">B</b>
                                <b title="View in JBrowse" @click="jbrowseJump(item.version,item.jBrowseParam)">J</b>
                            </p>
                            <div class="genecontent">
                                <p>Gene name : <span>{{item.name}}</span></p>
                                <p>Genomes :
                                    <template v-for="item1 in item.genelist" >
                                        <span class="geneversion">{{item1.version}}, </span>
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
import tableFooter from "@/components/table_footer"; //table分页
import { Geneinfo, versionBaseinfo,blastInfo  } from "@/api/index"; //页面调用的事件方法
export default {
    data(){
        return{
            versionName : "",
            fullName: "",
            otherUrl: '',
            versionData :[],
            introduction:'',
            genomeData:'',
            publications:'',
            hasResult:false,
            searchInput:'',
            tiaojian:'xxxxx',
            searchList:[],
            total:0,
            loading:true,
            imgsrc: {
                'WM82_v2.0':require('@/assets/images/WM82.jpg'),
                'SN14_v1.0':require('@/assets/images/SN14.jpg'),
                'ZH13_v1.0':require('@/assets/images/ZH13.jpg')
            },
            versionnick: [],
            nickName: '',
            searchtip : ''
        }
    },
    mounted(){
        window.localStorage.setItem('blastData', "");
    },
    methods: {
        search(val){
            //判断是否为空
            if(this.searchInput === ""){
                this.$alert(this.$t("common.tip1"), this.$t("common.tip"), {
                    confirmButtonText: this.$t("common.confirm"),
                });
                return;
            }
            //判断是否为其他基因组
            this.versionnick = JSON.parse(localStorage.getItem('versionnick'));
            //获取正确的基因前缀
            for(var j = 0; j < this.versionnick.length; j++){
                if(this.versionnick[j].versionName === this.versionName) {
                    this.nickName = this.versionnick[j].nickName;
                }
            }
            for(var i = 0; i < this.versionnick.length; i++) {
                if(this.versionnick[i].versionName !== this.versionName) {
                    if (this.searchInput.indexOf(this.versionnick[i].nickName) !== -1) {
                        //this.$refs.searchbtn.getElementsByClassName('el-input__inner')[0].style.borderColor = 'red';
                        $(".contain-search>div>input").addClass('errortip');
                        //this.$alert(this.$t("Please input the correct gene id. example:  " + this.nickName + "xxxxxx"), this.$t("common.tip"), {confirmButtonText: this.$t("common.confirm"),});
                        this.searchtip = 'Please input the corresponding version gene info. (e.g.,' + this.nickName + 'xxxxxx)';
                        return;
                    }
                }
            }

            this.tiaojian = this.searchInput;
            this.loading = true;
            let data = {
                entity:{keyword:this.searchInput,version:this.versionName},
                pageNum:val.pageNum || 1,
                pageSize:val.pageSize || 10
            }
            Geneinfo(data)
                .then(res =>{
                    //  let dataList =  getlist(data);
                    //对maps进行遍历处理
                    var tmplist = [];
                    for(var i = 0; i< res.maps.length; i++) {
                        var item = {};
                        item.name = res.maps[i].name;
                        item.description = res.maps[i].description;
                        item.id = res.maps[i].index;
                        item.geneid = "";
                        item.version = "";
                        item.jBrowseParam = "";
                        item.genelist = [];
                        var _this = this;
                        Object.keys(res.maps[i].dataList[0]).forEach(function(key){
                            //  if(res.maps[i].dataList[0][key] !== ""){
                            //      if(item.geneid === ""){
                            //          item.geneid = res.maps[i].dataList[0][key];
                            //      }
                            //  }
                            if (key === _this.versionName) {
                                item.geneid = res.maps[i].dataList[0][key];
                                item.version = key;
                                item.jBrowseParam = res.jbrowseList[item.geneid];
                            }
                            item.genelist.push({version:key,genename:res.maps[i].dataList[0][key]});
                        })
                        tmplist.push(item);
                    }
                    this.searchList = tmplist;
                    this.total = res.total;
                    this.hasResult = true ;
                    this.loading = false;
                    this.$nextTick(() => {
                        this.$refs.pagination.hidePage();
                    })
                })
                .catch(error => {
                    console.log(error);
                });
            },
            fetchDate() {
                if(this.$route.query.versionName){
                this.versionName = this.$route.query.versionName;
                var tmpnick = JSON.parse(localStorage.getItem("versionnick"));
                for (var i = 0; i < tmpnick.length; i++) {
                    if (tmpnick[i].versionName === this.versionName) {
                        this.fullName = tmpnick[i].fullName;
                    }
                }
                this.otherUrl = '&tracks=DNA,' + this.versionName + ',GCContent,GCContentXY,repeat dna,repeat line,repeat ltrc,repeat ltrg,repeat ltro,repeat sine,repeat tr&highlight=';
                }else{
                    if(JSON.parse(localStorage.getItem("version").split(",").length)){
                    this.versionName = JSON.parse(localStorage.getItem("version")).split(",")[0];
                    }
                }
                //重置数据及搜索条件
                this.searchList = [];
                this.hasResult = false;
                this.searchInput = '';
                //重置错位提示
                $(".contain-search>div>input").removeClass('errortip');
                this.searchtip = '';

                versionBaseinfo(this.versionName)
                .then(res =>{
                    this.introduction = res[0].introduction;
                    this.genomeData = res[0].genomeData;
                    this.publications = res[0].publications;
                }).catch(error => {
                    console.log(error);
                });
            },
            urlJump(val){
                this.$router.push({name: val});
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
            jbrowseJump(val,url){
                this.$router.push({name: "jbrowse", query: {version: val,otherUrl:url}})
            },
            toGetTableData(v){
                this.search(v);
            },
            inputLimit() {
            //输入框字符限制(仅允许数字字母. _ / ，空格)
            this.searchInput=this.searchInput.replace(/[^\w\d\.,_/\s]/g,'');
            },
            getnick() {
                //如果localStorage内没有则重新获取
                if (!localStorage.getItem('versionnick')) {
                    versionBaseinfo();
                } else {
                    this.versionnick = localStorage.getItem('versionnick');
                }
            },
            deleterr() {
                $(".contain-search>div>input").removeClass('errortip');
                this.searchtip = '';
            }
        },
    mounted() {
        // 组件创建完后获取数据，
        // 此时 data 已经被 observed 了
        this.fetchDate();
        this.getnick();
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        "$route": "fetchDate"
    },
    components: {
        tableFooter
    }
}
</script>
<style>
.top .el-button--medium{
    padding: 0!important;
    text-align: center;
    width: 110px;
    height: 34px;
    line-height: 34px;
}
.center .center-b i{
    font-size: 16px;
    font-family: Times New Roman;
}
.center .center-b span{
    display: block;
    font-weight: bold;
}
.contain-search .el-input--medium{
    width: 680px;
}
.contain-search .el-input--medium .el-input__inner{
        border-radius: 24px 0 0 24px;
    width: 680px;
    height: 48px;
    font-family: 'ArialMT';
    font-size: 14px;
    color: #333;
    padding-left: 20px!important;
}
.contain-search .el-button--primary{
    width: 140px;
    background: #5c8ce6;
    font-size: 15px;
    font-family: "\5FAE\8F6F\96C5\9ED1";
    color: #fff;
    height: 48px;
    border-radius: 0 24px 24px 0;
    margin-left: -5px;
}
.contain-search .el-input--medium .errortip {
    border-color: red;
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
         position: relative;
         background: #edf2fa;
         text-align: center;
         height: 80px;
         line-height: 70px;
         margin: 0 75px;
         .example{
             position: absolute;
             left: 140px;
             top: 35px;
             color: red;
         }
     }
}

.version{
    width: 1200px;
    margin: 0 auto;
    // background: #fff;
    font-family: ArialMT;
    font-size: 14px;
    color: #808080;
    border: 1px solid #e0e0e0;
    margin-bottom: 30px;
    .top{
        background: #fff;
        // border-bottom: 1px solid #e0e0e0;
        height:74px;
        line-height: 74px;
        .top-l{
        margin-left: 30px;
        font-size: 24px;
        color: #5c8ce6;
        }
        .top-r{
            text-align: right;
            margin-right: 30px;
        }
    }
    .descri{
        margin-top: 10px;
        background: #fff;
        .center{
            .center-t{
                color: #5c8ce6;
                margin: 0 0 0 30px;
                padding-top: 20px;
                img{
                    margin-right: 8px;
                }
                span{
                        position: relative;
                        top: -5px;
                    font-size: 20px;
                }
            }
            .center-b{
                    line-height: 31px;
                    margin: 14px 30px 0 30px;
                    padding-bottom: 50px;
                    border-bottom: 1px solid #e0e0e0;
            }
            .nodata{
                text-align: center;
                display: block;
                margin-top: 30px;
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
}
</style>

