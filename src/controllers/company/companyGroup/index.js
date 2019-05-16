const CompanyGroupDomain = require('../../../domains/company/companyGroup')
const database = require('../../../database')
const { FieldValidationError } = require('../../../helpers/errors')

const companyGroupDomain = new CompanyGroupDomain()

const getAllComanyGroup = async (req, res, next) => {
  const transaction = await database.transaction()
  try {
    const { query } = req.params

    const order = JSON.parse(req.query.order)

    const companyGroupList = await companyGroupDomain
      .companyGroup_GetAll({ query, order, transaction })

    await transaction.commit()
    res.json(companyGroupList)
  } catch (error) {
    await transaction.rollback()
    next(new FieldValidationError())
  }
}

module.exports = {
  getAllComanyGroup,
}
