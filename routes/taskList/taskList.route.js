const express = require('express');
const router = express.Router();
const TaskList = require('../../models/taskList');

router.get('/', async (req, res) => {
    const tasksList = await TaskList.find();
    res.json(tasksList);
});

router.get('/:id', async (req, res) => {
    const taskList = await TaskList.findById(req.params.id);
    res.json(taskList);
});

router.post('/', async (req, res) => {
    const { name, description, status, dueDate } = req.body;
    const TaskList = new TaskList({name, description, status, dueDate});
    await TaskList.save();
    res.json({status: 'TaskList Saved!'});
});

router.put('/:id', async (req, res) => {
    const { name, description, status, dueDate } = req.body;
    const newTaskList = { name, description, status, dueDate };
    await TaskList.findByIdAndUpdate(req.params.id, newTaskList);
    res.json({status: 'TaskList Updated!'});
});

router.delete('/:id', async (req, res) => {
    await TaskList.findByIdAndRemove(req.params.id);
    res.json({status: 'TaskList Deleted!'})
});

module.exports = router;