const dbfactory = require('./database.js')

const schema = {
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  active: {
    type: Boolean
  }
}

const Users = dbfactory("Users", schema)

function addUser(firstName, lastName, password, active) {
  let new_user = new Users({
    firstName: firstName,
    lastName: lastName,
    password: password,
    active: active
  })
  return new Promise((resolve, reject) => {
    new_user.save(function (error, user) {
      if (error) {
        reject(error)
      }
      resolve({
        user: user,
        success: true,
        message: 'You\'ve successfully signed up!'
      })
    })
  })
}

function fetchOne(id) {
  return new Promise((resolve, reject) => {
    Users.findById(id, Object.keys(schema).join(" "), function (error, user) {
      if (error) {
        reject(error)
      }
      resolve(user)
    })
  })
}

function updateOne(id, userObj) {
  return new Promise((resolve, reject) => {
    Users.findById(id, Object.keys(schema).join(" "), function (error, user) {
      if (error) {
        reject(error)
      }

      user.firstName = userObj.firstName
      user.lastName = userObj.lastName
      user.password = userObj.password
      user.active = userObj.active

      user.save(function (error) {
        if (error) {
          reject(error)
        }
        resolve(true)
      })
    })
  })
}

function removeOne(id) {
  return new Promise((resolve, reject) => {
    Users.remove({
      _id: id
    }, function (error, user) {
      if (error) {
        reject(error)
      }
      resolve(true)
    })
  })
}


module.exports = {
  addUser,
  fetchOne,
  updateOne,
  removeOne
}