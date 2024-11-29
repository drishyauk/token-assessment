import React, { useState } from "react";

const SearchBar = ({ cryptos, onSelect }) => {
  const [query, setQuery] = useState("");

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    const selectedCrypto = cryptos.find((crypto) =>
      crypto.name.toLowerCase().includes(query.toLowerCase())
    );
    if (selectedCrypto) {
      onSelect(selectedCrypto.id, "usd");
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for a cryptocurrency"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
