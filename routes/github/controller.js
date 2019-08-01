const Github = require('../../models/github/githubModel');
const response = require('../response');

module.exports.get = async (req, res ) => {
    req.serviceLog.action = "Get Github";
    try {
        if (req.params.id) {
            let item = await Github.findById(req.params.id)
                .exec((err, githubs) => {
                    if (!err) {
                        res.status(200).send(githubs);
                    } else {
                        req.serviceLog.error = err;
                        return res.status(404).send(response({error: `Could'n get github with id ${req.params.id}`, title: "GET github By Id"}));
                    }
                });
        } else {
            let items = await Github.find({})
                .exec((err, github) => {
                    if (!err) {
                        res.status(200).send(github);
                    } else {
                        req.serviceLog.error = err;                
                        return res.status(404).send(response({error: `Could'n get github list`, title: "GET list github"}));
                    }
                });
        }
    } catch (err) {
        req.serviceLog.error = err;
        return res.status(500).send(response({title: "GET github", message: `Error in request`}));
    }
};

module.exports.post = async (req, res ) => {
    req.serviceLog.action = "Post Github";
    let item = new Github(req.body);
    try {
        await item.save();
        req.serviceLog.message = `Method POST OK`;
        return res.status(201).send(response({ success: "Success created Github", title: "POST github"}));
    } catch (err) {
        req.serviceLog.error = err;
        res.status(500).send(response(`Error in request`, null, "POST github"));
    }
};

module.exports.put = async (req, res ) => {
    req.serviceLog.action = "Put Github";
    try {
        let item = await Github.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (!item) {
            req.serviceLog.error = err;
            return status.status(404).send(response({error: `Could'n update Github with Id ${req.params.id}`, title:"Update Github"}));
        } else {
            req.serviceLog.message = `Method PUT OK`;
            res.status(200).send(response({success: "Success updated Github", title: "Update Github" }));
        }
    } catch (err) {
        req.serviceLog.error = err;
        res.status(500).send(response({error: `Error in request`, title: "Update Github"}));
    }
};

module.exports.delete = async (req, res ) => {
    req.serviceLog.action = "Delete Github";
    try {
        let item = await Github.findOneAndRemove({ _id: req.params.id });
        if (!item) {
            req.serviceLog.error = err;
            return res.status(404).send(response({ error: `Could'n delete Github with Id ${req.params.id}`, title: "Delete github"}));
        } else {
            req.serviceLog.message = `Method DELETE OK`;
            return res.status(203).send(response({success: "Successfull delete Github", title: "Delete github"}));
        }
    } catch (err) {
        req.serviceLog.error = err
        return res.status(500).send(response({ error: `Error in request`, title: "Delete github"}));
    }
};