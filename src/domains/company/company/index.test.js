const R = require('ramda')

const { generateCompany } = require('../../../helpers/mockData/company')
const { generateCompanyGroup } = require('../../../helpers/mockData/company')
const CompanyDomain = require('../company')
const CompanyGroupDomain = require('../companyGroup')
const { FieldValidationError } = require('../../../helpers/errors')

const companyDomain = new CompanyDomain()
const companyGroupDomain = new CompanyGroupDomain()


describe('tests about company domain: ', () => {
  describe('create tests: ', async () => {
    let companyMockGenerated = {}
    let companyGroupMockGenerated = {}
    let companyCounter = 1
    let companyGroupCounter = 1

    beforeEach(() => {
      companyGroupMockGenerated = generateCompanyGroup(companyGroupCounter.toString())
      companyGroupCounter += 1
    })
    beforeEach(() => {
      companyMockGenerated = generateCompany(companyCounter)
      companyCounter += 1
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

    test('try to create two companies as the same cnpj', async () => {
      await companyDomain.create(companyMockGenerated)

      await expect(companyDomain.create(companyMockGenerated)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj already exists',
        }]))
    })

    test('try to create a company with cnpj already registered in a companyGroup', async () => {
      const chipMock1 = {
        ...companyGroupMockGenerated,
        cnpj: '18731118000155',
      }
      const chipMock2 = {
        ...companyMockGenerated,
        cnpj: '18731118000155',
      }

      await companyGroupDomain.create(chipMock1)

      await expect(companyDomain.create(chipMock2)).rejects
        .toThrowError(new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj already exists',
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
