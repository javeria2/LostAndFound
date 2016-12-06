/**
 * Created by mamoruohara on 12/5/16.
 */
var Comments = require('../models/comments');

module.exports = function(router) {

    var commentsRouter = router.route('/comments');

    commentsRouter.get(function(req, res) {

        var where   = "where"   in req.query ? eval("("+req.query.where+")") : null;
        var sort    = "sort"    in req.query ? eval("("+req.query.sort+")") : null;
        var select  = "select"  in req.query ? eval("("+req.query.select+")") : null;
        var skip    = "skip"    in req.query ? parseInt(req.query.skip) : 0;
        var limit   = "limit"   in req.query ? parseInt(req.query.limit) : 0;
        var count   = "count"   in req.query ? req.query.count : false;

        Comments
            .find(where)
            .sort(sort)
            .select(select)
            .skip(skip)
            .limit(limit)
            .exec(function (err, comments) {
                if (err) {
                    if (err.name === "MongoError") {
                        res.status(500).send({ message: "Mongo error, check query string", data: []});
                    } else {
                        res.status(500).send({ message: "Too many dank memes (something weird happened)", data: []});
                    }
                    return console.error(err);
                }
                (count === "true") ?
                    res.json({ message: "OK", data: comments.length}) :
                    res.json({ message: "OK", data: comments});
            });
    }).post(function(req, res) {
        var postItem = new Comments(req.body);
        postItem.save(function (err, newComment) {
            if (err) { // catch any errors
                if (err.name === 'ValidationError') {
                    console.error(err);
                    res.status(500).send({ message: err.errors, data: [] })
                } else {
                    res.status(500).send({ message: "Wooooahhhhh baaad", data: [] })
                }
            } else {
                res.status(201).json({ message: "Comment successfully added!", data: newComment});
            }
        });
    }).options(function(req, res){
        res.writeHead(200);
        res.end();
    });

    return router;
};