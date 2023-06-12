const request = require('supertest')
const app = require('../app')
const { user,photo } = require("../models");
const jwt = require('../helpers/jwt')
let auth = null
let userId = null
let notId = null
let putId = null

for (let index = 1; index < 100; index++) {
  if (index !== userId) {
    notId = index
    break
  }
}

describe("POST /photos", () => {
      beforeAll(async () => {
        // destroy data users
        try {
          await photo.destroy({ where: {} },{truncate: true});
          await user.destroy({ where: {} },{truncate: true});

          const result = await user.create({
            email: "tes34@gmail.com",
            full_name: "tes00",
            username: "tes34",
            password: "tes1234",
            profile_image_url: "https://www.shutterstock.com/image-vector/short-custom-urls-url-shortener-600w-2233924609.jpg",
            age: 21,
            phone_number: "0853457"
          });
          userId = result.id
        } catch (error) {
          console.log(error);
        }
      });
// login
    it("Should loged in", (done) => {
      request(app)
        .post("/users/login")
        .send({
          email:"tes34@gmail.com",
          password:"tes1234"
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
          auth = res.body.token
          done()
        })
      })

      it("Should respond with 201", (done) => {
        request(app)
          .post("/photos")
          .set('token',  auth)
          .send({
            title: "test",
            caption: "test jest",
            poster_image_url: "https://www.shutterstock.com/image-vector/short-custom-urls-url-shortener-600w-2233924609.jpg",
          })
          .expect(201)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            
            expect(Object.keys(res.body.Photo).length).toBe(5);
            expect(res.body.Photo.UserId).toEqual(userId);
            expect(res.body.Photo.title).toEqual("test");
            expect(res.body.Photo.caption).toEqual("test jest");
            expect(res.body.Photo.poster_image_url).toEqual("https://www.shutterstock.com/image-vector/short-custom-urls-url-shortener-600w-2233924609.jpg");
            done();
          });
      });

      it("Should respond with 404", (done) => {
        request(app)
          .post("/photos")
          .set('token',  'udbiusbivcsuv')
          .send({
            title: "test",
            caption: "test jest",
            poster_image_url: "https://www.shutterstock.com/image-vector/short-custom-urls-url-shortener-600w-2233924609.jpg",
          })
          .expect(404)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            
            expect(res.body).toHaveProperty("message");
            expect(res.body.message).toEqual("User not found");
            expect(Object.keys(res.body).length).toBe(2);
            expect(Object.keys(res.body).length).not.toBe(5);
            expect(res.body).not.toHaveProperty("Photos");        
            done();
          });
      });

      it("Should respond with 500", (done) => {
        request(app)
          .post("/photos")
          .set('token',  auth)
          .send({
            title: "",
            caption: "test jest",
            poster_image_url: "https://www.shutterstock.com/image-vector/short-custom-urls-url-shortener-600w-2233924609.jpg",
          })
          .expect(500)
          .end((err, res) => {
            if (err) {
              done(err);
            }
            expect(res.body.name).toEqual("SequelizeValidationError");
            expect(res.body.errors[0].value).toEqual("");
            expect(res.body.errors[0].message).toEqual("Title is required!");
            expect(Object.keys(res.body).length).not.toBe(5);
            expect(res.body).not.toHaveProperty("Photos");        
            done();
          });
      });
})

describe("GET /photos", () => {
  beforeAll(async () => {
    // destroy data users
    try {
     const photo1 =  await photo.create({
        title: "test2",
        caption: "test jest2",
        poster_image_url: "https://www.shutterstock.com/image-vector/short-custom-urls-url-shortener-600w-2233924609.jpg",
        UserId : userId
      }
    );
    
    } catch (error) {
      console.log(error);
    }
  });

  it("Should respond with 200", (done) => {
    request(app)
      .get("/photos")
      .set('token',  auth)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(Object.keys(res.body.Photos).length).toBe(2);
        expect(res.body.Photos[0].UserId).toEqual(userId);
        expect(res.body).not.toHaveProperty("message");        
        expect(res.body.message).not.toEqual("User not found");
        expect(Object.keys(res.body).length).not.toBe(2);
        done();
      });
  });

  it("Should respond with 404", (done) => {
    request(app)
      .get("/photos")
      .set('token',  'jgud5d')
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.body).not.toHaveProperty("Photos");  
        expect(res.body).toHaveProperty("message");        
        expect(res.body.message).toEqual("User not found");
        expect(Object.keys(res.body).length).toBe(2);
        expect(Object.keys(res.body).length).not.toBe(1);

        done();
      });
  });
})

describe("PUT /photos/:id", () => {

  beforeAll(async () => {
    // destroy data users
    try {
      const photoId = await photo.findOne({ where: { UserId: userId } })
      putId = photoId.id

      
    } catch (error) {
      console.log(error);
    }
  });

  it("Should respond with 200", (done) => {
    request(app)
      .put(`/photos/${putId}`)
      .set('token',  auth)
      .send({
        title: "test baru put",
        caption: "test put"
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(Object.keys(res.body.photo).length).toBe(7);
        expect(res.body.photo.UserId).toEqual(userId);
        expect(res.body.photo.title).toEqual("test baru put");
        expect(res.body.photo.caption).toEqual("test put");
        expect(res.body.photo.poster_image_url).toEqual("https://www.shutterstock.com/image-vector/short-custom-urls-url-shortener-600w-2233924609.jpg");

        done();
      });
  });

  it("Should respond with 404", (done) => {
    request(app)
      .put(`/photos/${putId}`)
      .set('token',  'ujvtxutuy')
      .send({
        title: "test baru put",
        caption: "test put"
      })
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).not.toHaveProperty("Photos");  
        expect(res.body).toHaveProperty("message");        
        expect(res.body.message).toEqual("User not found");
        expect(Object.keys(res.body).length).toBe(2);
        expect(Object.keys(res.body).length).not.toBe(1);
        done();
      });
  });

  it("Should respond with 404", (done) => {
    request(app)
      .put(`/photos/0`)
      .set('token',  auth)
      .send({
        title: "test baru put",
        caption: "test put"
      })
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).not.toHaveProperty("Photos");  
        expect(res.body).toHaveProperty("message");        
        expect(res.body.message).toEqual("Photo not found");
        expect(Object.keys(res.body).length).toBe(1);
        expect(res.status).not.toBe(200)

        done();
      });
  });

  it("Should respond with 500", (done) => {
    request(app)
      .put(`/photos/${putId}`)
      .set('token',  auth)
      .send({
        title: "",
        caption: "test put"
      })
      .expect(500)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).not.toHaveProperty('Photos');
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0].message).toEqual('Title is required!');
        expect(res.body.errors[0].path).toEqual('title');
        expect(res.status).not.toBe(200)

        done();
      });
  });
})

describe("DELETE /photos/:id", () => {

  it("Should respond with 200", (done) => {
    request(app)
      .delete(`/photos/${putId}`)
      .set('token',  auth)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).not.toHaveProperty("errors");        
        expect(res.body).toHaveProperty("message");        
        expect(res.body.message).toEqual("Your photo has been successfully deleted");
        expect(Object.keys(res.body).length).toBe(1);
        expect(res.status).not.toBe(401)

        done();
      });
  })

  it("Should respond with 404", (done) => {
    request(app)
      .delete(`/photos/${putId}`)
      .set('token',  'jcr5')
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("message");        
        expect(res.body.message).toEqual("User not found");
        expect(Object.keys(res.body).length).toBe(2);
        expect(Object.keys(res.body).length).not.toBe(1);
        expect(res.status).not.toBe(200)


        done();
      });
  })

  it("Should respond with 404", (done) => {
    request(app)
      .delete(`/photos/0`)
      .set('token',  auth)
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("message");        
        expect(res.body.message).toEqual("Photo not found");
        expect(Object.keys(res.body).length).toBe(1);
        expect(Object.keys(res.body).length).not.toBe(2);
        expect(res.status).not.toBe(200)


        done();
      });
  })

  it("Should respond with 404", (done) => {
    request(app)
      .delete(`/photos/0`)
      .set('token-auth',  'jviyutcy')
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body).toHaveProperty("message");        
        expect(res.body.message).toEqual("User not found");
        expect(Object.keys(res.body).length).toBe(2);
        expect(Object.keys(res.body).length).not.toBe(1);
        expect(res.status).not.toBe(200)

        done();
      });
  })
})