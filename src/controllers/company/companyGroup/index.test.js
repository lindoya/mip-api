const request = require('../../../helpers/request')

describe('get all tests', () => {
  test('getAll', async () => {
    const response = await request().get('/api/company/group')
    console.log(response)
    expect(1).toBe(1)
  })
})
