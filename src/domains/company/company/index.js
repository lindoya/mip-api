const R = require('ramda')
const Cnpj = require('@fnando/cnpj/dist/node')

const { FieldValidationError } = require('../../../helpers/errors')
const database = require('../../../database')

const AddressDomain = require('../../address')

const Comapany = database.model('company')
const ComapanyGroup = database.model('companyGroup')
const Address = database.model('address')
// const CompanyContact = database.model('companyContact')
const Contact = database.model('contact')

const addressDomain = new AddressDomain()

module.exports = class companyDomain {
  async create(bodyData, options = {}) {
    const { transaction = null } = options

    let company = R.omit(['id', 'address'], bodyData)

    // eslint-disable-next-line no-underscore-dangle
    const companyNotHas = prop => R.not(R.has(prop, company))


    if (R.not(R.has('address', bodyData))) {
      throw new FieldValidationError([{
        field: 'address',
        message: 'address cannot be null',
      }])
    }

    const { address } = bodyData

    // type Validations
    if (companyNotHas('type')
          || (company.type !== 'unit'
          && company.type !== 'master'
          && company.type !== 'branch')) {
      throw new FieldValidationError([{
        field: 'type',
        message: 'type need is a valid value',
      }])
    }

    // razao Social validations
    if (company.type !== 'unit') {
      if (companyNotHas('razaoSocial') || !company.razaoSocial) {
        throw new FieldValidationError([{
          field: 'razaoSocial',
          message: 'razaoSocial cannot be null',
        }])
      }
      const companyReturned = await Comapany.findOne({
        where: { razaoSocial: company.razaoSocial },
        transaction,
      })

      if (companyReturned) {
        throw new FieldValidationError([{
          field: 'razaoSocial',
          message: 'razaoSocial already exists',
        }])
      }
    }


    // eslint-disable-next-line no-useless-escape
    if (!/^[\w\s\.À-ú\/\(\)\,\'\-]+$/.test(company.razaoSocial)) {
      throw new FieldValidationError([{
        field: 'razaoSocial',
        message: 'razaoSocial invalid',
      }])
    }

    // name Validations
    if (companyNotHas('name') || !company.name) {
      throw new FieldValidationError([{
        field: 'name',
        message: 'name cannot be null',
      }])
    } else {
      const companyReturned = await Comapany.findOne({
        where: { name: company.name },
        transaction,
      })

      if (companyReturned) {
        throw new FieldValidationError([{
          field: 'name',
          message: 'name already exists',
        }])
      }
    }

    // eslint-disable-next-line no-useless-escape
    if (!/^[\w\s\.À-ú]+$/.test(company.name)) {
      throw new FieldValidationError([{
        field: 'name',
        message: 'name invalid',
      }])
    }


    // IE validations
    if (companyNotHas('stateRegistration') || !company.stateRegistration) {
      if (company.type === 'unit') {
        company = {
          ...company,
          stateRegistration: 'unit',
        }
      } else {
        company = {
          ...company,
          stateRegistration: 'isento',
        }
      }
    }

    // cnpj Validations
    if (company.type !== 'unit') {
      if (companyNotHas('cnpj') || !company.cnpj) {
        throw new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj cannot to be null',
        }])
      }

      if (!Cnpj.isValid(company.cnpj)) {
        throw new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj is invalid',
        }])
      }

      const companyReturned = await Comapany.findOne({
        where: { cnpj: company.cnpj },
        transaction,
      })

      if (companyReturned) {
        throw new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj already exists',
        }])
      }
    }

    // validation companyGroup
    if (company.type === 'branch' || company.type === 'unit') {
      company = {
        ...company,
        companyGroupId: null,
      }
    } else if (company.type === 'master') {
      if (companyNotHas('companyGroupId') || !company.companyGroupId) {
        const nogroup = await ComapanyGroup.findOne({
          where: {
            groupName: 'Sem grupo',
          },
        })

        company = {
          ...company,
          companyGroupId: nogroup.id,
        }
      }
    }

    const addresCreated = await addressDomain.create(address, { transaction })

    const companyFormatted = {
      ...company,
      addressId: addresCreated.id,
    }

    const companyCreated = await Comapany.create(companyFormatted, { transaction })

    const response = await Comapany.findByPk(companyCreated.id, {
      include: [
        {
          model: ComapanyGroup,
        },
        {
          model: Address,
        },
        // {
        //   model: CompanyContact,
        //   include: [{
        //     model: Contact,
        //   }],
        // },
      ],
      transaction,
    })

    // console.log(JSON.stringify(response))

    return response
  }
}
