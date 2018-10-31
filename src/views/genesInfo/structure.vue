<template>
    <div class="explains">
        <div class="explain-list" id="basic">
				<div class="explain-h">
					<p>Gene structure</p>
				</div>
				<div class="explain-b">
                    <div class="color-example">
                        <label>
                            <span><i class="cor-pro"></i>Promoter</span>
                            <span><i class="cor-5utr"></i>5'UTR</span>
                            <span><i class="cor-cds"></i>CDS</span>
                            <span><i class="cor-3utr"></i>3'UTR</span>
                        </label>
                    </div>
                    <div id="geneStructure">
                    </div>
				</div>
			</div>
    </div>
</template>

<script>
import {getstrucInfo,downloadSeq} from "@/api/index"; //页面调用的事件方法
import * as d3 from 'd3'; //引入D3

export default {
    data () {
        return {
            geneid: '',
            structureInfo: []
        }
    },
    mounted() {
        // 组件创建完后获取数据，
        // 此时 data 已经被 observed 了
        this.fetchDate();
    },
    methods: {
        drawGeneStructure(divId,data) {
            var start = data.transcriptStart;
            var end = data.transcriptEnd;
            var maxLength = end - start;
            var svg = d3.select("#" + divId).append("svg").attr("width", $("#" + divId).width()).attr("height", 40),
                svg_width = svg.attr("width"),
                svg_height = svg.attr("height"),
                svg_margin = 20

            var structureColor = {
                "promoter": "#C6E3FE",
                "3'UTR": "#FFBA02",
                "CDS": "#009ABB",
                "5'UTR": "#F87580",
                "line": "#D1D1D1"
            }

            //构建比例尺
            var Scale = d3.scaleLinear().domain([0, maxLength]).range([0, svg_width - svg_margin * 2])
            var g = svg.append("g")
                .attr("transform", "translate( "+svg_margin+" , 20)")

            // 背景线
            g.append("line").attr("x1", 0).attr("y1", 0).attr("x2", Scale(maxLength)).attr("y2", 0).attr("stroke-width", 4).attr("stroke", structureColor.line)
            // 方块
            for (var i = 0; i< data.structureList.length; i++) {
                g.append("rect").attr("x", Scale(data.structureList[i].start - start))
                    .attr("y", function(){
                        if(data.structureList[i].feature === "promoter"){
                            return -6
                        }
                        return -15
                    }).attr("width", Scale(data.structureList[i].end - data.structureList[i].start)).attr("height", function(){
                    if(data.structureList[i].feature === "promoter"){
                        return 12
                    }
                    return 30
                })
                    .attr("fill", structureColor[data.structureList[i].feature])
            }
        },
        fetchDate() {
            var _this = this;
            if(this.$route.query.geneid){
                this.geneid = this.$route.query.geneid;
            }
            getstrucInfo({'geneId':this.geneid})
                .then(res =>{
                    _this.structureInfo = res;
                    //console.log(this.structureInfo);
                    _this.$nextTick(() =>{
                         //选取绘图div
                        d3.select("#geneStructure").selectAll("svg").remove();
                        //对每个转录本循环生成对应的视图
                        $.each(_this.structureInfo, function(i, item){
                            var genDomId = "geneId" + i;
                            var html = [];
                            html.push('<div class="structure-list">');
                            html.push('    <a href="javascript:;">'+item.transcriptId+'</a>');
                            html.push('    <div id="'+ genDomId +'" ></div>');
                            html.push('    <div class="show">');
                            html.push('        <p class="btn-download-more">');
                            html.push('            <button id="'+item.transcriptId+'" class="btn js-btn-download">Download</button>');
                            html.push('            <button class="btn js-more-txt">Hide</button>');
                            html.push('        </p>');
                            html.push('        <div class="more-txt">');
                            html.push('            <table cellspacing="0" cellpadding="0">');
                            html.push('                <tr><td></td><td>Chromosome</td><td>Start</td><td>End</td><td>Length</td></tr>');
                            $.each(item.structureList, function(ii, sitem){
                                html.push('                <tr><td>'+sitem.feature+'</td><td>'+sitem.chromosome+'</td><td>'+sitem.start+'</td><td>'+sitem.end+'</td><td>'+sitem.length+'</td></tr>');
                            });
                            html.push('            </table>');
                            html.push('        </div>');
                            html.push('    </div>');
                            html.push('</div>');
                            $("#geneStructure").append($(html.join('\n')));

                            //对每个转录本绘制基因结构图
                            _this.drawGeneStructure(genDomId,item)                       
                        });
                        _this.$nextTick(() => {
                            //绑定下载及隐藏事件
                            $("#geneStructure").on('click', '.js-btn-download', function(e){
                                //console.log($(this).attr('id'));
                                downloadSeq({'transcriptId':$(this).attr('id')}).then(res => {
                                    //window.open(res);
                                    //将文件内容写入文件
                                    let url = window.URL.createObjectURL(new Blob([res]))
                                    let link = document.createElement('a')
                                    link.style.display = 'none'
                                    link.href = url
                                    link.setAttribute('download', $(this).attr('id') + 'sequence.txt')
                                    document.body.appendChild(link)
                                    link.click()
                                });
                                e.stopPropagation();
                            })
                            $("#geneStructure").on('click', '.js-more-txt', function(e){
                                $(this).closest('div.show').find("div.more-txt").toggle();
                                $(this).text()=='Hide'?$(this).text('Detail'):$(this).text('Hide');
                                e.stopPropagation();
                            })
                        })
                         
                    })
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        "$route": "fetchDate"
    }
}
</script>

<style>
.structure-list {
    border: 1px solid #e6e6e6;
    padding-bottom: 20px;
    /* border-bottom: none; */
}
.structure-list a {
    color: #5c8ce6;
    font-size: 18px;
    padding-left: 18px;
    margin-bottom: 15px;
    margin-top: 15px;
    display: block;
}
.btn-download-more {
    padding-top: 25px;
    padding-left: 20px;
    padding-bottom: 15px;
}
.btn-download-more button {
    font-size: 14px;
    margin-right: 5px;
    background-color: #5c8ce6;
    border: 1px solid #5c8ce6;
    cursor: pointer;
    width: 120px;
    height: 34px;
    color: #fff;
}
.more-txt table {
    width: 95%;
    margin: 0 auto;
    padding-bottom: 10px;
    cellpadding: 0;
    cellspacing : 0;
}
.more-txt table tr {
    height: 35px;
}

.explain-b tbody tr td {
    border-right: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
    text-align: center;
}
.explain-b tbody tr:first-child td{
    border-top: 1px solid #e6e6e6;
}
#basic .explain-b tbody tr td:first-child {
    background: #f5f8ff;
    width: 150px;
    border-left: 1px solid #e6e6e6;
}
</style>

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
.color-example {
    text-align: right;
    margin-bottom: 20px;
    height: 38px;
    line-height: 38px;
}
.color-example label {
    display: inline-block;
    border: 1px solid #e6e6e6;
    padding: 0 20px;
}
.color-example span {
    padding-left: 15px;
}
.color-example span i {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 8px;
    vertical-align: sub;
    margin-right: 5px;
}
.color-example span i.cor-pro {
    background: #c7e1ff;
}
.color-example span i.cor-5utr {
    background: #f87481;
}
.color-example span i.cor-cds {
    background: #0099bb;
}
.color-example span i.cor-3utr {
    background: #ffb902;
}
</style>


