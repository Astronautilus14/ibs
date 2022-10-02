const router = require('express').Router();
const db_conn = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', verifyToken, verifyAdmin, async (req, res) => {
   const { username, password } = req.body;

   // Check user input
   if (username === undefined || password === undefined) return res.status(400).send(JSON.stringify({message: 'Naam en wachtwoord zijn verplicht'}));
   if (username.length == 0) return res.status(400).send(JSON.stringify({message: 'Een naam is verplicht'}));
   if (password.length < 6) return res.status(400).send(JSON.stringify({message: 'Wachtwoord is minder dan zes tekens'}));

   // Hash password
   const salt = await bcrypt.genSalt(10);
   const hash = await bcrypt.hash(password, salt);

   // Insert into database
   const query = 'INSERT INTO users (name, password) VALUES(?, ?)';
   db_conn.query(query, [username, hash], (error, result) => {
      if (error) {
         if (error.code == 'ER_DUP_ENTRY') return res.status(409).send(JSON.stringify({message: 'Naam bestaat al'}));
         console.error(error);
         return res.status(500).send(JSON.stringify({message: error}));
      }
      res.sendStatus(200);
   });
});

router.post('/login', (req, res) => {
   const { username, password } = req.body;

   // Check user input
   if (username === undefined || password === undefined) return res.status(400).send(JSON.stringify({message: 'Naam en wachtwoord zijn verplicht'}));
   if (username.length == 0 || password.length == 0) res.status(400).send(JSON.stringify({message: 'Naam en wachtwoord zijn verplicht'}));

   const query = 'SELECT id, password FROM users WHERE name = ?';
   db_conn.query(query, username, async (error, result) => {
      if (error) {
         console.error(error);
         return res.status(500).send(JSON.stringify({message: error}));
      }

      if (result.length == 0) return res.status(400).send(JSON.stringify({message: `Er is geen account met de naam ${username}`}));

      const correct_password = result[0].password;
      const correct = await bcrypt.compare(password, correct_password);
      if (!correct) return res.status(401).send(JSON.stringify({message: 'Wachtwoord onjuist'}));

      // Token
      const p_id = result[0].id;
      const token = jwt.sign({p_id: p_id}, process.env.TOKEN_SECRET);
      res.header('auth-token', token).send(JSON.stringify({token: token}));
   });
});

router.post('/changepassword', verifyToken, (req, res) => {
   const p_id = req.p_id;
   const { oldPassword, newPassword } = req.body;

   // Check user input
   if (oldPassword === undefined || newPassword === undefined) return res.status(400).send(JSON.stringify({message: 'Oud wachtwoord en nieuw wachtwoord zijn verplicht'}));
   if (oldPassword.length == 0) return res.status(400).send(JSON.stringify({message: 'Oud wachtwoord is verplicht'}));
   if (newPassword.length < 6) return res.status(400).send(JSON.stringify({message: 'Wachtwoord is minder dan zes tekens'}));

   // Check old password
   const query = 'SELECT password FROM users WHERE id = ?';
   db_conn.query(query, p_id, async (error, result) => {
      if (error) {
         console.error(error);
         return res.status(500).send(JSON.stringify({message: error}));
      }

      if (result.length == 0) return res.status(500).send(JSON.stringify({message: `Can't find user in database anymore with id ${p_id}`}));

      const correct_password = result[0].password;
      const correct = await bcrypt.compare(oldPassword, correct_password);
      if (!correct) return res.status(403).send(JSON.stringify({message: 'Wachtwoord onjuist'}));

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);

      // Update password
      const query = 'UPDATE users SET password = ? WHERE id = ?';
      db_conn.query(query, [hash, p_id], (error, result) => {
         if (error) {
            console.error(error);
            return res.status(500).send(JSON.stringify({message: error}));
         }
         return res.sendStatus(200);
      })
   });
})

function verifyToken(req, res, next) {
   const token = req.header('auth-token');
   if (token === undefined) return res.status(401).send(JSON.stringify({message: 'Je bent niet ingelogd'}));
   try {
      req.p_id = jwt.verify(token, process.env.TOKEN_SECRET).p_id;
      next();
   } catch (error) {
      res.status(401).send(JSON.stringify({message: 'Je bent niet ingelogd'}));
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

      if (!result[0].admin) return res.status(403).send(JSON.stringify({message: 'Je hebt hiertoe geen permissie'}));
      next();
   });
}

module.exports = {
   auth: router,
   verifyToken: verifyToken,
   verifyAdmin: verifyAdmin
};