import Login from './pages/login/Login';
import Admin from './pages/admin/Admin';
import Changepassword from './pages/changepassword/Changepassword';
import Nav from './components/Nav';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ isAdmin, setIsAdmin ] = useState(false);

  useEffect( _ => {
    if (sessionStorage.hasOwnProperty('token')) setIsLoggedIn(true);
    if (sessionStorage.hasOwnProperty('is-admin')) setIsAdmin(true);
  }, [])

  if (!isLoggedIn) return <Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />;

  return (
    <BrowserRouter>
      <Nav setIsLoggedIn={setIsLoggedIn} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <Routes>
        <Route exact path="/" element={<Admin />} />
        <Route exact path="/admin" element={<Admin />} />
        <Route exact path="/wachtwoordwijzigen" element={<Changepassword />} /> 
      </Routes>
    </BrowserRouter>
  );
}
