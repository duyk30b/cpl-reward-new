# What is this?

This is a server created for the purpose of falsifying data.
It is using the following technologies: json-server, json-server auth

# Installation

`npx @duycode/create-fakeapi`

# How to use

Please use VSCode with REST Client extensions, and try the following code:

```
@baseUrl = http://localhost:{{$dotenv PORT}}

### @name Login
POST {{baseUrl}}/login
Content-Type: application/json

{
  "email": "user@gmail.com",
  "password": "123456"
}

### @name Register
POST {{baseUrl}}/register
Content-Type: application/json

{
  "email": "olivier2@gmail.com",
  "username": "Oliver",
  "password": "123456"
}

### @name Signup
POST {{baseUrl}}/signup
Content-Type: application/json

{
  "email": "harry@gmail.com",
  "username": "Harry",
  "password": "123456"
}

### @name Signin
POST {{baseUrl}}/signin
Content-Type: application/json

{
  "email": "harry@gmail.com",
  "password": "123456"
}
```

# Option
