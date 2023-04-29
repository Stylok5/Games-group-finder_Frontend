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
      console.log(err.response.data);
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
      //   const res2 = await axios.get(`${DEV_API_AUTH}/user/`);
      setCurrentUser(res1);
    } catch (err) {
      console.log(err);
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
    <>
      <div className="usercontainer">
        <li>
          <div className=" profile-details ">
            <strong>Username:</strong>{" "}
            {isEditing ? (
              <input
                name="username"
                className="input-group-text"
                id="addon-wrapping"
                value={formData.username}
                onChange={onChange}
              />
            ) : (
              user.username
            )}
          </div>
        </li>
        <li>
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
                />
                <img className="preview-img" src={previewImage} />
              </>
            ) : (
              <img className="normal-img" src={user.profile_image} />
            )}
          </div>
        </li>
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
              />
            ) : (
              user.description
            )}
          </div>
          <div className=" profile-details ">
            <strong>Discord Link:</strong>{" "}
            {isEditing ? (
              <input
                name="discord_link"
                className="input-group-text"
                id="addon-wrapping"
                value={formData.discord_link}
                onChange={onChange}
              />
            ) : (
              user.discord_link
            )}
          </div>
        </li>
      </div>
      <div>
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

      <div className="groups-container">
        {user.groups &&
          user.groups.map((group) => (
            <div key={group.id} className="group-box">
              <div className="group-details">
                <div>
                  Created by{" "}
                  <Link to={`/users/${group.owner.id}`}>
                    {group.owner.username}
                  </Link>{" "}
                  for {group.game}
                </div>
                <div>
                  <Link className="group-link" to={`/groups/${group.id}`}>
                    {group.name}
                  </Link>{" "}
                  {group.description}
                </div>
              </div>
              <div className="group-delete">
                {group.owner.email === currentUser.email && (
                  <button
                    onClick={(e) => {
                      removeGroup(group.id);
                    }}
                    className="delete-button"
                  >
                    Delete group
                  </button>
                )}
              </div>
            </div>
          ))}

        {isCurrentUser && loggedIn && (
          <li>
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
                  <input
                    className="review-input"
                    type="text"
                    placeholder="group name"
                    name="name"
                    value={group.name}
                    onChange={onChangeHandler}
                    required
                  />
                  <input
                    className="review-input"
                    type="text"
                    placeholder="group description"
                    name="description"
                    value={group.description}
                    onChange={onChangeHandler}
                    required
                  />
                  <Button className="listBtn" variant="light" type="submit">
                    Create a group
                  </Button>
                </form>
              </Card.Body>
            </Card>
          </li>
        )}
      </div>
    </>
  );
};

export default UserPage;
