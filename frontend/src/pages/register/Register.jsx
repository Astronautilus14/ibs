import { useState } from 'react';
import config from '../../config.json';
import styles from './styles.css';

export default function Register({ setPage }) {
   const [ result, setResult ] = useState({
      isResult: false,
      isError: false,
      message: 'lorum ipsum solar dat idem'
   })

   function register(event) {
      event.preventDefault();

      const username = event.target.username.value;
      const password = event.target.password.value;
      const passwordRepeat = event.target.password_repeat.value;
      
      if (password != passwordRepeat) return setResult({
         isResult: true,
         isError: true,
         message: 'Wachtworden komen niet overeen'
      });

      const data = {
         username: username,
         password: password
      }

      fetch(`${config.api_url}/auth/register`, {
         method: 'POST',
         mode: 'cors',
         body: JSON.stringify(data),
         headers: {
           'content-type': 'application/json',
           'auth-token': sessionStorage.getItem('token')
         }
       })
       .then( res => {
          if (res.status == 200) {
            setResult({
               isResult: true,
               isError: false,
               message: `Nieuwe gebruiker ${username} aangemaakt`
            });
          } else {
             res.json().then( data => {
                setResult({
                  isResult: true,
                  isError: true,
                  message: data.message
                });
             });
          }
       });
   }

   return (
      <div className="register">
         <h2>Registreer een nieuwe gebruiker</h2>
         <form onSubmit={register}>
            <input type="text" name="username" placeholder="Gebruikersnaam" />
            <input type="password" name="password" placeholder="Wachtwoord" />
            <input type="password" name="password_repeat" placeholder="Herhaal wachtwoord" />
            <input type="submit" value="Registreer" />
         </form>
         <div className={(result.isResult ? '' : 'hide ') + (result.isError ? 'error ' : '') + 'result'}>
            <p>{result.message}</p>
         </div>
      </div>
   );
}