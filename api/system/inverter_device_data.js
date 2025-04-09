import request from '@/utils/request'

// 查询逆变器设备数据信息列表
export function listInverter_device_data(query) {
  return request({
    url: '/system/inverter_device_data/list',
    method: 'get',
    params: query
  })
}

// 查询逆变器设备数据信息详细
export function getInverter_device_data(id) {
  return request({
    url: '/system/inverter_device_data/' + id,
    method: 'get'
  })
}

// 新增逆变器设备数据信息
export function addInverter_device_data(data) {
  return request({
    url: '/system/inverter_device_data',
    method: 'post',
    data: data
  })
}

// 修改逆变器设备数据信息
export function updateInverter_device_data(data) {
  return request({
    url: '/system/inverter_device_data',
    method: 'put',
    data: data
  })
}

// 删除逆变器设备数据信息
export function delInverter_device_data(id) {
  return request({
    url: '/system/inverter_device_data/' + id,
    method: 'delete'
  })
}



// getPowerUsage 用电量分析
export function getPowerUsage(query) {
  return request({
    url: '/system/inverter_device_data/getPowerUsage',
    method: 'get',
    params: query
  })
}

//getPowerGeneration 发电量分析
export function getPowerGeneration(query) {
  return request({
    url: '/system/inverter_device_data/getPowerGeneration',
    method: 'get',
    params: query
  })
}

// getPowerTrend  功率统计
export function getPowerTrend(query) {
  return request({
    url: '/system/inverter_device_data/getPowerTrend',
    method: 'get',
    params: query
  })
}
