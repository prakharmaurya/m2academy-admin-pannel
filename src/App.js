import { createContext, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/app/Navbar';
import Protected from './hook/Protected';
import ForgotPassword from './pages/auth/ForgotPassword';
import Login from './pages/auth/Login';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Board from './pages/[board]';
import Classes from './pages/[board]/[classes]';
import Chapters from './pages/[board]/[classes]/[chapters]';
import Lable from './pages/[board]/[classes]/[chapters]/label';
import ChapterLabel from './pages/[board]/[classes]/[chapters]/label/chapterLabel';
import Contents from './pages/[board]/[classes]/[chapters]/label/chapterLabel/contents';
import Snackbar from './components/app/Snacker';
import SlidesPage from './pages/Slides';

export const Context = createContext();

function App() {
  const [isShowSnack, setIsShowSnack] = useState(true);
  const [snackDetail, setSnackDetail] = useState({ type: '', msg: '' });

  useEffect(() => {
    if (isShowSnack) {
      const timeOut = setTimeout(() => {
        setIsShowSnack(false);
      }, 5000);

      return () => clearTimeout(timeOut);
    }
  }, [isShowSnack]);

  return (
    <Context.Provider value={{ setIsShowSnack, setSnackDetail }}>
      <Navbar />
      {isShowSnack && (
        <Snackbar
          type={snackDetail.type}
          message={snackDetail.msg}
          closeSnackbar={() => setIsShowSnack(false)}
        />
      )}
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot_password" element={<ForgotPassword />} />
        <Route path="/" element={<Protected Component={Home} />} />
        <Route path="/slides" element={<Protected Component={SlidesPage} />} />
        <Route path="/:id" element={<Protected Component={Board} />} />
        <Route path="/:id/:id" element={<Protected Component={Classes} />} />
        <Route
          path="/:id/:id/:id"
          element={<Protected Component={Chapters} />}
        />
        <Route
          path="/:id/:id/:id/:id"
          element={<Protected Component={Lable} />}
        />
        <Route
          path="/:id/:id/:id/:id/:id"
          element={<Protected Component={ChapterLabel} />}
        />
        <Route
          path="/:id/:id/:id/:id/:id/:id"
          element={<Protected Component={Contents} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Context.Provider>
  );
}

export default App;
