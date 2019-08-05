const app = require('../../app');
const request = require('supertest');
const mongoDB = require('../../database/database');
const TaskList = require('../../models/taskList/taskListModel');
const initialData = require('./taskList.data.json');

let sampleTask = { name: 'test6', description: 'test6', status: 'To Do' };
const NON_EXISTED_ID = '5c727568118f051c0ca4d0f9';

beforeEach(async () => {
    await mongoDB.connect();
    await TaskList.collection.insertMany(initialData);
});

afterEach((done) => {
    mongoDB.disconnect(done);
});

function validateArray() {
    let result = false;
    initialData.forEach(element => {
        result = TaskList.exists({name : element.name});
        if(result === false)
            return result;
    });
    return result;
};

describe('Test the TASKLIST', () => {
    test('It should response the GET method with 200 status and return an Array of Tasks', async (done) => {
        try {
            const response = await request(app).get('/tasklist');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.any(Array));
            expect(await validateArray()).toBe(true);
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
            expect(response.header["content-type"]).toEqual("application/json; charset=utf-8");
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

//POST
describe('Method POST', () => {
    test('Should Insert a new Task item', async (done) => {
        try {
            let newData = {
                "name": "New Name",
                "description": "test",
                "status": "In progress",
                "notes": "test"
            };
            let taskListBeforePost = await TaskList.find({});
            expect(taskListBeforePost).toHaveLength(initialData.length);
            let response = await request(app).post('/taskList').send(newData);
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(newData);
            let taskListAfterPost = await TaskList.find({});
            expect(taskListAfterPost.length).toEqual(initialData.length + 1);
            done();
        } catch (error) {
            done.fail(error);
        }
    });
    
    test('Should respond 400 when required fields are empty', async (done) => {
        try {
            let invalidData = {
                "name": "",
                "description": "",
                "status": "",
                "notes": ""
            };
            let response = await request(app).post('/taskList').send(invalidData);
            expect(response.status).toBe(400);
            let taskListAfterPost = await TaskList.find({});
            expect(taskListAfterPost.length).toBe(initialData.length);
            done();
        } catch (error) {
            done.fail(error);
        }
    });

});

//PUT
describe('Method PUT', () => {
    test('Should update item with new data', async (done) => {
        try {
            let taskToUpdate = initialData[1];
            let updatedData = {
                "name": "Task Updated",
                "description": "Description Updated",
                "status": "Status Updated",
                "notes": "Notes updated"
            }
            const response = await request(app).put('/taskList/' + taskToUpdate._id).send(updatedData);
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject(updatedData);

            done();
        } catch (error) {
            done.fail(error);
        }
    });
    test('Should respond 400 when unexisting id is send', async (done) => {
        try {
            let updatedData = {
                "name": "Task Updated",
                "description": "Description Updated",
                "status": "Status Updated",
                "notes": "Notes updated"
            }
            let response = await request(app).put('/taskList/' + '111111111111000000000000').send(updatedData);
            expect(response.status).toBe(400);
            done();
        } catch (error) {
            done.fail(error);
        }
    });
});