import React, { useState, useEffect, useMemo, useCallback } from "react";
import { fetchCryptos } from "./services/cryptoService";
import CurrencySelector from "./components/CurrencySelector";
import FilterCrypto from "./components/FilterCrypto";
import ShowCryptos from "./components/ShowCryptos";

const SUPPORTED_CURRENCIES = ["usd", "eur", "inr", "gbp", "jpy"];

const App = () => {
  const [cryptos, setCryptos] = useState([]);
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [error, setError] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Cache for currency data
  const currencyCache = useMemo(() => new Map(), []);

  const fetchCryptosData = useCallback(
    async (currency) => {
      if (currencyCache.has(currency)) {
        setCryptos(currencyCache.get(currency));
        setFilteredCryptos(currencyCache.get(currency));
        return;
      }

      setLoadingData(true);
      setError(null);
      try {
        const data = await fetchCryptos(currency);
        currencyCache.set(currency, data);
        setCryptos(data);
        setFilteredCryptos(data);
      } catch (error) {
        handleFetchError(error);
      } finally {
        setLoadingData(false);
      }
    },
    [currencyCache]
  );

  const preloadCurrencies = useCallback(async () => {
    const currenciesToPreload = SUPPORTED_CURRENCIES.filter(
      (currency) => currency !== "usd" && !currencyCache.has(currency)
    );

    await Promise.all(
      currenciesToPreload.map(async (currency) => {
        try {
          const data = await fetchCryptos(currency);
          currencyCache.set(currency, data);
          console.log(`Preloaded ${currency} data`);
        } catch (error) {
          console.warn(`Failed to preload ${currency}:`, error);
        }
      })
    );
  }, [currencyCache]);

  useEffect(() => {
    fetchCryptosData("usd").then(() => preloadCurrencies());
  }, [fetchCryptosData, preloadCurrencies]);

  const handleFetchError = (error) => {
    if (error.response) {
      setError(`Error ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      setError("Network error. Please check your internet connection.");
    } else {
      setError("An unexpected error occurred.");
    }
    console.error("API error:", error);
  };

  const handleCurrencyChange = (currency) => {
    setLoadingPrices(true);
    setSelectedCurrency(currency);
    if (currencyCache.has(currency)) {
      setFilteredCryptos(currencyCache.get(currency));
      setLoadingPrices(false);
    } else {
      fetchCryptosData(currency);
      setLoadingPrices(false);
    }
  };

  const handleFilter = (query) => {
    const filtered = cryptos.filter((crypto) =>
      crypto.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCryptos(filtered);
  };

  return (
    <div className="main-container">
      <h1>Crypto Price Tracker</h1>
      <div className="top-section">
        <FilterCrypto onFilter={handleFilter} />
        <CurrencySelector onChange={handleCurrencyChange} />
      </div>
      <div className="data-section">
        {(loadingData || loadingPrices) && (
          <p
            style={{
              fontSize: "16px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Loading data...
          </p>
        )}
        {error && (
          <p
            style={{ color: "red", display: "flex", justifyContent: "center" }}
          >
            {error}
          </p>
        )}
        {!loadingData && !loadingPrices && !error && (
          <ShowCryptos data={filteredCryptos} currency={selectedCurrency} />
        )}
      </div>
    </div>
  );
};

export default App;
