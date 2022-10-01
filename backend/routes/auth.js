const router = require('express').Router();
const db_conn = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', verifyToken, verifyAdmin, async (req, res) => {
   const { name, password } = req.body;

   // Check user input
   if (name === undefined || password === undefined) return res.sendStatus(400);
   if (name.length == 0) return res.status(400).send('Een naam is verplicht')
   if (password.length < 6) return res.status(400).send('Wachtwoord is minder dan zes tekens');

   // Hash password
   const salt = await bcrypt.genSalt(10);
   const hash = await bcrypt.hash(password, salt);

   // Insert into database
   const query = 'INSERT INTO users (name, password) VALUES(?, ?)';
   db_conn.query(query, [name, hash], (error, result) => {
      if (error) {
         if (error.code == 'ER_DUP_ENTRY') return res.status(409).send('Naam bestaat al');
         console.error(error);
         return res.status(500).send(error);
      }
      return res.sendStatus(200);
   });
});

router.post('/login', (req, res) => {
   const { name, password } = req.body;

   // Check user input
   if (name === undefined || password === undefined) return res.sendStatus(400);
   if (name.length == 0 || password.length == 0) return res.status(400).send('Naam en wachtwoord zijn verplicht');

   const query = 'SELECT id, password FROM users WHERE name = ?';
   db_conn.query(query, name, async (error, result) => {
      if (error) {
         console.error(error);
         return res.status(500).send(error);
      }

      if (result.length == 0) return res.status(400).send(`Er is geen user met de naam ${name}`);

      const correct_password = result[0].password;
      const correct = await bcrypt.compare(password, correct_password);
      if (!correct) return res.status(400).send('Wachtwoord onjuist');

      // Token
      const p_id = result[0].id;
      const token = jwt.sign({p_id: p_id}, process.env.TOKEN_SECRET);
      res.header('auth-token', token).send(token);
   });
});

function verifyToken(req, res, next) {
   const token = req.header('auth-token');
   if (token === undefined) return res.status(401).send('Je bent niet ingelogt');
   try {
      req.p_id = jwt.verify(token, process.env.TOKEN_SECRET).p_id;
      next();
   } catch (error) {
      res.status(401).send('Je bent niet ingelogt');
   }
}

function verifyAdmin(req, res, next) {
   const p_id = req.p_id;
   const query = 'SELECT admin FROM users WHERE id = ?';
   db_conn.query(query, p_id, (error, result) => {
      if (error) {
         console.error(error);
         return res.status(500).send(error);
      }

      if (!result[0].admin) return res.status(403).send('Je hebt hiertoe geen permissie');
      next();
   });
}

module.exports = {
   auth: router,
   verifyToken: verifyToken,
   verifyAdmin: verifyAdmin
};