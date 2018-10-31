<template>
<div>
  <div class="download">
    <div class="detail">
        <div class="download_table">
          <el-table :data="tableData" border stripe>
            <el-table-column label="Version" :resizable='false'>
                <template slot-scope="scope">
                    <span>{{scope.row.fullName}}</span>
                    <i style="font-style: normal;position: relative;top: -7px;right: -5px;">{{scope.row.publicationsId}}</i>
                </template>
            </el-table-column>
            <el-table-column label="Genome" :resizable='false'>
                <template slot-scope="scope">
                    <a :href='scope.row.genome'  target="_blank">FASTA</a>
                </template>
            </el-table-column>
            <el-table-column label="GFF" :resizable='false'>
                <template slot-scope="scope">
                    <a :href='scope.row.gff'  target="_blank">GFF</a>
                </template>
            </el-table-column>
            <el-table-column label="CDS" :resizable='false'>
                <template slot-scope="scope">
                    <a :href='scope.row.cds'  target="_blank">FASTA</a>
                </template>
            </el-table-column>
            <el-table-column label="Protein" :resizable='false'>
                <template slot-scope="scope">
                    <a :href='scope.row.protein' target="_blank">FASTA</a>
                </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tableInfo">
            <p class="center-t"><img src="@/assets/images/Publications.png" alt=""><span>Reference</span></p>
            <ul class="center-b">
                <li v-for="item in tableData" :key="item.id" v-html="item.publications"></li>
            </ul>
        </div>
        <div class="tableInfo">
            <p class="center-t"><img src="@/assets/images/GeneticMap.png" alt=""><span>Corresponding Gene ID of Different Genomics</span></p>
            <ul class="center-b" style="border-bottom:none;">
                <li style="margin-bottom: 0px;;">
                  This file include the data mapping relationships:
                  <div class="downloadimg">
                    <img src="@/assets/images/Download.png" alt="" @click="downloadBtn">
                  </div>
                </li>
            </ul>

          <div class="download-search-con">
            <div class="download-search-main">
              <div class="download-search">
                  <el-input v-model.trim="secInput" placeholder="Input gene ID or Name/Function" @keyup.enter.native="search" @keyup.native="secInputLimit" maxlength="100"></el-input>
                  <el-button  type="primary" @click="searchBtn"><i class="el-icon-search" style="position:relative; left: -5px;"></i>Search</el-button>
              </div>
             </div>
          </div>
        </div>
    </div>
  </div>
  <div class="sequdown">
    <div class="tableInfo">
          <p class="center-t"><img src="@/assets/images/Sequences.png" alt=""><span>Sequence Download</span></p>
    </div>
    <div class="searchdatail">
      <div class="genesearch">
        <div class="searchbtn">
          <el-button class="gene"  type="primary" @click="changeshow('gene')"><span class="search">Search By Gene</span><span class="arrow-right" v-show="selecttype==='gene'"></span></el-button>           
        </div>
        <div class="down-search" v-show="selecttype==='gene'">
          <el-input v-model.trim="searchInput" placeholder="Input gene ID or Name/Function"  @keyup.enter.native="searchgeneregion"  @keyup.native="inputLimit" maxlength="256" ></el-input>
          <el-button  type="primary" @click="searchgeneregion" style="margin-right:20px;"><i class="el-icon-search" style="position:relative; left: -5px;"></i><span class="search">{{$t("common.search")}}</span></el-button>
          <!-- <p class="example">示例:<span @click="searchgene(example)" class="examplelink">
              {{example}}</span></p> -->
        </div>
        <div class="searchbtn">
          <el-button  class="region" type="primary" @click="changeshow('region')"><span class="search">Search By Region</span><span class="arrow-right" v-show="selecttype==='region'"></span></el-button>          
        </div>
        <div class="region-search" v-show="selecttype==='region'">
          <div class="selectchr">
            <el-select v-model="version" :placeholder="holdversion">
              <el-option
                v-for="(item,index) in versionlist"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-select v-model="chr" :placeholder="holdchr" style="margin-left: 39px;">
              <el-option
                v-for="(item,index) in chrlist"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="chrregion">
            <el-input v-model.trim="start" type="number" placeholder="0" @keyup.enter.native="searchgeneregion" maxlength="256"></el-input>
            <span class="s-line"></span>
            <el-input v-model.trim="end" type="number" :placeholder="chrlength" @keyup.enter.native="searchgeneregion" maxlength="256"></el-input>
            <el-button class="regionbtn" @click="searchgeneregion"><span>search</span></el-button>
          </div>       
        </div>
        <div class="uploadfile">
        <div>
            <el-button  type="primary" class="upload" :disabled="isUpDisabled"  @click="handleUpload">select txt file</el-button>
            <input id="excel-upload-input" type="file" class="c-hide" @change="handkeFileChange" style="display:none">
        </div>
          <span><img src="@/assets/images/Upload.png" alt=""></span>
          <span class="uptext">One queryID per Line</span>
        </div>  

      </div>
      <div class="genecontent">
        <ul class="geneTableHread"><li style="width:300px">ID</li><li style="width:300px">Name</li><li style="width:400px">Description</li></ul>
        <div class="contentarea" v-loading="loading" >
          <ul>
            <li v-for="(item,index) in genelist"  :key="index">
              <span style="width:300px">{{item.geneId}}</span>
              <span style="width:300px">{{item.geneName}}</span>
              <span style="width:400px">{{item.description}}</span>
              <span style="width:100px; text-align: center;"><img src="@/assets/images/close.png" alt="" @click="deletegene(index)"></span>
              </li>
          </ul>
          <div v-show="genelist.length===0" style="padding:10px">No Data</div>
        </div>  
      </div>
      <div class="genecondition">
        <div class="content">
          <span>Setting download condition:</span>
          <!-- <img src="@/assets/images/checkbox.png" style="margin-left:24px"> -->
          <span >Upstream</span><el-input v-model.trim="upstreamSequence" type="number" placeholder="<=10000" @keyup.enter.native="search" ></el-input><span>bp</span>&nbsp;&nbsp;&nbsp;
          <!-- <img src="@/assets/images/checkbox.png" style="margin-left:50px"> -->
          <span >Downstream</span><el-input v-model.trim="dowmstreamSequence" type="number" placeholder="<=10000" @keyup.enter.native="search"></el-input><span>bp</span>
        </div>
      </div>
      <div class="genedown">
        <el-button class="downbtn" :disabled="isdisabled" @click="downBtn">Download Sequence</el-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { versionDownloadInfo,geneDownloadInfo,chrList,downBtnData} from "@/api/index"; //页面调用的事件方法
export default {
  data() {
    return {
      tableData: [],
      selecttype: 'gene',
      genelist: [],
      searchInput:'',
      secInput:'',
      upstream:'',
      dowmstream:'',
      upstreamSequence:'',
      dowmstreamSequence:'',
      holdversion: '',
      version: '',
      versionchr: {},
      chrlengthlist: {},
      versionlist: [],
      fullNameMap: [],
      holdchr:'',
      chr:'',
      chrlist:[],
      chrlength: '',
      start:'0',
      end:'',
      loading:false,
      isdisabled:false,
      isUpDisabled:false,
      // SequenceD:"Download Sequence",
      pUrl:""
    };
  },
  mounted() {
    versionDownloadInfo()
      .then(res => {
        this.tableData = res.list;
      })
      .catch(error => {
        console.log(error);
      });
      var _this = this;
    chrList().then((res) => {
      var tmpversionchr = {};
      var tmpchrlengthlist = {};
      var tmpversionlist = [];
      var tmpfullNameMap = {};

      for(var i = 0; i < res.length; i++) {
        tmpversionchr[res[i].fullName] = [];
        tmpchrlengthlist[res[i].fullName] = {};
        //tmpversionlist.push(res[i].version);
        tmpversionlist.push(res[i].fullName);
        tmpfullNameMap[res[i].fullName] = res[i].version;
        for(var j = 0; j < res[i].chrList.length; j++) {
          tmpversionchr[res[i].fullName].push(res[i].chrList[j].chr);
          tmpchrlengthlist[res[i].fullName][res[i].chrList[j].chr] = res[i].chrList[j].length;
        }
      }
      _this.versionchr = tmpversionchr;
      _this.chrlengthlist = tmpchrlengthlist;
      _this.versionlist = tmpversionlist;
      _this.fullNameMap = tmpfullNameMap;
      
      //默认第一个版本
      _this.holdversion = _this.versionlist[0];
      _this.version = _this.versionlist[0];
      //默认第一个版本的染色体列表 
      _this.chrlist = _this.versionchr[_this.holdversion];

      //默认第一条染色体
      _this.holdchr = _this.versionchr[_this.holdversion][0];

      // 默认长度
      _this.chrlength = _this.chrlengthlist[_this.holdversion][_this.holdchr];
    }).catch(error => {
        console.log(error);
    });

    this.pUrl = window.g.ApiUrl;//获取全局接口访问URL
    this.ImgUrl=window.g.ImgUrl;//获取全局图片URL
    this.MapUrl=window.g.MapUrl;//遗传图谱文件下载URL
  },
  methods: {
    inputLimit() {
        //输入框字符限制(仅允许数字字母. _ / ，空格)
        this.searchInput=this.searchInput.replace(/[^\w\d\.,_/\s]/g,'');
    }, 
    secInputLimit(){
      //输入框字符限制(仅允许数字字母. _ / ，空格)
        this.secInput=this.secInput.replace(/[^\w\d\.,_/\s]/g,'');
    },
//
searchBtn(){
  if(this.secInput === ""){
    this.$message({
          showClose: true,
          message: "The input box can not be empty!",
          type: "warning"
        });
      return false;
  }

  this.secInput = this.secInput;
  let routeData = this.$router.resolve({ path: '/map', query: {  secInput: this.secInput }});
   window.open(routeData.href, '_blank');

},

    //基因图谱点击下载
    downloadBtn(){
      window.location.href=this.MapUrl+'/download/genome/compare.zip'// 在当前页面打开序列下载
    },
    //txt文件上传
  handleUpload() {
      document.getElementById('excel-upload-input').click();
    },
    handkeFileChange(e){
    
    var files = e.target.files;//获取到文件列表
    if(e.target.files[0].type!=="text/plain"){
        this.$message({
          showClose: true,
          message: "Upload files can only be TXT format!",
          type: "warning"
        });
      return false;
    }else if(e.target.files[0].size / 1024>500){
         this.$message({
          showClose: true,
          message: "Upload file size should not exceed 500KB!",
          type: "warning"
        });
      return false;
    }else{
      this.isUpDisabled=true;//上传中 禁止再次点击下载
      var that=this;
      var reader = new FileReader();//新建一个FileReader
      reader.readAsText(files[0], "UTF-8");//读取文件 
      reader.onload = function(evt){ //读取完文件之后会回来这里
        var fileString = evt.target.result; // 读取文件内容
        var reg = /.*[\u4e00-\u9fa5].*/;
          if (reg.test(fileString)) {
            that.$message({
              showClose: true,
              message: "Contains illegal characters!",
              type: "warning"
            });
            that.isUpDisabled=false;//上传成功 取消禁止点击
            return false;
          }else{
            var txtDate=fileString.split(/[(\r\n)\r\n]+/);
            // 数据处理
            var dataParamArr = [];
              for(var i=0; i<txtDate.length;i++){
                var dataParam = {};
                dataParam.geneId = txtDate[i];
                dataParam.geneName = "";
                dataParam.description = "";
                dataParamArr.push(dataParam)
              }
            that.genelist=dataParamArr;
            that.isUpDisabled=false;//上传成功 取消禁止点击
          }
      }
    }
    },
    changeshow (val) {
      this.selecttype = val;
    },
    searchgeneregion(val){
      if(this.selecttype === "gene") {
            if(this.searchInput===""){
              this.$message({
                 showClose: true,
                  message: "Genes can not be empty！",
                  type: "warning"
                });
                return false;
          }else{
            this.loading = true;
            let data = {
                    entity:{
                      keyword: this.searchInput,
                      version: this.fullNameMap[this.version],
                      upstream: this.upstream,
                      dowmstream: this.dowmstream
                    },
                    pageNum:val.pageNum || 1,
                    pageSize:2000
                };
                geneDownloadInfo(data)
                .then(res => {
                  this.genelist = res;
                  this.loading = false;      
                })
          }
      } else {
        var start=Number(this.start);
        var end=Number(this.end);
       if(start>end){
              this.$message({
                showClose: true,
                  message: "The beginning can not be greater than the end!",
                  type: "warning"
              });
              return false;
            }else if(start>this.chrlength &&end>this.chrlength){//判断起始终止不能超过最大值
              this.$message({
                showClose: true,
                  message: "Cannot exceed maximum!",
                  type: "warning"
              });
              return false;
            }else{
              this.loading = true;
                let data = {
                    entity:{
                        version: this.fullNameMap[this.version],
                        chromosome: this.chr,
                        startPos: start,
                        endPos: end,
                        upstream: this.upstream,
                        dowmstream: this.dowmstream
                    },
                      pageNum:val.pageNum || 1,
                      pageSize:2000
                      }
                  geneDownloadInfo(data)
                  .then(res => {
                    this.genelist = res;   
                    this.loading = false;               
                  })
            }
      }
    },
    deletegene(index) {
      this.genelist.splice(index,1);
      // for(var i = 0; i < this.genelist.length; i++) {
      //   if (this.genelist[i].id === val) {
      //     this.genelist.splice(i,1);
      //   }
      // }
    },
    //下载序列接口
    downBtn(){
      var starts=Number(this.upstreamSequence);
      var ends=Number(this.dowmstreamSequence);
       if(this.genelist.length===0){
          this.$message({
            showClose: true,
              type: "warning",
              message: " Sequence is empty!"
          });
          return false;
        }else if(starts>ends){
            this.$message({
              showClose: true,
                  message: "The beginning can not be greater than the end!",
                  type: "warning"
              });
              return false;
        }else if(starts>10000 || ends>10000){
            this.$message({
              showClose: true,
                  message: "Input value should be less than 10000!",
                  type: "warning"
              });
              return false;
        }else{
          this.$confirm("Confirm download sequence?", "Tips", {
                confirmButtonText: "confirm",
                cancelButtonText: "cancel",
                type: '',
            })
          .then(() => {
            //  this.SequenceD="Downloading..."
             this.isdisabled=true;//下载中 禁止再次点击下载
             let genelistArr=[];
             for(var i=0;i<this.genelist.length;i++){
               genelistArr.push(this.genelist[i].geneId)
             }
              downBtnData({"geneIdList":genelistArr,"upstream":starts,"downstream":ends})
              .then(res => {
                    window.location.href=res// 在当前页面打开序列下载
                    // this.SequenceD="Download Sequence";
                    this.isdisabled=false;
              })
              .catch(error => {
                  console.log(error);
              });
          })
          .catch(() => {
              this.$message({
                showClose: true,
                  type: "info",
                  message: "Cancelled Download"
              });
          });
      }
    }
  },
  watch:{
    version(val, oldVal){
      this.chrlist = [];
      this.holdchr = this.versionchr[val][0];
      this.chr = this.versionchr[val][0];
      this.chrlist = this.versionchr[val];
      this.chrlength = this.chrlengthlist[val][this.holdchr];
    },
    chr(val, oldval) {
      this.chrlength = this.chrlengthlist[this.version][val];
    }
  }
};
</script>
<style>
.download .el-table,
.download .el-table th {
  text-align: center;
  color: #595959;
  font-size: 14px;
  font-weight: normal;
}
.download .el-table th {
  color: #262626;
  font-size: 16px;
  background: #f5f8ff;
}
.download .el-table--medium th,
.download .el-table--medium td {
  padding: 8px 0;
}
.download .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #f5f8ff;
}
.download .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #f5f8ff;
}
.down-search .el-input--medium{
  width: 376px; 
}
.down-search .el-input--medium .el-input__inner{
  border-radius: 24px 0 0 24px;
  width: 376px;          
  height: 48px;
  font-family: ArialMT;
  font-size: 14px;
  color: #333;
  padding-left: 20px!important;
}
.down-search .el-button--primary {
    width: 140px;
    background: #5c8ce6;
    font-size: 15px;
    font-family: \\5FAE\8F6F\96C5\9ED1;
    color: #fff;
    height: 48px;
    border-radius: 0 24px 24px 0;
    margin-left: -5px;
}
.region-search .el-input--medium{
  width: 200px; 
}
.region-search .el-input--medium .el-input__inner{
  display: inline;
  width: 200px;
}
.genecondition .el-input--medium{
  width: 180px; 
}
.genecondition .el-input--medium .el-input__inner{
  display: inline;
  width: 170px;
  margin:0 6px;
  color: #333
}

.download .el-input__inner{
    border-radius: 4px 0 0 4px;
  }

 .download .el-button--medium {
    border-radius:0 4px 4px 0;
}
 .download .el-button--medium:hover {
    background: #66b1ff;
    border-color: #66b1ff;
    color: #fff;
}

.download .el-input__inner {
    height: 40px;
    line-height: 40px;
    color: #333
}

 .download .download-search-con{
   padding: 0px 30px 0px 30px;
 }

 .download .el-button--primary{
    background-color: #5c8ce6;
    border-color: #5c8ce6;
 }

</style>

<style lang="scss" scoped>
.download .download-search{
  width: 440px;
  display:flex;
  padding: 14px 0px 14px 0px;
}
.download .download-search-main{
 border-top: 1px solid #e0e0e0;
}
.download {
  width: 1200px;
  margin: 0 auto 10px;
  background: #fff;
  font-family: ArialMT;
  .download_table {
    padding: 24px 30px;
    a{
        color: #5c8ce6;
    }
  }
  .tableInfo {
    .center-t {
      color: #5c8ce6;
      padding: 24px 0 0 30px;
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
      padding: 14px 30px 10px 30px;
      border-bottom: 1px solid #e0e0e0;
      li {
        margin-bottom: 14px;
        word-spacing :3px; 
      }
      .downloadimg{
        display:inline-block;
        width: 24px;
        height: 24px;
        background: #5c8ce6;
        margin-left: 6px;
        border-radius: 3px;
        img {
          padding: 4px;
          vertical-align: middle;
          cursor: pointer;
        }
      }
    }
  }
}
.sequdown{
  margin: 10px auto 30px;
  width: 1200px;
  background: #fff;
  font-family: ArialMT;
  padding-bottom: 10px;
  .tableInfo {
    .center-t {
      color: #5c8ce6;
      padding: 24px 0 0 30px;
      img {
        margin-right: 8px;
      }
      span {
        position: relative;
        top: -5px;
        font-size: 20px;
      }
    }
  }
  .searchdatail{
    width: 1140px;
    // height: 400px;
    margin:10px auto;
    border:1px solid #dddddd;
    .genesearch{
      position: relative;
      height: 92px;
      padding:14px 20px;
      .searchbtn button{
        width: 150px;
        height: 40px;
      }
      .searchbtn button.gene{
        margin-bottom: 10px;
        background: #6cdbd9;
        border-color: #6cdbd9;
        position: relative;
        .arrow-right {
          position: absolute;
          top: 9px;
          right: -11px;
          font-size: 0;
          line-height: 0;
          border-width: 10px;
          border-color: #6cdbd9;
          border-right-width: 0;
          border-style: dashed;
          border-left-style: solid;
          border-top-color: transparent;
          border-bottom-color: transparent;
        }
      }
      .searchbtn button.region{
        background: #a2a2f0;
        border-color: #a2a2f0;
        position: relative;
        .arrow-right {
          position: absolute;
          top: 9px;
          right: -11px;
          font-size: 0;
          line-height: 0;
          border-width: 10px;
          border-color: #a2a2f0;
          border-right-width: 0;
          border-style: dashed;
          border-left-style: solid;
          border-top-color: transparent;
          border-bottom-color: transparent;
        }
      }
      .down-search{
        margin-right: 30px;
        position:absolute;
        top: 36px;
        left: 194px;
        border-right: 1px solid #dedede;
      }
      .region-search{
        padding-right: 20px;
        position:absolute;
        top: 15px;
        left: 194px;
        border-right: 1px solid #dedede;
        .selectchr{
          margin-bottom:10px;
        }
        .chrregion{
          display:inline;
          .s-line{
            width: 15px;
            display: inline-block;
            margin: 0 10px;
            height: 1px;
            background: #e6e6e6;
            margin-top: 25px;
          }
          .regionbtn{
            margin-left: 10px;
            width: 80px;
            font-size: 14px;
            color: #fff;
            background: #5c8ce6;
          }
        }
      }
      .uploadfile{
        position: absolute;
        top: 41.5px;
        right: 20px;
        display: flex;
        line-height: 37px;
        .upload{
          width: 155px;
          height: 37px;
          font-size: 14px;
          color:#fff;
          background: #5c8ce6;
        }
        img{
          margin-left: 8px;
          vertical-align: middle;
          width: 16px;
          height: 16px;
        }
        .uptext{
          width: 150px;
          top: 14px;
          margin-left: 4px;
          font-size: 14px;
          color: #808080;
        }
      }
    }
    .genecontent{
      position: relative;
      padding:12px 0;
      margin:0 20px;      
      .geneTableHread{
        width: 100%;
        overflow: hidden;
        border: 1px solid #dedede;
        border-bottom:none;
        background: #f5f8ff;
          li{
            float: left;
            text-align: center;
            font-size:16px;
            padding: 10px 0;
          
          }
      }
      .contentarea{
        width: 100%;
        height: 120px;
        border: 1px solid #dedede;
        overflow-y: scroll;
        background: #fff;
        ul li{
          margin: 5px 16px;
          display: flex;
          span{
            font-size:14px;
            line-height: 16px;
            color: #333333;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-indent:10px;
          }
          img{
            margin-left:10px;
            vertical-align: middle;
            cursor: pointer;
          }
        }
      }
    }
    .genecondition{
      // height: 50px;
      // display: inline;
      .content{
        margin:0 20px;
        padding: 10px 0 20px 0;
        border-bottom:1px solid #eee;
        img{
          vertical-align: sub;
        }
      }
    }
    .genedown{
     padding: 12px 20px;
     text-align: right;
      .downbtn{
        // position: absolute;
        // top: 10px;
        // right: 20px;
        margin-left: 10px;
        width: 175px;
        height: 40px;
        font-size: 14px;
        color: #fff;
        background: #5c8ce6;
      }
    }
  }
}
</style>
