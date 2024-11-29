import React from "react";

const RecentSearches = ({ searches, onSelect }) => {
  return (
    <div className="recent-section">
      <h3>Recent Searches:</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Currency</th>
          </tr>
        </thead>
        <tbody>
          {searches.map((search, index) => (
            <tr
              key={index}
              onClick={() => onSelect(search.id, search.currency)}
            >
              <td>{search.name}</td>
              <td>{search.currency.toUpperCase()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentSearches;
