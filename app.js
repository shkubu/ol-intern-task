const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoConnect = require('./util/database').mongoConnect;
const https = require('https');

const projectsRoutes = require('./routes/projects');
const apartmentTypesRoutes = require('./routes/apartment-types');
const floorTypesRoutes = require('./routes/floor-types');
const floorsRoutes = require('./routes/floors');
const apartmentsRoutes = require('./routes/apartments');
const cardsRoutes = require('./routes/binadari-cards');
const newsRoutes = require('./routes/news');
const ordersRoutes = require('./routes/orders');
const crmRoutes = require('./routes/crm');
const suggestionRoutes = require('./routes/suggestion');
const authRoutes = require('./routes/auth');

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

const app = express();
const helmet = require('helmet');

app.use(express.static('./public/binadari-front'));
app.use('/home', express.static('./public/binadari-front'));
app.use('/projects', express.static('./public/binadari-front'));
app.use('/cards', express.static('./public/binadari-front'));
app.use('/selected_project/:projectId', express.static('./public/binadari-front'));
app.use('/selected_project/:projectId/:floor', express.static('./public/binadari-front'));
app.use('/selected_project/:projectId/:floorId/:apartmentId', express.static('./public/binadari-front'));
app.use('/online-form', express.static('./public/binadari-front'));
app.use('/news', express.static('./public/binadari-front'));
app.use('/news/:newsId', express.static('./public/binadari-front'));
app.use('/about-us', express.static('./public/binadari-front'));
app.use('/contact', express.static('./public/binadari-front'));
app.use('/site', express.static('./public/binadari-front'));
app.use('/site/:parent', express.static('./public/binadari-front'));
app.use('/site/:parent/:child', express.static('./public/binadari-front'));
app.use('/site/:parent/:child/:grandchild', express.static('./public/binadari-front'));
app.use('/admin', express.static('./public/binadari-admin'));
app.use('/crm', express.static('./public/binadari-crm'));
app.use('/crm/home', express.static('./public/binadari-crm'));
app.use('/zohoverify/verifyforzoho.html', express.static('./public/zohoverify/verifyforzoho.html'));


app.use(bodyParser.json({limit: '500mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/back/projects', projectsRoutes);
app.use('/back/apartment-types', apartmentTypesRoutes);
app.use('/back/floor-types', floorTypesRoutes);
app.use('/back/floors', floorsRoutes);
app.use('/back/apartments', apartmentsRoutes);
app.use('/back/binadari-cards', cardsRoutes);
app.use('/back/news', newsRoutes);
app.use('/back/orders', ordersRoutes);
app.use('/back/crm', crmRoutes);
app.use('/back/suggestion', suggestionRoutes);
app.use('/back/auth', authRoutes);

app.use(helmet());

app.use((error, req, res, next) => {
   console.log(error);
   const status = error.statusCode || 500;
   const message = error.message;
   res.status(status).json({message: message});
});

mongoConnect(() => {
  // https.createServer({key: privateKey, cert: certificate}, app).listen(process.env.PORT || 8080);
  app.listen(process.env.PORT || 8080);
    console.log('start');
});
