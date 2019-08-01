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

describe('Get required all fields tasklist, exception notes', () => {
    test('Must be return an error ', async (done) => {
        try {
            let task1 = new TaskList({
                notes: "I am a note"
            });
            await task1.save();

            done.fail("Should have more fiels");
        } catch (error) {
            expect(error).toEqual(expect.any(Object));
            expect(error.message).toEqual('TaskList validation failed: status: Path `status` is required., description: Path `description` is required., name: Path `name` is required.');
            done();
        };
    });
});

describe('Get required dueDate tasklist', () => {
    test('Must be return an error ', async (done) => {
        try {
            let task1 = new TaskList({
                name: "task #1234232",
                description: "Make a lunch",
                dueDate: "",
                status: "Done"
            });
            await task1.save();

            done.fail("Should not save duplicate fiels");
        } catch (error) {
            expect(error).toEqual(expect.any(Object));
            expect(error.message).toEqual('TaskList validation failed: dueDate: Path `dueDate` is required.');
            done();
        };
    });
});

describe('Get required all fields tasklist, exception notes', () => {
    test('Must be return an error ', async (done) => {
        try {
            let task1 = new TaskList({
                notes: "I am a note"
            });
            await task1.save();

            done.fail("Should have more fiels");
        } catch (error) {
            expect(error).toEqual(expect.any(Object));
            expect(error.message).toEqual('TaskList validation failed: status: Path `status` is required., description: Path `description` is required., name: Path `name` is required.');
            done();
        };
    });
});

describe('Validate data types in model', () => {
    test('Must be return an error ', async (done) => {
        const dueDate = 'asfas 2wasaf asasf';
        try {
            let task1 = new TaskList({
                name: 124214,
                description: false,
                dueDate,
                status: false,
                notes: () => ({ message: 'Not work' })
            });
            await task1.save();

            done.fail("There are not type of fields");
        } catch (error) {
            expect(error).toEqual(expect.any(Object));
            expect(error.message).toEqual('TaskList validation failed: dueDate: Cast to Date failed for value "' + dueDate + '" at path "dueDate", status: `false` is not a valid enum value for path `status`.');
            done();
        };
    });
});

describe('Validate the unique field', () => {
    test('Must be return and error unique field', async (done) => {
        try {
            // let result = await request(app).get('/github');
            // expect(result.status).toBe(200);    
            let github1 = new TaskList({
                name: "task51",
                description: "Make lunch",
                dueDate: "Thu Aug 08 2019 18:25:00 GMT-0400",
                status: "Done"
            });
            await github1.save();

            let github2 = new TaskList({
                name: "task51",
                description: "Make dinner",
                dueDate: "Thu Aug 08 2019 18:25:00 GMT-0400",
                status: "Done"
            });
            await github2.save();

            done.fail("Should not save duplicate name");
        } catch (error) {
            expect(error).toEqual(expect.any(Object));
            expect(error.message).toEqual('TaskList validation failed: name: Error, expected `name` to be unique. Value: `task51`');
            done();
        };
    });
});