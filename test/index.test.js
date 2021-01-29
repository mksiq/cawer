const fetch = require("node-fetch");

test("Api is running: must return welcome message", () => {
//  fail("API not running")
  return fetch("http://localhost:8080", { method: "GET" }).then((res) => {
    res.json().then((x) => {
      expect(x.message).toBe("Welcome to CAW CAWER API!");
    })
  }).catch( e => {
    fail("API not running");
  });
});

test("Insert user that exists: not allowed", () => {
  const theDate = `username=tester&password=testertester&email=tester@gmail.com&alias=tester`;
  return fetch("http://localhost:8080/register-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: theDate,
  }).then((res) => {
    res.json().then((x) => {}).catch(x => {
      expect(x.message).toBe("User already exists")
    })
  }).catch(x => {
    expect(x.message).toBe("User already exists");
  })
});

test("Insert user that does not exists: allowed", () => {
  const newUser = `username=new&password=newnewnew&email=new@gmail.com&alias=new`;
  return fetch("http://localhost:8080/register-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: newUser,
  }).then((res) => {
    res.json().then((x) => {expect(x.username).toBe("new"); done();} ).catch(x => {
      expect(x).not.toThrow(x)
    }).catch(x => {
      expect(x.message).not.toBe("User already exists");
    });
  })
});
