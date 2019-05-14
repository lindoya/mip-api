const router = require('express').Router()
const companyRoute = require('./company')

router.use('/company', companyRoute)

module.exports = router
