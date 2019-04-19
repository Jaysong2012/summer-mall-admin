import request from '@/utils/request';

export function listProduct(data) {
  return request({
    url: '/product/product/list',
    method: 'post',
    data
  })
}

export function statusProduct(data) {
  return request({
    url: '/product/product/status',
    method: 'post',
    data
  })
}

export function batchStatusProduct(data) {
  return request({
    url: '/product/product/batch-status',
    method: 'post',
    data
  })
}

export function saveProduct(data) {
  return request({
    url: '/product/product/save',
    method: 'post',
    data
  })
}

export function detailProduct(data) {
  return request({
    url: '/product/product/detail',
    method: 'post',
    data
  })
}
