const mongoDB = require('../../database/database');
const TaskListModel = require('../../models/taskList/taskListModel');
const initialData = require('./taskList.data.json');

//Parameters
const NON_EXISTING_ID = '111111111111000000000000';
const modelName = 'Task';
const REQUIRED_FIELDS = ["name", "description", "status"];
const UNIQUE_FIELDS = ["name"];
const DEFAULT_FIELDS = [{ name: "priority", value: "Low" }];
const ENUM_FIELDS = [{ name: "status", value: ["To Do", "In progress", "Done"] }];

const allFields = {
    name: "task #1",
    description: "Make a function",
    status: "To Do",
    priority: "High",
    dueDate: new Date("2019,10,10"),
    notes: " There are not notes"
}
const withouthDefaultData = {
    name: "task #1",
    description: "Make a function",
    status: "To Do",
    dueDate: new Date("2019,10,10"),
    notes: " There are not notes"
}
const voidData = {
    name: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
    notes: ""
}

const updateData = {
    name: "task #1",
    description: "Make a Class",
    status: "In progress",
    priority: "low",
    dueDate: new Date("2020,01,01"),
    notes: " With 5 parameters"
}

const minimumData = {
    name: "task data",
    status: "Done",
    description: "Minimum data"
}

const extraData = {
    name: "task #2",
    description: "Make a Class",
    status: "In progress",
    priority: "low",
    dueDate: new Date("2020,01,01"),
    notes: " With 5 parameters",
    owner: "user1",
    deathLine: new Date("2019,10,10")
}

const minParamsModel = ["name", "description", "priority", "status"];
const typeError = { isRequired: "required", date: "Date", unique: "unique", enum: "enum" };

const structureModel = {
    name: expect.any(String),
    description: expect.any(String),
    dueDate: expect.any(Date),
    priority: expect.any(String),
    status: expect.any(String),
    notes: expect.any(String)
}

function testModel(parameters) {
    let {
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
        minimumData,
        extraData,
        minParamsModel,
        typeError,
        structureModel 
    } = parameters;

    beforeEach(async () => {
        await mongoDB.connect();
    });
    
    afterEach((done) => {
        mongoDB.disconnect(done);
    });
    
    const getValueForPath = (obj, searchValue, { searchKeys = typeof searchValue === "string", maxDepth = 10 } = {}) => {
        let valueParam = null;
        const notObject = typeof searchValue !== "object";
        const gvpio = (obj, maxDepth) => {
            if (!maxDepth) return;
            for (const [curr, currElem] of Object.entries(obj)) {
                if (searchKeys && curr === searchValue) {
                    valueParam = currElem;
                    break;
                }
                if (typeof currElem === "object") {
                    gvpio(currElem, maxDepth - 1);
                    if (notObject) continue;
                }
                if (currElem === searchValue) {
                    valueParam = currElem;
                    break;
                }
            }
        }
        gvpio(obj, maxDepth);
        return valueParam;
    }
    
    expect.extend({
        toHaveSpecificError(received, expected) {
            const existsPathInError = getValueForPath(received, "kind");
            const pass = existsPathInError === expected;
            if (pass) {
                return {
                    message: () =>
                        `expected ${received} to match ${expected.length} key(s) ${expected}`,
                    pass: true,
                };
            } else {
                return {
                    message: () =>
                        `expected ${JSON.stringify(received)} to match ${expected.length} key(s) ${expected} but received ${Object.keys(received)}`,
                    pass: false,
                };
            }
        },
    });

    const FIND_FIELDS_WITH_ATTRIBUTE = (attribute, hasAttribute) => {
        return Object.values(currentModel.schema.paths).filter(field => {
            if (field.options.hasOwnProperty(attribute) && hasAttribute) {
                return field;
            } else {
                if (!field.options.hasOwnProperty(attribute) && !hasAttribute) {
                    return field;
                }
            };
        });
    }

    const REQUIRED_FIELDS_MODEL = FIND_FIELDS_WITH_ATTRIBUTE('required', true);
    const UNIQUE_FIELDS_MODEL = FIND_FIELDS_WITH_ATTRIBUTE('unique', true);
    const DEFAULT_FIELDS_MODEL = FIND_FIELDS_WITH_ATTRIBUTE('default', true);
    const ENUM_FIELDS_MODEL = FIND_FIELDS_WITH_ATTRIBUTE('enum', true);

    describe(`Validate REQUIRED fields for ${modelName}`, () => {
        test(`Should match all REQUIRED fields for ${modelName}`, (done) => {
            if (REQUIRED_FIELDS_MODEL.length > 0) {
                REQUIRED_FIELDS_MODEL.map(modelField => {
                    const field = REQUIRED_FIELDS.find(f => f === modelField.path);
                    expect(field).toBe(modelField.path);
                });
            } else {
                console.log(`Model ${modelName} doesn't have required fields defined`);
            }
            done();
        });
    
        test(`Should match all NON REQUIRED fields for ${modelName}`, (done) => {
            const non_required_fields_model = FIND_FIELDS_WITH_ATTRIBUTE('required', false);
            if (non_required_fields_model.length > 0) {
                non_required_fields_model.map(modelField => {
                    const field = REQUIRED_FIELDS.find(f => f === modelField.path);
                    expect(field).toBeUndefined();
                });
            }
            done();
        });
    });
    
    describe(`Validate UNIQUE fields for ${modelName}`, () => {
        test(`Should match all UNIQUE fields for ${modelName}`, (done) => {
            if (UNIQUE_FIELDS_MODEL.length > 0) {
                UNIQUE_FIELDS_MODEL.map(modelField => {
                    const field = UNIQUE_FIELDS.find(f => f === modelField.path);
                    expect(field).toBe(modelField.path);
                });
            } else {
                console.log(`Model ${modelName} deosn't have unique fields defined`);
            }
            done();
        });
    
        test(`Should match all NON UNIQUE fields for ${modelName}`, (done) => {
            const non_unique_fields_model = FIND_FIELDS_WITH_ATTRIBUTE('unique', false);
            if (non_unique_fields_model.length > 0) {
                non_unique_fields_model.map(modelField => {
                    const field = UNIQUE_FIELDS.find(f => f === modelField.path);
                    expect(field).toBeUndefined();
                });
            }
            done();
        });
    });
    
    describe(`Validate DEFAULT fields for ${modelName}`, () => {
        test(`Should match all DEFAULT fields for ${modelName}`, (done) => {
            if (DEFAULT_FIELDS_MODEL.length > 0) {
                DEFAULT_FIELDS_MODEL.map(modelField => {
                    const field = DEFAULT_FIELDS.find(f => f.name === modelField.path);
                    expect(field.name).toBe(modelField.path);
                });
            } else {
                console.log(`Model ${modelName} deosn't have default fields defined`);
            }
            done();
        });
    
        test(`Should match all NON DEFAULT fields for ${modelName}`, (done) => {
            const non_default_fields_model = FIND_FIELDS_WITH_ATTRIBUTE('default', false);
            if (non_default_fields_model.length > 0) {
                non_default_fields_model.map(modelField => {
                    const field = UNIQUE_FIELDS.find(f => f.name === modelField.path);
                    expect(field).toBeUndefined();
                });
            }
            done();
        });
    });
    
    describe(`Validate ENUM fields for ${modelName}`, () => {
        test(`Should match all DEFAULT fields for ${modelName}`, (done) => {
            if (ENUM_FIELDS_MODEL.length > 0) {
                ENUM_FIELDS_MODEL.map(modelField => {
                    const field = ENUM_FIELDS.find(f => f.name === modelField.path);
                    expect(field.name).toBe(modelField.path);
                    expect(field.value).toEqual(expect.arrayContaining(modelField.enumValues));
                });
            } else {
                console.log(`Model ${modelName} deosn't have enum fields defined`);
            }
            done();
        });
    
        test(`Should match all NON ENUM fields for ${modelName}`, (done) => {
            const non_enum_fields_model = FIND_FIELDS_WITH_ATTRIBUTE('enum', false);
            if (non_enum_fields_model.length > 0) {
                non_enum_fields_model.map(modelField => {
                    const field = ENUM_FIELDS.find(f => f.name === modelField.path);
                    expect(field).toBeUndefined();
                });
            }
            done();
        });
    });

    ////OLD TESTS
    describe(`INSERT items for ${modelName}`, () => {
        test(`Should INSERT a new ${modelName} item with all fields`, async (done) => {
            try {
                const item = new currentModel(allFields);
                item.validate(function (err) {
                    expect(err).toBeNull();
                });
                const response = await item.save();
                expect(response).toEqual(expect.objectContaining(structureModel));
                expect(response).toMatchObject(allFields);
    
                done();
            } catch (error) {
                done.fail(error);
            };
        });

        test(`Should INSERT a new ${modelName} item with default data`, async (done) => {
            try {
                const item = new currentModel(withouthDefaultData);
                item.validate(function (err) {
                    expect(err).toBeNull();
                });
                const response = await item.save();
                expect(response).toMatchObject(withouthDefaultData);
    
                if (DEFAULT_FIELDS.length > 0) {
                    DEFAULT_FIELDS.map(defaultField => {
                        expect(response[defaultField.name]).toBeDefined();
                        expect(response[defaultField.name]).toBe(defaultField.value);
                    });
                }
    
                done();
            } catch (error) {
                done.fail(error);
            };
        });
    
        test(`Should INSERT a new ${modelName} item with minimum fields`, async (done) => {
            try {
                const item = new currentModel(minimumData);
                item.validate(function (err) {
                    expect(err).toBeNull();
                });
                const response = await item.save();
                expect(response).toMatchObject(minimumData);
    
                if (DEFAULT_FIELDS.length > 0) {
                    DEFAULT_FIELDS.map(defaultField => {
                        expect(response[defaultField.name]).toBeDefined();
                        expect(response[defaultField.name]).toBe(defaultField.value);
                    });
                }
    
                done();
            } catch (error) {
                done.fail(error);
            };
        });
    
        test(`Should insert many valid ${modelName} items`, async (done) => {
            try {
                const data = await currentModel.collection.insertMany(initialData);
                expect(data.insertedCount).toBe(initialData.length);
                expect(data.result.ok).toBe(1);
                expect(data.ops).toEqual(expect.any(Array));
    
                done();
            } catch (error) {
                done.fail(error);
            }
        });
    
        test(`Should NOT INSERT a new ${modelName} item and reply with an error`, async (done) => {
            try {
                const item = new currentModel({});
                await item.save();
    
                done.fail("Should have more fields");
            } catch (error) {
                expect(error.errors).toHaveSpecificError(typeError.isRequired);
                done();
            };
        });
    
        test(`Should NOT INSERT a new ${modelName} with void fields and reply with an error`, async (done) => {
            try {
                const item = new currentModel(voidData);
                await item.save();
    
                done.fail("Should have more fields");
            } catch (error) {
                expect(error.errors).toHaveSpecificError(typeError.isRequired);
                done();
            };
        });
    
        test(`Should insert a new ${modelName} that has extra data but just save ${modelName} fields`, async (done) => {
            try {
                const item = new currentModel(extraData);
                const response = await item.save();
                expect(response).toEqual(expect.objectContaining(structureModel));
                done();
            } catch (error) {
                done.fail("There are not type of fields");
            };
        });
    });
    
    describe(`UPDATE items for ${modelName}`, () => {
        test(`Should UPDATE a new ${modelName} and reply the same`, async (done) => {
            try {
                const item = new currentModel(allFields);
                const itemSaved = await item.save();
                const response = await currentModel.findOneAndUpdate({ _id: itemSaved._id }, updateData, { new: true, runValidators: true, context: 'query' });
                expect(response).toEqual(expect.objectContaining(structureModel));
    
                done();
            } catch (error) {
                done.fail(error);
            };
        });
    
        test(`Should NOT UPDATE a new ${modelName} item with an unique value repeated`, async (done) => {
            try {
                const item1 = new currentModel(allFields);
                await item1.save();
    
                const item2 = new currentModel(extraData);
                const itemSaved = await item2.save();
    
                await currentModel.findOneAndUpdate({ _id: itemSaved._id }, allFields, { new: true, runValidators: true, context: 'query' });
    
                done.fail("Should not save duplicate name");
            } catch (error) {
                expect(error.errors).toHaveSpecificError(typeError.unique);
                done();
            };
        });
    
        test(`Should NOT UPDATE a new ${modelName} item with extra fields`, async (done) => {
            try {
                const item1 = new currentModel(allFields);
                const itemSaved = await item1.save();
                const response = await currentModel.findOneAndUpdate({ _id: itemSaved._id }, extraData, { new: true, runValidators: true, context: 'query' });
                expect(response).toEqual(expect.objectContaining(structureModel));
                done();
            } catch (error) {
                done.fail(error);
            };
        });
    
        test(`Should NOT UPDATE the ${modelName} item and reply with a null response`, async (done) => {
            try {
                const item = new currentModel(allFields);
                await item.save();
                const response = await currentModel.findOneAndUpdate({ _id: NON_EXISTING_ID }, extraData, { new: true, runValidators: true, context: 'query' });
                expect(response).toBe(null);
    
                done();
            } catch (error) {
                done.fail(error);
            };
        });
    });
    
    describe(`DELETE items for ${modelName}`, () => {
        test(`Should DELETE the ${modelName} item and reply with the same MODEL item`, async (done) => {
            try {
                const item = new currentModel(allFields);
                const itemSaved = await item.save();
                const response = await currentModel.findOneAndDelete({ _id: itemSaved._id });
                expect(response).toEqual(expect.objectContaining(structureModel));
    
                done();
            } catch (error) {
                done.fail(error);
            };
        });
    
        test(`Should NOT DELETE the ${modelName} item and reply with a null response`, async (done) => {
            try {
                const item = new currentModel(allFields);
                await item.save();
                const response = await currentModel.findOneAndDelete({ _id: NON_EXISTING_ID });
                expect(response).toBe(null);
    
                done();
            } catch (error) {
                done.fail(error);
            };
        });
    });
    
    let validData = []
    
    describe(`Validate VALID ${modelName} data`, () => {
        validData.map((data, index) => {
            test(`Valid data #${index}`, async (done) => {
                try {
                    let item = new currentModel(data);
                    item.validate(function (err) {
                        expect(err).toBeNull();
                    });
                    done();
                } catch (error) {
                    done.fail(error)
                }
            });
        });
    });
    
    let invalidData = []
    describe(`Validate INVALID ${modelName} data`, () => {
        invalidData.map((data, index) => {
            test(`Valid data #${index}`, async (done) => {
                try {
                    let item = new currentModel(data);
                    item.validate(function (err) {
                        console.log("ERROR EXPECTED: ",err.errors);
                        expect(err.errors).not.toBeNull();
                    });
                    done();
                } catch (error) {
                    done.fail(error)
                }
            });
        });
    });
    
    // describe(`Populate`, () => {
    //     test(`Populate Model`, async (done) => {
    //         try {
    //             let item = new currentModel(allFields);
    //             let savedItem = await item.save();
    //             let person = new referenceModel({name: "person", tasks: [savedItem._id]});
    
    //             let populate = await referenceModel.findOne({ name: "person"});
    
    //             console.log("POPULATE ", populate);
    //             console.log("POPULATE ", person);
    //             done();
    //         } catch (error) {
    //             done.fail(error);
    //         };
    //     });
    // });
}

testModel({
    currentModel: TaskListModel,
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
    minimumData,
    extraData,
    minParamsModel,
    typeError,
    structureModel
})