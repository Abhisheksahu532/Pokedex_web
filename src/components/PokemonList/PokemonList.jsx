import { useEffect, useState } from "react";
import axios from "axios";
import "./PokemonList.css";
import Pokemon from "../Pokemon/Pokemon";

function PokemonList(){

    const [ pokemonListState, setPokemonListState ] = useState({
        pokemonList: [],
        isLoading: true,
        pokedexUrl: 'https://pokeapi.co/api/v2/pokemon',
        nextUrl: '',
        prevUrl: ''
    });


    async function downloadPokemon(){
        setPokemonListState((state) => ({...state, isLoading: true}));
        const response = await axios.get(pokemonListState.pokedexUrl); // downloads list of 20 pokemons 

        const pokemonResults =response.data.results; // creates a array of pokemons from result

        console.log(response.data);
        setPokemonListState((state) => ({
            ...state,
            nextUrl: response.data.next, 
            prevUrl: response.data.previous 
        }));


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
                image: pokemon.sprites.other.showdown.front_default,
                types: pokemon.types

            }
        });

        console.log(res)
        setPokemonListState((state) => ({
            ...state, 
            pokemonList: res, 
            isLoading: false
        }));
        
    }
    useEffect(() => {
        downloadPokemon();
    },[pokemonListState.pokedexUrl]);

    return(
        <div className="pokemon-list-wrapper">
            <div className="pokemon-wrapper">
                {(pokemonListState.isLoading) ? "Loading...." :
                    pokemonListState.pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} id={p.id}/>)
                }
            </div>
            <div className="controls">
                <button disabled={pokemonListState.prevUrl == null} onClick={() => {
                    setPokemonListState({...pokemonListState, pokedexUrl: pokemonListState.prevUrl})
                }}>Prev</button>
                <button disabled={pokemonListState.nextUrl == null} onClick={() => {
                    setPokemonListState({...pokemonListState, pokedexUrl: pokemonListState.nextUrl})
                }}>Next</button>
            </div>
            
        </div>
    )
}

export default PokemonList;