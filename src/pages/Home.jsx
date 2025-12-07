import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 15;

  const [search, setSearch] = useState("");
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  const [liked, setLiked] = useState(() => {
    const saved = localStorage.getItem("liked");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("liked", JSON.stringify(liked));
  }, [liked]);

  useEffect(() => {
    const fetchData = async () => {
      const offset = (page - 1) * limit;
      const res = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );

      const detailData = await Promise.all(
        res.data.results.map(async (p) => {
          const detail = await axios.get(p.url);
          return {
            name: p.name,
            url: p.url,
            id: detail.data.id,
            types: detail.data.types.map((t) => t.type.name),
          };
        })
      );

      setPokemons(detailData);
    };
    fetchData();
  }, [page]);

  useEffect(() => {
    const fetchTypes = async () => {
      const res = await axios.get("https://pokeapi.co/api/v2/type");
      setTypes(res.data.results);
    };
    fetchTypes();
  }, []);

  const toggleLike = (id) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filtered = pokemons.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
    if (!selectedType) return nameMatch;
    return nameMatch && p.types.includes(selectedType);
  });
  const navigate = useNavigate();

  const handleClick = async (id) => {
    console.log("pokemon card is clicked", id);
    navigate(`/pokemon/${id}`)
  }
  return (
    <div className="p-6 min-h-screen bg-linear-to-b from-blue-50 to-white">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-600 tracking-wide">
        Pokedex Lite
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition w-full sm:w-48"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">Filter by Type</option>
          {types.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
      {
        filtered.length <= 0 && (<div className="text-center">No item to list</div>)
      }
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filtered.map((p) => (
          <li
            key={p.id}
            className="cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition p-4 flex flex-col items-center relative"
            onClick={() => handleClick(p.id)}
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
              alt={p.name}
              className="w-24 h-24 mb-2"
            />
            <p className="capitalize font-bold mt-2 text-gray-800 text-lg">{p.name}</p>
            <div className="flex gap-2 mt-2 flex-wrap justify-center">
              {p.types.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-semibold capitalize"
                >
                  {t}
                </span>
              ))}
            </div>

            <button
              className={`absolute top-2 right-3 text-2xl transition transform hover:scale-110 ${liked.includes(p.id) ? "text-red-500" : "text-gray-400"
                }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(p.id);
              }}
            >
              ♥
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination */}

      {pokemons.length > 10 && <div className="flex justify-center gap-4 mt-10 items-center">
        <button
          className={`px-4 py-2 rounded-lg bg-blue-500 text-white shadow-md transition hover:bg-blue-600 ${page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
        >
          Prev
        </button>

        <span className="px-3 py-1 font-semibold text-gray-800 bg-gray-200 rounded-lg">{page}</span>

        <button
          className="px-4 py-2 rounded-lg bg-blue-500 text-white shadow-md transition hover:bg-blue-600"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>}
    </div>
  );
};

export default Home;




