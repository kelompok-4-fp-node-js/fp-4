const request = require("supertest");
const app = require("../app");
const { user } = require("../models");
const jwt = require("../helpers/jwt");
let auth = null;
let userId = null;
let notId = null;

for (let index = 1; index < 100; index++) {
  if (index !== userId) {
    notId = index;
    break;
  }
}

describe("POST /users/register", () => {
  beforeAll(async () => {
    // destroy data users
    try {
      await user.destroy({ where: {} }, { truncate: true });
    } catch (error) {
      console.log(error);
    }
  });
  it("Should respond with 201", (done) => {
    request(app)
      .post("/users/register")
      .send({
        email: "tes34@gmail.com",
        full_name: "tes00",
        username: "tes34",
        password: "tes1234",
        profile_image_url: "https://www.shutterstock.com/image-vector/short-custom-urls-url-shortener-600w-2233924609.jpg",
        age: 21,
        phone_number: "0853457",
      })
      .expect(201)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        userId = res.body.user.id;
        expect(res.body.user.email).toEqual("tes34@gmail.com");
        expect(res.body.user.full_name).toEqual("tes00");
        expect(res.body.user.username).toEqual("tes34");
        expect(res.body.user).toHaveProperty("profile_image_url");
        expect(res.body.user.phone_number).toEqual(853457);
        done();
      });
  });

  it("Should be response 500", (done) => {
    request(app)
      .post("/users/register")
      .send({
        email: "",
        full_name: "tes00",
        username: "tes34",
        password: "tes1234",
        profile_image_url: "https://www.shutterstock.com/image-vector/short-custom-urls-url-shortener-600w-2233924609.jpg",
        age: "21",
        phone_number: "0853457",
      })
      .expect(500)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.errors[0].message).toEqual("Email is required!");
        expect(res.body.errors[0].type).toEqual("Validation error");
        expect(res.body.errors[0].instance.email).toEqual("");
        expect(res.body.errors[0].path).toEqual("email");
        expect(res.body.errors[0].value).toEqual("");
        done();
      });
  });
});

describe("POST /users/login", () => {
  it("Should response 201", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: "tes34@gmail.com",
        password: "tes1234",
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("token");
        expect(Object.keys(res.body).length).toBe(1);
        expect(res.body).not.toHaveProperty("code");
        expect(res.body).not.toHaveProperty("message");
        auth = res.body.token;
        done();
      });
  });

  it("Should be response 401", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: "tes34@gmail.com",
        password: "tes12334",
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(Object.keys(res.body).length).toBe(2);
        expect(Object.keys(res.body).length).not.toBe(1);
        expect(res.body.code).toEqual(401);
        expect(res.body.message).toEqual("Password salah");
        expect(res.body).not.toHaveProperty("token");
        done();
      });
  });
});

describe("PUT /users/:id", () => {
  it("Should response 200", (done) => {
    request(app)
      .put(`/users/${userId}`)
      .set("token", auth)
      .send({
        phone_number: "0853457982",
        age: "26",
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.user[0].age).toEqual(26);
        expect(res.body.user[0].phone_number).toEqual(853457982);
        expect(res.body.user[0].age).not.toEqual(21);
        expect(res.body.user[0].phone_number).not.toEqual("0853457");
        done();
      });
  });

  it("Should response 404", (done) => {
    request(app)
      .put(`/users/${userId}`)
      .set("token", "dsgsrye")
      .send({
        phone_number: "0853457982",
        age: "21",
      })
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("User not found");
        expect(Object.keys(res.body).length).toBe(2);
        expect(res.body).not.toHaveProperty("user");
        done();
      });
  });

  it("Should response 404", (done) => {
    request(app)
      .put(`/users/${notId}`)
      .set("token", auth)
      .send({
        phone_number: "0853457982",
        age: "21",
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("user not found");
        expect(Object.keys(res.body).length).toBe(1);
        expect(res.body).not.toHaveProperty("user");
        done();
      });
  });
});

describe("Delete /users/:id", () => {
  it("Should response 200", (done) => {
    request(app)
      .delete(`/users/${userId}`)
      .set("token", auth)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Your Account has been successfully deleted");
        expect(res.body.message).not.toEqual("You not user this account");
        expect(res.body.message).not.toEqual("User not found");
        expect(Object.keys(res.body).length).toBe(1);
        done();
      });
  });

  it("Should response 401", (done) => {
    request(app)
      .delete(`/users/${notId}`)
      .set("token", auth)
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).not.toEqual("Your Account has been successfully deleted");
        expect(res.body.message).not.toEqual("You not user this account");
        expect(res.body.message).toEqual("user not found");
        expect(Object.keys(res.body).length).toBe(1);
        done();
      });
  });

  it("Should response 404", (done) => {
    request(app)
      .delete(`/users/${notId}`)
      .set("token", "sdfsgseg")
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).not.toEqual("Your Account has been successfully deleted");
        expect(res.body.message).not.toEqual("You not user this account");
        expect(res.body.message).toEqual("User not found");
        expect(Object.keys(res.body).length).toBe(2);
        done();
      });
  });
});
