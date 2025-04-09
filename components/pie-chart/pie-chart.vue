<template>
  <view class="charts-box">
    <qiun-data-charts
      type="ring"
      ref="chartRef"
      :opts="opts"
      :chartData="uChartsData"
    />
  </view>
</template>

<script>
export default {
  props: {
    reshow: {
      type: Boolean,
      default: true,
    },
    chartColor: {
      type: Array,
      default: () => ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
    },
    centerData: {
      type: String,
      default: 0,
    },
    chartData: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    chartData: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
  },
  computed: {
    uChartsData() {
      this.updateChart();
      console.log(this.chartData);
      return {
        series: [
          {
            data: JSON.parse(JSON.stringify(this.chartData)),
          },
        ],
      };
    },
    opts() {
      return {
        rotate: false,
        rotateLock: false,
        color: this.chartColor,
        padding: [2, 2, 2, 2],
        dataLabel: true,
        update: true,
        enableScroll: false,
        legend: {
          show: false,
          position: "right",
          lineHeight: 25,
        },
        title: {
          // name: this.centerData,
          fontSize: 18,
          color: "#333",
          fontWeight: "bold",
        },
        subtitle: {
          name: "度",
          fontSize: 14,
          color: "#b5b3b6",
        },
        extra: {
          ring: {
            ringWidth: 20,
            activeOpacity: 0.5,
            customRadius: 60,
            activeRadius: 6,
            offsetAngle: 0,
            labelWidth: 15,
            border: true,
            borderWidth: 3,
            borderColor: "#FFFFFF",
          },
        },
      };
    },
  },
  mounted() {
    // this.getServerData();
  },
  methods: {
    updateChart() {
      const chartInstance = this.$refs.chartRef; // 需要给组件添加ref="chartRef"
      if (chartInstance && chartInstance.updateData) {
        chartInstance.updateData(this.uChartsData);
      }
    },
    getServerData() {
      //模拟从服务器获取数据时的延时
      setTimeout(() => {
        //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
        let res = {
          series: [
            {
              data: [
                { name: "一班", value: 50, labelShow: false },
                { name: "二班", value: 30, labelShow: false },
              ],
            },
          ],
        };
        this.chartData = JSON.parse(JSON.stringify(res));
      }, 500);
    },
  },
};
</script>

<style scoped>
/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
.charts-box {
  width: 100%;
  height: 300px;
}
</style>
