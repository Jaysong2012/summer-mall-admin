import request from '@/utils/request';

export function conditionProductAttributeCategory(data) {
  return request({
    url: '/condition/product-attribute-category/list',
    method: 'post',
    data: data
  })
}

export function listProductAttributeCategory(data) {
  return request({
    url: '/product/product-attribute-category/list',
    method: 'post',
    data
  })
}

export function statusProductAttributeCategory(data) {
  return request({
    url: '/product/product-attribute-category/status',
    method: 'post',
    data
  })
}

export function saveProductAttributeCategory(data) {
  return request({
    url: '/product/product-attribute-category/save',
    method: 'post',
    data
  })
}
