import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {FadeLoader} from 'react-spinners'
import {ArrowLeft} from 'lucide-react'
const Detail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [pokemon, setPokemon] = useState(location.state?.pokemon || null);
  const [loading, setLoading] = useState(!pokemon);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pokemon) return;

    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = res.data;

        setPokemon({
          id: data.id,
          name: data.name,
          sprite: data.sprites.other["official-artwork"].front_default,
          types: data.types.map((t) => t.type.name),
          height: data.height,
          weight: data.weight,
          abilities: data.abilities,
          stats: data.stats,
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch Pokémon data.");
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id, pokemon]);

  if (loading) return <p className="flex justify-center items-center h-screen"><FadeLoader/></p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-3">
      <div className="max-w-xl mx-auto rounded-xl p-5">
        
        <button
          onClick={() => navigate("/")}
          className="mb-4 px-3 py-1 text-black rounded shadow flex gap-2 cursor-pointer"
        >
         <ArrowLeft /> Back
        </button>

        <h1 className="text-3xl text-center font-bold capitalize">
          {pokemon.name}
        </h1>

        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="w-44 h-44 mx-auto my-4"
        />
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold mb-2">Type</h2>
          <div className="flex justify-center gap-3 flex-wrap">
            {pokemon.types.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded text-black bg-green-200 text-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-200 rounded-lg p-3 text-center">
            <p className="font-semibold">Height</p>
            <p>{pokemon.height / 10} m</p>
          </div>
          <div className="bg-gray-200 rounded-lg p-3 text-center">
            <p className="font-semibold">Weight</p>
            <p>{pokemon.weight / 10} kg</p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-center mb-2">Abilities</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {pokemon.abilities.map((ab) => (
              <span
                key={ab.ability.name}
                className="px-3 py-1 bg-gray-200 rounded capitalize text-sm"
              >
                {ab.ability.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <h2 className="text-lg font-semibold text-center mb-2">Stats</h2>
          <ul className="text-center text-sm">
            {pokemon.stats.map((s) => (
              <li key={s.stat.name} className=" mb-1">
                {s.stat.name}: <b>{s.base_stat}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Detail;
