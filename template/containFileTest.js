module.exports = getText = (args) => {
    const argsModel = args.charAt(0).toUpperCase() + args.slice(1);
    const text = `const app = require('../../app');
const request = require('supertest');
const mongoDB = require('../../database/database');
const ${argsModel} = require('../../models/${args}/${args}Model');
const initialData = require('./${args}.data.json');

beforeEach(async () => {
    await mongoDB.connect();
    await ${argsModel}.collection.insert(initialData);
});

afterEach((done) => {
    mongoDB.disconnect(done);
});

describe('Get all list of ${args}', () => {
    test('Must be return all ${args}', async (done) =>{
        try {
            let result = await request(app).get('/${args}');
            expect(result.status).toBe(200);    
            // expect(result.body).toMatchObject([]);
            done();
        } catch (error) {
            done.fail(error);
        }
    });
});

// test('It should response the GET method with 200 status and return a Array of ${args}', async (done) => {
//     try {
//         const response = await request(app).get("/${args}");
//         expect(response.status).toBe(200);
//         expect(response.body).toEqual(expect.any(Array));
//         expect(response.body).toMatchObject([sampleService]);
//         expect(response.body.length).toBe(1);
//         validateJsonHeaders(response.header);
//         done();
//     } catch (error) {
//         done.fail(error);
//     }
// });

//GETBYID
describe('${args} get by ID, return one element', () => {
    test('Should response only one object ${args}', async (done) => {
        try {
            let item = new ${argsModel}();
            item.save();

            const response = await request(app).get('/${args}/'+item._id);
            expect(response.status).toBe(200);
            // expect(response.body).toMatchObject({ });
            done();
        } catch (error) {
            done.fail(error);
        }
    });
});

//GETBYID
describe('${args} get by ID, with an id of object does not exist', () => {
    test('Should response with a error for http', async (done) => {
        try {
            let item = {
                _id: "13safs3wrmk56kj564k"
            };        
            const response = await request(app).get('/${args}/'+item._id);
            expect(response.status).toBe(404);
            // expect(response.body).toMatchObject({
            //
            //     });
            done();
        } catch (error) {
            done.fail(error);
        }
    });
});

//POST
describe('Method post, after should send the ${args} object and compare', () => {
    test('Should response with the new ${args}', async (done) => {
        try {
            const new${args} = { };
            const response = await request(app).post('/${args}').send(new${args});
            expect(response.status).toBe(201);
            // expect(response.body).toMatchObject({});
            done();
        } catch (error) {
            done.fail(error);
        }
    });
});

//PUT
describe('Method put, after should send the a message', () => {
    test('Should UPDATE a ${args}', async (done) => {
        try {
            let ${args} = { };
            let item = new ${argsModel}(${args});
            item.save();

            let update${args} = { }
            const response = await request(app).put('/${args}/'+item._id).send(update${args});
            expect(response.status).toBe(200);
            // expect(response.body).toMatchObject({});
            done();
        } catch (error) {
            done.fail(error);
        }    
    });
});

//PUT
describe('Method put, after should send the new data, with wrong ID', () => {
    test('Should response with an ERROR MESSAGE', async (done) => {
        try {
            let ${args} = { };
            let item = new ${argsModel}(${args});
            item.save();

            let update${args} = { };
            //ID not exist in DB
            const id = "2i43iusay34nm1214";
            const response = await request(app).put('/${args}/'+id).send(update${args});
            expect(response.status).toBe(500);
            // expect(response.body).toMatchObject({
            //
            //     });
            done();
        } catch (error) {
            done.fail(error);
        }
    });
});

// DELETE METHOD review the response of controller
describe('Method delete, should send a string verication for delete', () => {
    test('Should delete a ${args}', async (done) => {
        try {
            const ${args} = { };

            let item = new ${argsModel}(${args});
            item.save();

            const response = await request(app).delete('/${args}/'+item._id);
            expect(response.status).toBe(203);
            // expect(response.body).toMatchObject({});
            done();
        } catch (error) {
            done.fail(error);
        }
    });
});

// DELETE METHOD review the response of controller
describe('Method delete of unknow ID', () => {
    test('Should response with an error', async (done) => {
        try {
            const ${args} = { };

            let item = new ${argsModel}(${args});
            item.save();

            const id = '5ceeae0e96665d29c824d12easxz'
            const response = await request(app).delete('/${args}/'+id);
            expect(response.status).toBe(500);
            // expect(response.body).toMatchObject({
            //         
            //     });
            done();
        } catch (error) {
            done.fail(error);
        }
     });
});`;
    return text;
};