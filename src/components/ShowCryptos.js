import React, { useEffect, useState } from "react";

const ShowCryptos = ({ data, currency }) => {
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
            <th>Price ({currency.toUpperCase()})</th>
            <th>Market Cap ({currency.toUpperCase()})</th>
            <th>24h Change</th>
          </tr>
        </thead>
        <tbody>
          {cryptoData.map((crypto) => (
            <tr key={crypto.id}>
              <td>{crypto.name}</td>
              <td>{crypto.symbol.toUpperCase()}</td>
              <td>
                {crypto.current_price
                  ? `${crypto.current_price.toLocaleString()} ${currency.toUpperCase()}`
                  : "N/A"}
              </td>
              <td>
                {crypto.market_cap
                  ? `${crypto.market_cap.toLocaleString()} ${currency.toUpperCase()}`
                  : "N/A"}
              </td>
              <td
                style={{
                  color:
                    crypto.price_change_percentage_24h > 0 ? "green" : "red",
                }}
              >
                {crypto.price_change_percentage_24h !== null
                  ? `${crypto.price_change_percentage_24h.toFixed(2)}%`
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShowCryptos;
