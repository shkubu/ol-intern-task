const Accounts = require('../models/accounts');
const throwError = require('../static-funcions/throw-error');

exports.getData = (req, res, next) => {
  const clientId = parseInt(req.params.clientId);
  const accounts = Accounts.getData(clientId);
  res.status(200).json(accounts);
}

exports.saveData = (req, res, next) => {
  const clientId = parseInt(req.params.clientId);
  const accounts = req.body;
  const notUniqueAccount = Accounts.checkAccountNumberUnique(clientId, accounts);
  if (notUniqueAccount) {
    throwError(409, `${notUniqueAccount} account_is_not_unique`, next);
    return;
  }
  Accounts.saveData(clientId, accounts);
  res.status(201).json({message: 'accounts saved!'})
}

// exports.updateData = (req, res, next) => {
//   const id = parseInt(req.params.id);
//   const clientData = req.body;
//   if (Clients.checkUpdatePersonId(id, clientData.personId)) {
//     throwError(409, 'another_person_id_already_exists', next);
//     return;
//   }
//   const client = new Clients(clientData);
//   client.updateData(id);
//   res.status(204).json();
// }

// exports.deleteData = (req, res, next) => {
//   const id = parseInt(req.params.id);
//   if (Clients.deleteData(id)) {
//     res.status(204).json({message: 'client deleted!'});
//   } else {
//     throwError(409, 'item_not_found', next);
//   }
// }
