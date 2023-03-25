import { Routes, Route } from 'react-router-dom';
import Navbar from './components/app/Navbar';
import Protected from './hook/Protected';
import Login from './pages/auth/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Protected Component={Home} />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
