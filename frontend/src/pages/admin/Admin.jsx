import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import MakeAdmin from './components/MakeAdmin';
import DeleteUser from './components/DeleteUser';
import styles from './styles.css';

export default function Admin() {
   

   return (
      <div className="admin">
         <Register />
         <ResetPassword />
         <MakeAdmin />
         <DeleteUser />
      </div>
   );
}