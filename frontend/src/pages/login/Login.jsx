import config from '../../config.json';
import { useState } from 'react';
import styles from './styles.css';

export default function Login({ setIsLoggedIn , setIsAdmin }) {
   const [ error, setError ] = useState({
      isError: false,
      message: ''
   });

   function login(event) {
      event.preventDefault();
  
      const data = {
        "username": event.target.username.value,
        "password": event.target.password.value
      }
  
      fetch(`${config.api_url}/auth/login`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        }
      })
      .then( res => {
         if (res.status === 200) {
            res.json().then( data => {
               sessionStorage.setItem('token', data.token);
               if (data.isAdmin) {
                  sessionStorage.setItem('is-admin', 1);
                  setIsAdmin(true);
               }
               setIsLoggedIn(true);
            });
         } else {
            res.json().then( data => {
               setError({
                  isError: true,
                  message: data.message
               });
            });
         }
      });
    }
  
    return (
      <div className='login'>
         <div className='box'>
            <h2>IBS</h2>
            <form onSubmit={login}>
            <input type="text" name="username" placeholder="Gebruikersnaam" />
            <input type="password" name="password" placeholder="Wachtwoord" />
            <input type="submit" value="Login" />
            </form>
            <div className={!error.isError ? 'hide error': 'error'}>
               <p>{error.message}</p>
            </div>
         </div>
      </div>
    );
}