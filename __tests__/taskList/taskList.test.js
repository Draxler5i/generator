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

//#####################################VALIDATE MODEL
describe('Creating taskLists', () => {
    test('Creating a taskList', (done) => {
        const task = new TaskList({
            name: "taks1",
            description: "Desc of task1",
            dueDate: "Thu Aug 01 2019 09:44:26 GMT-0400",
            status: "In progress",
            notes: "Hurry!"
        });
        task.save()
            .then( () => {
                expect(task.isNew).toBe(false); //If is save to db it is not new
                done();
            });
    });
});

describe('Reading taskList details', () => {
    test('finds tasklist with the name of programming', (done) => {
        TaskList.findOne({ name: 'programming' })
            .then( ({ name }) => {
                // console.log("TASK ",tasklist);
                expect(name).toEqual('programming');
                done();
            });
    });
});

describe('Deleting a taskList', () => {
    test('Remove a taskList using its instance', (done) => {
        TaskList.deleteOne({ name: 'programming'})
            .then( TaskList.findOne({ name: 'programming'}))
            .then( ({ name, description, dueDate, status, notes }) => {
                expect( name ).toBe(undefined);
                expect( description ).toBe(undefined);
                expect( dueDate ).toBe(undefined);
                expect( status ).toBe(undefined);
                expect( notes ).toBe(undefined);
                done();
            });
    });
});

describe('Deleting taskLists', () => {
    test('Remove multiple taskLists', (done) => {
        TaskList.deleteOne({ name: 'name'})
            .then( TaskList.find({ name: 'name'}))
            .then( ({ deletedCount }) => {
                expect( deletedCount ).toBe(1);
                done();
            });
    });
});


//#####################################API
describe('Get all list of taskList', () => {
    test('Must be return all taskList', async (done) => {
        try {
            let result = await request(app).get('/taskList');
            expect(result.status).toBe(200);
            let numberOfTasks = result.body.length;
            result.body.forEach(element => {
                expect(element).toHaveProperty("name");
            });
            expect(numberOfTasks).toEqual(5);
            expect(result.body).toEqual(expect.any(Array));
            // result.body.forEach(element => {
            //     var task = new TaskList(element);
            //     task.validate(function (err) {
            //         expect(err).toBeNull();
            //         done();
            //     });
            // });
            done();
        } catch (error) {
            done.fail(error);
        }
    });
});

describe('Verify the TaskList model', () => {
    test('Must verify all the TaskList properties', async (done) => {
        try {
            let result = await request(app).get('/taskList');
            expect(result.status).toBe(200);
            let task = new TaskList();
            // task.save(function(error) {
            //     console.log(error);
            // });
            done();

        } catch (error) {
            done.fail(error);
        }
    });
});

//GET
describe('taskList get return TaskList', () => {
    test('Should response taskList', async (done) => {
        try {
            const response = await request(app).get('/taskList');
            expect(response.status).toBe(200);
            // expect(response.body).toMatchObject({ });
            done();
        } catch (error) {
            done.fail(error);
        }
    });
});

// //GETBYID
// describe('taskList get by ID, with an id of object does not exist', () => {
//     test('Should response with a error for http', async (done) => {
//         try {
//             let item = {
//                 _id: "13safs3wrmk56kj564k"
//             };        
//             const response = await request(app).get('/taskList/'+item._id);
//             expect(response.status).toBe(404);
//             // expect(response.body).toMatchObject({
//             //
//             //     });
//             done();
//         } catch (error) {
//             done.fail(error);
//         }
//     });
// });

// //POST
// describe('Method post, after should send the taskList object and compare', () => {
//     test('Should response with the new taskList', async (done) => {
//         try {
//             const newtaskList = { };
//             const response = await request(app).post('/taskList').send(newtaskList);
//             expect(response.status).toBe(201);
//             // expect(response.body).toMatchObject({});
//             done();
//         } catch (error) {
//             done.fail(error);
//         }
//     });
// });

// //PUT
// describe('Method put, after should send the a message', () => {
//     test('Should UPDATE a taskList', async (done) => {
//         try {
//             let taskList = { };
//             let item = new TaskList(taskList);
//             item.save();

//             let updatetaskList = { }
//             const response = await request(app).put('/taskList/'+item._id).send(updatetaskList);
//             expect(response.status).toBe(200);
//             // expect(response.body).toMatchObject({});
//             done();
//         } catch (error) {
//             done.fail(error);
//         }    
//     });
// });

// //PUT
// describe('Method put, after should send the new data, with wrong ID', () => {
//     test('Should response with an ERROR MESSAGE', async (done) => {
//         try {
//             let taskList = { };
//             let item = new TaskList(taskList);
//             item.save();

//             let updatetaskList = { };
//             //ID not exist in DB
//             const id = "2i43iusay34nm1214";
//             const response = await request(app).put('/taskList/'+id).send(updatetaskList);
//             expect(response.status).toBe(500);
//             // expect(response.body).toMatchObject({
//             //
//             //     });
//             done();
//         } catch (error) {
//             done.fail(error);
//         }
//     });
// });

// // DELETE METHOD review the response of controller
// describe('Method delete, should send a string verication for delete', () => {
//     test('Should delete a taskList', async (done) => {
//         try {
//             const taskList = { };

//             let item = new TaskList(taskList);
//             item.save();

//             const response = await request(app).delete('/taskList/'+item._id);
//             expect(response.status).toBe(203);
//             // expect(response.body).toMatchObject({});
//             done();
//         } catch (error) {
//             done.fail(error);
//         }
//     });
// });

// // DELETE METHOD review the response of controller
// describe('Method delete of unknow ID', () => {
//     test('Should response with an error', async (done) => {
//         try {
//             const taskList = { };

//             let item = new TaskList(taskList);
//             item.save();

//             const id = '5ceeae0e96665d29c824d12easxz'
//             const response = await request(app).delete('/taskList/'+id);
//             expect(response.status).toBe(500);
//             // expect(response.body).toMatchObject({
//             //         
//             //     });
//             done();
//         } catch (error) {
//             done.fail(error);
//         }
//      });
// });