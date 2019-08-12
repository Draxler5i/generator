const mongoDB = require('../../database/database');
const PersonModel = require('../../models/person/personModel');
const TaskListModel = require('../../models/taskList/taskListModel');

let task = {
    name: "name1", 
    description: "test1", 
    status: "In progress", 
    notes: "test1"
}

const structureModel = {
    name: expect.any(String),
    task: expect.any(Object),
}

beforeAll(async () => {
    await mongoDB.connect();
});

afterAll((done) => {
    mongoDB.disconnect(done);
})

describe('Validate ObjectID field', () => {
    test('Testing ObjectID and populate', async (done) => {
        try {
            let newTask = new TaskListModel(task);
            let newPerson = new PersonModel({ name: "test", task: newTask._id })
            await newTask.save();
            await newPerson.save();
            let response = await PersonModel.findById({ _id: newPerson._id}).populate('task');
            expect(response).toEqual(expect.objectContaining(structureModel));
            expect(response.task).toEqual(expect.any(Object));
            await newTask.deleteOne();
            response = await PersonModel.findById({ _id: newPerson._id}).populate('task');
            expect(response.task).toBeNull();
            done();
        } catch (error) {
            done.fail(error);
        }
    })
});
