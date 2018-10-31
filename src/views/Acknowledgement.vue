<template>
    <div class='preview'>
        <div class='previewMain'>
            <div class="preview_tit">
                <img src="@/assets/images/school2.png" alt="">
                <span>Cooperators</span>
            </div>
            <ul class="preview_ul">
                <li v-for="(item,index) in StableData" :key='index'>
                    <div class="imgDiv"><img :src="ImgUrl+'/images/genome'+item.image" alt=""></div>
                    <p>{{item.name}}</p>
                </li>
            </ul>
        </div>
        <div class='previewMain' style="margin-bottom:30px;">
            <div class="preview_tit">
                <!-- <img src="@/assets/images/school1.png" alt="">
                <span>Others</span> -->
            </div>
            <div class="preview_content">
                <ul>
                    <li class="preview_p" v-for="(item,index) in otherListData" :key='index'>{{item.content}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { relSchoolListData,relOtherListData} from "@/api/index"; //页面调用的事件方法-
export default {
 name: 'Acknowledgement',
 data() {
        return {
            StableData: [], //学校预览列表data
            otherListData: [], //其他预览列表data
            pUrl:"",
            ImgUrl:""
        };
    },
    mounted() {
         this.pUrl = window.g.ApiUrl;//获取全局接口访问URL
         this.ImgUrl=window.g.MapUrl;//获取全局图片URL
         this.relSchoolList ();
         this.relOtherList ();
    },
    methods: {
        // 学校正式列表数据获取
        relSchoolList () {
            relSchoolListData({ status: 1 })
                .then(res => {
                this.StableData = res;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        // 其他正式列表数据获取
         relOtherList () {
            relOtherListData({ status: 1 })
                .then(res => {
                this.otherListData = res;
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }
}
</script>

<style scoped>
.preview {
    min-height: 778px;
    width: 1200px;
    margin: 0 auto;
    margin-top: 3px;
}
.previewMain{
    width: 1140px;
    padding:20px 30px 0 30px;
    margin-bottom: 10px;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
    background: #ffffff;
}
.preview_tit {
    padding-bottom: 20px;
}
.preview_tit img {
    padding-right: 6px;
    position: relative;
    top: 5px;
}
.preview_tit span {
    font-size: 20px;
    color: #5c8ce6;
}
.preview_ul {
    overflow: hidden;
}
.preview_ul li {
    width: 285px;
    text-align: center;
    float: left;
    margin-bottom: 40px;
}
.imgDiv {
    width: 100%;
    height: 100px;
}
.preview_ul li img {
    width: 100px;
    height: 100px;
    /* border-radius: 50%;
    box-shadow: 0px 5px 5px 5px #184aad10; */
}
.preview_ul li p {
    font-size: 14px;
    color: #666666;
    text-align: center;
    margin-top: 24px;
}
.preview_p {
    font-size: 14px;
    color: #666666;
    line-height: 25px;
    margin-bottom: 10px;
}
.preview_content{
    padding-bottom: 30px;
}
</style>
