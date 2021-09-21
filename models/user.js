const fs = require('fs');

class UserSchema {
  constructor(name, password) {
    this.name = name;
    this.password = password
  }
  checkUser() {
    const users = JSON.parse(fs.readFileSync('database/users.json'));
    const inputUser = {
      name: this.name,
      password: this.password
    }
    const selectedUser = users.find((user) => {
      return user.name === inputUser.name && user.password === inputUser.password;
    });
    return !!selectedUser;
  }
}

module.exports = UserSchema;
