const mongoDB = require('../../database/database');
const currentModel = require('../../models/taskList/taskListModel');
const initialData = require('./taskList.data.json');

//Parameters

beforeEach(async () => {
    await mongoDB.connect();
    
});

afterEach((done) => {
    mongoDB.disconnect(done);
});

describe(`blablabla model`,() =>{
    test(`Should insert many valid items`, async (done) => {
        try {
            await currentModel.collection.insertMany(initialData);
            done();
        } catch (error) {
            done.fail(error);           
        }
    });
    test('Get required all fields tasklist, exception notes must return an error ', async (done) => {
        try {
            let task1 = new currentModel({
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

    test('Get required dueDate tasklist, must return an error ', async (done) => {
        try {
            let task1 = new currentModel({
                name: "task #1234232",
                description: "Make a lunch",
                dueDate: "",
                status: "Done"
            });
            await task1.save();

            done.fail("Should have a valid dueDate");
        } catch (error) {
            expect(error).toEqual(expect.any(Object));
            expect(error.message).toEqual('TaskList validation failed: dueDate: Path `dueDate` is required.');
            done();
        };
    });

    test('Get required all fields tasklist, exception notes, must return an error ', async (done) => {
        try {
            let task1 = new currentModel({
                notes: "I am a note",
                status: "Done"
            });
            await task1.save();

            done.fail("Should have more fiels");
        } catch (error) {
            expect(error).toEqual(expect.any(Object));
            expect(error.message).toEqual('TaskList validation failed: description: Path `description` is required., name: Path `name` is required.');
            done();
        };
    });

    test('Validate data types in model, must return an error ', async (done) => {
        const dueDate = 'asfas 2wasaf asasf';
        try {
            let task1 = new currentModel({
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

    test('Validate the unique field, must return and error unique field', async (done) => {
        try { 
            let github1 = new currentModel({
                name: "task51",
                description: "Make lunch",
                dueDate: "Thu Aug 08 2019 18:25:00 GMT-0400",
                status: "Done"
            });
            await github1.save();

            let github2 = new currentModel({
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

    test('Validate default date. If dueDate it is void, should be now date by default', async (done) => {
        try {
            let task1 = new currentModel({
                name: "New task list",
                description: "Make the new service",
                status: "To Do"
            });
            let newTask = await task1.save();
            expect(newTask.dueDate.toDateString()).toBe(new Date().toDateString());
            expect(newTask.dueDate.getHours()).toBe(new Date().getHours());
            //expect(newTask.dueDate.getMinutes()).toBe(new Date().getMinutes());
            done();
        } catch (error) {
            done.fail(error);
        };
    });

    test('Validate enum data in status, should response with error, enum validation', async (done) => {
        try {
            let task1 = new currentModel({
                name: "Other task list",
                description: "Make a new service",
                status: "Status"
            });
            await task1.save();

            done.fail(error);
        } catch (error) {
            Object.keys(currentModel.schema.paths).map( path => {
                console.log("PASSED TEST", path);
                let currentPath = error.errors[path];
                if(currentPath) {
                    console.log(" IF TRUE");
                    expect(error.errors[path]).toBeDefined();    
                }
            });
            
            // console.log("ERRORS ", error.errors);
            expect(error.name).toBe('ValidationError');
            done();
        };
    });

    test('Update model, update required fields with void field', async (done) => {
        try {
            let task1 = new currentModel({
                name: "task #1234232",
                description: "Make a lunch",
                status: "To Do"
            });
            let taskSaved = await task1.save();

            let taskUpdate = {
                name: "task #9",
                description: "Take a rest"
            };
            let response = await currentModel.findOneAndUpdate({ _id: taskSaved._id }, taskUpdate, done);

            expect(response).toMatchObject(taskUpdate);
            expect(response.name).toBe(taskUpdate.name);
            expect(response.description).toBe(taskUpdate.description);

            done();
        } catch (error) {
            done.fail(error);
        };
    });

    test('Update model, update a taskList name with a field that already exist', async (done) => {
        try {
            let task1 = new currentModel({
                name: "task #12",
                description: "Make a service",
                status: "To Do"
            });
            let task1Saved = await task1.save();

            let task2= new currentModel({
                name: "task #13",
                description: "Make a function",
                status: "In progress"
            });
            let task2Saved = await task2.save();

            let response = await currentModel.findOneAndUpdate({_id: task2Saved._id}, { name: task1.name }, { new: true, runValidators: true, context: 'query' } );

            done.fail("ERROR item save duplicate key");
        } catch (error) {
            expect(error).toEqual(expect.any(Object));
            done();
        };
    });

    test('Delete a taskList, should not exits at list', async (done) => {
        try {
            let task1 = new currentModel({
                name: "task #1234232",
                description: "Make a lunch",
                status: "To Do"
            });
            let taskSaved = await task1.save();

            let response = await currentModel.findOneAndDelete({ _id: taskSaved._id }, done);
            // let response1 = await TaskList.findOne({ _id: taskSaved._id });
            // console.log()
            expect(response).toBe(null);

            done();
        } catch (error) {
            done.fail(error);
        };
    });
});