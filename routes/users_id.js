/**
 * Created by mamoruohara on 12/3/16.
 */
var Users = require('../models/user');

module.exports = function(router) {

    var usersIdRouter = router.route('/users/:id');

    usersIdRouter.get(function(req, res) {
        console.log(req.params.id);
        Users.find({ _id: req.params.id }, function (err, tasks) {
            if (err) {
                res.status(500).json({ message: "Something went super bad yo", data: [] });
                return console.error(err);
            } else {
                if (tasks.length === 0) {
                    res.status(404).json({ message: "User not found", data: [] })
                } else {
                    res.json({ message: "OK", data: tasks[0]});
                }
            }

        });
    });

    return router;
};