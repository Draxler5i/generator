const TaskList = require('../../models/taskList/taskListModel');

module.exports.get = async (req, res) => {
    try {
        if (req.params.id) {
            let item = await TaskList.findById(req.params.id)
            if(!item) {
                return res.status(400).json({message: 'No such Task'});
            }
            return res.status(200).json(item);
        } else {
            let items = await TaskList.find({})
            return res.status(200).json(items);
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports.post = async (req, res) => {
    let item = new TaskList(req.body);
    try {
        let newItem = await item.save();
        return res.status(201).json(newItem);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

module.exports.put = async (req, res) => {
    try {
        let item = await TaskList.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (!item) {
            return res.status(400).json({ error: 'Not Found Error ' + item + ' not found' });
        } else {
            return res.status(200).json(item);
        }
    } catch (err) {
        return res.status(500).json({ error: 'Unknown Server Error' });
    }
};

module.exports.delete = async (req, res) => {
    try {
        let item = await TaskList.findOneAndRemove({ _id: req.params.id });
        if (!item) {
            return res.status(400).json({ error: 'Not Found Error taskList not found' });
        } else {
            return res.status(203).json({ message: 'taskList Successfully deleted' });
        }
    } catch (err) {
        return res.status(500).json('Unknown server error, Unknown server error when trying to delete taskList');
    }
};
