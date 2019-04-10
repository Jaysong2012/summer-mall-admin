import request from '@/utils/request';

export function listProductBrand(data) {
  return request({
    url: '/product/product-brand/list',
    method: 'post',
    data
  })
}

export function statusProductBrand(data) {
  return request({
    url: '/product/product-brand/status',
    method: 'post',
    data
  })
}

export function saveProductBrand(data) {
  return request({
    url: '/product/product-brand/save',
    method: 'post',
    data
  })
}
