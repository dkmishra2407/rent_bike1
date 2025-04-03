const router = require('express').Router();
const  holdingController  = require('../Controller/HoldingController');

router.get('/getholding', holdingController.getHoldings);
// router.post('/addholding', holdingController.addHolding);
// router.delete('/remove', holdingController.removeHolding);

module.exports = router;