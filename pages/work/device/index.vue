<template>
  <view class="device">
<!--    <view class="inputBox">
      设备编码: <uni-easyinput v-model="deviceInfo.deviceCode" placeholder="请输入" />
      <button type="primary" size="mini" @click="add">新增</button>
    </view>
    <view class="inputBox">
      设备名称: <uni-easyinput v-model="deviceInfo.deviceName" placeholder="请输入" />
      <button type="primary" size="mini" @click="search()">查询</button>
    </view> -->
    <view class="uni-container">
      <uni-table
        ref="table"
        :loading="loading"
        border
        stripe
        emptyText="暂无更多数据"
      >
        <uni-tr>
          <uni-th width="40" align="center">序号</uni-th>
          <uni-th width="100" align="center">名称</uni-th>
          <uni-th width="100" align="center">编号</uni-th>
          <uni-th width="100" align="center">状态</uni-th>
          <uni-th width="50" align="center">操作</uni-th>
        </uni-tr>
        <uni-tr v-for="(item, index) in tableData" :key="index">
          <uni-td align="center">{{ index + 1 }}</uni-td>
          <uni-td>
            <view class="name">{{ item.deviceName }}</view>
          </uni-td>
          <uni-td>{{ item.deviceCode }}</uni-td>
          <uni-td>
            <view class="name">
				    <span v-if="item.deviceStatus === 0">在线</span>
				    <span v-else-if="item.deviceStatus === 1">离线</span>
				    <span v-else>异常</span>
			</view>
          </uni-td>
          <uni-td>
            <view class="tableButton" @click="check(item)">详情</view>
			<view class="tableButton" @click="handleDetail(item)">数据</view>
          </uni-td>
        </uni-tr>
      </uni-table>
      <view class="uni-pagination-box"
        ><uni-pagination
          :page-size="pageSize"
          :current="pageCurrent"
          :total="total"
          @change="change"
      /></view>
    </view>
  </view>
</template>

<script>
import {listDevice_info,} from "@/api/system/deviceInfo.js"
export default {
  dicts: ['device_type','device_status'],
  data() {
    return {
      deviceInfo: {
        deviceCode: "",
        deviceName: "",
        deviceStatus: 0,
		deviceType:"",
        address: "",
		deptId:"",
		id:"",
      },
      searchVal: "",
      tableData: [],
      // 每页数据量
      pageSize: 10,
      // 当前页
      pageCurrent: 1,
      // 数据总量
      total: 0,
      loading: false,
    };
  },
  onLoad() {
    this.getData(1);
  },
  methods: {
    add() {
 this.$tab.navigateTo("/pages/work/deviceAdd/index");
    },
	check(item){
		const deviceInfoStr = JSON.stringify(item);
		uni.navigateTo({
		  url: `/pages/work/deviceAdd/index?deviceInfo=${encodeURIComponent(deviceInfoStr)}`
	  });},
    handleDetail(item) {
		const deviceInfoStr = JSON.stringify(item);
      uni.navigateTo({
		  url:`/pages/work/deviceData/index?deviceInfo=${encodeURIComponent(deviceInfoStr)}`
	  });
    },
    // 分页触发
    change(e) {
      this.getData(e.current);
    },
    // 搜索
    search() {
      this.getData(1, this.deviceInfo);
    },
    // 获取数据
    getData(pageCurrent) {
      this.loading = true;
      this.pageCurrent = pageCurrent;
		listDevice_info({
        pageSize: this.pageSize,
        pageCurrent: pageCurrent,
        deviceCode: this.deviceInfo.deviceCode,
		deviceName: this.deviceInfo.deviceName
      }).then(res =>{
		  this.tableData = res.rows;
		  this.total = res.total;
		  this.loading = false;
	  });
    },
    // 伪request请求
    request(options) {
      const { pageSize, pageCurrent, success, value } = options;
      let total = tableData.length;
      let data = tableData.filter((item, index) => {
        const idx = index - (pageCurrent - 1) * pageSize;
        return idx < pageSize && idx >= 0;
      });
      if (value) {
        data = [];
        tableData.forEach((item) => {
          if (item.name.indexOf(value) !== -1) {
            data.push(item);
          }
        });
        total = data.length;
      }

      setTimeout(() => {
        typeof success === "function" &&
          success({
            data: data,
            total: total,
          });
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.device {
  background: #ffffff;
  text-align: center;
  min-height: 100vh;
  padding: 20px 4%;
  .inputBox {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0 auto 20px;
  }
  .uni-easyinput {
    margin: 0 10px;
  }
  .uni-easyinput__content-input {
    font-size: 16px;
  }
  .tableButton {
    color: #4095e5;
    text-decoration: underline;
  }
  .uni-pagination-box {
    margin-top: 20px;
  }
  .uni-table-tr:nth-child(2n + 3) {
    background-color: #f2f2f2;
  }
  .uni-table-th {
    background-color: #f2f2f2;
    color: #101010;
  }
}
</style>
