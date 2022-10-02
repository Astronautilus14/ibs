import config from '../../config.json';
import { useState } from 'react';
import styles from './styles.css';

export default function Changepassword({ changePage }) {
   const [ result, setResult ] = useState({
      isResult: false,
      isError: false,
      message: ''
   })

   function changepassword(event) {
      event.preventDefault();

      const oldPassword = event.target.old_password.value;
      const newPassword = event.target.new_password.value;
      const newPasswordRepeat = event.target.new_password_repeat.value;
      
      if (newPassword != newPasswordRepeat) return setResult({
         isResult: true,
         isError: true,
         message: 'Wachtworden komen niet overeen'
      });

      const data = {
         oldPassword: oldPassword,
         newPassword: newPassword
      }

      fetch(`${config.api_url}/auth/changepassword`, {
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
               message: 'Wachtwoord succesvol gewijzigd'
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
      <div className='changepassword'>
         <h2>Wachtwoord wijzigen</h2>
         <form onSubmit={changepassword}>
            <input type="password" name="old_password" placeholder="Oud wachtwoord" />
            <input type="password" name="new_password" placeholder="Nieuw wachtwoord" />
            <input type="password" name="new_password_repeat" placeholder="Nieuw wachtwoord herhalen" />
            <input type="submit" value="Wijzig wachtwoord" />
         </form>
         <div className={(result.isResult ? '' : 'hide ') + (result.isError ? 'error ' : '') + 'result'}>
            <p>{result.message}</p>
         </div>
      </div>
   );
}