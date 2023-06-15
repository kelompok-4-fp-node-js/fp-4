const request = require("supertest");
const app = require("../app");

const { generateToken } = require("../helpers/jwt");
const { user, SocialMedia } = require("../models");

describe("POST /socialmedias/", () => {
  beforeAll(async () => {
    try {
      userCreate = await user.create({
        email: "user1@gmail.com",
        full_name: "user 1",
        username: "user1860",
        password: "user1123",
        profile_image_url: "https://example.com/user1860.jpg",
        age: "10",
        phone_number: "0879",
      });
      accessToken = generateToken({
        id: userCreate.id,
        username: userCreate.username,
        email: userCreate.email,
        password: userCreate.password,
      });
    } catch (error) {
      console.log(error);
    }
  });
  it("POST SocialMedia response 201", (done) => {
    request(app)
      .post("/socialmedias/")
      .send({ name: "kharis860", social_media_url: "https://facebook.com/kharis860" })
      .set({ token: accessToken })
      .expect(201)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("Social_Media");
        expect(res.body.Social_Media).toHaveProperty("id");
        expect(res.body.Social_Media).toHaveProperty("name");
        expect(res.body.Social_Media).toHaveProperty("social_media_url");
        expect(res.body.Social_Media).toHaveProperty("UserId");
        expect(res.body.Social_Media).toHaveProperty("updatedAt");
        expect(res.body.Social_Media).toHaveProperty("createdAt");
        done();
      });
  });
  it("POST SocialMedia failed minus token", (done) => {
    request(app)
      .post("/socialmedias/")
      .send({ name: "kharis860", social_media_url: "https://facebook.com/kharis860" })
      .set({ token: null })
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toEqual(404);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("User not found");
        expect(typeof res.body.message).toBe("string");
        done();
      });
  });
  it("POST SocialMedia failed invalid input", (done) => {
    request(app)
      .post("/socialmedias/")
      .send({ name: "kharis860", social_media_url: "" })
      .set({ token: accessToken })
      .expect(500)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0]).toHaveProperty("message");
        expect(res.body.errors[0].message).toEqual("Social media Url is required!");
        expect(res.body.errors[0]).toHaveProperty("type");
        expect(res.body.errors[0]).toHaveProperty("path");
        done();
      });
  });
  afterAll(async () => {
    // destroy data
    try {
      await user.destroy({ where: {} });
      await SocialMedia.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});

describe("GET /socialmedias/", () => {
  beforeAll(async () => {
    try {
      userCreate = await user.create({
        email: "user1@gmail.com",
        full_name: "user 1",
        username: "user1860",
        password: "user1123",
        profile_image_url: "https://example.com/user1860.jpg",
        age: "10",
        phone_number: "0879",
      });
      accessToken = generateToken({
        id: userCreate.id,
        username: userCreate.username,
        email: userCreate.email,
        password: userCreate.password,
      });
      socialMediacreate = await SocialMedia.create({
        name: "kharis860",
        social_media_url: "https://facebook.com/kharis860",
        UserId: userCreate.id,
      });
    } catch (error) {
      console.log(error);
    }
  });
  it("GET SocialMedia response 200", (done) => {
    request(app)
      .get("/socialmedias/")
      .set({ token: accessToken })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("Social_Medias");
        expect(res.body.Social_Medias[0]).toHaveProperty("id");
        expect(res.body.Social_Medias[0]).toHaveProperty("name");
        expect(res.body.Social_Medias[0]).toHaveProperty("social_media_url");
        expect(res.body.Social_Medias[0]).toHaveProperty("UserId");
        expect(res.body.Social_Medias[0].UserId).toEqual(userCreate.id);
        expect(res.body.Social_Medias[0]).toHaveProperty("user");
        done();
      });
  });
  it("GET SocialMedia failed minus token", (done) => {
    request(app)
      .post("/socialmedias/")
      .set({ token: null })
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toEqual(404);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("User not found");
        expect(typeof res.body.message).toBe("string");
        done();
      });
  });
  afterAll(async () => {
    // destroy data
    try {
      await user.destroy({ where: {} });
      await SocialMedia.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});

describe("PUT /socialmedias/:socialMediaId", () => {
  beforeAll(async () => {
    try {
      userCreate = await user.create({
        email: "user1@gmail.com",
        full_name: "user 1",
        username: "user1860",
        password: "user1123",
        profile_image_url: "https://example.com/user1860.jpg",
        age: "10",
        phone_number: "0879",
      });
      userCreate1 = await user.create({
        email: "user2@gmail.com",
        full_name: "user 2",
        username: "user2860",
        password: "user2123",
        profile_image_url: "https://example.com/user2860.jpg",
        age: "10",
        phone_number: "0879",
      });
      accessToken = generateToken({
        id: userCreate.id,
        username: userCreate.username,
        email: userCreate.email,
        password: userCreate.password,
      });
      unauthorizedAccessToken = generateToken({
        id: userCreate1.id,
        username: userCreate1.username,
        email: userCreate1.email,
        password: userCreate1.password,
      });
      socialMediacreate = await SocialMedia.create({
        name: "kharis860",
        social_media_url: "https://facebook.com/kharis860",
        UserId: userCreate.id,
      });
    } catch (error) {
      console.log(error);
    }
  });
  it("PUT SocialMedia response 200", (done) => {
    request(app)
      .put("/socialmedias/" + socialMediacreate.id)
      .send({ name: "kharis861", social_media_url: "https://facebook.com/kharis861" })
      .set({ token: accessToken })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("Social_Media");
        expect(res.body.Social_Media).toHaveProperty("id");
        expect(res.body.Social_Media).toHaveProperty("name");
        expect(res.body.Social_Media).toHaveProperty("social_media_url");
        expect(res.body.Social_Media).toHaveProperty("UserId");
        expect(res.body.Social_Media.UserId).toEqual(userCreate.id);
        done();
      });
  });
  it("PUT SocialMedia failed minus token", (done) => {
    request(app)
      .put("/socialmedias/" + socialMediacreate.id)
      .send({ name: "kharis861", social_media_url: "https://facebook.com/kharis861" })
      .set({ token: null })
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toEqual(404);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("User not found");
        expect(typeof res.body.message).toBe("string");
        done();
      });
  });
  it("PUT SocialMedia failed invalid input", (done) => {
    request(app)
      .put("/socialmedias/" + socialMediacreate.id)
      .send({ name: "kharis861", social_media_url: "" })
      .set({ token: accessToken })
      .expect(500)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("name");
        expect(res.body).toHaveProperty("errors");
        expect(res.body.errors[0]).toHaveProperty("message");
        expect(res.body.errors[0].message).toEqual("Social media Url is required!");
        expect(res.body.errors[0]).toHaveProperty("type");
        expect(res.body.errors[0]).toHaveProperty("validatorKey");
        expect(res.body.errors[0].validatorKey).toEqual("notEmpty");
        done();
      });
  });
  it("PUT SocialMedia failed authorization", (done) => {
    request(app)
      .put("/socialmedias/" + socialMediacreate.id)
      .send({ name: "kharis861", social_media_url: "https://facebook.com/kharis861" })
      .set({ token: unauthorizedAccessToken })
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("This not your social media");
        expect(typeof res.body.message).toBe("string");
        expect(res.body.message).toHaveLength(26);
        expect(res.body.message).toContain("social media");
        done();
      });
  });
  afterAll(async () => {
    // destroy data
    try {
      await user.destroy({ where: {} });
      await SocialMedia.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});

describe("DELETE /socialmedias/:socialMediaId", () => {
  beforeAll(async () => {
    try {
      userCreate = await user.create({
        email: "user1@gmail.com",
        full_name: "user 1",
        username: "user1860",
        password: "user1123",
        profile_image_url: "https://example.com/user1860.jpg",
        age: "10",
        phone_number: "0879",
      });
      socialMediaCreate = await SocialMedia.create({
        name: "kharis860",
        social_media_url: "https://facebook.com/kharis860",
        UserId: userCreate.id,
      });
      accessToken = generateToken({
        id: userCreate.id,
        username: userCreate.username,
        email: userCreate.email,
        password: userCreate.password,
      });

      userCreate1 = await user.create({
        email: "user2@gmail.com",
        full_name: "user 2",
        username: "user2860",
        password: "user2123",
        profile_image_url: "https://example.com/user2860.jpg",
        age: "10",
        phone_number: "0879",
      });

      unauthorizedAccessToken = generateToken({
        id: userCreate1.id,
        username: userCreate1.username,
        email: userCreate1.email,
        password: userCreate1.password,
      });
    } catch (error) {
      console.log(error);
    }
  });
  it("DELETE SocialMedia failed invalid id params", (done) => {
    request(app)
      .delete("/socialmedias/1")
      .set({ token: accessToken })
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("data with id 1 not found");
        expect(typeof res.body.message).toBe("string");
        expect(res.body.message).toContain("1");
        expect(res.body.message).toHaveLength(24);
        done();
      });
  });
  it("DELETE SocialMedia failed minus token", (done) => {
    request(app)
      .delete("/socialmedias/" + socialMediaCreate.id)
      .set({ token: null })
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toEqual(404);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("User not found");
        expect(res.body.message).toHaveLength(14);
        expect(typeof res.body.message).toBe("string");
        done();
      });
  });

  it("DELETE SocialMedia failed invalid authorization", (done) => {
    request(app)
      .delete("/socialmedias/" + socialMediaCreate.id)
      .set({ token: unauthorizedAccessToken })
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("This not your social media");
        expect(typeof res.body.message).toBe("string");
        expect(res.body.message).toHaveLength(26);
        expect(res.body.message).toContain("social media");
        done();
      });
  });
  it("DELETE SocialMedia response 200", (done) => {
    request(app)
      .delete("/socialmedias/" + socialMediaCreate.id)
      .set({ token: accessToken })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Your social media has been successfully deleted");
        expect(typeof res.body.message).toBe("string");
        expect(res.body.message).toHaveLength(47);
        done();
      });
  });

  afterAll(async () => {
    // destroy data
    try {
      await user.destroy({ where: {} });
      await SocialMedia.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});
