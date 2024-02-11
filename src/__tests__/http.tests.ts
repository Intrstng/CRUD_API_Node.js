import {UserType} from '../data';

const request = require('supertest');
import { validate } from 'uuid';
import { runServer, closeServer, getPort } from '../index';

const testUser_1 = {
    username: 'Tom',
    age: 5,
    hobbies: ['cycling', 'fishing'],
};
const testUser_2 = {
    username: 'Jerry',
    age: 3,
    hobbies: ['reading', 'cooking'],
};

const invalidUserRecord = {
    'user_SOME-MISTAKE_name': 'Spike',
    age: 'FIVE',
    hobbies: ['seafaring', null]
}

const testUserNotFilledCorrectly = {
    hobbies: ['seafaring', 'hunting']
}

let testUserID = '';
const TEST_PORT = getPort();
const BASE_URL = `http://localhost:${TEST_PORT}/`;

const someValidUIID_ID = '9fb9b44d-0c61-41f7-b1d7-12101a912dd9';
const invalidUIIDFormat = '9fb9b44d-0c61-41f7-b1d7-12101a912dd';
const arbitraryID = '7007884a-6df5-4c8d-b885-44fb068d578b';


// TESTS
// SCENARIO #1
describe('Scenario #1', () => {
    beforeAll(async () => {
        runServer(TEST_PORT + 1)
    });

    afterAll((done) => {
        closeServer();
        done();
    });
    test('Get all USERS records using GET api/users (expecting an empty array).', async () => {
        const response = await request(BASE_URL).get('api/users');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject([]);
    });
    test('Create a new USER record using POST api/users request.', async () => {
        const response = await request(BASE_URL).post('api/users').send(testUser_1);
        testUserID = response.body.id;
        expect(response.statusCode).toBe(201);
        expect(typeof response.body.id).toBe('string');
        expect(validate(response.body.id)).toBe(true);
        expect(response.body).toMatchObject(testUser_1);
    });
    test('Get JUST created USER record by it`s ID using GET api/users/{userId} request.', async () => {
        const response = await request(BASE_URL).get(`api/users/${testUserID}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(testUserID);
        expect(response.body).toMatchObject(testUser_1);
    });
    test('Update created USER record by it`s ID using PUT api/users/{userId} request.', async () => {
        const response = await request(BASE_URL).put(`api/users/${testUserID}`).send(testUser_2);
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(testUser_2);
    });
    test('Delete created USER record by it`s ID using DELETE api/users/{userId} request.', async () => {
        const response = await request(BASE_URL).delete(`api/users/${testUserID}`);
        expect(response.statusCode).toBe(204);
        expect(response.body).toBe('');
    });
    test('Check if USER record was successfully deleted by previous DELETE request using GET api/users/{userId} request.', async () => {
        const response = await request(BASE_URL).get(`api/users/${testUserID}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toContain(`The server can not find the requested resource. DESCRIPTION: User with this ID not found: ${testUserID}`);
    });
})


// SCENARIO #2
describe('Scenario #2', () => {
    beforeAll(async () => {
        runServer(TEST_PORT + 2)
    });

    afterAll((done) => {
        closeServer();
        done();
    });
    test('Request with unsupported HTTP method.', async () => {
        const response = await request(BASE_URL).patch('api/users');
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('The request could not be understood by the server due to incorrect syntax. The client MUST change the request before trying again. DESCRIPTION: This API method is not available. Check API method or path in URL.');
    });
    test('Using request HTTP methods with unsupported path.', async () => {
        const response_1 = await request(BASE_URL).put('api/users');
        const response_2 = await request(BASE_URL).delete('api/users');
        expect(response_1.statusCode).toBe(400);
        expect(response_2.statusCode).toBe(400);
        expect(response_1.body.message).toBe('The request could not be understood by the server due to incorrect syntax. The client MUST change the request before trying again. DESCRIPTION: This API method is not available. Check API method or path in URL.');
        expect(response_2.body.message).toBe('The request could not be understood by the server due to incorrect syntax. The client MUST change the request before trying again. DESCRIPTION: This API method is not available. Check API method or path in URL.');
    });
    test('GET request to non-existing endpoint.', async () => {
        const nonExistingEndpoint = 'some-non/existing/resource';
        const response = await request(BASE_URL).get(nonExistingEndpoint);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe(`The server can not find the requested resource. DESCRIPTION: Route not found: /${nonExistingEndpoint}`);
    });
    test('GET request to get USER record using ID in invalid format (not uuid).', async () => {
        const response = await request(BASE_URL).get(`api/users/${invalidUIIDFormat}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toContain(`The request could not be understood by the server due to incorrect syntax. The client MUST change the request before trying again. DESCRIPTION: Invalid user id: ${invalidUIIDFormat}`);
    });

    test('GET request of USER record if the requested ID has valid uuid format, but no such USER record with this ID exists.', async () => {
        const response = await request(BASE_URL).get(`api/users/${someValidUIID_ID}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toContain(`The server can not find the requested resource. DESCRIPTION: User with this ID not found: ${someValidUIID_ID}`);
    });

    test('POST request of USER record with empty body.', async () => {
        const response = await request(BASE_URL).post('api/users').send({});
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Check these object properties for correctness: username age hobbies');
    });

    test('POST request of USER record with broken body.', async () => {
        const response = await request(BASE_URL).post('api/users').send();
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Bad Request: body parsing error.');
    });

    test('POST request with incorrect properties of USER record.', async () => {
        const response = await request(BASE_URL).post('api/users').send(invalidUserRecord);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Check these object properties for correctness: username age hobbies');
    });

    test('POST request with not all required properties of USER record.', async () => {
        const response = await request(BASE_URL).post('api/users').send(testUserNotFilledCorrectly);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Check these object properties for correctness: username age');
    });

    test('POST request to create a new USER record using the POST api/users request - FOR USE IN THE FOLLOWING TESTS.', async () => {
        const response = await request(BASE_URL).post('api/users').send(testUser_1);
        testUserID = response.body.id;
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject(testUser_1);
        expect(typeof testUserID).toBe('string');
        expect(validate(response.body.id)).toBe(true);
    });

    test('PUT request to update created USER record using ID in invalid format (not uuid).', async () => {
        const response = await request(BASE_URL).put(`api/users/${invalidUIIDFormat}`).send(testUser_2);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(`The request could not be understood by the server due to incorrect syntax. The client MUST change the request before trying again. DESCRIPTION: Invalid user id: ${invalidUIIDFormat}`);
    });

    test('PUT request to update a created USER record if the request does not include all required properties.', async () => {
        const response = await request(BASE_URL).put(`api/users/${testUserID}`).send(testUserNotFilledCorrectly);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Check these object properties for correctness: username age');
    });

    test('DELETE request to delete created USER record using ID in invalid format (not uuid)', async () => {
        const response = await request(BASE_URL).delete(`api/users/${invalidUIIDFormat}`);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(`The request could not be understood by the server due to incorrect syntax. The client MUST change the request before trying again. DESCRIPTION: Invalid user id: ${invalidUIIDFormat}`);
    });

    test('DELETE request to delete a created USER record if the requested ID is in a valid uuid format, but no such USER record exists with that ID.', async () => {
        const response = await request(BASE_URL).delete(`api/users/${arbitraryID}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe(`The server can not find the requested resource. DESCRIPTION: User with this ID not found: ${arbitraryID}`);
    });
})


// SCENARIO #3
describe('Scenario #3', () => {
    let user: UserType | null;

    beforeAll(async () => {
        runServer(TEST_PORT + 3)
    });

    afterAll((done) => {
        closeServer();
        done();
    });

    test ('POST request to create a new USER record using the POST api/users request - FOR USE IN THE FOLLOWING TESTS.', async () => {
        const response = await request(BASE_URL).post('api/users').send(testUser_1);
        testUserID = response.body.id;
        expect(response.statusCode).toBe(201);
        user = response.body;
        expect(user).toMatchObject(testUser_1);
        expect(typeof testUserID).toBe('string');
        expect(validate(response.body.id)).toBe(true);
    });

    test ('POST request to create another new USER record with a POST api/users request with the same properties as previous user', async () => {
        const response = await request(BASE_URL).post('api/users').send(testUser_1);
        testUserID = response.body.id;
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject(testUser_1);
        expect(typeof testUserID).toBe('string');
        expect(validate(response.body.id)).toBe(true);
    });

    test ('GET request to get USER records with a GET api/users request to check that both created users are present', async () => {
        const response = await request(BASE_URL).get('api/users');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(3);
    });

    test ('Post request to create new USER record with a POST api/users request and try to provide a valid UUID as part of the body', async () => {
        const response = await request(BASE_URL).post('api/users').send({ ...testUser_1, id: someValidUIID_ID });
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject(testUser_1);
        expect(typeof response.body.id).toBe('string');
        expect(validate(response.body.id)).toBe(true);
        expect(response.body.id).not.toBe(someValidUIID_ID);
    });

    test ('Post request to update created USER record with a PUT api/users/{userID} request and try to provide valid UUID as a part of body', async () => {
        const response = await request(BASE_URL).put(`api/users/${user?.id}`).send({ ...testUser_2, id: someValidUIID_ID });
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(testUser_2);
        expect(response.body.id).toBe(user?.id);
    });
})