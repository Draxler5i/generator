const app = require('../../app');
const request = require('supertest');
const mongoDB = require('../../database/database');
const TaskList = require('../../models/taskList/taskListModel');
const initialData = require('./taskList.data.json');

let sampleTask = {name: 'test6', description: 'test6', status: 'To Do'};
const NON_EXISTED_ID = '5c727568118f051c0ca4d0f9';

beforeEach(async () => {
    await mongoDB.connect();
    await TaskList.collection.insertMany(initialData);
});

afterEach((done) => {
    mongoDB.disconnect(done);
});

describe('Test the TASKLIST', () => {
    test('It should response the GET method with 200 status and return an Array of Tasks', async (done) => {
        try {
            let i = 0;
            const response = await request(app).get('/tasklist');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.any(Array));
            response.body.forEach(element => {
                let sampleData = initialData[i];
                delete sampleData._id;
                expect(element).toMatchObject(sampleData)
                i++;
            });
            expect(response.body.length).toBe(initialData.length);
            expect(response.header["content-type"]).toEqual("application/json; charset=utf-8");
            done();
        } catch (error) {
            done.fail(error);
        }
    });
    test('It should response the GET method by ID with 200 status and return Task Object', async (done) => {
        try {
            let newTask = await (new TaskList(sampleTask)).save(); 
            const response = await request(app).get('/tasklist/' + newTask._id);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.any(Object));
            expect(response.body).toMatchObject(sampleTask);
            expect(response.header["content-type"]).toEqual("application/json; charset=utf-8");
            done();
        } catch (error) {
            done.fail(error);
        }
    });
    test('It should response the GET method by ID with 404 status when Non-existed ID is sended', async (done) => {
        try {
            const response = await request(app).get('/tasklist/' + NON_EXISTED_ID);
            expect(response.status).toBe(404);
            expect(response.header["content-type"]).toEqual("application/json; charset=utf-8");
            done()
        } catch (error) {
            done.fail(error)
        }
    });
    test('It should response the DELETE method with 204 status and Delete the Task', async (done) => {
        try {
            let newTask = await (new TaskList(sampleTask)).save(); 
            let numberOfTasks = await TaskList.count();
            const response = await request(app).delete('/tasklist/' + newTask._id);
            let updatedNumberOfTasks = await TaskList.count();
            expect(response.status).toEqual(203);
            expect(updatedNumberOfTasks).toBe(numberOfTasks - 1);
            done();
        } catch (error) {
            done.fail(error)            
        }
    });
    test('It should response the DELETE method with 404 status when Non-existed ID is sended', async (done) => {
        try {
            const response = await request(app).delete('/tasklist/' + NON_EXISTED_ID);
            expect(response.status).toEqual(404);
            expect(response.header["content-type"]).toEqual("application/json; charset=utf-8");
            done();
        } catch (error) {
            done.fail(done);
        }
    });
});