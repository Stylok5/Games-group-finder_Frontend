import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { DEV_API_AUTH } from "../consts-data";
import { CircleMenu, CircleMenuItem } from "react-circular-menu";

const NavBar = () => {
  const navigationLinks = [
    { title: "Homepage", slug: "/" },
    { title: "Browse", slug: "/browse?page=1" },
  ];
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(token ? true : false);
    axios.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : "";
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get(`${DEV_API_AUTH}/user/`);
          setUser(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      getUser();
    }
  }, [location, loggedIn]);

  const onLogout = () => {
    axios.defaults.headers.common["Authorization"] = "";
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser({});
    navigate("/");
  };

  return (
    <CircleMenu className="donut" startAngle={0} totalAngle={150} radius={25}>
      <CircleMenuItem>
        <nav className="navitem">
          <ul className="primary-nav">
            {navigationLinks.map((link, idx) => (
              <li className="navbar" key={idx}>
                <Link to={link.slug}>{link.title}</Link>
              </li>
            ))}
          </ul>
          <ul className="secondary-nav">
            {loggedIn ? (
              <>
                {loggedIn && (
                  <li className="nav-item user-info">
                    <div className="user-info-wrapper">
                      {user.profile_image ? (
                        <img className="user-avatar" src={user.profile_image} />
                      ) : (
                        <span style={{ visibility: "hidden" }}></span>
                      )}
                      <span>
                        {" "}
                        <Link to={`/users/${user.id}`}>{user.username}</Link>
                      </span>
                    </div>
                  </li>
                )}

                <li className="nav-item-logout" onClick={onLogout}>
                  <Link className="linksnavbar" to="/logout">
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/register">Register</Link>
                </li>
                <li className="nav-item">
                  <Link to="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </CircleMenuItem>
    </CircleMenu>
  );
};

export default NavBar;
