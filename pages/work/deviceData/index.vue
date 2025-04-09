<template>
  <view class="deviceData">
    <date-picker @date-change="handleDateChange" />
    <view class="title"
      >发电量<uni-icons
        type="info"
        size="18"
        color="#A0A0A0"
        class="icon"
      ></uni-icons
    ></view>
    <view class="chartBox">
      <view class="chartLeft" @click="handleClick(0)">
        <view class="pieNumber"
          ><span>{{ pieData1[0].value }}</span
          >度</view
        >
        <p>自发自用</p>
        <p>({{ pieData1[0].percentage }}%)</p>
      </view>
      <div class="round"></div>
      <pie-chart
        class="chartContent"
        chart-height="200px"
        :chart-data="pieData1"
        canvas-id="pieData1"
        :chart-color="chartColor1"
        :center-data="centerData1"
        :reshow="reshow1"
      />
      <view class="chartLeft chartRight" @click="handleClick(1)"
        ><view class="pieNumber"
          ><span>{{ pieData1[1].value }}</span
          >度</view
        >
        <p>上网电量</p>
        <p>({{ pieData1[1].percentage }}%)</p></view
      >
    </view>

    <view class="title"
      >用电量<uni-icons
        type="info"
        size="18"
        color="#A0A0A0"
        class="icon"
      ></uni-icons
    ></view>
    <view class="chartBox">
      <view class="chartLeft"
        ><view class="pieNumber"
          ><span style="color: #f58809">{{ pieData2[0].value }}</span
          >度</view
        >
        <p>自给自足</p>
        <p>({{ pieData2[0].percentage }}%)</p></view
      >
      <div class="round"></div>

      <!-- <pie-chart
        class="chartContent"
        chart-height="200px"
        :chart-data="pieData2"
        :chart-color="chartColor2"
        canvas-id="pieData2"
        :center-data="centerData2"
        :reshow="reshow2"
      /> -->
      <view class="chartLeft chartRight"
        ><view class="pieNumber"
          ><span style="color: #ffd58d">{{ pieData2[1].value }}</span
          >度</view
        >
        <p>购买电量</p>
        <p>({{ pieData2[1].percentage }}%)</p></view
      >
    </view>
    <!-- 趋势图 -->
    <view class="lineChart">
      <qiun-data-charts
        type="line"
        :opts="lineOpts"
        :chartData="lineChartData"
        :ontouch="true"
      />

      <!-- <LineChart
        :colors="['#FF9F40', '#4BC0C0', '#90e86a']"
        chart-height="600px"
        :yData="lineChartData"
      /> -->
    </view>
  </view>
</template>

<script>
import DatePicker from "@/components/date-picker/date-picker.vue";
import PieChart from "@/components/pie-chart/pie-chart.vue";
import LineChart from "@/components/line-chart/line-chart.vue";
// import ChartBox from "@/components/chart-box/chart-box.vue"; // 新增组件
import {
  getPowerUsage,
  getPowerGeneration,
  getPowerTrend,
} from "@/api/system/inverter_device_data.js";

export default {
  components: { DatePicker, PieChart, LineChart },
  data() {
    return {
		date: null,
      reshow1: false,
      reshow2: false,

      pieData1: [
        { value: 0.0, name: "自发自用", labelShow: false },
        { value: 0.0, name: "上网电量", labelShow: false },
      ],
      pieData2: [
        { value: 0.0, name: "自给自足", labelShow: false },
        { value: 0.0, name: "购买电量", labelShow: false },
      ],
      chartColor1: ["#1AAB70", "#67B943"],
      chartColor2: ["#F58809", "#FFD58D"],
      deviceInfo: {
        deviceCode: "",
        deviceName: "",
        deviceStatus: 0,
        deviceType: "",
        address: "",
        deptId: "",
        id: "",
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: undefined,
        deviceId: undefined,
        deviceName: undefined,
        deviceCode: undefined,
      },
      lineChartData: {}, // 新增：趋势图数据
      dateRange: [],
      centerData1: "",
      centerData2: "",
      lineOpts: {
        dataLabel: false,
        dataPointShape: false,
        color: this.colors,
        padding: [15, 10, 0, 15],
        enableScroll: true,
        legend: {},
        xAxis: {
          disableGrid: true,
          // scrollShow: true,
          rotateLabel: true,
          marginTop: 10,
          labelCount: 10,
          itemCount: 994,
        },
        yAxis: {
          gridType: "dash",
          dashLength: 2,
        },
        extra: {
          line: {
            type: "straight",
            width: 2,
            activeType: "hollow",
          },
        },
      },
    };
  },
  onLoad(options) {
        this.deviceInfo = JSON.parse(decodeURIComponent(options.deviceInfo));
        console.log(this.deviceInfo);
		this.date = new Date();
		const year = this.date.getFullYear();
		const month = String(this.date.getMonth() + 1).padStart(2, "0");
		const day = String(this.date.getDate()).padStart(2, "0");
		this.date = `${year}-${month}-${day}`;
		this.dateRange[0] = this.date;
		this.dateRange[1] = this.date;
		this.queryParams.deviceCode = this.deviceInfo.deviceCode;
		this.queryParams.deviceId = this.deviceInfo.id;
		this.queryParams = this.addDateRange(this.queryParams, this.dateRange);
		console.log("queryParams",this.queryParams);
  },
  created() {
 // 初始化时获取趋势图数据
 this.getPowerUsageData();
 this.getPowerGenerationData();
 this.fetchLineChartData();
  },
  methods: {
    handleClick(num) {
      console.log(123);
      this.centerData1 = this.pieData1[num]?.value;
    },
    handleDateChange(date) {
      this.dateRange[0] = date;
      this.dateRange[1] = date;
      // 处理日期变化
      this.queryParams = this.addDateRange(this.queryParams, this.dateRange);
      console.log(this.queryParams);
      this.reshow1 = false;
      this.reshow2 = false;
      this.getPowerUsageData();
      this.getPowerGenerationData();
      this.fetchLineChartData();
    },
    // 获取上网电量
    async getPowerUsageData() {
      const res = await getPowerUsage(this.queryParams);
      if (res.data.length > 0) {
        // 求和
        const num = res.data.reduce((sum, val) => sum + parseFloat(val), 0);
        // 处理数据
        const data = this.pieData1.map((item, index) => {
          item.value = res.data[index];
          item.percentage = (res.data[index] / num) * 100;
          return item;
        });
        this.pieData1 = data;
        this.centerData1 = data[0]?.value;
        this.reshow1 = true;
      }
    },
    // 获取购买电量
    async getPowerGenerationData() {
      const res = await getPowerGeneration(this.queryParams);
      if (res.data.length > 0) {
        // 求和
        const num = res.data.reduce((sum, val) => sum + parseFloat(val), 0);
        // 处理数据
        const data = this.pieData2.map((item, index) => {
          item.value = res.data[index];
          item.percentage = (res.data[index] / num) * 100;
          return item;
        });
        this.pieData2 = data;
        this.centerData2 = data[0]?.value;
        this.reshow2 = true;
      }
    },
    async fetchLineChartData() {
      const res = await getPowerTrend(this.queryParams);
      if (res.code == 200) {
        const categories = res.data[0].map((item) => item.time) || [];
        const series = [
          {
            name: "光伏发电功率",
            data: res.data[0].map((item) => item.value) || [],
          },
          {
            name: "电网功率",
            data: res.data[1].map((item) => item.value) || [],
          },
          {
            name: "负载用电功率",
            data: res.data[2].map((item) => item.value) || [],
          },
        ];
        this.lineChartData = {
          categories: categories,
          series: series,
        };
      }
    },

    addDateRange(params, dateRange, propName) {
      let search = params;
      search.params =
        typeof search.params === "object" &&
        search.params !== null &&
        !Array.isArray(search.params)
          ? search.params
          : {};
      dateRange = Array.isArray(dateRange) ? dateRange : [];
      if (typeof propName === "undefined") {
        search.params["beginTime"] = dateRange[0];
        search.params["endTime"] = dateRange[1];
      } else {
        search.params["begin" + propName] = dateRange[0];
        search.params["end" + propName] = dateRange[1];
      }
      return search;
    },
  },
};
</script>

<style lang="scss" scoped>
.deviceData {
  background: #ffffff;
  text-align: center;
  min-height: 100vh;
  padding: 20px 4%;
  .chartBox {
    width: 100%;
    background: rgba(246, 246, 249);
    margin: 40px auto 0;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 15px 20px;
    .round {
      position: absolute;
      background-color: #fff;
      width: 130px;
      height: 130px;
      border-radius: 50%;
      left: 50%;
      transform: translateX(-50%);
    }
    .chartContent {
      position: absolute;
      top: 0%;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    }
    .chartLeft {
      .pieNumber {
        color: #b5b3b6;
        font-size: 14px;
        span {
          color: #1aab70;
          font-size: 18px;
          margin-right: 3px;
          font-weight: bold;
        }
      }
      p {
        color: #797779;
        font-size: 14px;
      }
    }
    .chartRight {
      .pieNumber {
        span {
          color: #67b943;
        }
      }
    }
  }
  .title {
    color: #676767;
    font-size: 16px;
    margin: 30px 0;
    text-align: left;
    margin-left: 4%;
  }
  .icon {
    margin-top: 2px;
    vertical-align: top;
    display: inline-block;
  }
  .lineChart {
    margin-top: 80px;
  }
}
</style>
