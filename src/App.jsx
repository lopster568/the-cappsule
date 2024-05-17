import { useState } from "react";
import MedicineCard from "./components/medicine-card/medicine-card";
import { useEffect } from "react";
import { useDebounce } from "use-debounce";
import SearchIcon from "./assets/search.svg";
import Loader from "./assets/loader.svg";
import { useSearchParams } from "react-router-dom";

function App() {
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery] = useDebounce(query, 500);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (debouncedQuery) {
      handleSearch();
      setSearchParams({ q: debouncedQuery });
    }
  }, [debouncedQuery]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://backend.cappsule.co.in/api/v1/new_search?q=${query}&pharmacyIds=1,2,3`
      );
      const data = await response.json();
      setMedicines(data.data.saltSuggestions);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <h2 className="poppins-regular">Cappsule Web Development Test</h2>
        <div className="search-container">
          <span>
            <img src={SearchIcon} alt="search-icon" />
          </span>
          <input
            className="search-bar poppins-light"
            type="text"
            placeholder="Type Your Medicine Name Here"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={(e) => handleSearch()}
            className="search-btn poppins-semibold"
          >
            Search
          </button>
        </div>
        <div className="separator" />
        {medicines?.length === 0 && (
          <div className="medicine-list-container">
            <h3 className="poppins-semibold" style={{ color: "#8e8e8e" }}>
              "Find Medicines with Amazing Discount"
            </h3>
          </div>
        )}
        {loading ? (
          <img className="loading" src={Loader} alt="loader" />
        ) : (
          medicines?.map((medicine) => (
            <MedicineCard
              forms={medicine.available_forms}
              details={medicine.salt_forms_json}
              salt={medicine.salt}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
