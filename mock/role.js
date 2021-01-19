const Mock = require('mockjs')



const roles = Mock.mock({
  'items|5': [{
    id: '@id',
    name: '@sentence(0, 5)'
  }]
})


module.exports = [
  {
    url: '/role/list',
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
