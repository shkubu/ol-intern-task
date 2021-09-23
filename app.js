const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const clientsRoutes = require('./routes/clients');
const accountsRoutes = require('./routes/accounts');

const app = express();
const helmet = require('helmet');

app.use(bodyParser.json({limit: '500mb'}));

app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/back/auth', authRoutes);
app.use('/back/clients', clientsRoutes);
app.use('/back/accounts', accountsRoutes);

app.use(helmet());

app.use((error, req, res, next) => {
   console.log(error);
   const status = error.statusCode || 500;
   const message = error.message;
   res.status(status).json({message: message});
});

app.listen(process.env.PORT || 8080);
