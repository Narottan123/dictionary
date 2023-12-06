
import React, { useState } from "react";
import Axios from "axios";
import "./App.css";
import { FaSearch } from "react-icons/fa";


function App() {
  const [data, setData] = useState(null);
  const [searchWord, setSearchWord] = useState("");
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  function getMeaning() {
    Axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${searchWord}`)
      .then((response) => {
        setData(response.data[0]);
        setError(null);
      })
      .catch((error) => {
        setData(null);
        setError("No word found");
      });
  }


  function handleInputChange(e) {
    const inputWord = e.target.value;
    setSearchWord(inputWord);

    
    if (inputWord.trim() !== "") {
      Axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${inputWord}`)
        .then((response) => {
          setSuggestions(response.data.map((entry) => entry.word));
        })
        .catch((error) => {
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  }

  function handleSuggestionClick(word) {
    setSearchWord(word);
    setSuggestions([]); 
  }

  return (
    <div className="App">
      <h1>Free Dictionary</h1>
      <div className="searchBox">
        <input
          type="text"
          placeholder="Search..."
          value={searchWord}
          onChange={handleInputChange}
        />
        <button onClick={getMeaning}>
          <FaSearch size="20px" />
        </button>
      </div>
      {suggestions.length > 0 && (
        <ul className="suggestionsList">
          {suggestions.map((word, index) => (
            <li key={index} onClick={() => handleSuggestionClick(word)}>
              {word}
            </li>
          ))}
        </ul>
      )}
      {error ? (
        <div className="error">{error}</div>
      ) : data ? (
        <div className="showResults">
          <h2>
            {data.word}{" "}
            
          </h2>
          <h4>Parts of speech:</h4>
          <p>{data.meanings[0].partOfSpeech}</p>
          <h4>Definition:</h4>
          <p>{data.meanings[0].definitions[0].definition}</p>
          <h4>Example:</h4>
          <p>{data.meanings[0].definitions[0].example}</p>
        </div>
      ) : null}
    </div>
  );
}

export default App;
