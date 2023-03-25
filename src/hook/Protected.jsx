import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/cookieConfig';

const Protected = (props) => {
  const navigate = useNavigate();

  const { Component } = props;
  useEffect(() => {
    const isLogin = getCookie('token');
    if (!isLogin) {
      navigate('/auth/login');
    }
  }, []);
  return (
    <>
      <Component />
    </>
  );
};

export default Protected;
