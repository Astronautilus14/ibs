const express = require('express');
const app = express();
const dotenv = require('dotenv');
const db_conn = require('./database');
const cors = require('cors');

dotenv.config();

// Import routes
const { auth } = require('./routes/auth');

// Database
function connect_db() {
   db_conn.connect( error => {
      if (error) throw error;
      console.log("Connected to the database");
   });
}

connect_db();

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/auth', auth);

// Listen
const port = process.env.PORT || 8080;
app.listen(port)
console.log(`Listening on port ${port}..`);