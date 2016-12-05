/**
 * Created by mamoruohara on 11/29/16.
 */
var secrets = require('../config/secrets');

module.exports = function(router) {

    var homeRoute = router.route('/');

    homeRoute.get(function(req, res) {
        connectionString = secrets.token + secrets.mongo_connection;
        res.json({ message: 'My connection string is ' + connectionString });
    });

    return router;
};
