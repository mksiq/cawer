const { json } = require("body-parser");
const fetch = require("node-fetch");

test("Api is running: must return a welcome message", () => {
  //  fail("API not running")
  return fetch("http://localhost:8080", { method: "GET" })
    .then((res) => {
      res.json().then((x) => {
        expect(x.message).toBe("Welcome to CAW CAWER API!");
      });
    })
    .catch((e) => {
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
    });
  });
});

test("Insert user that does not exists must throw no errors", () => {
  const data = `username=new&password=newnewnew&email=new@gmail.com&alias=new`;
  return fetch("http://localhost:8080/register-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: data,
  })
    .then((res) => {
      return res
        .json()
        .then((x) => {
          expect(x.username).toEqual("new");
        })
        .catch((error) => {
          expect(error).toEqual("new");
        });
    })
    .catch((err) => {
      expect(err).toEqual("new");
    });
});

test("User login: matching username and  password must login", () => {
  const loggingUser = `password=testertester&username=tester`;
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: loggingUser,
  })
    .then((res) => {
      return res
        .json()
        .then((x) => {
          expect(x.message).not.toEqual("Password does not match");
        })
        .catch((error) => {
          fail("Wrong password");
        });
    })
    .catch((err) => {
      fail("Something else went wrong");
    });
});

test("User login: Wrong username and  password must  not login", () => {
  const loggingUser = `password=atester&username=tester`;
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: loggingUser,
  })
    .then((res) => {
      return res
        .json()
        .then((x) => {
          expect(x.message).toEqual("Password does not match");
        })
        .catch((error) => {
          fail("Wrong password");
        });
    })
    .catch((err) => {
      fail("Something else went wrong");
    });
});

test("User login: Non existing username must throw error", () => {
  const loggingUser = `password=atester&username=nope`;
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: loggingUser,
  })
    .then((res) => {
      return res
        .json()
        .then((x) => {
          expect(x.message).toEqual("User not found");
        })
        .catch((error) => {
          fail("Did not give not found user error");
        });
    })
    .catch((err) => {
      fail("Something else went wrong");
    });
});

test("Get User: passing token must return user data", () => {
  const loggingUser = `password=testertester&username=tester`;
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: loggingUser,
  })
    .then((res) => {
      return res
        .json()
        .then((x) => {
          const { token } = x;
          return fetch("http://localhost:8080/self", {
            method: "GET",
            headers: {
              "x-access-token": token,
            },
          })
            .then((response) => {
              return response
                .json()
                .then((user) => expect(user.username).toEqual("tester"));
            })
            .catch((error) => {
              expect(error).toEqual("tester");
              fail(error);
            });
        })
        .catch((error) => {
          fail(error);
        });
    })
    .catch((err) => {
      fail("Something else went wrong");
    });
});

test("Get another user while logged: no errors thrown", () => {
  const loggingUser = `password=testertester&username=tester`;
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: loggingUser,
  })
    .then((res) => {
      return res
        .json()
        .then((x) => {
          const { token } = x;
          return fetch("http://localhost:8080/user/6014347978cb1716ccfaa9bc", {
            method: "GET",
            headers: {
              "x-access-token": token,
            },
          })
            .then((response) => {
              return response
                .json()
                .then((user) => expect(user.username).toEqual("aaa"));
            })
            .catch((error) => {
              fail(error);
            });
        })
        .catch((error) => {
          fail(error);
        });
    })
    .catch((err) => {
      expect(err).toEqual("aaa")
      fail("Something else went wrong");
    });
});

test("Delete User: no errors thrown", () => {
  const loggingUser = `username=new&password=newnewnew`;
  return fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: loggingUser,
  })
    .then((res) => {
      return res
        .json()
        .then((x) => {
          const { token } = x;
          return fetch("http://localhost:8080/delete-user", {
            method: "DELETE",
            headers: {
              "x-access-token": token,
            },
          })
            .then((response) => {
              expect("x").toEqual("x");
            })
            .catch((error) => {
              fail(error);
            });
        })
        .catch((error) => {
          fail(error);
        });
    })
    .catch((err) => {
      fail("Something else went wrong");
    });
});
