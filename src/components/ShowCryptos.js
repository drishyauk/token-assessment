import React, { useEffect, useState } from "react";

const ShowCryptos = ({ data }) => {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    setCryptoData(data);
  }, [data]);

  return (
    <div className="ShowCrypto-section">
      <h3>Top 50 Cryptocurrencies</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price (USD)</th>
            <th>Market Cap (USD)</th>
            <th>24h Change</th>
          </tr>
        </thead>
        <tbody>
          {cryptoData.map((crypto) => (
            <tr key={crypto.id}>
              <td>{crypto.name}</td>
              <td>{crypto.symbol.toUpperCase()}</td>
              <td>${crypto.current_price.toFixed(2)}</td>
              <td>${crypto.market_cap.toLocaleString()}</td>
              <td
                style={{
                  color:
                    crypto.price_change_percentage_24h > 0 ? "green" : "red",
                }}
              >
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowCryptos;
