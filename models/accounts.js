const Database = require('../static-funcions/database-manipulation');

class AccountsSchema {

  static getData(clientId) {
    const accounts = Database.readData('accounts');
    return accounts.filter(item => item.clientId === clientId);
  }

  static saveData(clientId, accounts) {
    const currentAccounts = Database.readData('accounts');
    console.log(currentAccounts);
    const deletedAccounts = currentAccounts.filter(item => item.clientId !== clientId);
    console.log(deletedAccounts);
    accounts = accounts.map(item => {
      item.clientId = clientId;
      return item;
    });
    const newAccounts = deletedAccounts.concat(accounts);
    console.log(newAccounts);
    Database.writeData('accounts', newAccounts);
  }

  static checkAccountNumberUnique(clientId, accounts) {
    const otherAccounts = Database.readData('accounts').filter(item => item.clientId !== clientId);
    for (const newAccount of accounts) {
      for (const otherAccount of otherAccounts) {
        if (newAccount.accountNumber === otherAccount.accountNumber) {
          return newAccount.accountNumber;
        }
      }
    }
    return false
  }
}

module.exports = AccountsSchema;
