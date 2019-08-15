const app = require('../app');
const request = require('supertest');
const mongoDB = require('../database/database');

function testRoutes(parameters) {
    let {
        modelName,
        route,
        currentModel,
        NON_EXISTING_ID,
        initialData,
        newData,
        updatedData,
        invalidData
    } = parameters;

    const initialDataCount = initialData.length;
    //****************************/

    beforeEach(async () => {
        await mongoDB.connect();
        await currentModel.collection.insertMany(initialData);
    });

    afterEach((done) => {
        mongoDB.disconnect(done);
    });

    describe(`GET method for ${modelName}`, () => {
        test(`Should GET an array with all ${modelName} items`, async (done) => {
            try {
                const response = await request(app).get(route);
                expect(response.status).toBe(200);
                expect(response.header["content-type"]).toEqual("application/json; charset=utf-8");
                expect(response.body).toEqual(expect.any(Array));
                expect(response.body.length).toBe(initialData.length);
                done();
            } catch (error) {
                done.fail(error);
            }
        });

        test(`Should GET a single ${modelName} item by ID`, async (done) => {
            try {
                let newItem = await (new currentModel(newData)).save();
                const response = await request(app).get(route + '/' + newItem._id);
                expect(response.status).toBe(200);
                expect(response.header["content-type"]).toEqual("application/json; charset=utf-8");
                expect(response.body).toEqual(expect.any(Object));
                expect(response.body).toMatchObject(newData);
                done();
            } catch (error) {
                done.fail(error);
            }
        });

        test(`Should NOT GET a ${modelName} item and reply with status 400 when Non-existing ID is sent`, async (done) => {
            try {
                const response = await request(app).get(route + '/' + NON_EXISTING_ID);
                expect(response.status).toBe(400);
                expect(response.header["content-type"]).toEqual("application/json; charset=utf-8");
                done()
            } catch (error) {
                done.fail(error)
            }
        });
    });
    describe(`DELETE method for ${modelName}`, () => {
        test(`Should DELETE the ${modelName} item and reply with status 204`, async (done) => {
            try {
                let newItem = await (new currentModel(newData)).save();
                let numberOfItems = await currentModel.countDocuments();
                const response = await request(app).delete(route + '/' + newItem._id);
                let updatedNumberOfItems = await currentModel.countDocuments();
                expect(response.status).toEqual(203);
                expect(response.header["content-type"]).toEqual("application/json; charset=utf-8");
                expect(updatedNumberOfItems).toBe(numberOfItems - 1);
                done();
            } catch (error) {
                done.fail(error)
            }
        });

        test(`Should NOT DELETE the ${modelName} item and reply with status 400 when Non-existing ID is sent`, async (done) => {
            try {
                const response = await request(app).delete(route + '/' + NON_EXISTING_ID);
                expect(response.status).toEqual(400);
                expect(response.header["content-type"]).toEqual("application/json; charset=utf-8");
                done();
            } catch (error) {
                done.fail(error);
            }
        });
    });

    describe(`POST method for ${modelName}`, () => {
        test(`Should INSERT a new ${modelName} item`, async (done) => {
            try {
                let countBeforePost = await currentModel.countDocuments();
                expect(countBeforePost).toEqual(initialDataCount);
                let response = await request(app).post(route + '/').send(newData);
                expect(response.status).toBe(201);
                expect(response.header["content-type"]).toEqual("application/json; charset=utf-8");
                expect(response.body).toMatchObject(newData);
                let countAfterPost = await currentModel.countDocuments();
                expect(countAfterPost).toEqual(initialDataCount + 1);
                done();
            } catch (error) {
                done.fail(error);
            }
        });

        test(`Should NOT INSERT a new ${modelName} item and reply with status 400 when required fields are empty`, async (done) => {
            try {
                let response = await request(app).post(route).send(invalidData);
                expect(response.status).toBe(400);
                expect(response.header["content-type"]).toEqual("application/json; charset=utf-8");
                let countAfterPost = await currentModel.countDocuments();
                expect(countAfterPost).toBe(initialDataCount);
                done();
            } catch (error) {
                done.fail(error);
            }
        });

    });

    describe(`PUT method for ${modelName}`, () => {
        test(`Should UPDATE the ${modelName} item by ID with the provided data`, async (done) => {
            try {
                let itemToUpdate = initialData[1];
                const response = await request(app).put(route + '/' + itemToUpdate._id).send(updatedData);
                expect(response.status).toBe(200);
                expect(response.header["content-type"]).toEqual("application/json; charset=utf-8");
                expect(response.body).toMatchObject(updatedData);
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        test(`Should NOT UPDATE the ${modelName} item and reply with status 400 when unexisting ID is sent`, async (done) => {
            try {
                let response = await request(app).put(route + '/' + NON_EXISTING_ID).send(updatedData);
                expect(response.status).toBe(400);
                expect(response.header["content-type"]).toEqual("application/json; charset=utf-8");
                done();
            } catch (error) {
                done.fail(error);
            }
        });
    });

}

module.exports = testRoutes;