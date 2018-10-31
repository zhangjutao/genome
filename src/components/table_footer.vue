<template>
     <div class="block">
            <el-pagination
            :pager-count = 11
            :background = true
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout=" prev, pager, next, sizes,total"
            :total="tableTotal">
            </el-pagination>
        </div>
</template>

<script>
export default {
  props: ["tableTotal"],
  data() {
    return {
      currentPage: 1, //默认显示页数
      pageNum: 1, //当前页
      pageSize: 10, //每页条
      total: "" //总数
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.currentPage = 1;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getTableData();
    },
    getTableData() {
      let page = { pageSize: this.pageSize, pageNum: this.pageNum};
      this.$emit("getTableData", page);
    },
    //屏蔽首页和尾页
    hidePage() {
      let morearr = [];
      let lastlength = $(".el-pagination ul.el-pager li").length;
      //找到显示为...的位置
      $(".el-pagination ul.el-pager li").each(function(i,val){
        if($(this).hasClass('el-icon-more') || $(this).hasClass('more')){
          morearr.push(i);
        }
      });
      //判定...的前面和后面是不是首页跟尾页，是的话隐藏
      //初始化
      $(".el-pagination ul.el-pager li:first-child").show();
      $(".el-pagination ul.el-pager li:last-child").show();
      for(var i = 0; i < morearr.length; i++) {
        
        var index = morearr[i];
        if(index === 1) {
          //判断首页
          $(".el-pagination ul.el-pager li:first-child").hide();
        }else{
          //尾页
          $(".el-pagination ul.el-pager li:last-child").hide();
        }
      }
    }
  }
};
</script>

<style>
   .block  .el-pagination__sizes{
        margin: 0 20px 0 20px;
    }
    .block .el-pagination__editor.el-input{
            width: 70px;
    }
    .sideBar .el-dialog{
        min-width:800px;
    }
</style>


<style lang="scss" scoped>
.block{
    text-align: center;
    margin-top: 20px;
    padding-bottom: 20px;
}
</style>
