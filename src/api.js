const express = require('express');
const app = express();
const serverless = require('serverless-http');
const healthRouter = require('./routes/health');
const orderRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const usersBalance = require('./routes/usersBalance');
const companyRouter = require('./routes/company');
const companySiteRouter = require('./routes/companySite');
const planRouter = require('./routes/plan');
const rateUsRouter = require('./routes/rateus');
const analyticsRouter = require('./routes/analytics');
const schedulesRouter = require('./routes/schedules');
const paymentsHistoricRouter = require('./routes/paymentsHistoric');
const addressRouter = require('./routes/address') 
const notificationRouter = require('./notification/notificationRoute') 
const scriptRouter = require('./routes/scriptRouter');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

const dotenv = require('dotenv'); 
dotenv.config();

// Mongo Config
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  locale : "zh@collation=unihan" 
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(cors());
app.use(bodyParser.json());
app.use(`/.netlify/functions/api/health`, healthRouter);
app.use(`/.netlify/functions/api/orders`, orderRouter);
app.use(`/.netlify/functions/api/auth`, authRouter);
app.use(`/.netlify/functions/api/users`, userRouter);
app.use(`/.netlify/functions/api/users-balance`, usersBalance);
app.use(`/.netlify/functions/api/companies`, companyRouter);
app.use(`/.netlify/functions/api/companies-site`, companySiteRouter);
app.use(`/.netlify/functions/api/plans`, planRouter);
app.use(`/.netlify/functions/api/rate-us`, rateUsRouter);
app.use(`/.netlify/functions/api/analytics`, analyticsRouter); 
app.use(`/.netlify/functions/api/schedules`, schedulesRouter);
app.use(`/.netlify/functions/api/payments-historic`, paymentsHistoricRouter);
app.use(`/.netlify/functions/api/address`, addressRouter);
app.use(`/.netlify/functions/api/notifications`, notificationRouter);

app.use(`/.netlify/functions/api/script`, scriptRouter);

module.exports.handler = serverless(app);