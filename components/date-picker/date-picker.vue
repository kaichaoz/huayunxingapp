<template>
  <view class="date-picker">
    <view class="data-content">
      <!-- 左箭头（前一天） -->
      <view class="arrow" @click="changeDate(-1)">
        <uni-icons type="left" size="25"></uni-icons>
      </view>

      <!-- 中间日期（点击弹出选择器） -->
      <view class="current-date" @click="showDatePicker">
        {{ formattedDate }}<view class="down-triangle"></view>
      </view>

      <!-- 右箭头（后一天） -->
      <view class="arrow" @click="changeDate(1)">
        <uni-icons type="right" size="25"></uni-icons>
      </view>
    </view>
    <!-- 日期选择器（默认隐藏） -->
    <uni-calendar
      :date="formattedDate"
      @confirm="onDateConfirm"
      :clear-date="true"
      :insert="false"
      ref="calendar"
    />
  </view>
</template>
<script>
export default {
  data() {
    return {
      currentDate: new Date(), // 当前日期
    };
  },
  computed: {
    // 格式化日期（如 "2024/03/15"）
    formattedDate() {
      const year = this.currentDate.getFullYear();
      const month = String(this.currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(this.currentDate.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },
  methods: {
    // 切换日期（offset: -1=前一天，1=后一天）
    changeDate(offset) {
      const newDate = new Date(this.currentDate);
      newDate.setDate(newDate.getDate() + offset);
      this.currentDate = newDate;
      this.$emit("date-change", this.formattedDate); // 通知父组件
    },

    // 显示日期选择器
    showDatePicker() {
      this.$refs.calendar.open();
    },

    // 选择日期后的回调
    onDateConfirm(e) {
      this.currentDate = new Date(e.fulldate);
      this.$emit("date-change", this.formattedDate); // 通知父组件
    },
  },
};
</script>
<style lang="scss" scoped>
.date-picker {
  .data-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }
}

.arrow {
  font-size: 20px;
  cursor: pointer;
}

.current-date {
  font-size: 18px;
  cursor: pointer;
  font-weight: bold;
}
.down-triangle {
  width: 0;
  height: 0;
  border-left: 8px solid transparent; /* 左边框透明 */
  border-right: 8px solid transparent; /* 右边框透明 */
  border-top: 8px solid #333; /* 上边框显示颜色（形成向下箭头） */
  display: inline-block;
  margin-left: 10px;
  vertical-align: top;
  margin-top: 8px;
}
</style>
