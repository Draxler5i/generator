module.exports = getText = (args) => {
    const model = args.charAt(0).toUpperCase() + args.slice(1);
    const text = `const ${model} = require('../../Library/Models/${args}Model');

module.exports.get = async (req, res ) => {
    try {
        if (req.params.id) {
            let item = await ${model}.findById(req.params.id)
                .exec((err, ${args}s) => {
                    if (!err) {
                        res.status(200).send(${args}s);
                    } else {
                        return res.status(404).json({ message: 'No such' + ${model} });
                    }
                });
        } else {
            let items = await ${model}.find()
                .exec((err, ${args}) => {
                    if (!err) {
                        res.status(200).send(${args});
                    } else {
                        return res.status(404).json({ message: 'No such' + ${model} });
                    }
                });
        }
    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports.post = async (req, res ) => {
    let item = new ${model}(req.body);
    try {
        let newItem = await item.save();
        return res.status(201).json(newItem);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports.put = async (req, res ) => {
    try {
        let item = await ${model}.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (!item) {
            return status.status(404).send({ error: 'Not Found Error ' + ${args} + ' not found'});
        } else {
            res.status(200).send(item);
        }
    } catch (err) {
        res.status(500).send({ error:'Unknown Server Error' });
    }
};

module.exports.delete = async (req, res ) => {
    try {
        let item = await controllerModel.findOneAndRemove({ _id: req.params.id });
        if (!item) {
            return res.status(404).send({ error: 'Not Found Error ${args} not found' });
        } else {
            return res.status(204).send(${args} + ' successfully deleted');
        }
    } catch (err) {
        return res.status(500).send('Unknown server error, Unknown server error when trying to delete ${args}');
    }
};
`;
    return text;
};