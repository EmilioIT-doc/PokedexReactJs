import React, { useEffect, useState, useContext } from 'react';
import scss from './Card.module.scss';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { URL_POKEMON, URL_ESPECIES, URL_EVOLUCIONES } from '../../api/apiRest';
import { CarritoContext } from '../../provider/CarritoContext';

const Card = ({ card }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [itemPokemon, setItemPokemon] = useState({});
  const [especiePokemon, setEspeciePokemon] = useState({});
  const [evoluciones, setEvoluciones] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const { agregarAlCarrito } = useContext(CarritoContext);

  useEffect(() => {
    const dataPokemon = async () => {
      const api = await axios.get(`${URL_POKEMON}/${card.name}`);
      setItemPokemon(api.data);
    };
    dataPokemon();
  }, [card]);

  useEffect(() => {
    const dataEspecie = async () => {
      const URL = card.url.split('/');
      const api = await axios.get(`${URL_ESPECIES}/${URL[6]}`);
      setEspeciePokemon({
        url_especie: api?.data?.evolution_chain,
        data: api?.data,
      });
    };
    dataEspecie();
  }, [card]);

  useEffect(() => {
    async function getPokemonImagen(id) {
      const response = await axios.get(`${URL_POKEMON}/${id}`);
      return response?.data?.sprites?.other['official-artwork']?.front_default;
    }

    if (especiePokemon?.url_especie) {
      const obtenerEvoluciones = async () => {
        const arrayEvoluciones = [];
        const URL = especiePokemon?.url_especie?.url.split('/');
        const api = await axios.get(`${URL_EVOLUCIONES}/${URL[6]}`);
        const URL2 = api?.data?.chain?.species?.url?.split('/');
        const img1 = await getPokemonImagen(URL2[6]);
        arrayEvoluciones.push({
          img: img1,
          name: api?.data?.chain?.species?.name,
        });

        if (api?.data?.chain?.evolves_to?.length !== 0) {
          const DATA2 = api?.data?.chain?.evolves_to[0]?.species;
          const ID = DATA2?.url?.split('/');
          const img2 = await getPokemonImagen(ID[6]);

          arrayEvoluciones.push({
            img: img2,
            name: DATA2?.name,
          });

          if (api?.data?.chain.evolves_to[0].evolves_to.length !== 0) {
            const DATA3 = api?.data?.chain?.evolves_to[0]?.evolves_to[0]?.species;
            const ID = DATA3?.url?.split('/');
            const img3 = await getPokemonImagen(ID[6]);

            arrayEvoluciones.push({
              img: img3,
              name: DATA3?.name,
            });
          }
        }

        setEvoluciones(arrayEvoluciones);
      };

      obtenerEvoluciones();
    }
  }, [especiePokemon]);

  let pokeId = itemPokemon?.id?.toString();
  if (pokeId?.length === 1) {
    pokeId = '00' + pokeId;
  } else if (pokeId?.length === 2) {
    pokeId = '0' + pokeId;
  }

  // Función para abrir el modal y almacenar el Pokémon seleccionado
  const openModal = (pokemon) => {
    setSelectedPokemon(pokemon);
    setModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedPokemon(null);
  };

  const addToCart = async (pokemon) => {
    const token = localStorage.getItem('jwtToken');
    console.log(pokemon); // Verifica que recibes el Pokémon correctamente aquí
    agregarAlCarrito(itemPokemon);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/carrito/agregar',
        {
          pokemon_name: pokemon.name,
          sprite: pokemon.sprites.other['official-artwork'].front_default,
          price: 349, // Opcional: asegúrate de tener el precio adecuado aquí
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        enqueueSnackbar('¡Pokémon agregado al carrito!', { variant: 'success' });
        // No veo definida la variable `setCarrito` aquí, verifica si es necesaria
      } else {
        enqueueSnackbar('Error al agregar el Pokémon al carrito', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error al agregar el Pokémon al carrito:', error);
      enqueueSnackbar('Error al agregar el Pokémon al carrito', { variant: 'error' });
    }
  };
  

  
  return (
    <div>
      <div className={scss.card}>
        <img
          className={scss.img_poke}
          src={itemPokemon?.sprites?.other['official-artwork']?.front_default}
          alt="pokemon"
        />
        <div className={`bg-${especiePokemon?.data?.color?.name} ${scss.sub_card}`}>
          <strong className={scss.id_card}>#{pokeId} </strong>
          <br />
          <strong className={scss.name_card}> {itemPokemon.name} </strong>
          <h4 className={scss.altura_poke}> Altura: {itemPokemon.height}0 cm </h4>
          <h4 className={scss.peso_poke}>Peso: {itemPokemon.weight} Kg </h4>
          <h4 className={scss.habitat_poke}>
            Habitat: {especiePokemon?.data?.habitat?.name}{' '}
          </h4>

          <div className={scss.div_stats}>
            {itemPokemon?.stats?.map((sta, index) => (
              <div key={index}>
                <h6 className={scss.item_stats}>
                  <span className={scss.name}> {sta.stat.name} </span>
                  <progress value={sta.base_stat} max={110}></progress>
                  <span className={scss.numero}> {sta.base_stat} </span>
                </h6>
              </div>
            ))}
          </div>

          <div className={scss.div_type_color}>
            {itemPokemon?.types?.map((ti, index) => (
              <div key={index}>
                <h6 className={`color-${ti.type.name} ${scss.color_type}`}>
                  {' '}
                  {ti.type.name}{' '}
                </h6>
              </div>
            ))}
          </div>

          <div className={scss.div_evolucion}>
            {evoluciones.map((evo, index) => (
              <div key={index} className={scss.item_evo}>
                <img src={evo.img} alt="evo" className={scss.img} />
                <h6> {evo.name} </h6>
              </div>
            ))}
          </div>
          <div className={scss.div_evolucion}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openModal(itemPokemon)}
            >
              View {itemPokemon.name}
            </button>

            <button type="button" className="btn btn-secondary" onClick={() => addToCart(itemPokemon)}>
              Agregar al Carrito
            </button>
          </div>
          <div>
            <strong> Precio $349 </strong>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && <div className="modal-backdrop fade show"></div>}
      {modalOpen && (
        <div
          className="modal fade show"
          id="viewpokemon"
          tabIndex="-1"
          aria-labelledby="viewpokemonLabel"
          aria-modal="true"
          role="dialog"
          style={{ display: 'block' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="viewpokemonLabel">
                  Detalles de {selectedPokemon?.name}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className={scss.card}>
                <img
                  className={scss.img_poke}
                  src={selectedPokemon?.sprites?.other['official-artwork']?.front_default}
                  alt="pokemon"
                />
                <div className={`bg-${especiePokemon?.data?.color?.name} ${scss.sub_card}`}>
                  <strong className={scss.id_card}>#{pokeId} </strong>
                  <br />
                  <strong className={scss.name_card}> {selectedPokemon?.name} </strong>
                  <h4 className={scss.altura_poke}> Altura: {selectedPokemon?.height}0 cm </h4>
                  <h4 className={scss.peso_poke}>Peso: {selectedPokemon?.weight} Kg </h4>
                  <h4 className={scss.habitat_poke}>
                    Habitat: {especiePokemon?.data?.habitat?.name}{' '}
                  </h4>

                  <div className={scss.div_stats}>
                    {selectedPokemon?.stats?.map((sta, index) => (
                      <div key={index}>
                        <h6 className={scss.item_stats}>
                          <span className={scss.name}> {sta.stat.name} </span>
                          <progress value={sta.base_stat} max={110}></progress>
                          <span className={scss.numero}> {sta.base_stat} </span>
                        </h6>
                      </div>
                    ))}
                  </div>

                  <div className={scss.div_type_color}>
                    {selectedPokemon?.types?.map((ti, index) => (
                      <div key={index}>
                        <h6 className={`color-${ti.type.name} ${scss.color_type}`}>
                          {' '}
                          {ti.type.name}{' '}
                        </h6>
                      </div>
                    ))}
                  </div>

                  <div className={scss.div_evolucion}>
                    {evoluciones.map((evo, index) => (
                      <div key={index} className={scss.item_evo}>
                        <img src={evo.img} alt="evo" className={scss.img} />
                        <h6> {evo.name} </h6>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
