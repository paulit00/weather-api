// __tests__/index.test.js

const axios = require("axios");
const app = require("../index");
const supertest = require("supertest");

const request = supertest(app);

jest.mock("axios");

describe("GET /weather", () => {
  let server; // Declare a variable to hold the server instance
  let port; // Declare a variable to hold the dynamically chosen port

  beforeAll((done) => {
    // Start the Express server before running the tests
    server = app.listen(0, () => {
      port = server.address().port; // Get the dynamically chosen port
      done();
    });
  });

  afterAll((done) => {
    // Close the Express server after all tests are finished
    server.close(done);
  });

  it("should return weather data for the specified city", async () => {
    const responseData = {
      data: {
        main: {
          temp: 25,
          humidity: 70,
        },
        weather: [{ description: "Partly cloudy" }],
      },
    };

    axios.get.mockResolvedValue(responseData);

    const response = await request.get("/weather?city=New%20York");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      temperature: 25,
      humidity: 70,
      description: "Partly cloudy",
    });
  });

  it("should return a 400 error if city parameter is missing", async () => {
    const response = await request.get("/weather");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "City parameter is required." });
  });
});
