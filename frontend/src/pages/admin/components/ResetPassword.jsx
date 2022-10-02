import { useState } from 'react';
import config from '../../../config.json';

export default function ResetPassword() {
   const [ result, setResult ] = useState({
      isResult: false,
      isError: false,
      message: ''
   });

   function resetPassword(event) {
      event.preventDefault();

      const username = event.target.username.value;
      const newPassword = event.target.new_password.value;
      const newPasswordRepeat = event.target.new_password_repeat.value;

      if (newPassword != newPasswordRepeat) return setResult({
         isResult: true,
         isError: true,
         message: 'Wachtworden komen niet overeen'
      });

      const data = {
         username: username,
         newPassword: newPassword
      }

      fetch(`${config.api_url}/auth/resetpassword`, {
         method: 'POST',
         mode: 'cors',
         body: JSON.stringify(data),
         headers: {
           'content-type': 'application/json',
           'auth-token': sessionStorage.getItem('token')
         }
      }).then( res => {
         if (res.status === 200) {
            setResult({
               isResult: true,
               isError: false,
               message: 'Wachtwoord succesvol hersteld'
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
      <div className="resetPassword">
         <h2>Herstel wachtwoord</h2>
         <form onSubmit={resetPassword}>
            <input type="text" name="username" placeholder="Gebruikersnaam" />
            <input type="password" name="new_password" placeholder="Nieuw wachtwoord" />
            <input type="password" name="new_password_repeat" placeholder="Herhaal nieuw wachtwoord" />
            <input type="submit" value="Herstel" />
         </form>
         <div className={(result.isResult ? '' : 'hide ') + (result.isError ? 'error ' : '') + 'result'}>
            <p>{result.message}</p>
         </div>
      </div>
   );
}