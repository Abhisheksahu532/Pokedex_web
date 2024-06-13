import { useEffect, useState } from "react";
import axios from "axios";
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";

function PokemonList(){

    const [pokemonList, setPokemonList] =useState([]);
    const [isLoading, setisLoading] =useState(true);

    const POKEDEX_URL = 'https://pokeapi.co/api/v2/pokemon';


    async function downloadPokemon(){
        const response = await axios.get(POKEDEX_URL); // downloads list of 20 pokemons 

        const pokemonResults =response.data.results; // creates a array of pokemons from result

        console.log(response.data);

        // iterating over the array of pokemons, and using their url, to create an array of promises
        //which will download those 20 pokemons
        const pokemonResultsPromise= pokemonResults.map((pokemon) => axios.get(pokemon.url));

        // passing that promise array to axios.all
        const pokemonData =await axios.all(pokemonResultsPromise);
        console.log(pokemonData);

        //now iterate on the data of each pokemon, and extract id,name,image,types

        const res= pokemonData.map((pokeData) =>{
            const pokemon = pokeData.data;
            return{
                id: pokemon.id,
                name : pokemon.name,
                image: pokemon.sprites.other.dream_world.front_default,
                types: pokemon.types

            }
        });

        console.log(res)
        setPokemonList(res);
        setisLoading(false);
        
    }
    useEffect(() => {
        downloadPokemon();
    },[]);

    return(
        <div className="pokemon-list-wrapper">
            <div className="pokemon-wrapper">
                {(isLoading) ? "Loading...." :
                    pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} />)
                }
            </div>
            <div className="controls">
                <button>Prev</button>
                <button>Next</button>
            </div>
            
        </div>
    )
}

export default PokemonList;