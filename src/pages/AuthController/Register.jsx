import React, { useState } from 'react';
import scss from "../AuthController/register.module.scss";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import HeaderModule from '../home/header/HeaderModule';
import axios from 'axios'; // Asegúrate de importar axios

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data) => {
    try {
        const response = await axios.post('http://localhost:8000/api/register', data);
        enqueueSnackbar('Registro Exitoso', { variant: 'success' });
        navigate('/login');
    } catch (error) {
        console.error('Registration error:', error);
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
          <h2>Register</h2>
          <div className={scss.formGroup}>
            <label className={scss.label}>Nombre</label>
            <input {...register('name', { required: true })} className={scss.input} />
            {errors.name && <span className={scss.error}>Este campo es requerido</span>}
          </div>
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
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
