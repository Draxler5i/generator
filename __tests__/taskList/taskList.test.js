const currentModel = require('../../models/taskList/taskListModel');
const initialData = require('./taskList.data.json');
const testRoutes = require('../StandardRoutes');

//Parameters
const modelName = 'Task';
const route = '/tasklist';
const NON_EXISTING_ID = '111111111111000000000000';
let invalidData = {
    "name": "",
    "description": "",
    "status": "",
    "notes": ""
};
let newData = {
    "name": "New Name",
    "description": "test",
    "status": "In progress",
    "notes": "test"
};
let updatedData = {
    "name": "Task Updated",
    "description": "Description Updated",
    "status": "Status Updated",
    "notes": "Notes updated"
}

testRoutes({ modelName, route, currentModel, NON_EXISTING_ID, 
    initialData, newData, updatedData, invalidData });