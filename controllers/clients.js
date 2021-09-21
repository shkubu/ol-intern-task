const Clients = require('../models/clients');
const throwError = require('../static-funcions/throw-error');

exports.getData = (req, res, next) => {
  const clients = Clients.getData();
  res.status(200).json(clients);
}

exports.postData = (req, res, next) => {
  const clientData = req.body;
  if (Clients.checkPersonId(clientData.personId)) {
    throwError(409, 'person_id_already_exists', next);
    return;
  }
  const client = new Clients(clientData);
  const newId = client.postData();
  res.status(201).json({newId, message: 'client created!'})
}

exports.updateData = (req, res, next) => {
  const id = parseInt(req.params.id);
  const clientData = req.body;
  if (Clients.checkUpdatePersonId(id, clientData.personId)) {
    throwError(409, 'another_person_id_already_exists', next);
    return;
  }
  const client = new Clients(clientData);
  client.updateData(id);
  res.status(204).json();
}

exports.deleteData = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (Clients.deleteData(id)) {
    res.status(204).json({message: 'client deleted!'});
  } else {
    throwError(409, 'item_not_found', next);
  }
}
