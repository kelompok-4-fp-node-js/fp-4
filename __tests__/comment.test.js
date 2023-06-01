const request = require("supertest");
const app = require("../app");

const { generateToken } = require("../helpers/jwt");
const { comment, user, photo } = require("../models");

let accessToken;

let commentCreate;
let photoCreate;

describe("POST /comments/", () => {
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
      photoCreate = await photo.create({
        poster_image_url: "https://picsum.photos/200/300.jpg",
        title: "photo of me",
        caption: "this summer",
        UserId: 1,
      });
      console.log(photoCreate.id);
      accessToken = generateToken({
        id: userCreate.id,
        username: userCreate.username,
        email: userCreate.email,
        password: userCreate.password,
      });
      console.log(accessToken);
    } catch (error) {
      console.log(error);
    }
  });
  it("POST comments response 201", (done) => {
    request(app)
      .post("/comments/")
      .send({
        comment: "good photo",
        PhotoId: photoCreate.id,
      })
      .set({ token: accessToken })
      .expect(201)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        console.log(res.body);
        expect(res.body).toHaveProperty("comment");
        expect(res.body.comment).toHaveProperty("id");
        expect(res.body.comment).toHaveProperty("UserId");
        expect(res.body.comment).toHaveProperty("PhotoId");
        expect(res.body.comment).toHaveProperty("comment");
        expect(res.body.comment).toHaveProperty("updatedAt");
        expect(res.body.comment).toHaveProperty("createdAt");
        done();
      });
  });
  it("POST comments response 404", (done) => {
    request(app)
      .post("/comments/")
      .send({
        comment: "good photo",
        PhotoId: photoCreate.id,
      })
      .set({ token: null })
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        console.log(res.body);
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toEqual(404);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("User not found");
        done();
      });
  });
  afterAll(async () => {
    // destroy data
    try {
      await photo.destroy({ where: {} });
      await user.destroy({ where: {} });
      await comment.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});

describe("GET /comments/", () => {
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
      photoCreate = await photo.create({
        poster_image_url: "https://picsum.photos/200/300.jpg",
        title: "photo of me",
        caption: "this summer",
        UserId: 1,
      });
      const commentCreate = await comment.create({
        UserId: userCreate.id,
        PhotoId: photoCreate.id,
        comment: "good photo",
      });
      accessToken = generateToken({
        id: userCreate.id,
        username: userCreate.username,
        email: userCreate.email,
        password: userCreate.password,
      });
      console.log(accessToken, "token comment get");
    } catch (error) {
      console.log(error);
    }
  });
  it("GET comments response 200", (done) => {
    request(app)
      .get("/comments/")
      .set({ token: accessToken })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        console.log(res.body, "get resp");
        expect(res.body).toHaveProperty("comments");
        expect(res.body.comments[0]).toHaveProperty("id");
        expect(res.body.comments[0]).toHaveProperty("UserId");
        expect(res.body.comments[0]).toHaveProperty("PhotoId");
        expect(res.body.comments[0]).toHaveProperty("comment");
        expect(res.body.comments[0]).toHaveProperty("createdAt");
        expect(res.body.comments[0]).toHaveProperty("updatedAt");
        expect(res.body.comments[0]).toHaveProperty("photo");
        expect(res.body.comments[0]).toHaveProperty("user");
        done();
      });
  });
  it("GET comments response 404", (done) => {
    request(app)
      .post("/comments/")
      .set({ token: null })
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        console.log(res.body, "get response 404");
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toEqual(404);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("User not found");
        done();
      });
  });
  afterAll(async () => {
    // destroy data
    try {
      await user.destroy({ where: {} });
      await photo.destroy({ where: {} });
      await comment.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});

describe("PUT /comments/:commentId", () => {
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
      commentCreate = await comment.create({
        UserId: userCreate.id,
        PhotoId: photoCreate.id,
        comment: "good photo",
      });
      accessToken = generateToken({
        id: userCreate.id,
        username: userCreate.username,
        email: userCreate.email,
        password: userCreate.password,
      });
      console.log(accessToken, "token put comment");
    } catch (error) {
      console.log(error);
    }
  });
  it("PUT comments response 200", (done) => {
    request(app)
      .put("/comments/" + commentCreate.id)
      .send({
        comment: "good photo edit",
      })
      .set({ token: accessToken })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        console.log(res.body, "put comment 200");
        expect(res.body).toHaveProperty("comment");
        expect(res.body.comment).toHaveProperty("id");
        expect(res.body.comment).toHaveProperty("UserId");
        expect(res.body.comment).toHaveProperty("PhotoId");
        expect(res.body.comment).toHaveProperty("comment");
        expect(res.body.comment).toHaveProperty("updatedAt");
        expect(res.body.comment).toHaveProperty("createdAt");
        done();
      });
  });
  it("PUT comments response 404", (done) => {
    request(app)
      .put("/comments/" + commentCreate.id)
      .send({
        comment: "good photo",
      })
      .set({ token: null })
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        console.log(res.body, "put comment 404");
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toEqual(404);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("User not found");
        done();
      });
  });
  afterAll(async () => {
    // destroy data
    try {
      await user.destroy({ where: {} });
      await comment.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});

describe("DELETE /comments/:commentId", () => {
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
      commentCreate = await comment.create({
        UserId: userCreate.id,
        PhotoId: photoCreate.id,
        comment: "good photo",
      });
      accessToken = generateToken({
        id: userCreate.id,
        username: userCreate.username,
        email: userCreate.email,
        password: userCreate.password,
      });
      console.log(accessToken, "token delete comment");
    } catch (error) {
      console.log(error);
    }
  });
  it("DELETE comments response 200", (done) => {
    request(app)
      .delete("/comments/" + commentCreate.id)
      .set({ token: accessToken })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        console.log(res.body, "delete comment 200");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Your comment has been successfully deleted");
        done();
      });
  });
  it("DELETE comments response 404", (done) => {
    request(app)
      .delete("/comments/" + commentCreate.id)
      .set({ token: null })
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        console.log(res.body, "delete comment 404");
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toEqual(404);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("User not found");
        done();
      });
  });
  afterAll(async () => {
    // destroy data
    try {
      await user.destroy({ where: {} });
      await comment.destroy({ where: {} });
    } catch (error) {
      console.log(error);
    }
  });
});
