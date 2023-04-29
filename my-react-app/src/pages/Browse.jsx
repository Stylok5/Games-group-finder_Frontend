import { useEffect, useState } from "react";
import axios from "axios";
import { DEV_API_URL } from "../consts-data";
import { Link } from "react-router-dom";

const Browse = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const getGames = async (page) => {
      try {
        const res = await axios.get(`${DEV_API_URL}/?page=${page}`);
        setGames(res.data.results);
        setTotalPages(
          res.data.count ? Math.ceil(res.data.count / PAGE_SIZE) : null
        );
        setCurrentPage(page);
      } catch (err) {
        console.log(err);
      }
    };

    // Call getGames to fetch games for the first page
    getGames(currentPage);

    // Store getGames in a variable for later use
    const handleGetGames = getGames;

    // Return cleanup function to remove the event listener
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };

    function handlePopstate(event) {
      const newPage = event.state?.page || 1;
      handleGetGames(newPage);
    }

    window.addEventListener("popstate", handlePopstate);
  }, [currentPage]);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="browsePage">
      <ul>
        {totalPages && (
          <nav>
            <ul className="pagination">
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    i + 1 === currentPage ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageClick(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <div className="games-container">
          <div className="games-grid">
            {games &&
              games.map((game, ind) => (
                <div key={ind} className="game-card">
                  <Link className="game-link" to={`/games/${game.id}`}>
                    <img
                      className="game-image"
                      src={game.image}
                      alt={game.title}
                    />
                    <h5 className="game-title">{game.title}</h5>
                    <p className="game-release-date">
                      Release date: {game.release_date}
                    </p>
                  </Link>
                  <a
                    className="officialLink"
                    href={game.official_site}
                    target="_blank"
                  >
                    Official Site
                  </a>
                </div>
              ))}
          </div>
        </div>
      </ul>
    </div>
  );
};

export default Browse;
