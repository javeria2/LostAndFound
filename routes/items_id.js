var Items = require('../models/items');

module.exports = function(router) {

    var itemsIdRouter = router.route('/items/:id');

    itemsIdRouter.get(function(req, res) {
        console.log(req.params.id);
        Items.find({ _id: req.params.id }, function (err, tasks) {
            if (err) {
                res.status(500).json({ message: "Something went super bad yo", data: [] });
                return console.error(err);
            } else {
                if (tasks.length === 0) {
                    res.status(404).json({ message: "Task not found", data: [] })
                } else {
                    res.json({ message: "OK", data: tasks[0]});
                }
            }

        });
    }).put(function(req, res) {
        // var postTask = new Tasks(req.body);
        console.log(req.params.id);
        console.log(req.body);
        Items.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, updatedItem) {
            if (err) { // catch any errors
                if (err.name === 'ValidationError') {
                    res.status(500).send({ message: err.errors, data: [] });
                    return console.error(err);
                } else {
                    res.status(500).send({ message: "Wooooahhhhh baaad", data: [] });
                    return console.error(err);
                }
            } else {
                if (updatedItem === null) {
                    res.status(404).json({ message: "Item not found, cannot update", data: []});
                } else {
                    res.status(200).json({ message: "Item successfully updated!", data: updatedItem});
                }
            }
        });
    }).delete(function(req, res) {
        Items.findByIdAndRemove(req.params.id, function (err, removed) {
            if (err) { // catch any errors
                console.log(err);
                res.status(500).send({ message: "Wooooahhhhh baaad", data: [] })
            } else {
                if (removed === null) {
                    res.status(404).json({ message: "Item not found, cannot delete", data: []});
                } else {
                    res.status(200).json({ message: "Item successfully deleted!", data: removed});
                }
            }
        });
    });

    return router;
};