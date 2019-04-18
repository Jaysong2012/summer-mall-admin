import request from '@/utils/request'

export function conditionMemberLevelList() {
  return request({
    url: '/condition/member-level/list',
    method: 'post'
  })
}
