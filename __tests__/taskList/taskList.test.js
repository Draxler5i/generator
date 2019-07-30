const app = require('../../app');
const request = require('supertest');
const mongoDB = require('../../database/database');
const TaskListModel = require('../../models/taskList');
const dataList = require('./taskList.data.json');// initial data

beforeEach(async () => {
    await mongoDB.connect();
    await TaskListModel.collection.insert(dataList);
});

afterEach((done) => {
    mongoDB.disconnect(done);
});

describe('Get all list task1', () => {
    test('Must be return all tasks1', async (done) => {
        try {
            let taskList = [{ name: 'test', desc: 'test', status: 'todo', dueDate: 'date' }];
            let item = new TaskListModel(taskList);
            await item.save();
            console.log("ID: ", item.id);
            let tasks = await TaskListModel.find({}).exec();
            expect(tasks.length).toBe(4);
            done();
        } catch (error) {
            done.fail(error);
        }
    });
})

describe('Get all list task2', () => {
    test('Must be return all tasks2', async (done) => {
        try {
            let taskList = [{ name: 'test', desc: 'test', status: 'todo', dueDate: 'date' }];
            let item = new TaskListModel(taskList);
            await item.save();
            console.log("ID: ", item.id);
            let tasks = await TaskListModel.find({}).exec();
            expect(tasks.length).toBe(4);
            done();
        } catch (error) {
            done.fail(error);
        }
    });
})

describe('Get all list task3', () => {
    test('Must be return all tasks3', async (done) => {
        try {
            let taskList = [{ name: 'test', desc: 'test', status: 'todo', dueDate: 'date' }];
            let item = new TaskListModel(taskList);
            await item.save();
            console.log("ID: ", item.id);
            let tasks = await TaskListModel.find({}).exec();
            expect(tasks.length).toBe(4);
            done();
        } catch (error) {
            done.fail(error);
        }
    });
})