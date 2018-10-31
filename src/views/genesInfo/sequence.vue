<template>
    <div class="explains" @click="resetActive">
        <div class="explain-list" id="basic">
				<div class="explain-h">
					<p>Reference sequences</p>
				</div>
				<div class="explain-b">
                    <div class="refseq">
                        <ul class="refseq_ul">
                            <li><i class="refseq_i1"></i>Upstream2k</li>
                            <li><i class="refseq_i2"></i>5'UTR</li>
                            <li><i class="refseq_i3"></i>CDS</li>
                            <li><i class="refseq_i4"></i>3'UTR</li>
                            <li><i class="refseq_i5"></i>Downstream2k</li>
                        </ul>
                    </div>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <p class="se0quence-name"><b>Genomic sequence</b></p>
                                <button class="copy" id="copyConterBtn" @click.stop="copySeq('seq')">Copy sequences</button><br>
                                <button class="copy" id="copyUpstream2kBtn" @click.stop="copySeq('upstream2k')">Copy Upstream2k</button><br>
                                <button class="copy" id="copygDNABtn" @click.stop="copySeq('gDNA')">Copy gDNA</button><br>
                                <button class="copy" id="copyCDSBtn" @click.stop="copySeq('CDS')">Copy CDS</button>
                                <button class="copy" id="copyDownstream2kBtn"@click.stop="copySeq('downstream2k')">Copy Downstream2k</button>
                            </td>
                            <td>
                                <div class="foo_main">
                                    <div class="foo_div">
                                        <textarea id="input" ref="copytext"></textarea>
                                        <div class="copy_p" id="copyConter">
                                            <p>
                                                <template v-for="(item,key) in structureList[0]">
                                                    <p :key="key" :class="key"><span :class="{'active':isActive[key], 'activeseq':isActive['seq']}">{{item}}</span></p>
                                                </template>
                                                <p class="gDNA">
                                                    <template v-for="(item,index) in gdnastructureList">
                                                        <p :key="index" :class="Object.keys(item)[0]"><span :class="{'activeseq':isActive['seq'],'activegdna':isActive['gDNA'],'active':isActive[Object.keys(item)[0]]}">{{Object.values(item)[0]}}</span></p>
                                                    </template>
                                                </p>
                                                <template v-for="(item,key) in structureList[structureList.length - 1]">
                                                    <p :key="key" :class="key"><span :class="{'activeseq':isActive['seq'],'active':isActive[key]}">{{item}}</span></p>
                                                </template>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </td>

                        </tr>
                        <tr>
                            <td>
                                <p class="se0quence-name"><b>Peptide sequence</b></p>
                                <button class="copy" id="copyPeptideBtn" @click.stop="copySeq('peptide')">Copy sequences</button><br>
                            </td>
                            <td>
                                <div class="foo_main">
                                    <div class="foo_div">
                                        <textarea id="inputPeptide"></textarea>
                                        <div class="copy_p" id="copyPeptideConter"><span class="peptide" :class="{'active':isActive['peptide']}">{{peptideseq}}</span></div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
				</div>
			</div>
    </div>
</template>

<script>
import {getSequenceInfo} from "@/api/index"; //页面调用的事件方法

export default {
    data () {
        return {
            geneid: '',
            sequenceInfo: {},
            structureList:[],
            geneseq: '',
            upstream2kseq: '',
            peptideseq: '',
            gDNAseq: '',
            CDSseq: '',
            downstream2kseq: '',
            isActive: {
                'seq': false,
                'upstream2k': false,
                'gDNA': false,
                'CDS': false,
                'downstream2k':false,
                'peptide': false
            },
            gdnastructureList: []
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
            var _this=  this;
            getSequenceInfo({'geneId':this.geneid})
                .then(res =>{
                    _this.sequenceInfo = res;
                    _this.$nextTick(() => {
                        _this.structureList = res.structureList;
                         //负链交换upstream和downstream
                        // if (res.strand === "-") {
                        //     var tmp = res.structureList[0];
                        //     res.structureList[0] = res.structureList[res.structureList.length - 1];
                        //     res.structureList[res.structureList.length - 1] = tmp;
                        // }
                        
                        _this.sequenceInfo = res;
                        //依次对对应的变量赋值
                        for(var i = 0; i < res.sequenceList.length; i++) {
                            switch (res.sequenceList[i].type){
                                case 'upstream2k':
                                    _this.upstream2kseq = res.sequenceList[i].sequence;
                                    break;
                                case 'gDNA':
                                    _this.gDNAseq = res.sequenceList[i].sequence;
                                    break;
                                case 'CDS':
                                    _this.CDSseq = res.sequenceList[i].sequence;
                                    break;
                                case 'peptide':
                                    _this.peptideseq = res.sequenceList[i].sequence;
                                    break;
                                case 'downstream2k':
                                    _this.downstream2kseq = res.sequenceList[i].sequence;
                                    break;
                                default:
                                    break;
                            }
                        }
                        // if(res.strand === "-") {
                        //     _this.geneseq = _this.downstream2kseq + _this.gDNAseq + _this.upstream2kseq;
                        // } else {
                        //     _this.geneseq = _this.upstream2kseq + _this.gDNAseq + _this.downstream2kseq;
                        // }
                        _this.geneseq = _this.upstream2kseq + _this.gDNAseq + _this.downstream2kseq;
                        //对gdna列表赋值
                        for(var j = 1;j < res.structureList.length - 1; j++) {
                            _this.gdnastructureList.push(res.structureList[j]);
                        }
                    })
                })
                .catch(error => {
                    console.log(error);
                });
        },
        resetActive(){
            var _this = this;
            Object.keys(this.isActive).forEach(function(key){
                _this.isActive[key] = false;
            });
        },
        copySeq(val) {
            switch (val) {
                case 'seq':
                    this.resetActive();
                    this.isActive['seq'] = true;
                    this.$refs.copytext.value = this.geneseq; // 修改文本框的内容
                    break;
                case 'upstream2k':
                    this.resetActive();
                    this.isActive['upstream2k'] = true;
                    this.$refs.copytext.value = this.upstream2kseq; // 修改文本框的内容
                    break;
                case 'gDNA':
                    this.resetActive();
                    this.isActive['gDNA'] = true;
                    this.$refs.copytext.value = this.gDNAseq; // 修改文本框的内容
                    break;
                case 'CDS':
                    this.resetActive();
                    this.isActive['CDS'] = true;
                    this.$refs.copytext.value = this.CDSseq; // 修改文本框的内容
                    break;
                case 'downstream2k':
                    this.resetActive();
                    this.isActive['downstream2k'] = true;
                    this.$refs.copytext.value = this.downstream2kseq; // 修改文本框的内容
                    break;
                case 'peptide':
                    this.resetActive();
                    this.isActive['peptide'] = true;
                    this.$refs.copytext.value = this.peptideseq; // 修改文本框的内容
                    break;
                default:
                    break
            }
            this.$refs.copytext.select(); // 选中文本
            document.execCommand("copy"); // 执行浏览器复制命令
        }
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        "$route": "fetchDate"
    }
}
</script>
<style>
table {
    border-collapse: collapse;
    text-align: center;
    width: 100%;
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
.refseq {
    overflow: hidden;
    margin-bottom: 20px;
}
.refseq_ul {
    list-style: none;
    overflow: hidden;
    float: right;
    border: 1px solid #dedede;
    padding: 10px;
}
.refseq_ul li {
    float: left;
    display: flex;
    padding-right: 16px;
}
.refseq_ul li i {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: block;
    display: flex;
    position: relative;
    top: 2px;
    margin-right: 4px;
}
.refseq_i1 {
    background: #abbac3;
}
.refseq_i2 {
    background: #f87481;
}
.refseq_i3 {
    background: #0099bb;
}
.refseq_i4 {
    background: #ffb902;
}
.refseq_i5 {
    background: #61daa5;
}
.explain-b tbody tr {
    height: 50px;
}
.explain-b tbody tr td {
    border: 1px solid #e6e6e6;
}
.explain-b tbody tr td:first-child {
    background: #f5f8ff;
    width: 253px;
    text-align: center;
    padding: 10px 0;
}
#basic .explain-b tbody tr td:nth-child(2) {
    text-align: center;
    padding: 10px 10px 10px 30px;
}
#copyConter p {
    display:inline;
}
.copy {
    width: 119px;
    height: 35px;
    background: #5c8ce6;
    border: 1px solid #5c8ce6;
    color: #fff;
    margin-top: 10px;
    font-size: 13px;
}
.copy i {
    float:left;
}
.foo_div {
    position: relative;
}
#input, #inputPeptide {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: -10;
}
.copy_p {
    width: 100%;
    height: 258px;
    overflow-y: auto;
    text-align: left;
    word-break: break-all;
}
#copyPeptideConter {
    width: 573px;
    height: 210px;
    margin: 30px 0;
}
.se0quence-name b {
    font-size: 16px;
}
.upstream2k {
    background: #abbac3;
    color: #fff;
}
.UTR5 {
    background: #f87481;
    color: #fff; 
}
.CDS{
    background: #0099bb;
    color: #fff;
}
.UTR3 {
    background: #ffb902;
    color: #fff; 
}
.downstream2k{
    background: #61daa5;
    color: #fff;
}
.active,.activeseq,.activegdna{
    background: #5c8ce6!important;
    color: #fff!important;
}
</style>


