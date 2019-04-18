import request from '@/utils/request';

export function listProductAttribute(data) {
  return request({
    url: '/product/product-attribute/list',
    method: 'post',
    data
  })
}

export function statusProductAttribute(data) {
  return request({
    url: '/product/product-attribute/status',
    method: 'post',
    data
  })
}

export function saveProductAttribute(data) {
  return request({
    url: '/product/product-attribute/save',
    method: 'post',
    data
  })
}

export function conditionProductAttributeList(params) {
  return request({
    url: '/condition/product-attribute/list',
    method: 'post',
    params: params
  })
}
