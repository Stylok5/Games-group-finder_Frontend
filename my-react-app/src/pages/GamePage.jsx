import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DEV_API_URL } from "../consts-data";

const GamePage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState({});
  useEffect(() => {
    const getGame = async () => {
      try {
        const res = await axios.get(`${DEV_API_URL}/${gameId}`);
        setGame(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getGame();
  }, []);

  return (
    <div className="gamePage">
      <ul key="title">
        <div className="card">
          <div className="card-body">
            <h1>{game.title}</h1>
            <li>{game.release_date}</li>
            <li>{game.genre && game.genre.map((item) => item.name)} </li>
            <li>
              <img className="exploreImg" src={game.image} />
            </li>
            <li>{game.description}</li>
            <li>
              <div style={{ height: "200px", overflow: "scroll" }}>
                {" "}
                {game.groups &&
                  game.groups.map((item, ind) => (
                    <ul key={ind}>
                      <Link to={`/groups/${item.id}`}>
                        <h3>{item.name}</h3>
                      </Link>
                      by {item.owner.username}
                      <li>{item.description}</li>
                    </ul>
                  ))}
              </div>
            </li>
          </div>
        </div>
      </ul>
    </div>
  );
};
export default GamePage;
