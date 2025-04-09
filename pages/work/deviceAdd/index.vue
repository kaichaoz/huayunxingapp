<template>
  <view class="deviceAdd">
    <view class="inputBox">
      设备编码:
      <uni-easyinput
        v-model="deviceInfo.deviceCode"
        placeholder="请输入设备编码"
        :error-message="errors.deviceCode"
      />
    </view>
    <view class="inputBox">
      设备名称:
      <uni-easyinput
        v-model="deviceInfo.deviceName"
        placeholder="请输入设备名称"
        :error-message="errors.deviceName"
      />
    </view>
    <view class="inputBox">
      所属公司:
      <uni-data-select
        v-model="deviceInfo.deptId"
        :localdata="deptList"
        placeholder="请选择公司"
        :disabled="isDeptSelectDisabled"
      ></uni-data-select>
    </view>
    <view class="inputBox">
      设备类型:
      <uni-data-select
        v-model="deviceInfo.deviceType"
        :localdata="range"
        @change="change"
        placeholder="请选择设备类型"
      ></uni-data-select>
    </view>
    <view class="inputBox">
      设备状态:
      <uni-data-checkbox
        v-model="deviceInfo.deviceStatus"
        :localdata="stateArr"
      ></uni-data-checkbox>
    </view>
    <view class="inputBox">
      安装地址:
      <uni-easyinput
        type="textarea"
        v-model="deviceInfo.address"
        placeholder="请输入安装地址"
        :error-message="errors.address"
      ></uni-easyinput>
    </view>
    <button
      type="primary"
      size="large"
      @click="save"
      :disabled="isSubmitDisabled"
    >
      保存
    </button>
  </view>
</template>

<script>
import { getDicts } from "@/api/system/dict/data.js";
import { addDevice_info, updateDevice_info } from "@/api/system/deviceInfo.js";
// import { listDeptAll } from "@/api/system/dept.js";

export default {
  onLoad(options) {
    // 初始化设备信息
    if (options.deviceInfo) {
      try {
        this.deviceInfo = JSON.parse(decodeURIComponent(options.deviceInfo));
        console.log(this.deviceInfo);
      } catch (error) {
        console.error("解析设备信息失败:", error);
        uni.showToast({
          title: "设备信息加载失败，请检查数据格式",
          icon: "none",
        });
      }
    }
    // 获取设备类型字典数据
    getDicts("device_type")
      .then((res) => {
        if (res && res.data && Array.isArray(res.data)) {
          this.range = res.data.map((item) => ({
            text: item.dictLabel,
            value: item.dictValue,
          }));
        } else {
          console.error("设备类型数据格式异常:", res);
          uni.showToast({
            title: "设备类型加载失败，请稍后重试",
            icon: "none",
          });
        }
      })
      .catch((error) => {
        console.error("获取设备类型字典数据失败:", error);
        uni.showToast({
          title: "设备类型加载失败，请检查网络",
          icon: "none",
        });
      });
  },
  created() {
    this.getDeptList();
  },
  data() {
    return {
      deviceInfo: {
        deviceCode: "",
        deviceName: "",
        deviceStatus: 0, // 默认值：0 表示在线
        deviceType: undefined,
        address: "",
        deptId: undefined, // 默认没有所属公司
        id: "",
      },
      range: [], // 设备类型选项
      stateArr: [
        { text: "在线", value: 0 },
        { text: "离线", value: 1 },
      ],
      errors: {
        deviceCode: "",
        deviceName: "",
        address: "",
      },
      deptList: [], // 公司列表
      isDeptSelectDisabled: false, // 是否禁用公司下拉框
    };
  },
  computed: {
    isSubmitDisabled() {
      const { deviceCode, deviceName, deviceType, address } = this.deviceInfo;
      return !deviceCode || !deviceName || !deviceType || !address;
    },
  },
  methods: {
    validateForm() {
      this.errors = {
        deviceCode: !this.deviceInfo.deviceCode ? "设备编码不能为空" : "",
        deviceName: !this.deviceInfo.deviceName ? "设备名称不能为空" : "",
        address: !this.deviceInfo.address ? "安装地址不能为空" : "",
      };

      return Object.values(this.errors).every((error) => !error);
    },
    save() {
      if (!this.validateForm()) {
        uni.showToast({
          title: "请完善表单信息",
          icon: "none",
        });
        return;
      }

      // 判断是否有 id 字段来决定是添加还是更新
      const saveAction = this.deviceInfo.id
        ? updateDevice_info(this.deviceInfo) // 如果存在 id，调用更新接口
        : addDevice_info(this.deviceInfo); // 如果不存在 id，调用添加接口

      saveAction
        .then((res) => {
          console.log("设备信息操作成功:", res);
          const successMessage = this.deviceInfo.id
            ? "设备信息更新成功"
            : "设备信息添加成功";
          uni.showToast({
            title: successMessage,
            icon: "success",
          });
          setTimeout(() => {
            uni.navigateBack(); // 返回上一页
          }, 1500);
        })
        .catch((error) => {
          console.error("设备信息操作失败:", error);
          let errorMessage = "设备操作失败，请稍后重试";

          if (error && error.errMsg && error.errMsg.includes("request:fail")) {
            errorMessage = "网络连接失败，请检查网络设置";
          } else if (error && error.message) {
            errorMessage = error.message; // 显示具体的错误信息
          }
          uni.showToast({
            title: errorMessage,
            icon: "none",
          });
        });
    },
    getDeptList() {
      // listDeptAll()
      //   .then((res) => {
      // 	   console.log("公司列表响应数据:", res);
      //     if (res && res.data && Array.isArray(res.data)) {
      //       this.deptList = res.data.map((item) => ({
      //         text: item.deptName, // 公司名称
      //         value: item.deptId, // 公司ID
      //       }));
      //       // 判断用户权限
      //       if (userInfo.deptId !== 0) {
      //         this.isDeptSelectDisabled = true; // 禁用下拉框
      //         this.deviceInfo.deptId = userInfo.deptId; // 设置默认值为当前登录用户的公司ID
      //       }
      //     } else {
      //       console.error("公司列表数据格式异常:", res);
      //       uni.showToast({
      //         title: "公司列表加载失败，请稍后重试",
      //         icon: "none",
      //       });
      //     }
      //   });
    },
    change(e) {
      console.log("设备类型选择变化:", e);
    },
  },
};
</script>

<style lang="scss" scoped>
.deviceAdd {
  background: #ffffff;
  min-height: 100vh;
  padding: 20px 4%;

  .inputBox {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    & > label {
      width: 100px;
      font-size: 16px;
      color: #333;
    }

    .uni-easyinput,
    .uni-data-select,
    .uni-data-checklist {
      flex: 1;
      margin-left: 10px;
    }
  }

  button[size="large"] {
    width: 70%;
    margin: 20px auto 0;
  }
}
</style>
