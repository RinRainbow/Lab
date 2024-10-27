const express = require('express');
const router = express.Router();
const { catchErrors } = require('@/handlers/errorHandlers');
const { hasPermission } = require('@/middlewares/permission');
const transfer = require('@/controllers/transferControllers');

router
    .route(`/dataset/upload`)
    .post(hasPermission('upload'),catchErrors(transfer().upload));


module.exports = router;