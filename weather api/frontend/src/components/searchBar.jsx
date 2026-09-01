import { useState } from "react";

function SearchBar({ setWeather }) {

    const [city,setCity] = useState("");
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");

    async function handleSearch() {
        if(!city.trim()){
            setError("Please enter a city");
            return ;
        }
        setLoading(true);
        setError("");
        try{
            const response = await fetch(`http://localhost:3000/api/weather?city=${city}`);
            if(!response.ok){
                throw new Error("City not found");
            }
            const data = await response.json();
            setWeather(data);
        }
        catch(error){
            setError(error.message);
            setWeather(null);
        }
        finally{
            setLoading(false);
        }
    }
  return (
    <div className="search-container">
      <input 
        type="text"
        placeholder="Enter city"
        value = {city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e)=>{
            if(e.key === "Enter"){
                handleSearch();
            }
        }}
      />

      <button onClick={handleSearch} >{loading ? "Searching...":"Search"}</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default SearchBar;