const currentModel = require('../../models/user/userModel');
const standardTestModel = require('../StandardModel');

const NON_EXISTING_ID = '111111111111000000000000';
const modelName = 'User';
const REQUIRED_FIELDS = ["email"];
const UNIQUE_FIELDS = ["email"];
const DEFAULT_FIELDS = [{ name: "roles", value: "User" }];
const ENUM_FIELDS = [{ name: "roles", value: ["Amin", "User"] }];

const allFields = {
    email: "task #1",
    roles: "Make a function",
    timestamps: ""
}

const withouthDefaultData = {
    email: "task #1",
    roles: "Make a function",
    timestamps: ""
}

const voidData = {
    email: "",
    roles: "",
    timestamps: ""
}

const updateData = {
    email: "task #2",
    roles: "Make a Class",
    timestamps: ""
}

const minimumFields = {
    email: "task data",
    roles: "Done",
    timestamps: ""
}

const extraData = {
    email: "task #2",
    roles: "Make a Class",
    timestamps: "",
    owner: "user1",
    deathLine: new Date("2019,10,10")
}

const structureModel = {
    email: expect.any(String),
    roles: expect.any(String),
    timestamps: expect.any(String)
}

standardTestModel({
    currentModel,
    NON_EXISTING_ID,
    modelName,
    REQUIRED_FIELDS,
    UNIQUE_FIELDS,
    DEFAULT_FIELDS,
    ENUM_FIELDS,
    allFields,
    withouthDefaultData,
    voidData,
    updateData,
    minimumFields,
    extraData,
    structureModel });