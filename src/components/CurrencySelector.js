import React from "react";

const CurrencySelector = ({ onChange }) => {
  const currencies = ["usd", "eur", "gbp", "inr", "chf"];

  return (
    <div>
      <label>Select Currency: </label>
      <select onChange={(e) => onChange(e.target.value)}>
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;
