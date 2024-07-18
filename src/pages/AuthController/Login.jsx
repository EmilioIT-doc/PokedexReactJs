import React from 'react';
import scss from "../AuthController/login.module.scss";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import HeaderModule from '../home/header/HeaderModule';
import axios from 'axios';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data) => {
    try {
        const response = await axios.post('http://localhost:8000/api/login', data);
        console.log('User logged in:', response.data);
        
        if (response.data && response.data.access_token) {
            localStorage.setItem('jwtToken', response.data.access_token);
            localStorage.setItem('userName', data.email); // Almacena el email como ejemplo
            enqueueSnackbar('Inicio de sesión exitoso', { variant: 'success' });
            navigate('/');
        } else {
            console.error('Unexpected response format:', response.data);
        }
    } catch (error) {
        console.error('Login error:', error);
    }
  };

  const handleButtonHover = (e, hover) => {
    e.currentTarget.style.backgroundColor = hover ? scss.buttonHover : scss.button;
  };

  return (
    <div>
      <HeaderModule />
      <div className={scss.container}>
        <form onSubmit={handleSubmit(onSubmit)} className={scss.form}>
          <h2>Log in</h2>
          <div className={scss.formGroup}>
            <label className={scss.label}>Email</label>
            <input {...register('email', { required: true })} className={scss.input} />
            {errors.email && <span className={scss.error}>Este campo es requerido</span>}
          </div>
          <div className={scss.formGroup}>
            <label className={scss.label}>Contraseña</label>
            <input type='password' {...register('password', { required: true })} className={scss.input} />
            {errors.password && <span className={scss.error}>Este campo es requerido</span>}
          </div>
          <button
            type="submit"
            className={scss.button}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
