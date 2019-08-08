const mongoDB = require('../../database/database');
const currentModel = require('../../models/taskList/taskListModel');
const initialData = require('./taskList.data.json');

//Parameters
const NON_EXISTING_ID = '111111111111000000000000';
const modelName = 'Task';
const REQUIRED_FIELDS = ["name", "description", "status"];
const UNIQUE_FIELDS = ["name"];
const DEFAULT_FIELDS = [{ name: "priority", value: ["low"] }];
const ENUM_FIELDS = [{ name: "status", value: ["To Do", "In progress", "Done"] }];

const newData = {
    name: "task #121",
    description: "Make a function",
    status: "To Do"
}
const invalidTypes = {
    name: 124214,
    description: false,
    dueDate: 'asfas 2wasaf asasf',
    status: false,
    notes: ""
}
const voidData = {
    name: "",
    description: "",
    status: ""
}
const updateData = {
    name: "task #9",
    description: "Take a rest"
}

const FIND_FIELDS = (param, hasFind) => {
    return Object.values(currentModel.schema.paths).filter( field => {
        if(field.options.hasOwnProperty(param) && hasFind) { return field }
        else { if(!field.options.hasOwnProperty(param) && !hasFind) {return field} };
    });
}

const REQUIRED_FIELDS_MODEL = FIND_FIELDS('required', true);
const UNIQUE_FIELDS_MODEL = FIND_FIELDS('unique', true);
const DEFAULT_FIELDS_MODEL = FIND_FIELDS('default', true);
const ENUM_FIELDS_MODEL = FIND_FIELDS('enum', true);

beforeEach(async () => {
    await mongoDB.connect();
});

afterEach((done) => {
    mongoDB.disconnect(done);
});

expect.extend({
    toHaveSpecificKeys(received, expected) {
        let hasExpectedLength = Object.keys(received).length === Object.keys(expected).length;
        let hasExpectedKeys = Object.keys(received).map(key => {
            let includesKey = Object.keys(expected).includes(key);
            if (!includesKey) { return false; } else {
                return true;
            }
        })
        const pass = hasExpectedLength && hasExpectedKeys;
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

//Returns value parameter if non exists return null;
const objectExists = (obj, searchValue, { searchKeys = typeof searchValue === "string", maxDepth = 10 } = {}) => {
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

describe(`Validate REQUIRED items for ${modelName}`, ()=>{
    test(`Should compare all REQUIRED fields from ${modelName}`, ()=> {
        if(REQUIRED_FIELDS_MODEL.length > 0) {
            REQUIRED_FIELDS_MODEL.map( modelField => {
                const field = REQUIRED_FIELDS.find( f => f === modelField.path );
                expect(field).toBe(modelField.path);
            });
        }
    });

    test(`Should compare all NO REQUIRED fields from ${modelName}`, ()=> {
        const non_required_fields_model = FIND_FIELDS('required', false);
        if(non_required_fields_model.length > 0) {
            non_required_fields_model.map( modelField => {
                const field = REQUIRED_FIELDS.find( f => f === modelField.path );
                expect(field).toBeUndefined();
            });
        }
    });
});

describe(`Validate UNIQUE items for ${modelName}`, ()=>{
    test(`Should compare all UNIQUE fields from ${modelName}`, ()=> {
        if(UNIQUE_FIELDS_MODEL.length > 0) {
            UNIQUE_FIELDS_MODEL.map( modelField => {
                const field = UNIQUE_FIELDS.find( f => f === modelField.path );
                expect(field).toBe(modelField.path);
            });
        }
    });

    test(`Should compare all NO UNIQUE fields from ${modelName}`, ()=> {
        const non_unique_fields_model = FIND_FIELDS('unique', false);
        if(non_unique_fields_model.length > 0) {
            non_unique_fields_model.map( modelField => {
                const field = UNIQUE_FIELDS.find( f => f === modelField.path );
                expect(field).toBeUndefined();
            });
        }
    });
});

describe(`Validate DEFAULT items for ${modelName}`, ()=>{
    test(`Should compare all DEFAULT fields from ${modelName}`, ()=> {
        if(DEFAULT_FIELDS_MODEL.length > 0) {
            DEFAULT_FIELDS_MODEL.map( modelField => {
                const field = DEFAULT_FIELDS.find( f => f.name === modelField.path );
                expect(field.name).toBe(modelField.path);
            });
        }
    });

    test(`Should compare all NO DEFAULT fields from ${modelName}`, ()=> {
        const non_default_fields_model = FIND_FIELDS('default', false);
        if(non_default_fields_model.length > 0) {
            non_default_fields_model.map( modelField => {
                const field = UNIQUE_FIELDS.find( f => f.name === modelField.path );                
                expect(field).toBeUndefined();
            });
        }
    });
});

describe(`Validate ENUM items for ${modelName}`, ()=>{
    test(`Should compare all DEFAULT fields from ${modelName}`, ()=> {
        if(ENUM_FIELDS_MODEL.length > 0) {
            ENUM_FIELDS_MODEL.map( modelField => {
                const field = ENUM_FIELDS.find( f => f.name === modelField.path );
                expect(field.name).toBe(modelField.path);
                ////////////////VERIFY - MAKE A VALIDATION OF ALL VALUES???
            });
        }
    });

    test(`Should compare all NO ENUM fields from ${modelName}`, ()=> {
        const non_enum_fields_model = FIND_FIELDS('enum', false);
        if(non_enum_fields_model.length > 0) {
            non_enum_fields_model.map( modelField => {
                const field = UNIQUE_FIELDS.find( f => f.name === modelField.path );
                expect(field).toBeUndefined();
            });
        }
    });
});


////OLD TESTS
describe(`INSERT items for ${modelName}`, () => {
    test(`Should INSERT a new ${modelName} item with one field by default`, async (done) => {
        try {
            const item = new currentModel(newData);
            const newItem = await item.save();
            expect(newItem).toHaveSpecificKeys(item);

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

            done.fail("Should have more fiels");
        } catch (error) {
            
            done();
        };
    });

    test(`Should NOT INSERT a new ${modelName} with void fields and reply with an error`, async (done) => {
        try {
            const item = new currentModel(voidData);
            await item.save();

            done.fail("Should have more fiels");
        } catch (error) {
            
            done();
        };
    });

    test(`Should NOT INSERT a new ${modelName} item without valid data and reply with an error`, async (done) => {
        try {
            const item = new currentModel(invalidTypes);
            await item.save();

            done.fail("There are not type of fields");
        } catch (error) {
            
            done();
        };
    });
});

describe(`UPDATE items for ${modelName}`, () => {
    test(`Should UPDATE a new ${modelName} item without one data`, async (done) => {
        try {
            const item = new currentModel(newData);
            const itemSaved = await item.save();
            const response = await currentModel.findOneAndUpdate({ _id: itemSaved._id }, updateData, { new: true, runValidators: true, context: 'query' });            

            expect(response).toHaveSpecificKeys(itemSaved.toJSON());

            done();
        } catch (error) {
            done.fail(error);
        };
    });

    test(`Should NOT UPDATE a new ${modelName} item with an unique value repeated`, async (done) => {
        try {
            const item1 = new currentModel(newData);
            await item1.save();

            const item2 = new currentModel(newData);
            await item2.save();

            done.fail("Should not save duplicate name");
        } catch (error) {
            
            done();
        };
    });
});

describe(`DELETE items for ${modelName}`, () => {
    test(`Should DELETE the ${modelName} item and reply with the same MODEL item`, async (done) => {
        try {
            const item = new currentModel(newData);
            const itemSaved = await item.save();
            const response = await currentModel.findOneAndDelete({ _id: itemSaved._id });

            expect(response).toHaveSpecificKeys(response, itemSaved);

            done();
        } catch (error) {
            done.fail(error);
        };
    });

    test(`Should NOT DELETE the ${modelName} item and reply with a null response`, async (done) => {
        try {
            const item = new currentModel(newData);
            await item.save();
            const response = await currentModel.findOneAndDelete({ _id: NON_EXISTING_ID });
            expect(response).toBe(null);

            done();
        } catch (error) {
            done.fail(error);
        };
    });
});