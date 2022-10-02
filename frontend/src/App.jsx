import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Changepassword from './pages/changepassword/Changepassword';
import { useState, useEffect } from 'react';

export default function App() {
  const [ page, setPage ] = useState('login');

  useEffect( _ => {
    if (sessionStorage.hasOwnProperty('token')) return setPage('home');
  }, [])

  switch (page) {
    case 'login':
      return <Login setPage={setPage} />
    case 'home':
      return <Changepassword setPage={setPage} />
    case 'register':
      return <Register setPage={setPage} />
    case 'changepassword':
      return <Changepassword setPage={setPage} />
    default:
      return <Login setPage={setPage} />
  }
}
