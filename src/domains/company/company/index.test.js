const R = require('ramda')

const { generateCompany } = require('../../../helpers/mockData/company')
const CompanyDomain = require('./index')
const { FieldValidationError } = require('../../../helpers/errors')

const companyDomain = new CompanyDomain()

describe('tests about company domain: ', () => {
  describe('create tests: ', async () => {
    let companyMockGenerated = {}
    let counter = 1

    beforeEach(() => {
      companyMockGenerated = generateCompany(counter)
      counter += 1
    })

    test('should add a new company', async () => {
      const companyMock = companyMockGenerated

      const companyCreated = await companyDomain.create(companyMock)

      expect(companyCreated.type).toBe(companyMock.type)
      expect(companyCreated.razaoSocial).toBe(companyMock.razaoSocial)
      expect(companyCreated.name).toBe(companyMock.name)
      expect(companyCreated.stateRegistration).toBe(companyMock.stateRegistration)
      expect(companyCreated.cnpj).toBe(companyMock.cnpj)
    })

    test('try add company with type null', async () => {
      const chipMock = companyMockGenerated
      chipMock.type = ''

      await expect(companyDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'type',
          message: 'type cannot be null',
        }]))
    })


    test('try add company without type', async () => {
      const chipMock = R.omit(['type'], companyMockGenerated)

      await expect(companyDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'type',
          message: 'type cannot be null',
        }]))
    })

    test('try add company without type invalid', async () => {
      const chipMock = {
        ...companyMockGenerated,
        type: 'different',
      }

      await expect(companyDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'type',
          message: 'type is invalid',
        }]))
    })

    test('try add company with razaoSocial null', async () => {
      const chipMock = companyMockGenerated
      chipMock.razaoSocial = ''

      await expect(companyDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'razaoSocial',
          message: 'razaoSocial cannot be null',
        }]))
    })


    test('try add company without razaoSocial', async () => {
      const chipMock = R.omit(['razaoSocial'], companyMockGenerated)

      await expect(companyDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'razaoSocial',
          message: 'razaoSocial cannot be null',
        }]))
    })

    test('try add company without razaoSocial invalid', async () => {
      const chipMock = {
        ...companyMockGenerated,
        razaoSocial: 'F0rÇ@ 3Rro',
      }

      await expect(companyDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'razaoSocial',
          message: 'razaoSocial is invalid',
        }]))
    })

    test('try add company with name null', async () => {
      const chipMock = companyMockGenerated
      chipMock.name = ''

      await expect(companyDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'name',
          message: 'name cannot be null',
        }]))
    })


    test('try add company without name', async () => {
      const chipMock = R.omit(['name'], companyMockGenerated)

      await expect(companyDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'name',
          message: 'name cannot be null',
        }]))
    })

    test('try add company without razaoSocial', async () => {
      const chipMock = R.omit(['razaoSocial'], companyMockGenerated)

      await expect(companyDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'razaoSocial',
          message: 'razaoSocial cannot be null',
        }]))
    })

    test('try add company without name invalid', async () => {
      const chipMock = {
        ...companyMockGenerated,
        name: 'F0rÇ@ 3Rro',
      }

      await expect(companyDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'name',
          message: 'name is invalid',
        }]))
    })

    test('try add company with cnpj null', async () => {
      const chipMock = companyMockGenerated
      chipMock.cnpj = ''

      await expect(companyDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj cannot be null',
        }]))
    })


    test('try add company without cnpj', async () => {
      const chipMock = R.omit(['cnpj'], companyMockGenerated)

      await expect(companyDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj cannot be null',
        }]))
    })

    test('try add company without cnpj invalid', async () => {
      const chipMock = {
        ...companyMockGenerated,
        cnpj: '1234567',
      }

      await expect(companyDomain.create(chipMock)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj is invalid',
        }]))
    })

    test('type of unit does not have company group', async () => {
      const companyMock = {
        ...companyMockGenerated,
        type: 'unit',
      }

      const companyCreated = await companyDomain.create(companyMock)


      expect(companyCreated.companyGroupId).toBe(null)
    })

    test('type of branch does not have company group', async () => {
      const companyMock = {
        ...companyMockGenerated,
        type: 'branch',
      }

      const companyCreated = await companyDomain.create(companyMock)


      expect(companyCreated.companyGroupId).toBe(null)
    })

    test('', async () => {
      const companyMock = {
        ...companyMockGenerated,
        type: 'master',
        companyGroupId: '',
      }

      const companyCreated = await companyDomain.create(companyMock)


      expect(companyCreated.companyGroupId).toBeTruthy()
    })

    test('', async () => {
      const companyMock = {
        ...companyMockGenerated,
        type: 'master',
      }
      const chipMock = R.omit(['companyGroupId'], companyMock)
      // console.log(companyMock)

      const companyCreated = await companyDomain.create(chipMock)

      // console.log(JSON.stringify(companyCreated.companyGroupId))

      expect(companyCreated.companyGroupId).toBeTruthy()
    })
  })
})


// let addressMock = null
// let createdAddress = null
// beforeEach(async () => {
//   addressMock = generateAddress()

//   createdAddress = await addressDomain.add(addressMock)
// })
// test('should add a new address', async () => {
//   expect(createdAddress.id).toBeTruthy()

//   expect(createdAddress.street).toBe(addressMock.street)
//   expect(createdAddress.number).toBe(addressMock.number)
//   expect(createdAddress.complement).toBe(addressMock.complement)
//   expect(createdAddress.city).toBe(addressMock.city)
//   expect(createdAddress.state).toBe(addressMock.state)
//   expect(createdAddress.neighborhood).toBe(addressMock.neighborhood)
//   expect(createdAddress.referencePoint).toBe(addressMock.referencePoint)
//   expect(createdAddress.zipCode).toBe(addressMock.zipCode)
// })
