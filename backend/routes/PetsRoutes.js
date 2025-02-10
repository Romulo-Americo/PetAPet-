const router = require('express').Router()

const PetController = require('../controllers/PetController')

//middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

router.patch(
    '/create',
    verifyToken,
    imageUpload.single
    ('images'),
    PetController.create
)

module.exports = router
