import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DEV_API_GROUPSURL } from "../consts-data";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import { DEV_API_AUTH } from "../consts-data";
import Form from "react-bootstrap/Form";

const GroupPage = () => {
  const location = useLocation();
  const { groupId } = useParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [group, setGroup] = useState({});
  const [error, setError] = useState("");
  useEffect(() => {
    setLoggedIn(localStorage.getItem("token") ? true : false);
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "token"
    )
      ? `Bearer ${localStorage.getItem("token")}`
      : "";
    console.log(localStorage);
  }, [location]);

  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${DEV_API_AUTH}/user`);
        setUser(res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const getGroup = async () => {
      try {
        const res = await axios.get(`${DEV_API_GROUPSURL}/${groupId}`);
        setGroup(res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    getGroup();
  }, [groupId]);

  const joinGroup = async (groupid) => {
    try {
      const res1 = await axios.post(`${DEV_API_GROUPSURL}/${groupid}/join/`);
      console.log(res1.data);
      const res2 = await axios.get(`${DEV_API_GROUPSURL}/${groupid}`);
      setGroup(res2.data);
      console.log(res2.data);
      console.log(group);
    } catch (err) {
      console.log(err);
    }
  };

  const [chat, SetChat] = useState("");
  const onChangeHandler = (e) => {
    SetChat(e.target.value);
    console.log(e.target.value);
  };

  const chatBoxRef = useRef(null);
  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [group]);

  const addChat = async (groupid) => {
    try {
      const res1 = await axios.post(
        `${DEV_API_GROUPSURL}/${groupid}/groupchat/`,
        {
          message_text: chat,
        }
      );
      SetChat("");
      const res2 = await axios.get(`${DEV_API_GROUPSURL}/${groupid}`);
      setGroup(res2.data);
      console.log(chat);
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromList = async (groupId, memberId) => {
    try {
      const res = await axios.delete(
        `${DEV_API_GROUPSURL}/${groupId}/${memberId}/remove/`
      );
      console.log(res);
      setGroup((group) => {
        const updatedMembers = group.members.filter(
          (member) => member.id !== memberId
        );
        return {
          ...group,
          members: updatedMembers,
        };
      });
    } catch (err) {
      console.log(err);
    }
  };

  const [editable, setEditable] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [groupData, setGroupData] = useState({
    name: group.name,
    description: group.description,
  });
  const [originalGroupData, setOriginalGroupData] = useState({
    name: group.name,
    description: group.description,
  });

  const handleEditClick = () => {
    setEditingField(true);
  };

  const handleSaveClick = async () => {
    try {
      const res = await axios.put(`${DEV_API_GROUPSURL}/${groupId}/`, {
        name: groupData.name,
        description: groupData.description,
      });
      setGroupData({ name: res.data.name, description: res.data.description });
      setOriginalGroupData({
        name: res.data.name,
        description: res.data.description,
      });
      setEditable(false);
      setEditingField(null);
      const res1 = await axios.get(`${DEV_API_GROUPSURL}/${groupId}/`);
      setGroup(res1.data);
      setGroup;
    } catch (err) {
      setError(err.response.data.error);
      console.log(err.response.data.error);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleCancelClick = () => {
    setEditable(false);
    setEditingField(null);
    setGroupData(originalGroupData);
  };

  const toggleEditable = (fieldName) => {
    setEditable(true);
    setEditingField(fieldName);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData({ ...groupData, [name]: value });
  };

  const handleInputKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleSaveClick();
    }
  };

  const handleInputBlur = () => {
    handleCancelClick();
  };

  const handleTextareaClick = (e) => {
    if (editable) {
      e.stopPropagation();
    }
  };

  useEffect(() => {
    setGroupData({
      name: group.name,
      description: group.description,
    });
    setOriginalGroupData({
      name: group.name,
      description: group.description,
    });
  }, [group]);

  const leaveGroup = async (groupid) => {
    try {
      const res1 = await axios.delete(
        `${DEV_API_GROUPSURL}/${groupid}/leavegroup/`
      );
      const res2 = await axios.get(`${DEV_API_GROUPSURL}/${groupid}`);
      setGroup(res2.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const isOwner = group.owner && group.owner.email === user.email;

  const [clicked, setClicked] = useState({
    liked: null,
    disliked: null,
  });

  const addLike = async (groupId) => {
    try {
      const res = await axios.post(`${DEV_API_GROUPSURL}/${groupId}/like/`);
      console.log(res);
      const res2 = await axios.get(`${DEV_API_GROUPSURL}/${groupId}`);
      setGroup(res2.data);
      setClicked({ liked: true, disliked: true });
    } catch (err) {
      console.log(err);
    }
  };

  const addDislike = async (groupId) => {
    try {
      const res = await axios.post(`${DEV_API_GROUPSURL}/${groupId}/dislike/`);
      console.log(res);
      const res2 = await axios.get(`${DEV_API_GROUPSURL}/${groupId}`);
      setGroup(res2.data);
      setClicked({ liked: true, disliked: true });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="groupPage">
      <ul className="groupscard" key="title">
        <div className="cardetails">
          <div className="cardetails-body">
            {!isOwner ? (
              <h1 className="usertitle">
                Log in and join a group. Chat with your fellow members and leave
                a rating! Create or edit your own group by going to your user
                page.
              </h1>
            ) : (
              <h1 className="ownertitle">
                Edit your group details. Remove members by opening the dropdown
                menu
              </h1>
            )}
            {editable && editingField === "name" && isOwner ? (
              <div className="group-info-section">
                <span className="nametext">Group name:</span>
                <input
                  className="input-group-text"
                  id="addon-wrapping"
                  name="name"
                  value={groupData.name}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  onClick={(e) => handleTextareaClick(e, "name")}
                />
              </div>
            ) : (
              <div className="group-info-section">
                <span className="nametext">Group name:</span>
                {groupData.name}
                {isOwner && (
                  <button
                    className="groupEdit"
                    onClick={() => toggleEditable("name")}
                  >
                    Edit
                  </button>
                )}
              </div>
            )}
            <h5 className="error">{error}</h5>
            <div className="descriptiontext">
              {editable && editingField === "description" && isOwner ? (
                <div className="group-info-section">
                  <span>Description:</span>
                  <input
                    className="input-group-text"
                    id="addon-wrapping"
                    name="description"
                    value={groupData.description}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onClick={(e) => handleTextareaClick(e, "description")}
                  />
                </div>
              ) : (
                <div className="group-info-section">
                  <span className="nametext">Description:</span>
                  {groupData.description}

                  {isOwner && (
                    <button
                      className="groupEdit"
                      onClick={() => toggleEditable("description")}
                    >
                      Edit
                    </button>
                  )}
                </div>
              )}
            </div>
            {editable && isOwner && (
              <div>
                <button className="savebtn" onClick={handleSaveClick}>
                  Save
                </button>
                <button className="cancelbtn" onClick={handleInputBlur}>
                  Cancel
                </button>
              </div>
            )}
            <div className="owner">
              <p className="ownertext">Created by:</p>

              {group.owner && (
                <div className="owner-info">
                  <span>{group.game.title}</span>
                  {group.owner.profile_image ? (
                    <img
                      src={group.owner.profile_image}
                      alt={group.owner.username}
                    />
                  ) : (
                    <span
                      style={{
                        visibility: "hidden",
                      }}
                    ></span>
                  )}
                  {loggedIn ? (
                    <Link to={`/users/${group.owner.id}`}>
                      {group.owner.username}
                    </Link>
                  ) : (
                    group.owner.username
                  )}
                </div>
              )}
            </div>
            <div className="likedislikebtns">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addLike(groupId);
                }}
                className={
                  !loggedIn || clicked.liked ? "disabledlike" : "likebtn"
                }
                disabled={clicked.liked}
              ></button>
              <span className="spanlike"> {group.likes}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addDislike(groupId);
                }}
                className={
                  !loggedIn || clicked.disliked
                    ? "disableddislike"
                    : "dislikebtn"
                }
                disabled={clicked.disliked}
              ></button>
              <span className="dislikespan"> {group.dislikes}</span>
            </div>
            <div className="dropdownmembers">
              <Dropdown>
                <Dropdown.Toggle
                  as={Button}
                  className="membersbtn"
                  variant="secondary"
                  id="dropdown-basic"
                >
                  Members
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {group.members &&
                    group.members.map((member, ind) => (
                      <Dropdown.Item className="member" key={ind}>
                        <span className="memberuser">
                          {loggedIn ? (
                            <Link
                              className="member-link"
                              to={`/users/${member.user}`}
                            >
                              {member.profile_image ? (
                                <img
                                  src={member.profile_image}
                                  alt={member.username}
                                />
                              ) : (
                                <span
                                  style={{
                                    visibility: "hidden",
                                  }}
                                ></span>
                              )}
                              {member.username}
                            </Link>
                          ) : (
                            <div>
                              <img src={member.profile_image} />
                              {member.username}
                            </div>
                          )}
                        </span>
                        {group.owner &&
                          group.owner.username === user.username && (
                            <button
                              type="button"
                              className="removeMember"
                              onClick={() =>
                                removeFromList(group.id, member.id)
                              }
                            >
                              -
                            </button>
                          )}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="chatbox" ref={chatBoxRef}>
              {group.groupchat_messages &&
                group.groupchat_messages.map((message, ind) => (
                  <div className="chat-message" key={ind}>
                    <p className="timestamp">{message.created_at}</p>
                    <h6 className="messageuser">{message.created_by}</h6>
                    <p>{message.message_text}</p>
                  </div>
                ))}
            </div>
            <div className="inputmessage">
              {loggedIn &&
                (isOwner ||
                  (group.members &&
                    group.members.find(
                      (member) => member.username === user.username
                    ))) && (
                  <Form
                    className="review-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      addChat(groupId);
                    }}
                  >
                    <Form.Group className="d-flex mb-3">
                      <Form.Control
                        className="mr-2"
                        id="floatingTextarea"
                        type="text"
                        placeholder="Add a message"
                        onChange={onChangeHandler}
                        value={chat}
                      />
                      {chat ? (
                        <Button
                          className="submitbtn"
                          variant="secondary"
                          type="submit"
                        >
                          Submit
                        </Button>
                      ) : (
                        <Button
                          className="submitbtn"
                          variant="secondary"
                          disabled
                        >
                          Submit
                        </Button>
                      )}
                    </Form.Group>
                  </Form>
                )}
            </div>
            <div className="joinleavebtns">
              {loggedIn &&
                group.owner &&
                !isOwner &&
                group.members &&
                !group.members.find(
                  (member) => member.username === user.username
                ) && (
                  <button
                    className="joinbtn"
                    onClick={(e) => {
                      e.preventDefault();
                      joinGroup(groupId);
                    }}
                  >
                    Join group
                  </button>
                )}
              {group.members &&
                group.members.find(
                  (member) => member.username === user.username
                ) && (
                  <button
                    className="leavebtn"
                    onClick={(e) => {
                      e.preventDefault();
                      leaveGroup(groupId);
                    }}
                  >
                    Leave group
                  </button>
                )}
            </div>
          </div>
        </div>
      </ul>
    </div>
  );
};
export default GroupPage;
