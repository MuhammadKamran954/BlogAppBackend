const express = require('express');
const router = express.Router();
const getFileController = require('./../controller/controller');
const checkApiKey = require('./../../../../libs/common/src/jwt/jwt_strategy');
router.get('/file',checkApiKey,getFileController);

module.exports = router;