<template>
<div class="backStageContent">
   <div class="bsHeader">
      <el-row type="flex" class="bsHeader_content">
      <el-col :span="3" style="position:relative;margin-left: -100px;">
        <img  class="index-logo" src="@/assets/images/logo.png" alt="" width="26" height="26">
      </el-col>
      <el-col :span="9" style="position:relative">
        <router-link target="_blank" to="/map"  class="link_logo">Soyomics</router-link>
        <span style="width: 300px;height: 16px;line-height: 16px;color:#8a8f99">Intergrating multiple soybean genomic data</span>
      </el-col>
        <el-col :span="14" style="position:relative;  text-align: right;">
            <span style="width: 300px;height: 16px;line-height: 16px;color:#8a8f99">Welcome,admin</span>&nbsp;&nbsp;
            <span style="width: 300px;height: 16px;line-height: 16px;color:#8a8f99"><router-link to="/login" style="color:#8a8f99">Logout</router-link></span>
      </el-col>
    </el-row>
   </div>
  <div class='backStageMain'>
        <div class='schoolList'>学校列表<el-button type="primary" size="large" @click="SdialogVisible">新增</el-button></div>
    <div class='schoolMain'  v-loading="schoolLoading">
      <!-- 添加学校信息 -->
      <el-dialog title="添加学校信息" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <div class='schoolDiv'>
          <el-col :span="4">
            <div class="grid-content bg-purple">学校名字</div>
          </el-col>
          <el-col :span="20">
            <div class="grid-content bg-purple-light">
              <el-input v-model.trim="schoolNameInput" placeholder="请输入学校名字" maxlength="258" ></el-input>
            </div>
          </el-col>
        </div>
        <div class='schoolDiv'>
          <el-col :span="4">
            <div class="grid-content bg-purple">学校图片</div>
          </el-col>
          <el-col :span="20">
            <div class="grid-content bg-purple-light">
              <el-upload class="avatar-uploader" :action="pUrl+'/uploadImage'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" ref="upload">
                <div class="tishi el-icon-plus">
                  <p v-text="upText"></p>
                </div>
                <img :src="upMain" class="avatar">
                <div slot="tip" class="el-upload__tip">仅支持png、jpg图片文件，建议尺寸为200*200像素，文件小于1M</div>
              </el-upload>
            </div>
          </el-col>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addSchoolConfirm(schoolNameInput,schoolImgUrl)">确 定</el-button>
        </span>
      </el-dialog>
      <!-- table列表 -->
      <el-table :data="StableData" border class="StableTable">
        <el-table-column prop="name" label="学校名字" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zip" label="图片" width="200" align="center">
          <template slot-scope="scope">
            <span class="imgSpan"><img :src="ImgUrl+'/images/genome'+scope.row.image" class="imgStyle"></span>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="160" align="center">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.$index===0" @click="SmoveUp(scope.$index,scope.row.id,scope.row.orderby)">
              <i class="el-icon-arrow-up"></i>
            </el-button>
            <el-button size="mini" :disabled="scope.$index===(StableData.length-1)" @click="SmoveDown(scope.$index,scope.row.id,scope.row.orderby)">
              <i class="el-icon-arrow-down"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="large" @click="dialogEdit(scope.row,scope.$index,scope.row.image)">编辑</el-button>
            <el-button type="text" size="large" @click="schoolDelete(scope.row.id,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑学校信息 -->
      <el-dialog :data="StableData" title="编辑学校信息" :visible.sync="dialogEditVisible" width="30%">
        <div class='schoolDiv'>
          <el-col :span="4">
            <div class="grid-content bg-purple">学校名字</div>
          </el-col>
          <el-col :span="20">
            <div class="grid-content bg-purple-light">
              <el-input v-model.trim="schoolInput" placeholder="请输入学校名字"> </el-input>
            </div>
          </el-col>
        </div>
        <div class='schoolDiv'>
          <el-col :span="4">
            <div class="grid-content bg-purple">学校图片</div>
          </el-col>
          <el-col :span="20">
            <div class="grid-content bg-purple-light">
              <el-upload class="avatar-uploader" :action="pUrl+'/uploadImage'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <div class="tishis tishiBjs el-icon-plus">
                  <p v-text="upText"></p>
                </div>
                <img :src="upMain" class="avatar">
                <div slot="tip" class="el-upload__tip">仅支持png、jpg图片文件，建议尺寸为200*200像素，文件小于1M</div>
              </el-upload>
            </div>
          </el-col>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取 消</el-button>
          <el-button type="primary" :dataId="schoolEnitId" @click="schoolEnitConfirm(schoolEnitId,schoolInput,schoolImgUrl)">确 定</el-button>
        </span>
      </el-dialog>
      <div class='publishReview'>
        <el-button type="primary" @click="releaseBut(releaseArr)">发布</el-button>
        <el-button type="primary"  v-show="StableData.length!==0" @click="preview">预览</el-button>
      </div>
    </div>

    <!-- 其他列表 -->
      <div class='schoolList'>其他列表
        <el-button type="primary" size="large" @click="dialogOtherAddVisible = true">新增</el-button>
      </div>
    <div class='schoolMain otherMain' v-loading="otherLoading">
      <!-- 添加其他信息 -->
      <el-dialog title="添加其他信息" :visible.sync="dialogOtherAddVisible" :before-close="handleCloseQ" width="30%">
        <div class='schoolDiv'>
          <el-col :span="3">
            <div class="grid-content bg-purple">名字</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content bg-purple-light">
              <el-input type="textarea" v-model="introduct" :rows="4" placeholder="请输入名字"></el-input>
            </div>
          </el-col>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCloseQ">取 消</el-button>
          <el-button type="primary" @click="addOtherConfirm(introduct)">确 定</el-button>
        </span>
      </el-dialog>

      <!-- table列表 -->
      <el-table :data="otherListData" border class="otherTable">
        <el-table-column prop="name" label="名字" align="left">
          <template slot-scope="scope">
            <span class="otherCont"  :title="scope.row.content" >{{scope.row.content}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="160" align="center">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.$index===0" @click="moveUp(scope.$index,scope.row.id,scope.row.orderby)">
              <i class="el-icon-arrow-up"></i>
            </el-button>
            <el-button size="mini" :disabled="scope.$index===(otherListData.length-1)" @click="moveDown(scope.$index,scope.row.id,scope.row.orderby)">
              <i class="el-icon-arrow-down"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" >
          <template slot-scope="scope">
            <el-button type="text" size="large" @click="dialogOtherEdit(scope.row,scope.$index)">编辑</el-button>
            <el-button type="text" size="large" @click="otherDelete(scope.row.id,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑其他列表 -->
      <el-dialog :data="otherListData" title="其他列表" :visible.sync="dialogOtherVisible" width="30%">
        <div class='schoolDiv'>
          <el-col :span="3">
            <div class="grid-content bg-purple">名字</div>
          </el-col>
          <el-col :span="21">
            <div class="grid-content bg-purple-light">
              <el-input type="textarea" :rows="4" placeholder="请输入名字" v-model="otherInput"></el-input>
            </div>
          </el-col>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogOtherVisible = false">取 消</el-button>
          <el-button type="primary" :dataId="enitId" @click="otherEnitConfirm(enitId,otherInput)">确 定</el-button>
        </span>
      </el-dialog>
      <div class='publishReview'>
        <el-button type="primary" @click="releaseButQ(releaseArrQ)">发布</el-button>
        <el-button type="primary"  v-show="otherListData.length!==0" @click="preview">预览</el-button>
      </div>
    </div>
  </div>
   </div>
</template>
<script>
import {
    update,
    otherAdd,
    oDelete,
    otherDate,
    SchoolAdd,
    schoolEnitDate,
    sDelete,
    SotherDate,
    releaseData,
    releaseDataQ
} from "@/api/index"; //页面调用的事件方法-

export default {
    data() {
        return {
            upMain:"",//上传图片替换
            pUrl: "",
             ImgUrl:"",  //图片上传地址
            input: "",
            dialogVisible: false,
            dialogEditVisible: false,
            dialogOtherAddVisible: false,
            dialogOtherVisible: false,
            enitId: "",
            schoolInput: "",
            otherListData: [],
            otherInput: "",
            update: [], //编辑其他
            otherAdd: [], //添加其他
            oDelete: [], //删除其他
            introduct: "",
            StableData: [], //学校列表data
            schoolNameInput: "",
            schoolEnitId: "",
            //文件上传的参数
            dialogImageUrl: "",
            dialogVisible: false,
            schoolImg: "",
            schoolImgUrl: "",
            orderbyQ: "", //其他排序号
            SorderbyQ: "", //学校排序号
            releaseArr: [], //学校发布ID
            releaseArrQ: [], //其他发布ID
            upText:"",// 点击修改图片文字
            schoolLoading:false,
            otherLoading:false
        };
    },
    mounted() {
        $('.header').hide();
        this.pUrl = window.g.ApiUrl;//获取全局接口访问URL
        this.ImgUrl=window.g.MapUrl;//获取全局图片URL
        this.schoolList(this.pUrl);//学校列表获取初始化
        this.otherList(this.pUrl);//其他列表获取初始化
    },
    methods: {
        preview(){
            let routeData = this.$router.resolve({ path: '/preview' });
            window.open(routeData.href, '_blank');
        },
        // 学校发布
        releaseBut(releaseArr) {
            if(this.StableData.length===0){
                this.$message({
                    showClose: true,
                    type: "success",
                    message: " 内容为空!"
                });
                return false;
            }else if (releaseArr.length === 0) {
                this.$message({
                    showClose: true,
                    type: "success",
                    message: " 已是最新发布!"
                });
                return false;
            }
            this.$confirm("确定发布吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(() => {
                releaseData({ ids: releaseArr })
                .then(res => {
                    this.$message({
                        showClose: true,
                        type: "success",
                        message: "发布成功!"
                    });
                    this.schoolList(this.pUrl); //重新刷新页面
                })
                .catch(error => {
                    console.log(error);
                });
            })
            .catch(() => {
                this.$message({
                    showClose: true,
                    type: "info",
                    message: "已取消发布"
                });
            });
        },

        // 其他发布
        releaseButQ(releaseArrQ) {
            if(this.otherListData.length===0){
                this.$message({
                    showClose: true,
                    type: "success",
                    message: " 内容为空!"
                });
                return false;
            }else if (releaseArrQ.length === 0) {
                this.$message({
                    showClose: true,
                    type: "success",
                    message: " 已是最新发布!"
                });
                return false;
            }

            this.$confirm("确定发布吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: ""
            })
            .then(() => {
                releaseDataQ({ ids: releaseArrQ })
                .then(res => {
                this.$message({
                    showClose: true,
                    type: "success",
                    message: "发布成功!"
                });
                this.otherList(this.pUrl); //重新刷新页面
                })
                .catch(error => {
                    console.log(error);
                });
                          
            })
            .catch(() => {
                this.$message({
                    showClose: true,
                    type: "info",
                    message: "已取消发布"
                });
            });
         
        },
        // 学校列表数据获取
        schoolList(url) {
            this.schoolLoading=true;
            var that = this;
            this.$http
                .post(url + "/school/list", {
                    emulateJSON: true
                })
                .then(function(res) {
                    that.StableData = res.data;
                    var arr = [];
                    res.data.map(function(val, indedx) {
                        if (val.status != 1) {
                            arr.push(val.id);
                        }
                        that.releaseArr = arr;
                    });
                    that.schoolLoading=false;
                });
        },
        // 其他列表数据获取
        otherList(url) {
            this.otherLoading=true;
            var that = this;
            this.$http
                .post(url +"/content/list", {
                    emulateJSON: true
                })
                .then(function(res) {
                    that.otherListData = res.data;
                    var arr = [];
                    res.data.map(function(val, indedx) {
                        if (val.status != 1) {
                            arr.push(val.id);
                        }
                        that.releaseArrQ = arr;
                    });
                    that.otherLoading=false;
                });
        },

        // 学校添加
        addSchoolConfirm(schoolNameInput, schoolImgUrl) {
            if(schoolNameInput==""){
                this.$message({
                    showClose: true,
                        message: "学校名字不能为空",
                        type: "warning"
                    });
                            return false;
            }else if(schoolImgUrl==""){
                this.$message({
                    showClose: true,
                    message: "学校图片不能为空",
                    type: "warning"
                });
                    return false;
            }
            var that = this;
            SchoolAdd({ name: schoolNameInput, image: schoolImgUrl })
                .then(res => {
                    if (res.code === 0) {
                        this.SchoolAdd = res;
                        this.dialogVisible = false;
                        this.upMain = "";//清空图片
                        this.schoolNameInput = "";//清空input
                        this.schoolList(that.pUrl); //重新刷新页面
                        this.introduct = "";
                        this.$message({
                            showClose: true,
                            message: "添加成功",
                            type: "success"
                        });
                    } else {
                        this.$message("添加失败!");
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        //新增弹窗学校清除图片和input文字
        SdialogVisible(){
            this.dialogVisible = true;
            this.upMain = "";
            this.schoolImgUrl = "";
            this.upText="点击添加图片";
            $(".tishi").removeClass("tishiBj") ;
        },
        //关闭清空信息
        handleClose() {
            this.dialogVisible = false;
            this.upMain = "";
            this.schoolImgUrl = "";
            this.schoolNameInput = "";
            this.upText="点击添加图片";
        },
        //关闭其他文本清空
        handleCloseQ() {
            this.dialogOtherAddVisible = false;
            this.introduct = "";
        },
        //学校列表编辑
        dialogEdit(row, index, img) {
            var that = this;
            that.dialogEditVisible = true;
            that.schoolInput = this.StableData[index].name;
            that.schoolEnitId = this.StableData[index].id;
            this.schoolImgUrl=img;
            this.upMain=this.ImgUrl+'/images/genome'+this.schoolImgUrl;
            that.upText="点击修改图片";
        },
        // 编辑学校确定-其他列表数据获取
        schoolEnitConfirm(id, schoolNameInput,schoolImgUrl) {
               if(schoolNameInput==""){
                this.$message({
                        showClose: true,
                        message: "学校名字不能为空",
                        type: "warning"
                    });
                    return false;
            }
            schoolEnitDate({
                id: id,
                name: schoolNameInput,
                image: schoolImgUrl,
                status: 0
            })
                .then(res => {
                    if (res.code === 0) {
                        this.schoolEnitDate = res;
                        this.dialogEditVisible = false;
                        this.schoolList(this.pUrl); //重新刷新页面

                        this.otherInput = "";
                        this.$message({
                            showClose: true,
                            message: "编辑成功",
                            type: "success"
                        });
                    } else {
                        this.$message("编辑失败!");
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        //学校向上移动
        SmoveUp(index, id, SotherbyQ) {
            var that = this;
            that.SotherbyQ = SotherbyQ;
            if (index > 0) {
                let upDate = that.StableData[index - 1];
                that.StableData.splice(index - 1, 1);
                that.StableData.splice(index, 0, upDate);
                let datas = {
                    orderbys: [
                        {
                            id: that.StableData[index].id,
                            orderby: SotherbyQ
                        },
                        {
                            id: id,
                            orderby: SotherbyQ + 1
                        }
                    ]
                };
                this.Sorderby(datas);
            } else {
                alert("已经是第一条，不可上移");
            }
        },
        //学校向下移动
        SmoveDown(index, id, SotherbyQ) {
            var that = this;
            that.SotherbyQ = SotherbyQ;
            if (index + 1 === that.StableData.length) {
                alert("已经是最后一条，不可下移");
            } else {
                let downDate = that.StableData[index + 1];
                that.StableData.splice(index + 1, 1);
                that.StableData.splice(index, 0, downDate);

                let datas = {
                    orderbys: [
                        {
                            id: id,
                            orderby: SotherbyQ - 1
                        },
                        {
                            id: that.StableData[index].id,
                            orderby: SotherbyQ
                        }
                    ]
                };
                this.Sorderby(datas);
            }
        },
        //学校 删除
        schoolDelete(id, index) {
            this.$confirm("确定删除这条信息吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: ""
            })
            .then(() => {
                sDelete({ id: id })
                    .then(res => {
                        if (res.code === 0) {
                            this.sDelete = res;
                                this.schoolList(this.pUrl); //重新刷新页面
                                this.$message({
                                    showClose: true,
                                    type: "success",
                                    message: "删除成功!"
                                });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            })
            .catch(() => {
                this.$message({
                    showClose: true,
                    type: "info",
                    message: "已取消删除"
                });
            });
        },
        // 学校图片上传
        handleAvatarSuccess(res, file) {           
            this.upMain = URL.createObjectURL(file.raw);
            this.schoolImgUrl = file.response.content;
            $(".tishi").addClass("tishiBj");
            this.upText="点击修改图片";
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isPNG = file.type === "image/png";
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (!isJPG && !isPNG) {
                 this.$message({
                    showClose: true,
                    type: "info",
                    message: "上传图片必须是JPG/PNG格式!"
                });
                return false;
            }
            if (!isLt1M) {
                this.$message({
                    showClose: true,
                    type: "info",
                    message: "上传头像图片大小不能超过 1MB!"
                });
                return false;
            }
        },
        //向上移动
        moveUp(index, id, otherbyQ) {
            var that = this;
            that.otherbyQ = otherbyQ;

            if (index > 0) {
                let upDate = that.otherListData[index - 1];

                that.otherListData.splice(index - 1, 1);
                that.otherListData.splice(index, 0, upDate);

                let datas = {
                    orderbys: [
                        {
                            id: that.otherListData[index].id,
                            orderby: otherbyQ
                        },
                        {
                            id: id,
                            orderby: otherbyQ + 1
                        }
                    ]
                };

                this.orderby(datas);
            } else {
                alert("已经是第一条，不可上移");
            }
        },
        //向下移动
        moveDown(index, id, otherbyQ) {
            var that = this;
            that.otherbyQ = otherbyQ;
            if (index + 1 === that.otherListData.length) {
                alert("已经是最后一条，不可下移");
            } else {
                let downDate = that.otherListData[index + 1];
                that.otherListData.splice(index + 1, 1);
                that.otherListData.splice(index, 0, downDate);

                let datas = {
                    orderbys: [
                        {
                            id: id,
                            orderby: otherbyQ - 1
                        },
                        {
                            id: that.otherListData[index].id,
                            orderby: otherbyQ
                        }
                    ]
                };
                this.orderby(datas);
            }
        },
         // 编辑 其他弹窗数据绑定
        dialogOtherEdit(row, index) {
            var that = this;
            that.dialogOtherVisible = true;
            that.otherInput = this.otherListData[index].content;
            that.enitId = this.otherListData[index].id;
        },

        // 编辑其他确定-其他列表数据获取
        otherEnitConfirm(id, otherInput) {
            if(otherInput==""){
                this.$message({
                    showClose: true,
                        message: "学校名字不能为空",
                        type: "warning"
                    });
                    return false;
            }
            update({ id: id, content: otherInput,status: 0 })
                .then(res => {
                    if (res.code === 0) {
                        this.update = res;
                        this.dialogOtherVisible = false;
                        this.otherList(this.pUrl); //重新刷新页面
                        this.otherInput = "";
                        this.$message({
                            showClose: true,
                            message: "编辑成功",
                            type: "success"
                        });
                    } else {
                        this.$message("编辑失败!");
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        //其他 删除
        otherDelete(id, index) {
            this.$confirm("确定删除这条信息吗?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: '',
                })
                .then(() => {
                oDelete({ id: id })
                    .then(res => {
                        if (res.code === 0) {
                    
                            this.oDelete = res;
                            this.otherList(this.pUrl); //重新刷新页面
                            this.$message({
                                showClose: true,
                                type: "success",
                                message: "删除成功!"
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
                })
                .catch(() => {
                    this.$message({
                        showClose: true,
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        //添加确定
        addOtherConfirm(textarea) {
             if(textarea==""){
                this.$message({
                    showClose: true,
                        message: "名字不能为空",
                        type: "warning"
                    });
                    return false;
            }
            var that = this;
            otherAdd({ content: textarea })
                .then(res => {
                    if (res.code === 0) {
                        this.otherAdd = res;
                        this.dialogOtherAddVisible = false;
                        that.otherList(this.pUrl); //重新刷新页面
                        this.introduct = "";
                        this.$message({
                            showClose: true,
                            message: "添加成功",
                            type: "success"
                        });
                    } else {
                        this.$message("添加失败!");
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },

        //学校排序
        Sorderby(datas) {
            SotherDate(datas).then(res => {
                if (res.code === 0) {
                    this.schoolList(this.pUrl); //重新刷新页面
                }
            });
        },

        //其他排序
        orderby(datas) {
            otherDate(datas).then(res => {
                if (res.code === 0) {
                    this.otherList(this.pUrl); //重新刷新页面
                }
            });
        },
    }
};
</script>

<style lang="scss" >
.backStageContent{
    .backStageMain {
            width: 1160px;
            margin: 0 auto;
            min-height: 778px;
            background: #ffffff;
            padding: 0 20px 20px 20px;
            overflow: hidden;
            margin-top: 3px;
            margin-bottom: 30px;
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
        }
         .bsHeader{
        font-family: 'ArialMT';
        width: 100%;
        height: 80px;
        background: #ffffff;
        border-bottom: 1px solid #ddd;
        box-shadow: 1px 1px 5px #ddd;
        line-height: 80px;
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
        .uploadMian {
            width: 170px;
            height: 170px;
        }

        #imgtou {
            width: 100%;
            height: 100%;
            cursor: pointer;
        }
        .schoolMain .el-button span {
            font-size: 16px;
        }

        .schoolList {
            font-size: 24px;
            color: #5c8ce6;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 20px;
            line-height: 37px;
        }

        .schoolList {
            padding: 10px 0;
            overflow: hidden;
        }
        .schoolList button {
            float: right;
            background-color: #5c8ce6;
            border-color: #5c8ce6;
        }

        .schoolMain .el-button--primary {
            background-color: #5c8ce6;
            border-color: #5c8ce6;
            width: 100px;
            height: 40px;
            line-height: 0px;
        }
        .schoolMain .has-gutter .is-leaf {
            background-color: #f5f8ff;
        }

        .el-table--border th {
            border-bottom: 1px solid #e0e0e0;
        }
        .el-table--border th,
        .el-table--border td {
            border-right: 1px solid #e0e0e0;
        }

        .el-table--border th:last-child {
            border-right: none;
        }

        .el-table--border td:last-child {
            border-right: none;
        }

        .el-table th.is-leaf,
        .el-table td {
            border-bottom: 1px solid #e0e0e0;
        }
        .el-table--group,
        .el-table--border {
            border-bottom: 1px solid #e0e0e0;
        }

        .el-table--group,
        .el-table--border {
            border: 1px solid #e0e0e0;
            border-bottom:none;
            /* border-right: none; */
        }

        .el-table::before {
            height: 0px;
        }

        .el-table--group::after, .el-table--border::after {
            width: 0px;
        }
        .schoolMain .el-button--text {
            color: #5886db;
        }
        .publishReview {
            padding: 20px 10px;
            border: 1px solid #e0e0e0;
            border-top: none;
            margin-bottom: 10px;
        }
        .cell {
            font-size: 16px;
        }

        /* 弹窗上传样式 */
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            width: 200px;
            height: 200px;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409eff;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 200px;
            height: 200px;
            line-height: 200px;
            text-align: center;
            display:none;
        }
        .avatar {
            width: 200px;
            height: 200px;
            display: block;
        }

        .el-dialog__body {
            height: auto;
            overflow-y: auto;
            padding: 30px;
        }

        .bg-purple {
            position: relative;
            top: 10px;
        }

        .schoolDiv {
            margin-bottom: 20px;
            overflow: hidden;
        }
        .el-dialog__header {
            text-align: left;
            text-indent: 10px;
        }

        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409eff;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 200px;
            height: 200px;
            line-height: 200px;
            text-align: center;
        }
        .avatar {
            width: 200px;
            height: 200px;
            display: block;
        }

        el-upload {
            position: relative;
        }
        .tishi {
            position: absolute;
            width: 200px;
            height: 200px;
            /* background:#00000060; */
            font-size: 80px;
            text-align: center;
            line-height: 170px;
            left: 0;
            color: #d9d9d9;
            background: #fafafa;
        }

        .tishi p {
            font-size: 14px;
            color: #999999;
            position: absolute;
            top: 50px;
            text-align: center;
            width: 100%;
        }

        .tishis {
            position: absolute;
            width: 200px;
            height: 200px;
            font-size: 80px;
            text-align: center;
            line-height: 170px;
            left: 0;
            color: #d9d9d9;
            background: #fafafa;
        }

        .tishis p {
            font-size: 14px;
            color: #999999;
            position: absolute;
            top: 50px;
            text-align: center;
            width: 100%;
        }

        .el-upload__tip {
            height: 20px;
            color: #999999;
        }

        .grid-content {
            font-size: 16px;
        }

        .publishReview button{
        padding: 0px;
        
        }

        .publishReview span{
        width: 100px;
        height: 40px;
        line-height: 36px;
        display: block;
        }
        .publishReview a{
        width: 100px;
        height: 40px;
        line-height: 36px;
        display: block;
        }
        .tishiBj{
        background:#00000060;

        }
        .tishiBj p{
            color:#ffffff
        }

        .tishiBjs{
        background:#00000060;

        }
        .tishiBjs p{
            color:#ffffff
        }

        .imgStyle{
            width: 50px; height: 50px;
        }

        .el-table--medium th, .el-table--medium td {
            padding: 5px 0;
        }
        .imgSpan{
            display: block;
            height: 50px;
        }

        .otherMain .el-table--medium th,.otherMain .el-table--medium td{

            height: 60px;
        
        }

        .otherCont{
            overflow:hidden; 
            text-overflow:ellipsis;
            display:-webkit-box; 
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
            -webkit-line-clamp:2; 
        }

        .schoolMain .el-table--medium th,.schoolMain .el-table--medium td{
            height: 60px;
        }

        .el-loading-mask{
            background: #00000040;
        }

        .otherTable .has-gutter th:nth-child(3){
            border-right: none;
        }

        .StableTable .has-gutter th:nth-child(4){
            border-right: none;
        }
}
</style>
