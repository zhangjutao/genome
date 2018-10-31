<template>
    <div class="GeneOntology">
        <div class="genesInfo-contant">
            <div class="basic-information">
                <div class="basic-information-tab">
                    <p>Basic Information</p>
                    <p v-show="!RapeExondbInfo.length" class="noData" v-text="this.$t('common.nodata')"></p>
                    <table class="js-RapeExondbInfo">
                    <tbody>
                    <template v-for="item in RapeExondbInfo" >

                        <tr v-for="(item1,index) in item" :key="index + 'a'">
                                <td>{{index}}</td>
                                <td>{{item1}}</td>
                        </tr>
                        </template>

                    </tbody>
                </table>
                </div>
            </div>
            <div class="gens-structure">
                <p>Genes Structure</p>
                <p v-show="!RapeExondbInfo.length" class="noData" v-text="this.$t('common.nodata')"></p>
                <div id="geneStructureGraph"></div>
            </div>
            <div class="domain-structure">
                <p>Domain Structure</p>
                <p v-show="!returnPfamdbDT.length" class="noData" v-text="this.$t('common.nodata')"></p>
                <table class="js-returnPfamdbDT">
                    <tbody>
                        <template v-for="(item,index) in returnPfamdbDT" >
                        <tr  :key="index + 'b'" v-if="index<=0">
                            <td >Protein Domain</td>
                            <td >Desc</td>
                            <td >Start</td>
                            <td >End</td>
                            <td >E_value</td>
                        </tr>
                        <tr  :key="index + 'c'">
                            <td >{{item.PfamID}}</td>
                            <td >{{item.Anno}}</td>
                            <td >{{item.Start}}</td>
                            <td >{{item.End}}</td>
                            <td >{{item.Evalue}}</td>
                        </tr>
                        </template>
                    </tbody>
                </table>
                <div id="domainStructureGraph"></div>
            </div>
            <div class="go-annotation">
                <p>Go Annotation</p>
                <p v-show="!returnGoannoDT.length" class="noData" v-text="this.$t('common.nodata')"></p>
                <div class="go-annotation-tab"></div>
                <table class="js-go-anno">
                    <tbody>
                    <template v-for="(item,index) in returnGoannoDT" >

                        <tr :key="index + 'd'">
                                <td><a :href="'http://amigo.geneontology.org/amigo/medial_search?q='+item.GOanno" target="_blank">{{item.GOanno}}</a></td>
                                <td>{{item.Anno}}</td>
                        </tr>
                        </template>

                    </tbody>
                </table>
            </div>
            <div class="go-annotation">
                <p>IPR Annotation</p>
                <p v-show="!returnIprannoDT.length" class="noData" v-text="this.$t('common.nodata')"></p>
                <div class="go-annotation-tab"></div>
                <table class="js-ipr-anno">
                    <tbody>
                        <template v-for="(item,index) in returnIprannoDT" >

                        <tr  :key="index + 'e'">
                                <td><a :href="'http://www.ebi.ac.uk/interpro/entry/'+item.IPRanno" target="_blank">{{item.IPRanno}}</a></td>
                                <td>{{item.Anno}}</td>
                        </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { GetRapeInfoByGNAndGG } from "@/api/index"; //页面调用的事件方法
import $ from "jquery"; //引入jq
export default {
  data() {
    return {
      RapeExondbInfo: [],
      returnGoannoDT: [],
      returnIprannoDT: [],
      returnPfamdbDT: [],
      chart1:[],
      chart2:[],
    };
  },
  mounted() {
  },
  methods:{
    getdialogInfo(val){
    GetRapeInfoByGNAndGG(val)
      .then(res =>{
                this.RapeExondbInfo = res.RapeExondbInfo;
                this.returnGoannoDT = res.returnGoannoDT;
                this.returnIprannoDT = res.returnIprannoDT;
                this.returnPfamdbDT = res.returnPfamdbDT;
                let string = this.RapeExondbInfo[0].ExonRegion;
                let array1 = string.split('-').join(',').split(',');
                if (array1[array1.length - 1] == '') {
                            array1.pop();
                        }
                let series1 = [];
                let  series2 = {name: 'title',data: []};
                for (var i = 0; i < array1.length / 2; i++) {
                    series1[i] = {
                        data: [
                            [Number(array1[2 * i]), Number(array1[2 * i + 1])]
                        ],
                        color: '#7cb5ec'
                    }
                }
                for (var i = 0; i < this.returnPfamdbDT.length; i++) {
                    series2.data[i] = [this.returnPfamdbDT[i].Start, this.returnPfamdbDT[i].End];
                    series2.color = '#7cb5ec';
                }
                this.chart1 = series1;
                this.chart2 = series2;
                this.drawGeneStructureGraph(series1);
                this.drawDomainStructureGraph(series2); 
      })
      .catch(error => {
      console.log(error);
      });
      },
        drawGeneStructureGraph(series) {
                var width = 590,
                    height = 100;
                Highcharts.chart('geneStructureGraph', {
                    // 图表类型，以及反转等信息
                    chart: {
                        type: 'columnrange',
                        inverted: true,
                        plotBorderColor: '#FFFFFF',
                        width: width,
                        height: height // 图形的宽度和高度
                    },
                    // 图表标题
                    title: {
                        text: ''
                    },
                    // x轴设置
                    xAxis: {
                        labels: {
                            enabled: false // 不显示标签
                        },
                        tickColor: '#FFFFFF', // 刻度为白色，即不显示刻度
                        lineColor: '#FFFFFF',
                    },
                    // y轴设置
                    yAxis: {
                        title: '', // 无标题
                        lineColor: '#C0D0E0',
                        lineWidth: '1',
                        gridLineColor: '#FFFFFF', // 不显示网格线
                        min: 0, // y轴从0开始，而不是负数
                        tickPixelInterval: 60, // 50px为一格
                        minorTickInterval: 'auto',
                        minorGridLineColor: '#FFFFFF',
                        minorTickLength: 5,
                        minorTickWidth: 1,
                        minorTickColor: '#C0D0E0',
                        minorTickPosition: 'inside',
                        tickColor: '#C0D0E0', // 刻度的颜色
                        tickWidth: 1, // 刻度的宽度
                        tickPosition: 'inside', // 刻度的位置（default outside）
                        className: 'highcharts-axis-line',
                        labels: { // 设置坐标轴上的label
                            y: -10,
                            reserveSpace: true,
                        },
                        opposite: true,
                        id: 'yAxis' // 设置ID，用于后面操作此轴
                    },
                    // 提示框
                    tooltip: {
                        // enabled: false                  // 不显示提示框
                        positioner: function (w, h, point) {
                            return {
                                x: point.plotX,
                                y: 60
                            } // 提示框的显示位置
                        },
                        formatter: function () { // 提示框显示的内容
                            return this.point.low + '-' + this.point.high;
                        }
                    },
                    // 版权信息
                    credits: {
                        enabled: false,
                        text: 'Wutbiolab', // 版权信息的内容
                        href: 'http://www.wutbiolab.cn/index' // 版权信息的链接
                    },
                    plotOptions: {
                        columnrange: {
                            dataLabels: {
                                enabled: false,
                                formatter: function () {
                                    return this.value;
                                }
                            }
                        }
                    },

                    legend: {
                        enabled: false
                    },

                    series: series
                },function (chart) {
                    $('#geneStructureGraph g rect').attr('x', height - 70).attr('width',
                            '10'); // 图中元素位置固定为同一水平线
                });
        },
        drawDomainStructureGraph(series) {
                var width = 590,
                        height = (series.data.length - 1) * 30 + 80; // 高度跟随数组长度改变
                Highcharts.chart('domainStructureGraph', {
                    chart: {
                        type: 'columnrange',
                        inverted: true,
                        plotBorderColor: '#FFFFFF',
                        width: width,
                        height: height
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        labels: {
                            enabled: false // 不显示标签
                        },
                        tickColor: '#FFFFFF', // 不显示刻度颜色
                        lineColor: '#FFFFFF',
                        opposite: true
                    },
                    yAxis: {
                        title: '', // 无标题
                        min: 0,
                        lineColor: '#C0D0E0',
                        lineWidth: '1',
                        gridLineColor: '#FFFFFF', // 不显示网格线
                        tickPixelInterval: 50, // 50px为一格
                        minorTickInterval: 'auto',
                        minorGridLineColor: '#FFFFFF',
                        minorTickLength: 5,
                        minorTickWidth: 1,
                        minorTickColor: '#C0D0E0',
                        minorTickPosition: 'inside',
                        tickColor: '#C0D0E0', // 刻度的颜色
                        tickWidth: 1, // 刻度的宽度
                        tickPosition: 'inside', // 刻度的位置（default outside）
                        className: 'highcharts-axis-line',
                        labels: {
                            y: -10,
                            reserveSpace: true,
                        },
                        opposite: true,
                        id: 'yAxis' // 设置ID，用于后面操作此轴
                    },
                    plotOptions: {
                        columnrange: {
                            dataLabels: {
                                enabled: false,
                                formatter: function () {
                                    return this.y;
                                }
                            }
                        }
                    },
                    tooltip: {
                        // enabled: false                  // 不显示提示框
                        positioner: function (w, h, point) {
                            return {
                                x: point.plotX,
                                y: point.plotY + 48
                            } // 提示框显示的位置
                        },
                        formatter: function () { // 提示框显示的内容
                            return this.point.low + '-' + this.point.high;
                        }
                    },
                    credits: {
                        enabled: false,
                        text: 'Wutbiolab', // 版权信息的内容
                        href: 'http://www.wutbiolab.cn/index' // 版权信息的链接
                    },
                    legend: {
                        enabled: false
                    },
                    series: [series]
                }, function (chart) {
                    $('#domainStructureGraph .highcharts-series-group rect').attr('width',
                            '10');
                });
        }
    }

};
</script>


<style lang="scss" scoped>
.GeneOntology {
  table {
    border-collapse: collapse;
    text-align: left;
  }
  .genesInfo {
    margin: 0 auto;
    background-color: #ffffff;
  }
  .genesInfo-head {
    background-color: #f7f7f9;
    height: 35px;
    line-height: 35px;
    padding: 0 10px;
  }
  .genesInfo-head p {
    float: left;
    font-size: 18px;
  }
  .genesInfo-head a {
    float: right;
    color: #bfbfbf;
    font-size: 25px;
  }
  .genesInfo-contant {
    padding-top: 20px;
  }
  .genesInfo-contant > div {
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 25px;
    margin-bottom: 35px;
  }
  .basic-information .basic-information-tab {
    height: 410px;
    overflow: auto;
  }
  .basic-information p,
  .gens-structure p,
  .domain-structure p,
  .go-annotation p {
    font-weight: bolder;
    font-size: 18px;
    padding-bottom: 15px;
  }
    p.noData{
    font-weight: normal;
    font-size: 16px;
  }
  .basic-information table {
    padding-bottom: 20px;
  }
  .basic-information table tr td,
  .go-annotation table tr td {
    border: 1px solid #e6e6e6;
    padding: 8px 14px;
  }
  .basic-information table tr td:nth-child(1) {
    padding-right: 40px;
    white-space: nowrap;
  }
  .domain-structure tbody tr td {
    border: 1px solid #e6e6e6;
    padding: 5px 10px;
    height: 20px;
  }
  .basic-information tbody tr:nth-child(odd) {
    background-color: #f9f9f9;
  }
  .domain-structure tbody tr:nth-child(1) {
    background-color: #f7f7f7;
  }
  .domain-structure tbody tr:nth-child(2) {
    background-color: #f9f9f9;
  }
  .go-annotation tbody tr td:nth-child(2) {
    width: 200px;
  }
  .go-annotation-tab {
  }
  .basic-information .basic-information-tab::-webkit-scrollbar,
  .go-annotation::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: #fff;
  }
  /*定义滚动条轨道 内阴影+圆角*/
  .basic-information .basic-information-tab::-webkit-scrollbar-track,
  .go-annotation::-webkit-scrollbar-track {
    -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    background-color: #f5f5f5;
  }
  /*定义滑块 内阴影+圆角*/
  .basic-information .basic-information-tab::-webkit-scrollbar-thumb,
  .go-annotation::-webkit-scrollbar-thumb {
    -webkit-box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    background-color: #ccc;
  }

  .ga-mask {
    position: absolute;
    background: rgba(255, 255, 255, 0.6);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .ga-mask > div {
    text-align: center;
    margin-top: 30%;
  }
  a{
     color: #5c8ce6;
  }
}
</style>
