import axios from "axios";

const CACHE_TIME = 60000;
const MAX_RETRIES = 3;
const cache = new Map();

const fetchWithCacheAndRetry = async (
  url,
  options = {},
  retries = MAX_RETRIES
) => {
  const cacheKey = JSON.stringify({ url, ...options });

  if (cache.has(cacheKey)) {
    const { timestamp, data } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_TIME) {
      return data;
    }
  }

  try {
    const response = await axios.get(url, options);
    cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    return response.data;
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      console.warn("Too many requests. Retrying...");
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * (MAX_RETRIES - retries + 1))
      );
      return fetchWithCacheAndRetry(url, options, retries - 1);
    } else {
      throw error;
    }
  }
};

export const fetchCryptos = async (currency) => {
  return fetchWithCacheAndRetry(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      params: {
        vs_currency: currency,
        order: "market_cap_desc",
        per_page: 50,
        page: 1,
        sparkline: false,
      },
    }
  );
};

export const updatePricesInSelectedCurrency = async (currency, cryptoIds) => {
  return fetchWithCacheAndRetry(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      params: {
        vs_currency: currency,
        ids: cryptoIds.join(","),
        sparkline: false,
      },
    }
  );
};
