import request from "supertest";
import createApp from '../../src/app'

const app = createApp();

describe("POST /api/users", () => {
    describe("given a username and password", () => {

        test("should respond with a 201 status code", async () => {
            const response = await request(app)
                .post("/api/users")
                .send({
                    username: "Blaice chan",
                    password: "HashMePlease"
                });
            expect(response.statusCode).toBe(201);
            
        });
    });
})