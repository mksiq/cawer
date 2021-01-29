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
  const data = `username=tester&password=testertester&email=tester@gmail.com&alias=tester`;
  return fetch("http://localhost:8080/register-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: data,
  }).then((res) => {
    res.json().then((x) => {
      expect(x.message).toEqual("User already exists");
    })
  })
});

test("Insert user that does not exists must throw no errors", () => {
  const data = `username=newnew&password=aaaaaaaaa&email=newnew@gmail.com&alias=newnew`;
  return fetch("http://localhost:8080/register-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: data,
  }).then((res) => {
    return res.json().then((x) => {
      expect(x.username).toEqual("newnew");
    }).catch(error => {
      fail('f')
    })
  }).catch( err => {fail('f')})
});

test("User login: matching username and  password must login", () => {
  const loggingUser = `password=testertester&username=tester`;
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: loggingUser,
  }).then((res) => {
    return  res.json().then((x) => {
      expect(x.message).not.toEqual("Password does not match");
    }).catch(error => {
      fail('Wrong password');
    })
  }).catch( err => {
    fail('Something else went wrong');
  })
});

test("User login: Wrong username and  password must  not login", () => {
  const loggingUser = `password=atester&username=tester`;
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: loggingUser,
  }).then((res) => {
    return  res.json().then((x) => {
      expect(x.message).toEqual("Password does not match");
    }).catch(error => {
      fail('Wrong password');
    })
  }).catch( err => {
    fail('Something else went wrong');
  })
});

test("User login: Non existing username must throw error", () => {
  const loggingUser = `password=atester&username=nope`;
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: loggingUser,
  }).then((res) => {
    return  res.json().then((x) => {
      expect(x.message).toEqual("User not found");
    }).catch(error => {
      fail('Did not give not found user error');
    })
  }).catch( err => {
    fail('Something else went wrong');
  })
});
