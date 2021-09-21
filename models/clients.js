const Database = require('../static-funcions/database-manipulation');

class ClientsSchema {
  constructor(client) {
    this.client = client;
  }

  postData() {
    let clients = Database.readData('clients');
    clients = clients.sort((a, b) => a.id - b.id);
    const newClient = this.client;
    let newId = clients[clients.length - 1].id;
    newId++;
    newClient.id = newId;
    clients.push(newClient);
    Database.writeData('clients', clients)
    return newId;
  }

  updateData(id) {
    let clients = Database.readData('clients');
    clients = clients.map(item => {
      if (item.id === id) {
        item = {id, ...this.client};
      }
      return item;
    });
    Database.writeData('clients', clients);
  }

  static getData() {
    return Database.readData('clients');
  }

  static checkPersonId(id) {
    const clients = Database.readData('clients');
    const sameClient = clients.find(item => item.personId === id);
    return !!sameClient;
  }

  static checkUpdatePersonId(id, personId) {
    const clients = Database.readData('clients');
    const sameClient = clients.find(item => id !== item.id && item.personId === personId);
    return !!sameClient;
  }

  static deleteData(id) {
    const clients = Database.readData('clients');
    let deleteIndex = -1;
    clients.map((item, index) => {
      if (item.id === id) {
        deleteIndex = index;
      }
    });
    if (deleteIndex >= 0) {
      clients.splice(deleteIndex, 1);
      Database.writeData('clients', clients)
      return true;
    }
    return false;
  }
}

module.exports = ClientsSchema;
