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
        mapList: []
      };
    },
    mounted() {
      mapInfo().then((res) => {
            // console.log(res);
            this.mapList = res;
            this.$nextTick(() => {
              this.initChart();
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

      }
    }
  }
</script>