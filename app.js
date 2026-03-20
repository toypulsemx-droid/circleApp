const express = require('express');
const cors = require('cors');

const eventsRoutesApp = require('./Routes/RoutesApp/RoutesEvents');
const authCodeApp = require('./Routes/RoutesAuthUser/userAuthAuth');
const orderApp = require('./Routes/RouterOrder/routerOrder')
const crdApp = require('./Routes/RouterCDR/crdRouter')
const cloudRoutes = require('./Routes/RouterCloud/routerCloud');


const app = express();

const whitelist = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://jade-jelly-bba4f6.netlify.app',
  'https://toy-pulsemx.store',
  'http://192.168.100.33:5174',
  'https://circletickets.netlify.app',
  'https://www.circletickets.store',
  'https://circletickets.netlify.app',
  'https://circletickets.store',
  'https://www.circletickets.store',

];

app.use(cors({
  origin: function(origin, callback) {
    console.log('ORIGIN:', origin)
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    if (whitelist.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS no permitido por el servidor'));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options(/.*/, cors());
app.use(express.json());

app.use('/api', eventsRoutesApp);

app.use('/api', authCodeApp);
app.use('/api', orderApp);
app.use('/api', crdApp);
app.use('/api', cloudRoutes);


module.exports = app;
