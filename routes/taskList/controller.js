const TaskList = require('../../models/taskList/taskListModel');

module.exports.get = async (req, res ) => {
    try {
        if (req.params.id) {
            let item = await TaskList.findById(req.params.id)
                .exec((err, taskLists) => {
                    if (!err) {
                        res.status(200).send(taskLists);
                    } else {
                        return res.status(404).json({ message: 'No such' + TaskList });
                    }
                });
        } else {
            let items = await TaskList.find({})
                .exec((err, taskList) => {
                    if (!err) {
                        res.status(200).send(taskList);
                    } else {
                        return res.status(404).json({ message: 'No such' + TaskList });
                    }
                });
        }
    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports.post = async (req, res ) => {
    let item = new TaskList(req.body);
    try {
        let newItem = await item.save();
        return res.status(201).json({ message: 'TaskList created!' });
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports.put = async (req, res ) => {
    try {
        let item = await TaskList.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (!item) {
            return status.status(404).send({ error: 'Not Found Error ' + taskList + ' not found'});
        } else {
            res.status(200).send({ message: 'TaskList updated!'});
        }
    } catch (err) {
        res.status(500).send({ error:'Unknown Server Error' });
    }
};

module.exports.delete = async (req, res ) => {
    try {
        let item = await TaskList.findOneAndRemove({ _id: req.params.id });
        if (!item) {
            return res.status(404).send({ error: 'Not Found Error taskList not found' });
        } else {
            return res.status(203).json({ message: 'taskList Successfully deleted' });
        }
    } catch (err) {
        return res.status(500).send('Unknown server error, Unknown server error when trying to delete taskList');
    }
};
