import React, { useState } from "react";

const FilterCrypto = ({ onFilter }) => {
  const [query, setQuery] = useState("");

  const handleChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    onFilter(newQuery);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Filter cryptocurrency"
      />
    </div>
  );
};

export default FilterCrypto;
