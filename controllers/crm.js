const throwError = require('../static-funcions/throw-error');
const fs = require('fs');

const Crm = require('../models/crm');

exports.getData = async (req, res, next) => {
  const queryParams = req.query;
  const startRow = parseInt(queryParams.startRow) - 1;
  const endRow = parseInt(queryParams.endRow);
  const sortString = `${queryParams.asc === 'false' ? '-' : ''}${queryParams.orderBy}`;
  let filterQuery = {};
  if (queryParams.status) {
    filterQuery.status = queryParams.status;
  }
  if (queryParams.projectName) {
    filterQuery.projectName = queryParams.projectName;
  }
  if (queryParams.source) {
    filterQuery.source = queryParams.source;
  }
  if (queryParams.search) {
    filterQuery['$or'] = [
      {name: {$regex: `.*${queryParams.search}.*`}},
      {phoneNumber: {$regex: `.*${queryParams.search}.*`}},
      {'comments.comment': {$regex: `.*${queryParams.search}.*`}},
    ];
  }
  if (queryParams.updateDateStart || queryParams.updateDateEnd) {
    filterQuery.updateTime = {};
  }
  if (queryParams.updateDateStart) {
    filterQuery.updateTime['$gt'] = parseInt(queryParams.updateDateStart, 10);
  }
  if (queryParams.updateDateEnd) {
    filterQuery.updateTime['$lt'] = parseInt(queryParams.updateDateEnd, 10);
  }
  if (queryParams.createDateStart || queryParams.createDateEnd) {
    filterQuery.createTime = {};
  }
  if (queryParams.createDateStart) {
    filterQuery.createTime['$gt'] = parseInt(queryParams.createDateStart, 10);
  }
  if (queryParams.createDateEnd) {
    filterQuery.createTime['$lt'] = parseInt(queryParams.createDateEnd, 10);
  }
  Crm.find(filterQuery)
      .sort(sortString)
      .skip(startRow)
      .limit(endRow - parseInt(startRow))
      .exec((err, result) => {
        if (!result) {
          const error = new Error('Item not found!');
          error.statusCode = 404;
        }
        res.status(200).json(result);
      });
};

exports.getAllData = async (req, res, next) => {
  Crm.find()
      // .skip(0)
      // .limit(1000)
      .exec((err, result) => {
        if (!result) {
          const error = new Error('Item not found!');
          error.statusCode = 404;
        }
        res.status(200).json(result);
      });
};

exports.createLead = async (req, res, next) => {
  const data = req.body;
  const crm = new Crm({
    email: data.email,
    name: data.name,
    unread: false,
    projectName: data.projectName,
    apartmentName: data.apartmentName,
    createTime: new Date().getTime(),
    updateTime: new Date().getTime(),
    comments: data.comments,
    source: data.source,
    areaRange: data.areaRange,
    tagName: data.tagName,
    status: data.status,
    personId: data.personId,
    phoneNumber: data.phoneNumber
  });
  crm.save().then((result) => {
    res.status(201).json(result);
  }).catch((err => {
    next(err);
  }))
};

exports.createData = async (req, res, next) => {
  const data = req.body;
  if (data.phoneNumber.length > 10) {
    const oldLead = await Crm.findOne({phoneNumber: {$regex: `.*${data.phoneNumber.replace('+995', '')}.*`}});
    if (!!oldLead) {
      if (data.name) {
        oldLead.name = data.name
      }
      if (data.email) {
        oldLead.email = data.email
      }
      if (data.projectName) {
        oldLead.projectName = data.projectName
      }
      if (data.apartmentName) {
        oldLead.apartmentName = data.apartmentName
      }
      oldLead.source = data.source;
      oldLead.updateTime = new Date().getTime();
      oldLead.unread = true;
      oldLead.save().then(() => {
        res.status(201).json('created');
      });
    } else {
      data.createTime = new Date().getTime();
      data.updateTime = new Date().getTime();
      data.status = 'NEUTRAL';
      data.unread = true;
      const newLead = new Crm(data);
      newLead.save().then((result) => {
        res.status(201).json(result);
      });
    }
  } else {
    throwError(500, 'no', next);
  }
};

exports.deleteData = (req, res, next) => {
  const id = req.params.id;
  Crm.findById(id).then(item => {
    if (!item) {
      const error = new Error('Item not found!');
      error.statusCode = 404;
      throw error;
    }
    return Crm.findByIdAndDelete(id);
  }).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.readData = async (req, res, next) => {
  const id = req.params.id;
  Crm.findByIdAndUpdate(id, {
    $set: {
      unread: false
    }
  }).then(result => {
    res.status(201).json('read');
  }).catch(err => {
    throwError(500, 'nooo', next);
  });
}

exports.updateData = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  Crm.findByIdAndUpdate(id, {
    $set: {
      email: data.email,
      name: data.name,
      projectName: data.projectName,
      apartmentName: data.apartmentName,
      updateTime: new Date().getTime(),
      comments: data.comments,
      source: data.source,
      areaRange: data.areaRange,
      tagName: data.tagName,
      status: data.status,
      personId: data.personId,
      phoneNumber: data.phoneNumber
    }
  }, {upsert: true}).then(result => {
    res.status(201).json(result);
  }).catch(err => {
    throwError(500, 'nooo', next);
  });
}

exports.updateProjects = async (req, res, next) => {
  const projects = JSON.parse(fs.readFileSync('projects.json'));
  const projectsObj = {};
  for (let project of projects) {
    projectsObj[project.id] = project.title;
  }
  const leads = JSON.parse(fs.readFileSync('lead_projects.json'));
  const leadsObj = {};
  for (let lead of leads) {
    if (leadsObj[lead.lead_id]) {
      leadsObj[lead.lead_id] += `, ${projectsObj[lead.project_id]}`;
    } else {
      leadsObj[lead.lead_id] = projectsObj[lead.project_id];
    }
  }
  console.log(Object.keys(leadsObj).length);
  const data = await Crm.find({oldId: {$gt: 0}, projectName: {$exists: false}})
  console.log(data.length);
  let ids = data.map(item => {
    if (item.oldId) {
      return item.oldId
    }
  });
  ids = ids.sort((a, b) => {
    return a - b;
  });
  ids = [...new Set(ids)];
  console.log(ids.length);
  for (const id of ids) {
    if (leadsObj[id]) {
      await Crm.updateOne({oldId: id, projectName: {$exists: false}}, {$set: {projectName: leadsObj[id]}})
          .then((result) => {
            console.log(result);
          });
    }
    console.log('-----------------')
  }
  res.status(200).json();
}
