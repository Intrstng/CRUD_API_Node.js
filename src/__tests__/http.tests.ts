const request = require('supertest');
import { validate } from 'uuid';
import { runServer, closeServer, getPort } from '../index';


describe('Scenario 1', () => {
    const testUser_1 = {
        //"id": "71bd1176-0be0-4a02-b559-e5b661320470",
        "username": "Tom",
        "age": 5,
        "hobbies": ["cycling", "fishing"],
    };
    const testUser_2 = {
        //"id": "9fb9b44d-0c61-41f7-b1d7-12101a912dd9",
        "username": "Jerry",
        "age": 3,
        "hobbies": ["reading", "cooking"],
    };
    const testUser_3 = {
        "username": "Spike",
        "age": 5,
        "hobbies": ["seafaring", "body-building"],
    };

    let testUserID = '';
    const TEST_PORT = getPort();
    const BASE_URL = `http://localhost:${TEST_PORT}/`;

    beforeAll(async () => {
        runServer(TEST_PORT)
    });

    afterAll((done) => {
        closeServer();
        done();
    });
    test('Get all USERS records using GET api/users (expecting an empty array)', async () => {
        const response = await request(BASE_URL).get('api/users');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject([]);
    });
    test('Create a new USER record using POST api/users request', async () => {
        const response = await request(BASE_URL).post('api/users').send(testUser_1);
        testUserID = response.body.id;
        expect(response.statusCode).toBe(201);
        expect(typeof response.body.id).toBe('string');
        expect(validate(response.body.id)).toBe(true);
        expect(response.body).toMatchObject(testUser_1);
        expect(response.body.username).toBe(testUser_1.username);
        expect(response.body.age).toBe(testUser_1.age);
        expect(response.body.hobbies).toMatchObject(testUser_1.hobbies);
    });
    test('Get JUST created USER record by it`s ID using GET api/users/{userId} request', async () => {
        const response = await request(BASE_URL).get(`api/users/${testUserID}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(testUserID);
        expect(response.body).toMatchObject(testUser_1);
        expect(response.body.username).toBe(testUser_1.username);
        expect(response.body.age).toBe(testUser_1.age);
        expect(response.body.hobbies).toMatchObject(testUser_1.hobbies);
    });
    test('Update created USER record by it`s ID using PUT api/users/{userId} request', async () => {
        const response = await request(BASE_URL).put(`api/users/${testUserID}`).send(testUser_2);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(testUser_2);
        expect(response.body.username).toBe(testUser_2.username);
        expect(response.body.age).toBe(testUser_2.age);
        expect(response.body.hobbies).toMatchObject(testUser_2.hobbies);
    });
    test('Delete created USER record by it`s ID using DELETE api/users/{userId} request', async () => {
        const response = await request(BASE_URL).delete(`api/users/${testUserID}`);
        expect(response.statusCode).toBe(204);
        expect(response.body).toBe('');
    });
    test('Check if USER record was successfully deleted by previous DELETE request using GET api/users/{userId} request', async () => {
        const response = await request(BASE_URL).get(`api/users/${testUserID}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toContain(`The server can not find the requested resource. DESCRIPTION: User with this ID not found: ${testUserID}`);
    });
})