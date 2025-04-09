<template>
  <div class="echarts-container">
    <div ref="chartDom" class="chart" :style="{ height: chartHeight }"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "FixedTimeLineChart",
  props: {
    chartHeight: {
      type: String,
      default: "500px",
    },
    showArea: {
      type: Boolean,
      default: true,
    },
    colors: {
      type: Array,
      default: function () {
        return ["#FF6384", "#36A2EB", "#FFCE56"];
      },
    },
    yData: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      chartInstance: null,
      resizeObserver: null,
    };
  },
  methods: {
    initChart() {
      if (!this.$refs.chartDom) return;

      if (this.chartInstance) {
        this.chartInstance.dispose();
      }

      this.chartInstance = echarts.init(this.$refs.chartDom);
      const xData =
        this.yData.length > 0 ? this.yData[0].map((item) => item.time) : [];
      const option = {
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            console.log(params);
            return params.map((p) => `${p.seriesName}: ${p.data}`).join("/");
          },
        },
        legend: {
          data: ["光伏发电功率", "电网功率", "负载用电功率"], // 更新为所有三条线的名称
          top: 10,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: xData,
          axisLabel: {
            interval: "auto",
          },
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        series: [
          {
            name: "光伏发电功率",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            lineStyle: {
              color: this.colors[0],
              width: 3,
            },
            areaStyle: this.showArea
              ? {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: this.hexToRgba(this.colors[0], 0.3) },
                    { offset: 1, color: this.hexToRgba(this.colors[0], 0) },
                  ]),
                }
              : undefined,
            data: this.yData[0].map((item) => item.value),
          },
          {
            name: "电网功率",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            lineStyle: {
              color: this.colors[1],
              width: 3,
            },
            areaStyle: this.showArea
              ? {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: this.hexToRgba(this.colors[1], 0.3) },
                    { offset: 1, color: this.hexToRgba(this.colors[1], 0) },
                  ]),
                }
              : undefined,
            data: this.yData[1].map((item) => item.value),
          },
          {
            name: "负载用电功率",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            lineStyle: {
              color: this.colors[2],
              width: 3,
            },
            areaStyle: this.showArea
              ? {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: this.hexToRgba(this.colors[2], 0.3) },
                    { offset: 1, color: this.hexToRgba(this.colors[2], 0) },
                  ]),
                }
              : undefined,
            data: this.yData[2].map((item) => item.value),
          },
        ],
      };

      this.chartInstance.setOption(option);
      this.setupResizeHandler();
    },
    hexToRgba(hex, opacity = 1) {
      if (!hex || typeof hex !== "string") return "rgba(0,0,0,1)";
      const fullHex =
        hex.length === 4
          ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
          : hex;
      const r = parseInt(fullHex.slice(1, 3), 16);
      const g = parseInt(fullHex.slice(3, 5), 16);
      const b = parseInt(fullHex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    setupResizeHandler() {
      if (typeof ResizeObserver !== "undefined") {
        this.resizeObserver = new ResizeObserver(() => {
          this.chartInstance && this.chartInstance.resize();
        });
        this.resizeObserver.observe(this.$refs.chartDom);
      } else {
        window.addEventListener("resize", this.handleResize);
      }
    },
    handleResize() {
      this.chartInstance && this.chartInstance.resize();
    },
    cleanupResizeHandler() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", this.handleResize);
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    this.cleanupResizeHandler();
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
  watch: {
    colors: {
      handler() {
        this.initChart();
      },
      deep: true,
    },
    showArea() {
      this.initChart();
    },
  },
};
</script>

<style scoped>
.echarts-container {
  width: 100%;
  position: relative;
}
.chart {
  width: 100%;
  min-height: 300px;
}
</style>
