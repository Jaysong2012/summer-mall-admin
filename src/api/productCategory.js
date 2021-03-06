import request from '@/utils/request';

export function conditionProductCategoryList(data) {
  return request({
    url: '/condition/product-category/list',
    method: 'post',
    data: data
  })
}

export function conditionProductCategoryTree() {
  return request({
    url: '/product/product-category/tree',
    method: 'post'
  })
}

export function conditionSelectedProductCategoryIdTree(id) {
  const params = { id: id }
  return request({
    url: '/condition/product-category/id-tree',
    method: 'post',
    params: params
  })
}

export function statusProductCategory(data) {
  return request({
    url: '/product/product-category/status',
    method: 'post',
    data
  })
}

export function saveProductCategory(data) {
  return request({
    url: '/product/product-category/save',
    method: 'post',
    data
  })
}
