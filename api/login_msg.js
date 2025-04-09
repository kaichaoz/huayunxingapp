export function sendSmsCode() {
  return request({
    'url': '/sendSmsCode',
    'method': 'get'
  })
}