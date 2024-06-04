import React, { useEffect, useState } from "react";
import scss from "./layout.module.scss";
import HeaderModule from "../header/HeaderModule";
import axios from 'axios'
import { URL_POKEMON } from '../../../api/apiRest'
import Card from "../../card/Card";
import * as FaIcons from "react-icons/fa";


export default function LayoutHome() {

    const [arrayPokemon, setArrayPokemon] = useState([]);
    const [globalPokemon, setGlobalPokemon] = useState([]);
    const [xpage, setXpage] = useState(1);
    const [search, setSearch] = useState('');


    useEffect(() => {
        const api = async () => {
          const limit = 15;
          const xp = (xpage - 1) * limit;
          const apiPoke = await axios.get(
            `${URL_POKEMON}?offset=${xp}&limit=${limit}`
          );
    
          setArrayPokemon(apiPoke.data.results);
        };
    
        api();
        getGlobalPokemons();
      }, [xpage, search]);

      const getGlobalPokemons = async () => {
        const res = await axios.get(`${URL_POKEMON}?offset=0&limit=1000`);
    
        const promises = res.data.results.map((pokemon) => {
          return pokemon;
        });
    
        const results = await Promise.all(promises);
        setGlobalPokemon(results);
      };
    
    
      const filterPokemons = search?.length > 0 
      ? globalPokemon?.filter(pokemon =>  pokemon?.name?.includes(search))
      : arrayPokemon
    
    
    
      const obtenerSearch = (e) => {
    
        const texto = e.toLowerCase()
        setSearch(texto)
        setXpage(1)
      }
    

    

      return (
        <div className={scss.layout}>
          <HeaderModule obtenerSearch={obtenerSearch}  />
    
          <section className={scss.section_pagination}>
            <div className={scss.div_pagination}>
              <span className={scss.item_izquierdo}
              
              onClick={() => {
                if (xpage === 1) {
                  return console.log("no puedo retroceder");
                }
                setXpage(xpage - 1);
              }}
              
              >
                <FaIcons.FaAngleLeft />
              </span>
              <span className={scss.item}> {xpage} </span>
              <span className={scss.item}> DE </span>
              <span className={scss.item}>
                {" "}
                {Math.round(globalPokemon?.length / 15)}{" "}
              </span>
              <span
                className={scss.item_derecho}
                onClick={() => {
                  if (xpage === 67) {
                    return console.log("es el ultimo");
                  }
                  setXpage(xpage + 1);
                }}
              >
                {" "}
                <FaIcons.FaAngleRight />{" "}
              </span>
            </div>
          </section>
    
          <div className={scss.card_content}>
            {filterPokemons.map((card, index) => {
              return <Card key={index} card={card} />;
            })}
          </div>
        </div>
      );
}
