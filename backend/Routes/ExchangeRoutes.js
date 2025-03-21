const router = require('express').Router();
const ExchangeController = require('../Controller/ExchangeController');

router.post('/buy', ExchangeController.buyStock);
router.post('/sell', ExchangeController.sellStock);
router.get('/history', ExchangeController.getHistory);


module.exports = router;