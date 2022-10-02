import { Link } from 'react-router-dom';

export default function Nav({ setIsLoggedIn, isAdmin, setIsAdmin }) {
   function logout() {
      sessionStorage.removeItem('token'); 
      sessionStorage.removeItem('is-admin'); 
      setIsAdmin(false);
      setIsLoggedIn(false);
   }

   return (
      <nav>
         <ul>
            <li><Link to="/wachtwoordwijzigen">Wachtwoord wijzigen</Link></li>
            {isAdmin ? <li><Link to="/admin">Beheer</Link></li> : ''}
            <li onClick={logout}>Log uit</li>
         </ul>
      </nav>
   );
}