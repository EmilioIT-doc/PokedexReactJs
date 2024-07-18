import React, { useState, useEffect } from 'react';
import HeaderModule from '../home/header/HeaderModule';
import { Card, CardBody, CardHeader } from 'reactstrap';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const Historial = () => {
  const [compras, setCompras] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
      fetchCompras();
  }, []);

  
  const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('es-ES', options);
  };

  
  const fetchCompras = async () => {
      try {
          const token = localStorage.getItem('jwtToken');
          const response = await axios.get('http://localhost:8000/api/compras', {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`, 
              },
          });

          if (response.status === 200) {
              setCompras(response.data.compras);
          } else {
              enqueueSnackbar('Error al obtener el historial de compras', { variant: 'error' });
          }
      } catch (error) {
          console.error('Error al obtener el historial de compras:', error);
          enqueueSnackbar('Error al obtener el historial de compras', { variant: 'error' });
      }
  };

  return (
      <div>
        <HeaderModule/>
          <h2 style={{ color: '#fff', marginTop: '10px', textAlign: 'center' }}>Historial de Compras</h2>
          {compras.length === 0 ? (
              <p style={{ color: '#cccccc', fontSize: '18px', textAlign: 'center' }}>No tienes compras anteriores.</p>
          ) : (
              compras.map((compra, index) => (
                  <Card key={index} className="mb-3" style={{ padding: '10px' }}>
                      <CardHeader style={{ textAlign: 'center' }}>
                          Fecha: {formatDate(compra.created_at)}
                      </CardHeader>
                      <CardBody style={{ textAlign: 'center' }}>
                          <h5 style={{ color: 'blue' }}>Total: ${compra.total}</h5>
                          <h6>Pokémons Comprados:</h6>
                          <ul style={{ listStyleType: 'none', padding: 0 }}>
                              {compra.pokemons_comprados.map((pokemon, index) => (
                                  <li key={index} style={{ marginBottom: '10px' }}>
                                      <img src={pokemon.sprite} alt={pokemon.pokemon_name} style={{ width: '100px', marginRight: '10px', verticalAlign: 'middle' }} />
                                      <span style={{ fontWeight: 'bold' }}>{pokemon.pokemon_name.charAt(0).toUpperCase() + pokemon.pokemon_name.slice(1)} - ${pokemon.price}</span>
                                  </li>
                              ))}
                          </ul>
                      </CardBody>
                  </Card>
              ))
          )}
      </div>
  );
}

export default Historial;
