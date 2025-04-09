import request from '@/utils/request'

// 查询设备信息列表
export function listDevice_info(query) {
  return request({
    url: '/system/device_info/list',
    method: 'get',
    params: query
  })
}
// 查询设备信息列表
export function listDeviceAll(query) {
  return request({
    url: '/system/device_info/all',
    method: 'get',
    params: query
  })
}
// 查询设备信息详细
export function getDevice_info(id) {
  return request({
    url: '/system/device_info/' + id,
    method: 'get'
  })
}

// 新增设备信息
export function addDevice_info(data) {
  return request({
    url: '/system/device_info',
    method: 'post',
    data: data
  })
}

// 修改设备信息
export function updateDevice_info(data) {
  return request({
    url: '/system/device_info',
    method: 'put',
    data: data
  })
}

// 删除设备信息
export function delDevice_info(id) {
  return request({
    url: '/system/device_info/' + id,
    method: 'delete'
  })
}
