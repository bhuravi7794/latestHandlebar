// test/app.test.js
const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");

describe("Express with Handlebars", () => {
  it("should render navbar with correct data", (done) => {
    request(app)
      .get("/navbar")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.text).to.include(
          '<h1><a href="index.html"><i class="fas fa-code"></i>My App</a></h1>'
        );
        expect(res.text).to.include(
          '<li><a href="profiles.html">Developers</a></li>'
        );
        expect(res.text).to.include(
          '<li><a href="/api/users/register">Register</a></li>'
        );
        expect(res.text).to.include('<li><a href="/login">Login</a></li>');

        done();
      });
  });
});
