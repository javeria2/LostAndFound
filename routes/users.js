/**
 * Created by mamoruohara on 12/3/16.
 */
var Users = require('../models/user');

module.exports = function(router) {

    var usersRouter = router.route('/users');

    usersRouter.get(function(req, res) {

        var where   = "where"   in req.query ? eval("("+req.query.where+")") : null;
        var sort    = "sort"    in req.query ? eval("("+req.query.sort+")") : null;
        var select  = "select"  in req.query ? eval("("+req.query.select+")") : null;
        var skip    = "skip"    in req.query ? parseInt(req.query.skip) : 0;
        var limit   = "limit"   in req.query ? parseInt(req.query.limit) : 0;
        var count   = "count"   in req.query ? req.query.count : false;

        Users
            .find(where)
            .sort(sort)
            .select(select)
            .skip(skip)
            .limit(limit)
            .exec(function (err, items) {
                if (err) {
                    if (err.name === "MongoError") {
                        res.status(500).send({ message: "Mongo error, check query string", data: []});
                    } else {
                        res.status(500).send({ message: "Too many dank memes (something weird happened)", data: []});
                    }
                    return console.error(err);
                }
                (count === "true") ?
                    res.json({ message: "OK", data: items.length}) :
                    res.json({ message: "OK", data: items});
            });
    }).options(function(req, res){
        res.writeHead(200);
        res.end();
    });

    return router;
};