import "./styles.css";
import { useState } from "react";
import axios from "axios";
import { sortBy } from "lodash";

export default function App() {
  const [dataList, setDataList] = useState(null);
  const [searchTerm, setSearchTerm] = useState("react");
  const [loading, setLodaing] = useState(false);
  const [error, setError] = useState(false);
  const [sort, setSort] = useState({
    sortKey: "NONE",
    isReverse: false
  });

  const fetchData = async () => {
    setDataList(null);
    setLodaing(true);
    setError(false);
    try {
      const { data } = await axios.get(
        `https://hn.algolia.com/api/v1/search?query=${searchTerm}`
      );
      setDataList(data.hits);
    } catch (err) {
      setError(true);
    } finally {
      setLodaing(false);
    }
  };

  const SORT = {
    NONE: (list) => list,
    TITLE: (list) => sortBy(list, "title"),
    AUTHOR: (list) => sortBy(list, "author"),
    COMMENTS: (list) => sortBy(list, "num_comments")
  };

  const sortFunction = SORT[sort.sortKey];

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  const handleSort = (sortKey) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({ sortKey, isReverse });
  };

  const sortedList = sort.isReverse
    ? sortFunction(dataList).reverse()
    : sortFunction(dataList);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <label>Search</label>
      <input type="search" onChange={handleSearch} />
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <div>
        <button type="submit" onClick={() => handleSort("TITLE")}>
          Title
        </button>
        <button type="submit" onClick={() => handleSort("AUTHOR")}>
          Author
        </button>
        <button type="submit" onClick={() => handleSort("COMMENTS")}>
          Comments
        </button>
      </div>
      {loading && <span>Loading!!!</span>}
      {error && <span>Error!!!</span>}
      {dataList &&
        dataList.length > 0 &&
        sortedList.map((item, index) => {
          return (
            <div key={index}>
              <span>{item.title}</span> - <span>{item.author}</span> -{" "}
              <span>{item.num_comments}</span>
            </div>
          );
        })}
    </div>
  );
}
