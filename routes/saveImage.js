var express             = require('express'),
	router              = express.Router(),
    multipart           = require('connect-multiparty'),
    multipartMiddleware = multipart(),
    fs                  = require('fs-extra'),
    path                = require('path');

router.post('/saveImage', multipartMiddleware, function(req, res){
	//get the file data
	var file = req.files.file;

	//temp path made by multipart
	var tempPath = file.path;

	//unique date for naming
	var uploadDate = new Date().toISOString();
	uploadDate.replace('.', '').replace('-', '').replace(':', '');

	//target path (where we save img)
	var targetPath = path.join(__dirname + '/../client/uploads/' + uploadDate
		+ file.name);

	//actual path to return
	var savePath = '/../uploads/' + uploadDate + file.name;

	//rename the path
	fs.rename(tempPath, targetPath, function(err){
		if(err) {
			console.log(err);
			return;
		} 
		res.json(savePath);
	});
});

module.exports = router;