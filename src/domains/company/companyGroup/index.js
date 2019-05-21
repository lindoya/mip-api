const R = require('ramda')
const moment = require('moment')
const { isUUID } = require('validator')
const Cnpj = require('@fnando/cnpj/dist/node')

const { FieldValidationError } = require('../../../helpers/errors')
const database = require('../../../database')

const AddressDomain = require('../../address')

const CompanyGroup = database.model('companyGroup')
const Company = database.model('company')
const Address = database.model('address')

const formatQuery = require('../../../helpers/lazyLoad')

const addressDomain = new AddressDomain()

class CompanyGroupDomain {
  // eslint-disable-next-line camelcase
  async create(bodyData, options = {}) {
    const { transaction = null } = options

    const companyGroup = R.omit(['id', 'address'], bodyData)

    const { address = null } = bodyData

    const companyGroupNotHas = prop => R.not(R.has(prop, companyGroup))
    const companyGroupHas = prop => R.has(prop, companyGroup)
    const bodyDataHas = prop => R.has(prop, bodyData)

    if (companyGroupNotHas('groupName') || !companyGroup.groupName) {
      throw new FieldValidationError([{
        field: 'groupName',
        message: 'groupName cannot be null exist',
      }])
    }

    const groupName = await CompanyGroup.findOne({
      where: {
        groupName: companyGroup.groupName,
      },
      transaction,
    })

    if (groupName) {
      throw new FieldValidationError([{
        field: 'groupName',
        message: 'groupName already exist',
      }])
    }

    if (companyGroupNotHas('description') || !companyGroup.description) {
      throw new FieldValidationError([{
        field: 'description',
        message: 'description cannot be null exist',
      }])
    }

    if (companyGroupHas('cnpj') && companyGroup.cnpj) {
      if (!Cnpj.isValid(companyGroup.cnpj)) {
        throw new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj is invalid',
        }])
      }

      const companyCnpjExixtente = await Company.findOne({
        where: { cnpj: companyGroup.cnpj },
        transaction,
      })

      const companyGroupCnpjExixtente = await CompanyGroup.findOne({
        where: { cnpj: companyGroup.cnpj },
        transaction,
      })

      if (companyCnpjExixtente || companyGroupCnpjExixtente) {
        throw new FieldValidationError([{
          field: 'cnpj',
          message: 'cnpj already exists',
        }])
      }
    }

    let companyGroupFormatted = {
      ...companyGroup,
      addressId: null,
    }

    if (bodyDataHas('address') && address) {
      const addresCreated = await addressDomain.create(address, { transaction })

      companyGroupFormatted = {
        ...companyGroup,
        addressId: addresCreated.id,
      }
    }

    const companyGroupCreated = await CompanyGroup.create(companyGroupFormatted, {
      transaction,
    })

    const companyGroupReturned = await CompanyGroup.findByPk(companyGroupCreated.id, {
      include: [
        {
          model: Address,
        },
      ],
      transaction,
    })

    return companyGroupReturned
  }

  // eslint-disable-next-line camelcase
  async companyGroup_GetById(id, options = {}) {
    const { transaction = null } = options

    if (!id) {
      throw new FieldValidationError([{
        name: 'id',
        message: 'id cannot to be null',
      }])
    }

    if (!isUUID(id)) {
      throw new FieldValidationError([{
        name: 'id',
        message: 'id is invalid',
      }])
    }

    const companyGroupReturned = await CompanyGroup.findByPk(id, {
      transaction,
    })
    return companyGroupReturned
  }

  // eslint-disable-next-line camelcase
  async companyGroup_UpdateById(id, bodyData, options = {}) {
    const { transaction = null } = options
    const companyGroup = R.omit(['id'], bodyData)

    const hasGroupName = R.has('groupName', companyGroup)

    const hasDescription = R.has('description', companyGroup)

    let newCompanyGroup = {}

    if (hasGroupName) {
      newCompanyGroup = {
        ...newCompanyGroup,
        groupName: R.prop('groupName', companyGroup),
      }

      const groupName = await CompanyGroup.findOne({
        where: {
          groupName: companyGroup.groupName,
        },
        transaction,
      })

      if (groupName) {
        throw new FieldValidationError([{
          field: 'groupName',
          message: 'groupName already exist',
        }])
      }
    }
    if (hasDescription) {
      newCompanyGroup = {
        ...newCompanyGroup,
        description: R.prop('description', companyGroup),
      }
    }
    const companyGroupInstance = await this.companyGroup_GetById(id, { transaction })

    await companyGroupInstance.update(newCompanyGroup)

    const companyGroupUpdated = await this.companyGroup_GetById(id, { transaction })

    return companyGroupUpdated
  }

  // eslint-disable-next-line camelcase
  async companyGroup_GetAll(options = {}) {
    const inicialOrder = {
      field: 'createdAt',
      acendent: true,
      direction: 'DESC',
    }
    const { query = null, order = inicialOrder, transaction = null } = options

    if (order.acendent) {
      order.direction = 'DESC'
    } else {
      order.direction = 'ASC'
    }

    const {
      getWhere,
      limit,
      offset,
      pageResponse,
    } = formatQuery(query)

    const grups = await CompanyGroup.findAndCountAll({
      where: getWhere('companyGroup'),
      order: [
        [order.field, order.direction],
      ],
      limit,
      offset,
      transaction,
    })

    const { rows } = grups


    const qntCompPromiseList = []

    const formatRow = R.forEach((row) => {
      const qntEmp = Company.count({
        where: {
          companyGroupId: row.id,
        },
      })
      qntCompPromiseList.push(qntEmp)
    })

    formatRow(rows)

    const qntCompList = await Promise.all(qntCompPromiseList)

    const companyGroupsList = []
    for (let index = 0; index < rows.length; index += 1) {
      const qntComp = qntCompList[index]
      const row = rows[index]

      // console.log(row.createdAt)

      const formatdate = (date) => {
        moment.locale('pt-br')
        const formatDate = moment(date).format('L')
        const formatHours = moment(date).format('LT')
        const dateformated = `${formatDate} ${formatHours}`
        return dateformated
      }

      companyGroupsList.push({
        groupName: row.groupName,
        description: row.description,
        createdAt: formatdate(row.createdAt),
        deletedAt: formatdate(row.deletedAt),
        qntComp,
      })
    }

    const response = {
      page: pageResponse,
      show: limit,
      count: grups.count,
      rows: companyGroupsList,
    }
    return response
  }
}

module.exports = CompanyGroupDomain
