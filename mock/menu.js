const Mock = require('mockjs')



const roles = Mock.mock({
  items: [
    {label: '系统管理', name: 'zero'},
    {label: '企微管理', name: 'first'},
    {label: '任务宝', name: 'second'},
    {label: '红包裂变', name: 'third'},
    {label: '更多功能', name: 'fourth'},
  ]
})


module.exports = [
  {
    url: '/menus/list',
    type: 'get',
    response: config => {
      const items = roles.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
