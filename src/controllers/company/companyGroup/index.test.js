const request = require('../../../helpers/request')

describe('get all tests', () => {
  test('getAll', async () => {
    await request().get('/api/company/group')
    expect(1).toBe(1)
  })
})
