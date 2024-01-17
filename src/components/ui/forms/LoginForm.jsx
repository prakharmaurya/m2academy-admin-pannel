import React, { useContext } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Loader from '../Loader';

import apiClient, {
  setAuthHeader,
  setFormDataAuthHeader,
} from '../../../utils/api';
import { setCookie } from '../../../utils/cookieConfig';
import { Context } from '../../../App';

const LoginForm = () => {
  const { setIsShowSnack, setSnackDetail } = useContext(Context);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post('/teachers/login', { email, password });
      const token = res.data.token;
      setAuthHeader(token);
      setFormDataAuthHeader(token);
      setCookie('token', token);
      setLoading(false);
      setIsShowSnack(true);
      setSnackDetail({ type: 'success', msg: 'Login Success' });
      navigate('/');
    } catch (err) {
      setLoading(false);
      console.log(err);
      if (err.response) {
        if (err.response.data.message) {
          setIsShowSnack(true);
          setSnackDetail({ type: 'error', msg: err.response.data.message });
        }
      }
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-md">
        <div className="py-10 px-4">
          <h3 className="text-2xl text-blue-500 text-center pb-10 font-semibold">
            Login to M2 Academy
          </h3>
          <form onSubmit={login} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label>Email</label>
              <input
                required
                type="email"
                placeholder="Enter Your Email"
                className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* <p className="text-sm text-red-500">email does not exists</p> */}
            </div>
            <div className="flex flex-col gap-1">
              <label>Password</label>
              <input
                required
                type="password"
                placeholder="Enter Your Password"
                className="p-3 rounded-sm bg-gray-200 boredr-none focus:outline focus:outline-blue-300"
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* <p className="text-sm text-red-500">email does not exists</p> */}
              <Link
                to="/auth/forgot_password"
                className="text-end text-blue-500 hover:underline"
              >
                forgot password?
              </Link>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading ? true : false}
                className={`${
                  loading ? 'bg-gray-300 text-black' : 'text-white bg-blue-500'
                } px-6 py-1.5 roundedd-sm`}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      {loading && <Loader />}
    </>
  );
};

export default LoginForm;
