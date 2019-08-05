module.exports = getText = (args) => {
    const model = args.charAt(0).toUpperCase() + args.slice(1);
    const text = `const ${model} = require('../../models/${args}/${args}Model');

module.exports.get = async (req, res ) => {
    try {
        if (req.params.id) {
            let _item = await ${model}.findById(req.params.id);
            res.status(200).json(_item);
        } else {
            let _items = await ${model}.find({});
            res.status(200).json(_items);
        }
    } catch (err) {
        if( err.kind === 'ObjectId') {
            return res.status(400).json({message: \`ERROR not Found \${req.params.id}\`});
        }
        return res.status(500).json(err);
    }
};

module.exports.post = async (req, res ) => {
    let _item = new ${model}(req.body);
    try {
        let _newItem = await _item.save();
        return res.status(201).json(_newItem);
    } catch (err) {
        if(err.errors.name.kind === 'required') {
            return res.status(400).json({ message: "One field is missing" });
        }
        res.status(500).json(err);
    }
};

module.exports.put = async (req, res ) => {
    try {
        let _item = await ${model}.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true, context: 'query' });
        if (!_item) {
            res.status(404).json({ error: 'Not Found Error ' + ${args} + ' not found'});
        } else {
            res.status(200).json(_item);
        }
    } catch (err) {
        if( err.kind === 'ObjectId') {
            return res.status(400).json({message: \`ERROR not Found \${req.params.id}\`});
        }
        res.status(500).json({ error:'Unknown Server Error' });
    }
};

module.exports.delete = async (req, res ) => {
    try {
        let _item = await ${model}.findOneAndRemove({ _id: req.params.id });
        if (!_item) {
            res.status(404).send({ error: 'Not Found Error ${args} not found' });
        } else {
            res.status(203).json({ message: '${args} Successfully deleted' });
        }
    } catch (err) {
        if( err.kind === 'ObjectId') {
            return res.status(400).json({message: \`ERROR not Found \${req.params.id}\`});
        }
        res.status(500).send('Unknown server error, Unknown server error when trying to delete ${args}');
    }
};
`;
    return text;
};