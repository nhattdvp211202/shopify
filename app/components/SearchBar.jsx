import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
import debounce from "lodash/debounce";

const inputStyle = {
  border: "1px solid #ccc",
  borderRadius: "10px",
  padding: "8px",
  width: "220px",
  marginBottom: "30px",
  marginLeft: "730px",
};

// Debounce
const debouncedSearch = debounce((navigate, searchParams, value) => {
  searchParams.set("search", value);
  searchParams.set("page", 1);
  navigate(`?${searchParams.toString()}`);
}, 500);

const SearchBar = ({ initialSearch = "" }) => {
  const [searched, setSearched] = useState(initialSearch);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    debouncedSearch(navigate, searchParams, searched);
  }, [searched, searchParams, navigate]);

  useEffect(() => {
    if (searched !== initialSearch) handleSearch();
  }, [searched, initialSearch, handleSearch]);

  // Hàm xử lý thay đổi input
  const onChange = ({ target: { value } }) => setSearched(value);

  return (
    <input
      type="text"
      value={searched}
      onChange={onChange}
      placeholder="Search QR codes by title"
      style={inputStyle}
    />
  );
};

export default SearchBar;
