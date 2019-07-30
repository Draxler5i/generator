const app = require('../../app');
const request = require('supertest');
const mongoDB = require('../../database/database');
const TaskListModel = require('../../models/taskList');


beforeAll(async () => {
    await mongoDB.connect();
    //await UserModel.collection.insert(dataUsers)
});

afterAll((done) => {
    mongoDB.disconnect(done);
});

describe('Get all list task', () => {
    test('Must be return all tasks', async (done) =>{
        // let taskList = [{name: 'test', desc: 'test', status: 'todo', dueDate: 'date'}]
        let result = await request(app).get('/example');
        expect(result.body).toMatchObject([]);
        expect(result.status).toBe(200);
        
        done();
    });
})



