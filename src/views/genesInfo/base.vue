<template>
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

<script>
import {geneBaseInfo} from "@/api/index"; //页面调用的事件方法

export default {
    data () {
        return {
            geneid: '',
            baseList: []
        }
    },
    mounted() {
        // 组件创建完后获取数据，
        // 此时 data 已经被 observed 了
        this.fetchDate();
    },
    methods: {
        fetchDate() {
            if(this.$route.query.geneid){
                this.geneid = this.$route.query.geneid;
            }
            geneBaseInfo({geneId:this.geneid})
                .then(res =>{
                    var tmpbaseList = [];
                    Object.keys(res).forEach(function(key){
                        if(key !== 'geneOtherInfo') {
                            tmpbaseList.push(
                                {['GeneId(' + key + ')']:res[key]}
                            )
                        }
                    });
                    tmpbaseList.push({'Gene name':res.geneOtherInfo.geneName});
                    tmpbaseList.push({'Gene type':res.geneOtherInfo.geneType});
                    tmpbaseList.push({'Locus':res.geneOtherInfo.locus});
                    tmpbaseList.push({'Length':res.geneOtherInfo.length+'bp'});
                    tmpbaseList.push({'Species':res.geneOtherInfo.species});
                    tmpbaseList.push({'Description':res.geneOtherInfo.description});
                    this.baseList = tmpbaseList;
                })
                .catch(error => {
                    console.log(error);
                });
        },
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        "$route": "fetchDate"
    }
}
</script>

<style lang="scss" scoped>
.explain-list{
    min-height: 756px;
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


