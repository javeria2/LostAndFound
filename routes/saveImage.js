var express  = require('express'),
	router   = express.Router();

router.post('/saveImage', function(req, res){
	console.log("inside save image", req.files);
});

module.exports = router;