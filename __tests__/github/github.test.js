const app = require('../../app');
const request = require('supertest');
const mongoDB = require('../../database/database');
const Github = require('../../models/github/githubModel');
const initialData = require('./github.data.json');

beforeEach(async () => {
    await mongoDB.connect();
    await Github.collection.insert(initialData);
});

afterEach((done) => {
    mongoDB.disconnect(done);
});

describe('Get all list of github', () => {
    test('Must be return all github', async (done) => {
        try {
            // let result = await request(app).get('/github');
            // expect(result.status).toBe(200);    
            let github1 = new Github({ name: "draxler", email: "email" });
            let res1 = await github1.save();
            let github2 = new Github({ name: "draxler1", email: "email" });

            let github = await github2.save()

            console.log("Success ", github);
            done.fail("Should not save duplicate email");

        } catch (error) {
            expect(error).toEqual(expect.any(Object));
            // expect(err.name).(Array);
            // console.log("ERROR ", error.message);
            done();
        }
    });
});
