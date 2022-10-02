import { useState } from 'react';
import config from '../../../config.json';

export default function MakeAdmin() {
   const [ result, setResult ] = useState({
      isResult: false,
      isError: false,
      message: ''
   });

   function deleteUser(event) {
      event.preventDefault();

      const username = event.target.username.value;
      const check = event.target.check.checked;

      if (!check) return setResult({
         isResult: true,
         isError: true,
         message: 'Klik eerst de controle box'
      });

      const data = {
         username: username,
      }

      fetch(`${config.api_url}/auth/deleteuser`, {
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
               message: `${username} heeft nu admin rechten`
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
      <div className="deleteUser">
         <h2>Gebruiker verwijderen</h2>
         <form onSubmit={deleteUser}>
            <input type="text" name="username" placeholder="Gebruikersnaam" />
            <span>
               <input type="checkbox" name="check" />
               <p>Let op, deze actie kan niet ondaan gemaakt worden</p>
            </span>
            <input type="submit" value="Verwijder" />
         </form>
         <div className={(result.isResult ? '' : 'hide ') + (result.isError ? 'error ' : '') + 'result'}>
            <p>{result.message}</p>
         </div>
      </div>
   );
}