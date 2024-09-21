const express = require('express');
const router = express.Router();
const { catchErrors } = require('@/handlers/errorHandlers');
const detector = require('@/controllers/detectorControllers');

router
    .route(`/detector/fullSetting`)
    .post(catchErrors(detector("test").runPy));

router
    .route(`/detector/train`)
    .post(catchErrors(detector("train").runPy));
router
    .route(`/detector/unlearn`)
    .post(catchErrors(detector("unlearn").runPy));
router
    .route(`/detector/predict`)
    .post(catchErrors(detector("predict").runPy));

module.exports = router;