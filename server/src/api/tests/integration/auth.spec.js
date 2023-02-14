const request = require("supertest");
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const app = require("../../../config/express");
const User = require("../../models/user.model");

describe("Integration tests for the rest API", () => {
  let invalidUser;
  let dbUser;
  let validUser;
  let newUser;

  beforeEach(async () => {
    invalidUser = { email: "", fullName: "test", password: "123456" };
    dbUser = {
      _id: new ObjectId(),
      email: "test1@example.com",
      fullName: "test",
      password: "123456",
    };
    newUser = {
      email: "john@test.com",
      fullName: "John Doe",
      password: "123123",
    };
    validUser = {
      email: "test1@test.com",
      password: "123456",
    };

    await User.deleteMany({});
    await User.create(dbUser);
  });

  afterAll((done) => {
    mongoose.connection.close();
    done();
  });

  describe("POST /api/register", () => {
    it("should be validation error when submt invalid post body", async () => {
      res = await request(app).post("/api/register").send(invalidUser);

      expect(res.status).toEqual(httpStatus.BAD_REQUEST);
      expect(res.body).toEqual({
        error: true,
        message: "ValidationError",
        status: 400,
      });
    });

    it("should be registration failed when submit a user already registered in db", async () => {
      delete dbUser._id;
      res = await request(app)
        .post("/api/register")
        .set("Content-type", "application/json")
        .send(dbUser);

      expect(res.status).toEqual(httpStatus.CONFLICT);
      expect(res.body).toEqual({
        error: true,
        message: "User is already registered",
        status: httpStatus.CONFLICT,
      });
    });

    it("should be registration successfully when submit a new user", async () => {
      res = await request(app)
        .post("/api/register")
        .set("Content-Type", "application/json")
        .send(newUser);

      expect(res.status).toEqual(httpStatus.CREATED);
      expect(res.body).toEqual({
        message: "User created successfully",
        user: expect.any(String),
      });
    });
  });

  describe("POST /api/login", () => {
    it("should be not found message when submit invalid email or password", async () => {
      res = await request(app)
        .post("/api/login")
        .set("Content-type", "application/json")
        .send(validUser);

      expect(res.status).toEqual(httpStatus.UNAUTHORIZED);
      expect(res.body).toEqual({
        error: true,
        status: httpStatus.UNAUTHORIZED,
        message: expect.any(String),
      });
    });
    it("should be logged in when submit a user existing in db", async () => {
      delete dbUser._id;
      delete dbUser.fullName;
      res = await request(app)
        .post("/api/login")
        .set("Content-type", "application/json")
        .send(dbUser);

      expect(res.status).toEqual(httpStatus.OK);
      expect(res.body).toEqual({
        message: "User logged in successfully",
        status: httpStatus.OK,
        token: expect.any(String),
      });
    });
  });
});
