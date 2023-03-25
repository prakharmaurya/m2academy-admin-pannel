import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/ui/forms/LoginForm';
import { getCookie } from '../../utils/cookieConfig';

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isLogin = getCookie('token');
    if (isLogin) {
      navigate('/');
    }
  }, []);

  return (
    <div className="bg-gray-200 flex justify-center items-center min-h-screen">
      <div className="w-full md:w-1/2 px-5">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
