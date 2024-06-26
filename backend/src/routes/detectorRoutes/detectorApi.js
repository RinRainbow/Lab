const express = require('express');
const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const detector = require('@/controllers/detectorControllers');
//router.get('/test', (req, res) => res.send('Test route works!'));


router
    .route(`/dasw`)
    .get(catchErrors(detector("Dataset").listChosen));



module.exports = router;