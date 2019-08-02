const app = require('../../app');
const request = require('supertest');
const mongoDB = require('../../database/database');
const TaskList = require('../../models/taskList/taskListModel');
const initialData = require('./taskList.data.json');

beforeEach(async () => {
    await mongoDB.connect();
    await TaskList.collection.insertMany(initialData);
});

afterEach((done) => {
    mongoDB.disconnect(done);
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

            // Compare if length of InitialData after Method Post.
            let taskListBeforePost = await TaskList.find({});
            expect(taskListBeforePost).toHaveLength(initialData.length);
            // Status test.
            let response = await request(app).post('/taskList').send(newData);
            expect(response.status).toBe(201);
            
            expect(response.body).toMatchObject(newData);
            
            // Compare if length of InitialData before Method Post.
            let taskListAfterPost = await TaskList.find({});
            expect(taskListAfterPost.length).toEqual(initialData.length+1);
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
            let response = await request(app).put('/taskList/'+'111111111111000000000000').send(updatedData);
            expect(response.status).toBe(400);
            done();
        } catch (error) {
            done.fail(error);
        }    
    });
});
