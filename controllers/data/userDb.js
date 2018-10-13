
const users = require('./users')


exports.getUser = (id) => users.find(user=>user.id == id) 

