const mongoDB = require('../database/database');

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
        withoutDefaultData,
        voidData,
        updateData,
        minimumFields,
        extraData,
        structureModel
    } = parameters;

    beforeEach(async () => {
        await mongoDB.connect();
    });

    afterEach((done) => {
        mongoDB.disconnect(done);
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
            if (REQUIRED_FIELDS.length > 0 || REQUIRED_FIELDS_MODEL.length > 0) {
                REQUIRED_FIELDS.map(field => {
                    const modelField = REQUIRED_FIELDS_MODEL.find(f => f.path === field);
                    expect(modelField).toBeDefined();
                    expect(field).toBe(modelField.path);
                });
                expect(REQUIRED_FIELDS.length).toBe(REQUIRED_FIELDS_MODEL.length);
            } else {
                console.log(`${modelName} Model doesn't have REQUIRED fields defined`);
            }
            done();
        });

        test(`Should match all NON REQUIRED fields for ${modelName}`, (done) => {
            const non_required_fields_model = FIND_FIELDS_WITH_ATTRIBUTE('required', false);
            if (REQUIRED_FIELDS.length > 0 || non_required_fields_model.length > 0) {
                non_required_fields_model.map(modelField => {
                    const field = REQUIRED_FIELDS.find(f => f === modelField.path);
                    expect(field).toBeUndefined();
                });
            } else {
                console.log(`${modelName} Model have ALL REQUIRED fields defined`);
            }
            done();
        });
    });

    describe(`Validate UNIQUE fields for ${modelName}`, () => {
        test(`Should match all UNIQUE fields for ${modelName}`, (done) => {
            if (UNIQUE_FIELDS.length > 0 || REQUIRED_FIELDS_MODEL.length > 0) {
                UNIQUE_FIELDS.map( modelField => {
                    const field = UNIQUE_FIELDS.find(f => f === modelField.path);
                    expect(field).toBe(modelField.path);
                });
            } else {
                console.log(`Model ${modelName} doesn't have UNIQUE fields defined`);
            }
            done();
        });

        test(`Should match all NON UNIQUE fields for ${modelName}`, (done) => {
            const non_unique_fields_model = FIND_FIELDS_WITH_ATTRIBUTE('unique', false);
            if (UNIQUE_FIELDS.length > 0 || non_unique_fields_model.length > 0) {
                non_unique_fields_model.map(modelField => {
                    const field = UNIQUE_FIELDS.find( f => f === modelField.path);
                    expect(field).toBeUndefined();
                });
            } else {
                console.log(`${modelName} Model ALL UNIQUE fields unique`);
            }
            done();
        });
    });

    describe(`Validate DEFAULT fields for ${modelName}`, () => {
        test(`Should match all DEFAULT fields for ${modelName}`, (done) => {
            if (DEFAULT_FIELDS.length > 0 || DEFAULT_FIELDS_MODEL.length > 0) {
                DEFAULT_FIELDS.map( field => {
                    const modelField = DEFAULT_FIELDS_MODEL.find( f => f.path === field.name);
                    expect(modelField).toBeDefined();
                    expect(field.name).toBe(modelField.path);
                });
            } else {
                console.log(`Model ${modelName} doesn't have DEFAULT fields defined`);
            }
            done();
        });

        test(`Should match all NON DEFAULT fields for ${modelName}`, (done) => {
            const non_default_fields_model = FIND_FIELDS_WITH_ATTRIBUTE('default', false);
            if (DEFAULT_FIELDS.length > 0 || non_default_fields_model.length > 0) {
                non_default_fields_model.map(modelField => {
                    const field = UNIQUE_FIELDS.find( f => f.name === modelField.path);
                    expect(field).toBeUndefined();
                });
            } else {
                console.log(`${modelName} Model have ALL DEFAULT fields defined`);
            }
            done();
        });
    });

    describe(`Validate ENUM fields for ${modelName}`, () => {
        test(`Should match all DEFAULT fields for ${modelName}`, (done) => {
            if (ENUM_FIELDS.length > 0 || ENUM_FIELDS_MODEL > 0) {
                ENUM_FIELDS.map( modelField => {
                    const field = ENUM_FIELDS_MODEL.find( f => f.path === modelField.name);
                    expect(field.name).toBe(modelField.path);
                    expect(field.enumValues).toEqual(expect.arrayContaining(modelField.value));
                });
            } else {
                console.log(`Model ${modelName} doesn't have enum fields defined`);
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
            } else {
                console.log(`${modelName} Model have ALL ENUM fields defined`);
            }
            done();
        });
    });

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
            if (withoutDefaultData) {
                try {
                    const item = new currentModel(withoutDefaultData);
                    item.validate(function (err) {
                        expect(err).toBeNull();
                    });
                    const response = await item.save();

                    expect(response).toEqual(expect.objectContaining(withoutDefaultData));

                    if (DEFAULT_FIELDS.length > 0) {
                        DEFAULT_FIELDS.map(defaultField => {
                            expect(response[defaultField.name]).toBeDefined();
                            let type = currentModel.schema.paths[defaultField.name].instance;
                            if (type === 'Date') {
                                let date = Date.parse(defaultField.value);
                                expect(date).not.toBeNaN()
                            } else {
                                expect(response[defaultField.name]).toBe(defaultField.value);
                            }
                        });
                    }

                    done();
                } catch (error) {
                    done.fail(error);
                };
            }
        });

        test(`Should INSERT a new ${modelName} item with minimum fields`, async (done) => {
            if (minimumFields) {
                try {
                    const item = new currentModel(minimumFields);
                    item.validate(function (err) {
                        expect(err).toBeNull();
                    });
                    const response = await item.save();
                    expect(response).toMatchObject(minimumFields);

                    if (DEFAULT_FIELDS.length > 0) {
                        DEFAULT_FIELDS.map(defaultField => {
                            expect(response[defaultField.name]).toBeDefined();
                            let type = currentModel.schema.paths[defaultField.name].instance;
                            if (type === 'Date') {
                                let date = Date.parse(defaultField.value);
                                expect(date).not.toBeNaN()
                            } else {
                                expect(response[defaultField.name]).toBe(defaultField.value);
                            }
                        });
                    }

                    done();
                } catch (error) {
                    done.fail(error);
                };
            }
        });

        test(`Should insert a new ${modelName} item with extra fields but just save  original ${modelName} fields`, async (done) => {
            try {
                const item = new currentModel(extraData);
                item.validate(function (err) {
                    expect(err).toBeNull();
                });
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
                expect(response).toEqual(expect.objectContaining(updateData));

                done();
            } catch (error) {
                done.fail(error);
            };
        });

        test(`Should NOT UPDATE extra fields of new ${modelName} item`, async (done) => {
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
                const response = await currentModel.findOneAndUpdate({ _id: NON_EXISTING_ID }, updateData, { new: true, runValidators: true, context: 'query' });
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
                let countBeforeDelete = await currentModel.countDocuments();
                expect(countBeforeDelete).toBe(1);
                const response = await currentModel.findOneAndDelete({ _id: itemSaved._id });
                let countAfterDelete = await currentModel.countDocuments();
                expect(countAfterDelete).toBe(0);
                expect(response).toEqual(expect.objectContaining(allFields));

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

    let validData = [allFields, updateData, minimumFields, withoutDefaultData, extraData];
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

    let invalidData = [{}, voidData]
    describe(`Validate INVALID ${modelName} data`, () => {
        invalidData.map((data, index) => {
            test(`Valid data #${index}`, async (done) => {
                try {
                    let item = new currentModel(data);
                    item.validate(function (err) {
                        // console.log("ERROR EXPECTED: ", err.errors);
                        expect(err.errors).not.toBeNull();
                    });
                    done();
                } catch (error) {
                    done.fail(error)
                }
            });
        });
    });
}

module.exports = testModel;