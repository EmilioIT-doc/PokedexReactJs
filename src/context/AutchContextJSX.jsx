// import React, { createContext, useState, useContext } from 'react';
// import api from '../api/axios';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);

//   const register = async (data) => {
//     try {
//       await api.post('/register', data);
//       setError(null);
//     } catch (err) {
//       setError(err.response ? err.response.data.message : 'Error en el registro');
//     }
//   };

//   const login = async (data) => {
//     try {
//       const response = await api.post('/login', data);
//       setUser(response.data.user);
//       localStorage.setItem('auth_token', response.data.access_token);
//       setError(null);
//     } catch (err) {
//       setError(err.response ? err.response.data.message : 'Error en el inicio de sesión');
//     }
//   };

//   const logout = async () => {
//     try {
//       await api.post('/logout');
//       setUser(null);
//       localStorage.removeItem('auth_token');
//       setError(null);
//     } catch (err) {
//       setError(err.response ? err.response.data.message : 'Error en el cierre de sesión');
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, register, login, logout, error }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuthjsx = () => useContext(AuthContext);
