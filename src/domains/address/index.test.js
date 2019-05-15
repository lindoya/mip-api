const R = require('ramda')

const { generateAddress } = require('../../helpers/mockData/address')
const AddressDomain = require('./')
const { FieldValidationError } = require('../../helpers/errors')

const addressDomain = new AddressDomain()

describe('tests about address domain: ', () => {
  describe('create tests: ', async () => {
    let addressMockGenerated = {}
    let counter = 1

    beforeEach(() => {
      addressMockGenerated = generateAddress(counter.toString())
      counter += 1
    })

    test('should add a new address', async () => {
      const addressMock = addressMockGenerated

      const addressCreated = await addressDomain.create(addressMock)

      expect(addressCreated.street).toBe(addressMock.street)
      expect(addressCreated.number).toBe(addressMock.number)
      expect(addressCreated.complement).toBe(addressMock.complement)
      expect(addressCreated.city).toBe(addressMock.city)
      expect(addressCreated.state).toBe(addressMock.state)
      expect(addressCreated.neighborhood).toBe(addressMock.neighborhood)
      expect(addressCreated.referencePoint).toBe(addressMock.referencePoint)
      expect(addressCreated.zipCode).toBe(addressMock.zipCode)
    })

    test('try add address with street null', async () => {
      const chipMock = addressMockGenerated
      chipMock.street = ''

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'street',
          message: 'street cannot be null',
        }]))
    })


    test('try add address without street', async () => {
      const chipMock = R.omit(['street'], addressMockGenerated)

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'street',
          message: 'street cannot be null',
        }]))
    })

    test('try add address without street invalid', async () => {
      const chipMock = {
        ...addressMockGenerated,
        street: 'Av. Sod@',
      }

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'street',
          message: 'street is invalid',
        }]))
    })


    test('try add address with number null', async () => {
      const chipMock = addressMockGenerated
      chipMock.number = ''

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'number',
          message: 'number cannot be null',
        }]))
    })

    test('try add address without number', async () => {
      const chipMock = R.omit(['number'], addressMockGenerated)

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'number',
          message: 'number cannot be null',
        }]))
    })

    test('try add address without number invalid', async () => {
      const chipMock = {
        ...addressMockGenerated,
        number: '23a23',
      }

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'number',
          message: 'number is invalid',
        }]))
    })

    test('try add address with city null', async () => {
      const chipMock = addressMockGenerated
      chipMock.city = ''

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'city',
          message: 'city cannot be null',
        }]))
    })

    test('try add address without city', async () => {
      const chipMock = R.omit(['city'], addressMockGenerated)

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'city',
          message: 'city cannot be null',
        }]))
    })

    test('try add address without city invalid', async () => {
      const chipMock = {
        ...addressMockGenerated,
        city: 'áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ1638....manSAFG()',
      }

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'city',
          message: 'city is invalid',
        }]))
    })

    test('try add address with state null', async () => {
      const chipMock = addressMockGenerated
      chipMock.state = ''

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'state',
          message: 'state cannot be null',
        }]))
    })

    test('try add address without state', async () => {
      const chipMock = R.omit(['state'], addressMockGenerated)

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'state',
          message: 'state cannot be null',
        }]))
    })

    test('try add address with neighborhood null', async () => {
      const chipMock = addressMockGenerated
      chipMock.neighborhood = ''

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'neighborhood',
          message: 'neighborhood cannot be null',
        }]))
    })

    test('try add address without neighborhood', async () => {
      const chipMock = R.omit(['neighborhood'], addressMockGenerated)

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'neighborhood',
          message: 'neighborhood cannot be null',
        }]))
    })

    test('try add address with zipCode null', async () => {
      const chipMock = addressMockGenerated
      chipMock.zipCode = ''

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'zipCode',
          message: 'zipCode cannot be null',
        }]))
    })

    test('try add address without zipCode', async () => {
      const chipMock = R.omit(['zipCode'], addressMockGenerated)

      await expect(addressDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'zipCode',
          message: 'zipCode cannot be null',
        }]))
    })

    test('try add address without zipCode invalid', async () => {
      const chipMock1 = {
        ...addressMockGenerated,
        zipCode: '12354',
      }

      const chipMock2 = {
        ...addressMockGenerated,
        zipCode: '123dfg54',
      }

      const chipMock3 = {
        ...addressMockGenerated,
        zipCode: '123456789',
      }

      const chipMock4 = {
        ...addressMockGenerated,
        zipCode: '12345 678',
      }

      await expect(addressDomain.create(chipMock1)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'zipCode',
          message: 'cannot contains space',
        }]))

      await expect(addressDomain.create(chipMock2)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'zipCode',
          message: 'zipCode is invalid',
        }]))


      await expect(addressDomain.create(chipMock3)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'zipCode',
          message: 'zipCode is invalid',
        }]))

      await expect(addressDomain.create(chipMock4)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'zipCode',
          message: 'zipCode is invalid',
        }]))
    })
  })
})


// describe('tests about add a new address domain:', () => {
//   let addressMock = null
//   let createdAddress = null
//   beforeEach(async () => {
//     addressMock = generateAddress()

//     createdAddress = await addressDomain.add(addressMock)
//   })

//   test('should add a new address', async () => {
//     expect(createdAddress.id).toBeTruthy()

//     expect(createdAddress.street).toBe(addressMock.street)
//     expect(createdAddress.number).toBe(addressMock.number)
//     expect(createdAddress.complement).toBe(addressMock.complement)
//     expect(createdAddress.city).toBe(addressMock.city)
//     expect(createdAddress.state).toBe(addressMock.state)
//     expect(createdAddress.neighborhood).toBe(addressMock.neighborhood)
//     expect(createdAddress.referencePoint).toBe(addressMock.referencePoint)
//     expect(createdAddress.zipCode).toBe(addressMock.zipCode)
//   })

// test('should update address', async () => {
//   const newAddressMock = generateAddress()
//   const updatedAddress = await addressDomain
//     .updateById(createdAddress.id, { addressData: newAddressMock })

//   expect(updatedAddress.id).toBe(createdAddress.id)

//   expect(updatedAddress.street).toBe(newAddressMock.street)
//   expect(updatedAddress.number).toBe(newAddressMock.number)
//   expect(updatedAddress.complement).toBe(newAddressMock.complement)
//   expect(updatedAddress.city).toBe(newAddressMock.city)
//   expect(updatedAddress.state).toBe(newAddressMock.state)
//   expect(updatedAddress.neighborhood).toBe(newAddressMock.neighborhood)
//   expect(updatedAddress.referencePoint).toBe(newAddressMock.referencePoint)
//   expect(updatedAddress.zipCode).toBe(newAddressMock.zipCode)
// })

//   test('should delete address', async () => {
//     const deletedAddress = await addressDomain
//       .softDeleteById(createdAddress.id)

//     expect(deletedAddress.deletedAt).toBeTruthy()
//   })
// })
