import request from '@/utils/request';

export function listBrandCategory(data) {
  return request({
    url: '/product/brand-category/list',
    method: 'post',
    data
  })
}

export function statusBrandCategory(data) {
  return request({
    url: '/product/brand-category/status',
    method: 'post',
    data
  })
}

export function saveBrandCategory(data) {
  return request({
    url: '/product/brand-category/save',
    method: 'post',
    data
  })
}

export function conditionBrandCategoryList(data) {
  return request({
    url: '/condition/brand-category/list',
    method: 'post',
    data: data
  })
}
