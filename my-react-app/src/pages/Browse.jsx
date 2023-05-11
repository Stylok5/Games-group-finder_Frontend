import { useEffect, useState } from "react";
import axios from "axios";
import { DEV_API_URL } from "../consts-data";
import { Link } from "react-router-dom";

const Browse = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const PAGE_SIZE = 10;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getGames = async (page) => {
      try {
        const res = await axios.get(`${DEV_API_URL}?page=${page}`);
        setGames(res.data.results);
        setIsLoading(false);
        setTotalPages(
          res.data.count ? Math.ceil(res.data.count / PAGE_SIZE) : null
        );
        setCurrentPage(page);
      } catch (err) {
        console.log(err);
      }
    };

    getGames(currentPage);

    const handleGetGames = getGames;

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };

    function handlePopstate(event) {
      const newPage = event.state?.page || 1;
      handleGetGames(newPage);
    }
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
            {isLoading ? (
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              games &&
              games.map((game, ind) => (
                <Link key={ind} className="game-link" to={`/games/${game.id}`}>
                  <div className="game-card">
                    <img
                      className="game-image"
                      src={game.image}
                      alt={game.title}
                    />
                    <h5 className="game-title">{game.title}</h5>
                    <button
                      className="officialLink"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(game.official_site, "_blank");
                      }}
                    >
                      Official Site
                    </button>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </ul>
    </div>
  );
};

export default Browse;
