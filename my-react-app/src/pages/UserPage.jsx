import axios from "axios";
import { useEffect, useState } from "react";
import { DEV_API_AUTH, DEV_API_GROUPSURL, DEV_API_URL } from "../consts-data";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";

const UserPage = () => {
  const [user, setUser] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const { userId } = useParams();
  const [errorUser, setErrorUser] = useState("");
  const [errorGroup, setErrorGroup] = useState("");

  useEffect(() => {
    setLoggedIn(localStorage.getItem("token") ? true : false);
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "token"
    )
      ? `Bearer ${localStorage.getItem("token")}`
      : "";
    console.log(localStorage);
  }, [location]);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await axios.get(`${DEV_API_AUTH}/user/`);
        console.log(res);
        setCurrentUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${DEV_API_AUTH}/users/${userId}`);
        setUser(res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [userId, currentUser]);

  const [group, setGroup] = useState({
    game: "",
    name: "",
    description: "",
  });

  console.log(user);
  console.log(currentUser);

  const [games, setGames] = useState([]);
  useEffect(() => {
    const getGames = async () => {
      try {
        const res = await axios.get(`${DEV_API_URL}`);
        setGames(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getGames();
  }, []);

  const [toggleText, setToggleText] = useState("Select a game");
  const isCurrentUser = user.email === currentUser.email;
  const onChangeHandler = (e) => {
    setGroup({
      ...group,
      [e.target.name]: e.target.value,
    });
    console.log(group);
  };

  const createGroup = async (e) => {
    e.preventDefault();
    try {
      console.log("Group Name:", group.name);
      console.log("Game Title:", group.title);
      console.log("Group Description:", group.description);
      const res = await axios.post(`${DEV_API_GROUPSURL}/`, group);
      console.log(res);
      setGroup({
        game: "",
        name: "",
        description: "",
      });
      setToggleText("Select a game");
      const res1 = await axios.get(`${DEV_API_AUTH}/user`);
      setUser(res1.data);
      console.log(res1.data);
    } catch (err) {
      console.log(err.response.data.error);
      setErrorGroup(err.response.data.error);
      setTimeout(() => {
        setErrorGroup("");
      }, 3000);
    }
  };

  const onSelectGame = (title) => {
    setGroup({ ...group, title });
    setToggleText(title);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(user.profile_image);
  const [buttonActive, setButtonActive] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser.username,
    profile_image: currentUser.profile_image,
    description: currentUser.description,
    discord_link: currentUser.discord_link,
  });

  const onChange = (e) => {
    if (e.target.name === "profile_image") {
      setPreviewImage(e.target.value);
    }
    console.log(e.target.value);
    setPreviewImage(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setButtonActive(true);
  };

  useEffect(() => {
    setFormData({
      username: currentUser.username,
      profile_image: currentUser.profile_image,
      description: currentUser.description,
      discord_link: currentUser.discord_link,
    });
  }, [currentUser]);

  const handleEdit = () => {
    setCurrentUser(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(formData);
    setIsEditing(false);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const res1 = await axios.put(`${DEV_API_AUTH}/user/`, formData);
      console.log(res1);
      setIsEditing(false);
      window.location.reload();
      const res2 = await axios.get(`${DEV_API_AUTH}/user/`);
      setCurrentUser(res1);
    } catch (err) {
      console.log(err.response.data.error);
      setErrorUser(err.response.data.error);
      setTimeout(() => {
        setErrorUser("");
      }, 3000);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateUser(e);
    }
  };

  const removeGroup = async (groupId) => {
    try {
      const res1 = await axios.delete(`${DEV_API_GROUPSURL}/${groupId}`);
      setGroup(res1.data);
      const res2 = await axios.get(`${DEV_API_AUTH}/user`);
      setUser(res2.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="userpage">
      <div className="usercontainer">
        <div className="profile-details">
          <strong>Username:</strong>{" "}
          {isEditing ? (
            <input
              name="username"
              className="input-group-text"
              id="addon-wrapping"
              value={formData.username}
              onChange={onChange}
              onKeyDown={handleKeyDown}
            />
          ) : (
            user.username
          )}
          <h5 className="error-user">{errorUser}</h5>
        </div>
        <div className=" profile-details ">
          <strong>Image:</strong>{" "}
          {isEditing ? (
            <>
              <input
                name="profile_image"
                className="input-group-text"
                id="addon-wrapping"
                value={formData.profile_image}
                onChange={onChange}
                onKeyDown={handleKeyDown}
              />
              <img className="preview-img" src={previewImage} />
            </>
          ) : user.profile_image ? (
            <img className="normal-img" src={user.profile_image} />
          ) : (
            <span style={{ visibility: "hidden" }}></span>
          )}
        </div>
        <li>
          <div className=" profile-details ">
            <strong>Description:</strong>{" "}
            {isEditing ? (
              <input
                name="description"
                className="input-group-text"
                id="addon-wrapping"
                value={formData.description}
                onChange={onChange}
                onKeyDown={handleKeyDown}
              />
            ) : (
              user.description
            )}
          </div>
          <div className="profile-details ">
            <strong>Discord Link:</strong>{" "}
            {isEditing ? (
              <input
                name="discord_link"
                className="input-group-text"
                id="addon-wrapping"
                value={formData.discord_link}
                onKeyDown={handleKeyDown}
              />
            ) : (
              user.discord_link
            )}
          </div>
        </li>

        <div className="editButtons">
          {isCurrentUser && loggedIn && (
            <>
              {isEditing ? (
                <li>
                  <button onClick={updateUser}>Save Changes</button>
                  <button onClick={handleCancel}>Cancel</button>
                </li>
              ) : (
                <li>
                  <button onClick={handleEdit}>Edit Profile</button>
                </li>
              )}
            </>
          )}
        </div>
      </div>
      <div className="creategroupcontainer">
        {isCurrentUser && loggedIn && (
          <Card>
            <Card.Body>
              <form className="list-form" onSubmit={createGroup}>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-games">
                    {toggleText}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <div className="scrollable-menu">
                      {games &&
                        games.map((game) => (
                          <Dropdown.Item
                            key={game.id}
                            onClick={() => onSelectGame(game.title)}
                          >
                            {game.title}
                          </Dropdown.Item>
                        ))}
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="group name"
                    name="name"
                    value={group.name}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="group description"
                    name="description"
                    value={group.description}
                    onChange={onChangeHandler}
                    required
                  />
                </div>
                <div className="form-group">
                  <Button className="listBtn" variant="light" type="submit">
                    Create a group
                  </Button>
                  <h5 className="error-create">{errorGroup}</h5>
                </div>
              </form>
            </Card.Body>
          </Card>
        )}
      </div>
      <div className="groups-container">
        {user.groups &&
          user.groups.map((group) => (
            <Link
              key={group.id}
              className="group-box"
              to={`/groups/${group.id}`}
            >
              <ul className="group-details">
                <li>
                  {group.owner.email === user.email ? (
                    <span>Group's owner</span>
                  ) : (
                    <div>
                      <span>Created by </span>
                      <Link
                        className="owner-username"
                        to={`/users/${group.owner.id}`}
                      >
                        {group.owner.username}
                      </Link>
                    </div>
                  )}
                </li>
                <li>
                  <span>Game:</span> {group.game}
                </li>

                <li>
                  <span>Group title:</span>{" "}
                  <Link className="group-link" to={`/groups/${group.id}`}>
                    {group.name}
                  </Link>
                </li>
                <li>
                  <span className="descriptionText">Description:</span>{" "}
                  {group.description}
                </li>
              </ul>
              <div className="group-delete">
                {group.owner.email === currentUser.email && (
                  <Link
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGroup(group.id);
                    }}
                    className="delete-button"
                  >
                    Delete group
                  </Link>
                )}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default UserPage;
