<template>
  <div class="pageError">
      <div>
       <img class="pic-404__parent" :src="img_404" alt="404">
        <div class="bullshit__info">请检查您输入的网址是否正确，请点击以下按钮返回主页</div>
      <el-button @click="back" icon='arrow-left' class="bullshit__return-home">返回首页</el-button>
      </div>

  </div>
</template>

<script>
import img_404 from '@/assets/images/404.jpg'

export default {
  name: 'page404',
    data() {
    return {
      img_404,
    }
  },
    methods: {
    back() {
      // if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/' })
      // } else {
      //   this.$router.go(-1)
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
.pageError{
    background: #fff;
    padding: 200px 0 400px;
    text-align: center;

}
</style>
