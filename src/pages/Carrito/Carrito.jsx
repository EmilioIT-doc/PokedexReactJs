import React, { useContext } from 'react';
import scss from './Carrito.module.scss';
import HeaderModule from '../home/header/HeaderModule';
import { CarritoContext } from '../../provider/CarritoContext';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const Carrito = () => {
  const { carrito, eliminarDelCarrito, vaciarCarrito } = useContext(CarritoContext); // Asegúrate de que tienes acceso a vaciarCarrito
  const { enqueueSnackbar } = useSnackbar();

  // Calcula el total multiplicando el número de Pokémon en el carrito por 349
  const totalPrecio = carrito.length * 349;

  const deletePokemon = async (pokemon) => {
    eliminarDelCarrito(pokemon);
    try {
      await axios.delete(`http://localhost:8000/api/carrito/eliminar/${pokemon.name}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
    } catch (error) {
      console.error('Error al eliminar el Pokémon del carrito:', error);
    }
  };

  const comprarProductos = async () => {
    if (carrito.length === 0) {
      enqueueSnackbar('Carrito Vacío', { variant: 'warning' });
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      const datosCompra = carrito.map((pokemon) => ({
        pokemon_name: pokemon.name,
        sprite: pokemon.sprite,
        price: 349, // Asegúrate de enviar el precio correcto
      }));

      const response = await axios.post('http://localhost:8000/api/comprar', { items: datosCompra }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        vaciarCarrito();
        enqueueSnackbar('¡Felicidades! Compra Exitosa', { variant: 'info' });
      } else {
        enqueueSnackbar('Error al realizar la compra', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar(`Error al realizar la compra: ${error.message}`, { variant: 'error' });
    }
  };

  return (
    <div>
      <HeaderModule />
      <button type="button" className={scss.buttom}  onClick={comprarProductos}>
        Comprar
      </button>
      {carrito.length === 0 ? (
        <p>No hay Pokémon en el carrito.</p>
      ) : (
        <div className={scss.contenedor}>
          
          <span style={{ color: '#000000' }}>Total Pokemones:</span>
          <strong style={{ color: '#000000', margin: '10px' }}> ${totalPrecio}</strong>
          {carrito.map((pokemon) => (
            <div key={pokemon.id} className={scss.card}>
              <img
                className={scss.img_poke}
                src={pokemon?.sprites?.other['official-artwork']?.front_default}
                alt={pokemon.name}
              />
              <div className={`bg-${pokemon?.species?.color?.name} ${scss.sub_card}`}>
                <strong className={scss.id_card}>#{pokemon.id}</strong>
                <br />
                <strong className={scss.name_card}>{pokemon.name}</strong>
                <h4 className={scss.altura_poke}>Altura: {pokemon.height}0 cm</h4>
                <h4 className={scss.peso_poke}>Peso: {pokemon.weight} Kg</h4>
                <h4 className={scss.habitat_poke}>Habitat: {pokemon?.species?.habitat?.name}</h4>

                <div className={scss.div_stats}>
                  {pokemon?.stats?.map((sta, index) => (
                    <div key={index}>
                      <h6 className={scss.item_stats}>
                        <span className={scss.name}>{sta.stat.name}</span>
                        <progress value={sta.base_stat} max={110}></progress>
                        <span className={scss.numero}>{sta.base_stat}</span>
                      </h6>
                    </div>
                  ))}
                </div>

                <div className={scss.div_type_color}>
                  {pokemon?.types?.map((ti, index) => (
                    <div key={index}>
                      <h6 className={`color-${ti.type.name} ${scss.color_type}`}>
                        {' '}
                        {ti.type.name}{' '}
                      </h6>
                    </div>
                  ))}
                </div>

                <div className={scss.div_evolucion}>
                  {pokemon?.evoluciones?.map((evo, index) => (
                    <div key={index} className={scss.item_evo}>
                      <img src={evo.img} alt="evo" className={scss.img} />
                      <h6>{evo.name}</h6>
                    </div>
                  ))}
                </div>

                <button type="button" className="btn btn-danger" onClick={() => deletePokemon(pokemon)}>
                  Eliminar
                </button>
                

                <div>
                  <strong>Precio $349</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default Carrito;
