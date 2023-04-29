import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEV_API_URL } from "../consts-data";

const HomePage = () => {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  const getGames = async () => {
    try {
      const res = await axios.get(`${DEV_API_URL}`);
      setGames(res.data);
      navigate("/browse");
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="home">
      <section className="home-header">
        <h1 className="headline">
          "Video games foster the mindset that allows creativity to grow."
        </h1>
        <h2 className="head-author">- NOLAN BUSHNELL</h2>
        <button
          onClick={getGames}
          type="button"
          className="btn btn-outline-light"
        >
          Browse Games
        </button>
      </section>
    </div>
  );
};
export default HomePage;
