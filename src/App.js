import { Routes, Route } from 'react-router-dom';
import Navbar from './components/app/Navbar';
import Protected from './hook/Protected';
import ForgotPassword from './pages/auth/ForgotPassword';
import Login from './pages/auth/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Board from './pages/[board]';
import Classes from './pages/[board]/[classes]';
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot_password" element={<ForgotPassword />} />
        <Route path="/" element={<Protected Component={Home} />} />
        <Route path="/:id" element={<Protected Component={Board} />} />
        <Route path="/:id/:id" element={<Protected Component={Classes} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
