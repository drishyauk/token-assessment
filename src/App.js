import React, { useState, useEffect } from "react";
import axios from "axios";
import CurrencySelector from "./components/CurrencySelector";
import RecentSearches from "./components/RecentSearches";
import SearchBar from "./components/SearchBar";
import ShowCryptos from "./components/ShowCryptos";

const App = () => {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearch, setShowRecentSearches] = useState(false);

  // Fetch the top 50 cryptocurrencies on load
  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 50,
          page: 1,
          sparkline: false,
        },
      })
      .then((response) => {
        console.log({ response });
        setCryptos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from CoinGecko", error);
      });
  }, []);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    if (selectedCrypto) {
      console.log({ selectedCrypto });
      fetchCryptoPrice(selectedCrypto.id, currency);
    }
  };
  const fetchCryptoPrice = (cryptoId, currency) => {
    console.log({ cryptoId });
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${cryptoId}`, {
        params: {
          localization: false,
        },
      })
      .then((response) => {
        setSelectedCrypto({
          ...response.data,
          price: response.data.market_data.current_price[currency],
        });

        const newRecentSearches = [
          { name: response.data.name, currency: currency },
          ...recentSearches,
        ].slice(0, 10);
        setRecentSearches(newRecentSearches);
        setShowRecentSearches(true);
      })
      .catch((error) => {
        console.error("Error fetching crypto data", error);
      });
  };

  return (
    <div>
      <h1>Crypto Price Tracker</h1>
      <div className="top-section">
        <SearchBar cryptos={cryptos} onSelect={fetchCryptoPrice} />
        {selectedCrypto && (
          <div>
            <h2>{selectedCrypto.name}</h2>
            <p>
              Price: {selectedCrypto.price} {selectedCurrency.toUpperCase()}
            </p>
          </div>
        )}
        <CurrencySelector onChange={handleCurrencyChange} />
      </div>
      {showRecentSearch ? (
        <RecentSearches searches={recentSearches} onSelect={fetchCryptoPrice} />
      ) : (
        ""
      )}
      <div>
        <ShowCryptos data={cryptos} />
      </div>
    </div>
  );
};

export default App;
