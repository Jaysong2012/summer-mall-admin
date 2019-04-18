import request from '@/utils/request';
export function token() {
  return request({
    url: '/oss//sts/token',
    method: 'post'
  })
}

export function policy() {
  return request({
    url: '/oss//sts/policy',
    method: 'post'
  })
}
