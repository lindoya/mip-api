const router = require('express').Router()
const getAllComanyGroup = require('../../controllers/company/companyGroup')

router.get('/group', getAllComanyGroup.getAllComanyGroup)

module.exports = router
