const {  signinForm, signin, signout} = require('../controllers/auth.controller');
const router = require('express').Router();

router.get('/signin/form', signinForm);
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;