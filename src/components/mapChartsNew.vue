<template>
  <div class="echarts">
    <div :class="className" :id="id" :style="{height:height,width:width}" ref="myEchart"></div>
  </div>
</template>
<script>
  import echarts from "echarts";
  import '../../node_modules/echarts/map/js/world.js';
  import { mapInfo } from "@/api/index"; //页面调用的事件方法
  // import '../../../node_modules/echarts/map/js/china.js' // 引入中国地图数据

  export default {
    name: "echarts",
    props: {
      className: {
        type: String,
        default: ""
      },
      id: {
        type: String,
        default: ""
      },
      width: {
        type: String,
        default: "1050px"
      },
      height: {
        type: String,
        default: "494px"
      },
      zoom: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        title: "",
        placeholder: "",
        find: "", //1显示新增按钮，2显示导入按钮，若不显示这两个按钮可以写0或者不写值
        chart: null,
        hover: false,
        mapList: [],
        fullNameMap: {}
      };
    },
    mounted() {
      mapInfo().then((res) => {
            // console.log(res);
            this.mapList = res;
            this.$nextTick(() => {
              this.initChart(this.zoom);
            })
        });
      // this.chinaConfigure();
    },
    beforeDestroy() {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
    },
    methods: {
      //color转rgb
      color2rgb(color) {
            var r = parseInt(color.substr(1, 2), 16);
            var g = parseInt(color.substr(3, 2), 16);
            var b = parseInt(color.substr(5, 2), 16);
            return new Array(r, g, b);
        },
      rgb2color(rgb) {   
            var s = "#";   
            for (var i = 0; i < 3; i++)  
            {    
                var c = Math.round(rgb[i]).toString(16);   
                if (c.length == 1) 
                c = '0' + c; s += c;
            }
            return s.toUpperCase();
        },

      //世界地图
      initChart(zoomVal) {
        var NNData = this.mapList;
        var mapVersion = [];
        var _this = this;
        for (var i = 0; i < NNData.length; i++) {
          _this.fullNameMap[NNData[i].fullName] = NNData[i].version;
          mapVersion[NNData[i].name] = NNData[i].fullName;
        }

        this.chart = echarts.init(this.$refs.myEchart);
        var color  = ['rgba(147, 235, 248, 1)', 'rgba(255, 235, 59, .7)'];    // 自定义图中要用到的颜色
        var series = [];                        // 用来存储地图数据


        //世界上各个国家对应的颜色
        var ColorA = "#87cefa", ColorB = "ffff00",ColorC = "#ffa500";  

        var areaColor = {
          'Asia':'#57add9',
          'Europe':'#8ad4bd',
          'North America':'#f5c54c',
          'South America': '#d5b98a',
          'Africa' : '#f5b090',
          'Oceania':'#95c777',
          'Antarctica': '#5c8ce6'  //南极洲颜色暂时不需要
        }
        var coldatarow = [
              {name: 'Afghanistan', value: 28397.812,area:'Asia'},
              {name: 'Angola', value: 19549.124,area:'Africa'},
              {name: 'Albania', value: 3150.143,area:'Europe'},
              {name: 'United Arab Emirates', value: 8441.537,area:'Asia'},
              {name: 'Argentina', value: 40374.224,area:'South America'},
              {name: 'Armenia', value: 2963.496,area:'Asia'},
              {name: 'French Southern and Antarctic Lands', value: 268.065,area:'Europe'},
              {name: 'Australia', value: 22404.488,area:'Oceania'},
              {name: 'Austria', value: 8401.924,area:'Europe'},
              {name: 'Azerbaijan', value: 9094.718,area:'Asia'},
              {name: 'Burundi', value: 9232.753,area:'Africa'},
              {name: 'Belgium', value: 10941.288,area:'Europe'},
              {name: 'Benin', value: 9509.798,area:'Africa'},
              {name: 'Burkina Faso', value: 15540.284,area:'Africa'},
              {name: 'Bangladesh', value: 151125.475,area:'Asia'},
              {name: 'Bulgaria', value: 7389.175,area:'Europe'},
              {name: 'The Bahamas', value: 66402.316,area:'North America'},
              {name: 'Bosnia and Herz.', value: 3845.929,area:'Europe'},
              {name: 'Belarus', value: 9491.07,area:'Europe'},
              {name: 'Belize', value: 308.595,area:'North America'},
              {name: 'Bermuda', value: 64.951,area:'Europe'},
              {name: 'Bolivia', value: 716.939,area:'South America'},
              {name: 'Brazil', value: 195210.154,area:'South America'},
              {name: 'Brunei', value: 27.223,area:'Asia'},
              {name: 'Bhutan', value: 716.939,area:'Asia'},
              {name: 'Botswana', value: 1969.341,area:'Africa'},
              {name: 'Central African Rep.', value: 4349.921,area:'Africa'},
              {name: 'Canada', value: 34126.24,area:'North America'},
              {name: 'Switzerland', value: 7830.534,area:'Europe'},
              {name: 'Chile', value: 17150.76,area:'South America'},
              {name: 'China', value: 1359821.465,area:'Asia'},
              {name: "Côte d'Ivoire", value: 60508.978,area:'Africa'},
              {name: 'Cameroon', value: 20624.343,area:'Africa'},
              {name: 'Dem. Rep. Congo', value: 62191.161,area:'Africa'},
              {name: 'Congo', value: 3573.024,area:'Africa'},
              {name: 'Colombia', value: 46444.798,area:'South America'},
              {name: 'Costa Rica', value: 4669.685,area:'North America'},
              {name: 'Cuba', value: 11281.768,area:'South America'},
              {name: 'Northern Cyprus', value: 1.468,area:'Asia'},
              {name: 'Cyprus', value: 1103.685,area:'Asia'},
              {name: 'Czech Rep.', value: 10553.701,area:'Europe'},
              {name: 'Germany', value: 83017.404,area:'Europe'},
              {name: 'Djibouti', value: 834.036,area:'Africa'},
              {name: 'Denmark', value: 5550.959,area:'Europe'},
              {name: 'Dominican Republic', value: 10016.797,area:'North America'},
              {name: 'Algeria', value: 37062.82,area:'Africa'},
              {name: 'Ecuador', value: 15001.072,area:'South America'},
              {name: 'Egypt', value: 78075.705,area:'Africa'},
              {name: 'Eritrea', value: 5741.159,area:'Africa'},
              {name: 'Spain', value: 46182.038,area:'Europe'},
              {name: 'Estonia', value: 1298.533,area:'Europe'},
              {name: 'Ethiopia', value: 87095.281,area:'Africa'},
              {name: 'Finland', value: 5367.693,area:'Europe'},
              {name: 'Fiji', value: 860.559,area:'Oceania'},
              {name: 'Falkland Islands', value: 49.581,area:'South America'},
              {name: 'France', value: 63230.866,area:'Europe'},
              {name: 'Gabon', value: 1556.222,area:'Africa'},
              {name: 'United Kingdom', value: 62066.35,area:'Europe'},
              {name: 'Georgia', value: 4388.674,area:'Asia'},
              {name: 'Ghana', value: 24262.901,area:'Africa'},
              {name: 'Guinea', value: 10876.033,area:'Africa'},
              {name: 'Gambia', value: 1680.64,area:'Africa'},
              {name: 'Guinea Bissau', value: 10876.033,area:'Africa'},
              {name: 'Eq. Guinea', value: 696.167,area:'Africa'},
              {name: 'Greece', value: 11109.999,area:'Europe'},
              {name: 'Greenland', value: 56.546,area:'North America'},
              {name: 'Guatemala', value: 14341.576,area:'North America'},
              {name: 'French Guiana', value: 231.169,area:'South America'},
              {name: 'Guyana', value: 786.126,area:'South America'},
              {name: 'Honduras', value: 7621.204,area:'South America'},
              {name: 'Croatia', value: 4338.027,area:'Europe'},
              {name: 'Haiti', value: 9896.4,area:'North America'},
              {name: 'Hungary', value: 10014.633,area:'Europe'},
              {name: 'Indonesia', value: 240676.485,area:'Asia'},
              {name: 'India', value: 12054.648,area:'Asia'},
              {name: 'Ireland', value: 4467.561,area:'Europe'},
              {name: 'Iran', value: 240676.485,area:'Asia'},
              {name: 'Iraq', value: 30962.38,area:'Asia'},
              {name: 'Iceland', value: 318.042,area:'Europe'},
              {name: 'Israel', value: 7420.368,area:'Asia'},
              {name: 'Italy', value: 60508.978,area:'Europe'},
              {name: 'Jamaica', value: 2741.485,area:'North America'},
              {name: 'Jordan', value: 6454.554,area:'Asia'},
              {name: 'Japan', value: 127352.833,area:'Asia'},
              {name: 'Kazakhstan', value: 15921.127,area:'Asia'},
              {name: 'Kenya', value: 40909.194,area:'Africa'},
              {name: 'Kyrgyzstan', value: 5334.223,area:'Asia'},
              {name: 'Cambodia', value: 14364.931,area:'Asia'},
              {name: 'Korea', value: 51452.352,area:'Asia'},
              {name: 'Kosovo', value: 97.743,area:'Europe'},
              {name: 'Kuwait', value: 2991.58,area:'Asia'},
              {name: 'Lao PDR', value: 6395.713,area:'Asia'},
              {name: 'Lebanon', value: 4341.092,area:'Asia'},
              {name: 'Liberia', value: 3957.99,area:'Africa'},
              {name: 'Libya', value: 6040.612,area:'Africa'},
              {name: 'Sri Lanka', value: 20758.779,area:'Asia'},
              {name: 'Lesotho', value: 2008.921,area:'Africa'},
              {name: 'Lithuania', value: 3068.457,area:'Europe'},
              {name: 'Luxembourg', value: 507.885,area:'Europe'},
              {name: 'Latvia', value: 2090.519,area:'Europe'},
              {name: 'Morocco', value: 31642.36,area:'Africa'},
              {name: 'Moldova', value: 103.619,area:'Europe'},
              {name: 'Madagascar', value: 21079.532,area:'Africa'},
              {name: 'Mexico', value: 117886.404,area:'North America'},
              {name: 'Macedonia', value: 507.885,area:'Europe'},
              {name: 'Mali', value: 13985.961,area:'Africa'},
              {name: 'Myanmar', value: 51931.231,area:'Asia'},
              {name: 'Montenegro', value: 620.078,area:'Europe'},
              {name: 'Mongolia', value: 2712.738,area:'Asia'},
              {name: 'Mozambique', value: 23967.265,area:'Africa'},
              {name: 'Mauritania', value: 3609.42,area:'Africa'},
              {name: 'Malawi', value: 15013.694,area:'Africa'},
              {name: 'Malaysia', value: 28275.835,area:'Asia'},
              {name: 'Namibia', value: 2178.967,area:'Africa'},
              {name: 'New Caledonia', value: 246.379,area:'Oceania'},
              {name: 'Niger', value: 15893.746,area:'Africa'},
              {name: 'Nigeria', value: 159707.78,area:'Africa'},
              {name: 'Nicaragua', value: 5822.209,area:'North America'},
              {name: 'Netherlands', value: 16615.243,area:'Europe'},
              {name: 'Norway', value: 4891.251,area:'Europe'},
              {name: 'Nepal', value: 26846.016,area:'Asia'},
              {name: 'New Zealand', value: 4368.136,area:'Oceania'},
              {name: 'Oman', value: 2802.768,area:'Asia'},
              {name: 'Pakistan', value: 173149.306,area:'Asia'},
              {name: 'Panama', value: 3678.128,area:'North America'},
              {name: 'Peru', value: 29262.83,area:'South America'},
              {name: 'Philippines', value: 93444.322,area:'Asia'},
              {name: 'Papua New Guinea', value: 6858.945,area:'Oceania'},
              {name: 'Poland', value: 38198.754,area:'Europe'},
              {name: 'Puerto Rico', value: 3709.671,area:'North America'},
              {name: "Dem. Rep. Korea", value: 1.468,area:'Asia'},
              {name: 'Portugal', value: 10589.792,area:'Europe'},
              {name: 'Paraguay', value: 6459.721,area:'South America'},
              {name: 'Qatar', value: 1749.713,area:'Asia'},
              {name: 'Romania', value: 21861.476,area:'Europe'},
              {name: 'Russia', value: 21861.476,area:'Asia'},
              {name: 'Rwanda', value: 10836.732,area:'Africa'},
              {name: 'W. Sahara', value: 514.648,area:'Africa'},
              {name: 'Saudi Arabia', value: 27258.387,area:'Asia'},
              {name: 'Sudan', value: 35652.002,area:'Africa'},
              {name: 'S. Sudan', value: 9940.929,area:'Africa'},
              {name: 'Senegal', value: 12950.564,area:'Africa'},
              {name: 'Solomon Islands', value: 526.447,area:'Oceania'},
              {name: 'Sierra Leone', value: 5751.976,area:'Africa'},
              {name: 'El Salvador', value: 6218.195,area:'North America'},
              {name: 'Somaliland', value: 9636.173,area:'Africa'},
              {name: 'Somalia', value: 9636.173,area:'Africa'},
              {name: 'Serbia', value: 3573.024,area:'Europe'},
              {name: 'Suriname', value: 524.96,area:'South America'},
              {name: 'Slovakia', value: 5433.437,area:'Europe'},
              {name: 'Slovenia', value: 2054.232,area:'Europe'},
              {name: 'Sweden', value: 9382.297,area:'Europe'},
              {name: 'Swaziland', value: 1193.148,area:'Africa'},
              {name: 'Syria', value: 7830.534,area:'Asia'},
              {name: 'Chad', value: 11720.781,area:'Africa'},
              {name: 'Togo', value: 6306.014,area:'Africa'},
              {name: 'Thailand', value: 66402.316,area:'Asia'},
              {name: 'Tajikistan', value: 7627.326,area:'Asia'},
              {name: 'Turkmenistan', value: 5041.995,area:'Asia'},
              {name: 'East Timor', value: 10016.797,area:'Asia'},
              {name: 'Trinidad and Tobago', value: 1328.095,area:'North America'},
              {name: 'Tunisia', value: 10631.83,area:'Africa'},
              {name: 'Turkey', value: 72137.546,area:'Asia'},
              {name: 'Tanzania', value: 44973.33,area:'Africa'},
              {name: 'Uganda', value: 33987.213,area:'Africa'},
              {name: 'Ukraine', value: 46050.22,area:'Europe'},
              {name: 'Uruguay', value: 3371.982,area:'South America'},
              {name: 'United States', value: 312247.116,area:'North America'},
              {name: 'Uzbekistan', value: 27769.27,area:'Asia'},
              {name: 'Venezuela', value: 236.299,area:'South America'},
              {name: 'Vietnam', value: 89047.397,area:'Asia'},
              {name: 'Vanuatu', value: 236.299,area:'Oceania'},
              {name: 'West Bank', value: 13.565,area:'Asia'},
              {name: 'Yemen', value: 22763.008,area:'Asia'},
              {name: 'South Africa', value: 51452.352,area:'Africa'},
              {name: 'Zambia', value: 13216.985,area:'Africa'},
              {name: 'Zimbabwe', value: 13076.978,area:'Africa'}
            ];
        var Gradient = new Array(3);
        var A = this.color2rgb(ColorA);
        var B = this.color2rgb(ColorB);
        var C = this.color2rgb(ColorC);
        /*
        for (var N = 0; N < coldata.length; N++){
          if (coldata[N].value < 700000) {
              for (var c = 0; c < 3; c++) // RGB通道分别进行计算   
              { Gradient[c] = A[c] + (B[c] - A[c]) / 700000 * coldata[N].value; }
          }
          else {
              for (var c = 0; c < 3; c++) // RGB通道分别进行计算   
              { Gradient[c] = B[c] + (C[c] - B[c]) / 700000 * (coldata[N].value-700000); }
          }               
          coldata[N]["itemStyle"] = {
              normal: {
                  areaColor: this.rgb2color(Gradient)
              }
          }
        }
        */
        //对各个国家根据所属的洲增加颜色
        var coldata = [];
        for(var n = 0; n < coldatarow.length; n++) {
          var item = {};
          item.name = coldatarow[n].name;
          item['itemStyle'] = {
              normal: {
                  areaColor: areaColor[coldatarow[n].area]
              }
          };
          coldata.push(item);
        }

        //世界地图显示各个国家
        /*
        series.push({
            type: 'map',
            mapType: 'world',
            // zoom: 1.2,
            mapLocation: {
              y: 100
            },
            data: [
              {name: 'Afghanistan', value: 28397.812},
              {name: 'Angola', value: 19549.124},
              {name: 'Albania', value: 3150.143},
              {name: 'United Arab Emirates', value: 8441.537},
              {name: 'Argentina', value: 40374.224},
              {name: 'Armenia', value: 2963.496},
              {name: 'French Southern and Antarctic Lands', value: 268.065},
              {name: 'Australia', value: 22404.488},
              {name: 'Austria', value: 8401.924},
              {name: 'Azerbaijan', value: 9094.718},
              {name: 'Burundi', value: 9232.753},
              {name: 'Belgium', value: 10941.288},
              {name: 'Benin', value: 9509.798},
              {name: 'Burkina Faso', value: 15540.284},
              {name: 'Bangladesh', value: 151125.475},
              {name: 'Bulgaria', value: 7389.175},
              {name: 'The Bahamas', value: 66402.316},
              {name: 'Bosnia and Herzegovina', value: 3845.929},
              {name: 'Belarus', value: 9491.07},
              {name: 'Belize', value: 308.595},
              {name: 'Bermuda', value: 64.951},
              {name: 'Bolivia', value: 716.939},
              {name: 'Brazil', value: 195210.154},
              {name: 'Brunei', value: 27.223},
              {name: 'Bhutan', value: 716.939},
              {name: 'Botswana', value: 1969.341},
              {name: 'Central African Republic', value: 4349.921},
              {name: 'Canada', value: 34126.24},
              {name: 'Switzerland', value: 7830.534},
              {name: 'Chile', value: 17150.76},
              {name: 'China', value: 1359821.465},
              {name: 'Ivory Coast', value: 60508.978},
              {name: 'Cameroon', value: 20624.343},
              {name: 'Democratic Republic of the Congo', value: 62191.161},
              {name: 'Republic of the Congo', value: 3573.024},
              {name: 'Colombia', value: 46444.798},
              {name: 'Costa Rica', value: 4669.685},
              {name: 'Cuba', value: 11281.768},
              {name: 'Northern Cyprus', value: 1.468},
              {name: 'Cyprus', value: 1103.685},
              {name: 'Czech Republic', value: 10553.701},
              {name: 'Germany', value: 83017.404},
              {name: 'Djibouti', value: 834.036},
              {name: 'Denmark', value: 5550.959},
              {name: 'Dominican Republic', value: 10016.797},
              {name: 'Algeria', value: 37062.82},
              {name: 'Ecuador', value: 15001.072},
              {name: 'Egypt', value: 78075.705},
              {name: 'Eritrea', value: 5741.159},
              {name: 'Spain', value: 46182.038},
              {name: 'Estonia', value: 1298.533},
              {name: 'Ethiopia', value: 87095.281},
              {name: 'Finland', value: 5367.693},
              {name: 'Fiji', value: 860.559},
              {name: 'Falkland Islands', value: 49.581},
              {name: 'France', value: 63230.866},
              {name: 'Gabon', value: 1556.222},
              {name: 'United Kingdom', value: 62066.35},
              {name: 'Georgia', value: 4388.674},
              {name: 'Ghana', value: 24262.901},
              {name: 'Guinea', value: 10876.033},
              {name: 'Gambia', value: 1680.64},
              {name: 'Guinea Bissau', value: 10876.033},
              {name: 'Equatorial Guinea', value: 696.167},
              {name: 'Greece', value: 11109.999},
              {name: 'Greenland', value: 56.546},
              {name: 'Guatemala', value: 14341.576},
              {name: 'French Guiana', value: 231.169},
              {name: 'Guyana', value: 786.126},
              {name: 'Honduras', value: 7621.204},
              {name: 'Croatia', value: 4338.027},
              {name: 'Haiti', value: 9896.4},
              {name: 'Hungary', value: 10014.633},
              {name: 'Indonesia', value: 240676.485},
              {name: 'India', value: 12054.648},
              {name: 'Ireland', value: 4467.561},
              {name: 'Iran', value: 240676.485},
              {name: 'Iraq', value: 30962.38},
              {name: 'Iceland', value: 318.042},
              {name: 'Israel', value: 7420.368},
              {name: 'Italy', value: 60508.978},
              {name: 'Jamaica', value: 2741.485},
              {name: 'Jordan', value: 6454.554},
              {name: 'Japan', value: 127352.833},
              {name: 'Kazakhstan', value: 15921.127},
              {name: 'Kenya', value: 40909.194},
              {name: 'Kyrgyzstan', value: 5334.223},
              {name: 'Cambodia', value: 14364.931},
              {name: 'South Korea', value: 51452.352},
              {name: 'Kosovo', value: 97.743},
              {name: 'Kuwait', value: 2991.58},
              {name: 'Laos', value: 6395.713},
              {name: 'Lebanon', value: 4341.092},
              {name: 'Liberia', value: 3957.99},
              {name: 'Libya', value: 6040.612},
              {name: 'Sri Lanka', value: 20758.779},
              {name: 'Lesotho', value: 2008.921},
              {name: 'Lithuania', value: 3068.457},
              {name: 'Luxembourg', value: 507.885},
              {name: 'Latvia', value: 2090.519},
              {name: 'Morocco', value: 31642.36},
              {name: 'Moldova', value: 103.619},
              {name: 'Madagascar', value: 21079.532},
              {name: 'Mexico', value: 117886.404},
              {name: 'Macedonia', value: 507.885},
              {name: 'Mali', value: 13985.961},
              {name: 'Myanmar', value: 51931.231},
              {name: 'Montenegro', value: 620.078},
              {name: 'Mongolia', value: 2712.738},
              {name: 'Mozambique', value: 23967.265},
              {name: 'Mauritania', value: 3609.42},
              {name: 'Malawi', value: 15013.694},
              {name: 'Malaysia', value: 28275.835},
              {name: 'Namibia', value: 2178.967},
              {name: 'New Caledonia', value: 246.379},
              {name: 'Niger', value: 15893.746},
              {name: 'Nigeria', value: 159707.78},
              {name: 'Nicaragua', value: 5822.209},
              {name: 'Netherlands', value: 16615.243},
              {name: 'Norway', value: 4891.251},
              {name: 'Nepal', value: 26846.016},
              {name: 'New Zealand', value: 4368.136},
              {name: 'Oman', value: 2802.768},
              {name: 'Pakistan', value: 173149.306},
              {name: 'Panama', value: 3678.128},
              {name: 'Peru', value: 29262.83},
              {name: 'Philippines', value: 93444.322},
              {name: 'Papua New Guinea', value: 6858.945},
              {name: 'Poland', value: 38198.754},
              {name: 'Puerto Rico', value: 3709.671},
              {name: 'North Korea', value: 1.468},
              {name: 'Portugal', value: 10589.792},
              {name: 'Paraguay', value: 6459.721},
              {name: 'Qatar', value: 1749.713},
              {name: 'Romania', value: 21861.476},
              {name: 'Russia', value: 21861.476},
              {name: 'Rwanda', value: 10836.732},
              {name: 'Western Sahara', value: 514.648},
              {name: 'Saudi Arabia', value: 27258.387},
              {name: 'Sudan', value: 35652.002},
              {name: 'South Sudan', value: 9940.929},
              {name: 'Senegal', value: 12950.564},
              {name: 'Solomon Islands', value: 526.447},
              {name: 'Sierra Leone', value: 5751.976},
              {name: 'El Salvador', value: 6218.195},
              {name: 'Somaliland', value: 9636.173},
              {name: 'Somalia', value: 9636.173},
              {name: 'Republic of Serbia', value: 3573.024},
              {name: 'Suriname', value: 524.96},
              {name: 'Slovakia', value: 5433.437},
              {name: 'Slovenia', value: 2054.232},
              {name: 'Sweden', value: 9382.297},
              {name: 'Swaziland', value: 1193.148},
              {name: 'Syria', value: 7830.534},
              {name: 'Chad', value: 11720.781},
              {name: 'Togo', value: 6306.014},
              {name: 'Thailand', value: 66402.316},
              {name: 'Tajikistan', value: 7627.326},
              {name: 'Turkmenistan', value: 5041.995},
              {name: 'East Timor', value: 10016.797},
              {name: 'Trinidad and Tobago', value: 1328.095},
              {name: 'Tunisia', value: 10631.83},
              {name: 'Turkey', value: 72137.546},
              {name: 'United Republic of Tanzania', value: 44973.33},
              {name: 'Uganda', value: 33987.213},
              {name: 'Ukraine', value: 46050.22},
              {name: 'Uruguay', value: 3371.982},
              {name: 'United States of America', value: 312247.116},
              {name: 'Uzbekistan', value: 27769.27},
              {name: 'Venezuela', value: 236.299},
              {name: 'Vietnam', value: 89047.397},
              {name: 'Vanuatu', value: 236.299},
              {name: 'West Bank', value: 13.565},
              {name: 'Yemen', value: 22763.008},
              {name: 'South Africa', value: 51452.352},
              {name: 'Zambia', value: 13216.985},
              {name: 'Zimbabwe', value: 13076.978}
            ],
            symbolSize: 12,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {        // 每个区域的样式 
                normal: {
                    areaColor: '#323c48'
                },
                //没用的代码
                emphasis: {
                    areaColor: '#5c8ce6'
                }
            },
            regions: [{        // 选中的区域
                name: 'China',
                selected: true,
                itemStyle: {   // 高亮时候的样式
                    emphasis: {
                        areaColor: '#5c8ce6'
                    }
                },
                label: {    // 高亮的时候不显示标签
                    emphasis: {
                        show: false
                    }
                }
            }],
            roam: true
        })
        */
        series.push({
            // 散点效果
            type: 'effectScatter',         
            coordinateSystem: 'geo',       // 表示使用的坐标系为地理坐标系
            zlevel: 3,
            rippleEffect: {
                brushType: 'stroke'        // 波纹绘制效果
            },
            label: {
                normal: {                  // 默认的文本标签显示样式
                    show: true,
                    position: 'left',      // 标签显示的位置
                    formatter: '{b}',       // 标签内容格式器
                    fontSize: 15,
                    backgroundColor: 'rgba(108,110,111,1)',
                    color: '#fff',
                }
            },
            itemStyle: {
                normal: {
                    //color: 'rgba(147, 235, 248, 1)'
                    color: '#ff473d'  //锚点的颜色
                    // color: '#3a8ee6'
                }
            },
            data: NNData.map(function(dataItem) {
                return {
                    name: '  ' + dataItem.fullName + '   ',
                    value: [dataItem.pointx,dataItem.pointy],  // 起点的位置
                    symbolSize: 150 / 8,  // 散点的大小，通过之前设置的权重来计算，val的值来自data返回的value
                    version: dataItem.version
                };
            }),
        });

        // 把配置和数据放这里
        this.chart.setOption({
          backgroundColor: "#f5faff",
          title: {
            // text: '在线设备分布',
            left: '40%',
            top: '0px',
            textStyle: {
              color: '#fff',
              opacity: 0.7
            }
          },
          tooltip: {
            trigger: 'item',
            confine: true,
            triggerOn: 'mousemove',
            formatter: function(params,ticket,callback){
              // console.log(params);
              /*
                params.marker.getElementByTagName('span')[0].addEventListener('click',function(params){
                     console.log(mapVersion[params.name]);
                });
                */
                // console.log(params);
                if(params.name) {
                    //return 'Version: ' + params.name
                    return '';
                } else {
                    return '';
                }
            }
          },
        
          geo: {
            map: 'world',
            label: {
              emphasis: {
                show: false,
                areaColor: '#eee'  
              }
            },
            roam: 'move',  //缩放
            // scaleLimit:{min:1,max:4}, //缩放限制
            zoom: zoomVal,
            silent: true,
            itemStyle: {        // 每个区域的样式 
                normal: {
                    // areaColor: 'black',
                    borderColor: '#fff',
                    borderWidth: 0.5,
                    areaColor: '#74b1ed' //默认的地区颜色
                },
            },
            //使用region对每个区域绘制颜色
            regions:coldata
          },
          series: series
        });


        window.onresize = echarts.init(this.$refs.myEchart).resize;

        //给map添加点击事件的监听
        let _me = this;
        this.chart.on('click',function(params) {
        console.log(params);
          if (params.name) {
            //console.log(this.$router);
          _me.$router.push({name: 'version',query: { versionName: _me.fullNameMap[params.name.trim() ]}})
          }
        });
        
        // this.chart.on('georoam', function (params) {
        //   console.log(params);
        //   if(params.zoom) {
        //     _this.$emit('changeGeoroam',params.zoom);
        //   }
        // });
 
      }
    },
    watch: {
      'zoom':function(oldcval,newval) {
        this.initChart(this.zoom);
      }
    }
  }
</script>