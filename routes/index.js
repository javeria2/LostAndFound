/**
 * Created by mamoruohara on 11/29/16.
 */
module.exports = function(app, router) {
    app.use('/api', require('./home.js')(router));
    app.use('/api', require('./items.js')(router));
    app.use('/api', require('./items_id.js')(router));
    app.use('/api', require('./users.js')(router));
    app.use('/api', require('./users_id.js')(router));
};