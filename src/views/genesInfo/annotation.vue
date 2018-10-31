<template>
    <div class="explains">
        <div class="explain-list" id="basic">
				<div class="explain-h">
					<p>Gene annotation</p>
				</div>
				<div class="explain-b">
                    <div class="goannotation">
                        <el-row type="flex"  height="42" justify="center" class='odd'>GO annotation</el-row>
                        <el-row type="flex"  height="42" justify="center">
                            <el-col :span="8" class="first">GO_Entry</el-col>
                            <el-col :span="8">Anno</el-col>
                            <el-col :span="8">Type</el-col>
                        </el-row>
                        <template v-for="(item,index) in geneAnnoInfo.goInfo">
                            <el-row type="flex" :key="index" height="42" justify="center" :class="{odd:index%2 === 0}">
                                <el-col :span="8" class="first">{{item.goEntry}}</el-col>
                                <el-col :span="8">{{item.anno}}</el-col>
                                <el-col :span="8">{{item.type}}</el-col>
                            </el-row>
                        </template>
                    </div>
                    <div class="keggannotation">
                        <el-row type="flex"  height="42" justify="center" class='odd'>KEGG annotation</el-row>
                        <el-row type="flex"  height="42" justify="center">
                            <el-col :span="8" class="first">Target_ID</el-col>
                            <el-col :span="8">KO_Entry</el-col>
                            <el-col :span="8">KO_Difinition</el-col>
                        </el-row>
                        <template v-for="(item,index) in geneAnnoInfo.keggInfo">
                            <el-row type="flex" :key="index" height="42" justify="center" :class="{odd:index%2 === 0}">
                                <el-col :span="8" class="first">{{item.targetId}}</el-col>
                                <el-col :span="8">{{item.koEntry}}</el-col>
                                <el-col :span="8">{{item.koDefinition}}</el-col>
                            </el-row>
                        </template>
                    </div>
                    <div class="iprannotation">
                        <el-row type="flex"  height="42" justify="center" class='odd'>InterPro annotation</el-row>
                        <el-row type="flex"  height="42" justify="center">
                            <el-col :span="8" class="first">IPR_Entry</el-col>
                            <el-col :span="16">IPR_Anno</el-col>
                        </el-row>
                        <template v-for="(item,index) in geneAnnoInfo.iprInfo">
                            <el-row type="flex" :key="index" height="42" justify="center" :class="{odd:index%2 === 0}">
                                <el-col :span="8" class="first">{{item.iprEntry}}</el-col>
                                <el-col :span="16">{{item.iprAnno}}</el-col>
                            </el-row>
                        </template>
                    </div>
				</div>
			</div>
    </div>
</template>

<script>
import {geneAnno} from "@/api/index"; //页面调用的事件方法

export default {
    data () {
        return {
            geneid: '',
            geneAnnoInfo: {}
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
            geneAnno({'geneId':this.geneid})
                .then(res =>{
                    this.geneAnnoInfo = res;
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
.itemcontent{
    text-align:center;
}
.el-row--flex{
    line-height:42px;
}
.odd{
    background:#f5f8ff;
}
.el-row{
    // border-right: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
    border-left: none;
}
.el-col{
    border-left: 1px solid #e6e6e6;
    text-align: center;
}
.first{
    border-left: none;
}
.goannotation,.keggannotation,.iprannotation{
    margin: 0 auto 27px auto;
    border:1px solid #e6e6e6;
    border-bottom: none;
}
</style>


