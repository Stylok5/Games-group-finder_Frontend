import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DEV_API_GROUPSURL } from "../consts-data";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import { DEV_API_AUTH } from "../consts-data";
import Form from "react-bootstrap/Form";
import { Modal } from "react-bootstrap";
import { OverlayTrigger, Popover } from "react-bootstrap";

const GroupPage = () => {
  const location = useLocation();
  const { groupId } = useParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [group, setGroup] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setLoggedIn(localStorage.getItem("token") ? true : false);
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "token"
    )
      ? `Bearer ${localStorage.getItem("token")}`
      : "";
    // console.log(localStorage);
  }, [location]);

  const [user, setUser] = useState({});
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${DEV_API_AUTH}/user`);
        setUser(res.data);
        // console.log(res);
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
        setIsLoading(false);
        setGroup(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getGroup();
  }, []);

  const joinGroup = async (groupid) => {
    try {
      const res1 = await axios.post(`${DEV_API_GROUPSURL}/${groupid}/join/`);
      // console.log(res1.data);
      const res2 = await axios.get(`${DEV_API_GROUPSURL}/${groupid}`);
      setGroup(res2.data);
      // console.log(res2.data);
      // console.log(group);
    } catch (err) {
      console.log(err);
    }
  };

  const [chat, SetChat] = useState("");
  const onChangeHandler = (e) => {
    SetChat(e.target.value);
    // console.log(e.target.value);
  };

  const chatBoxRef = useRef(null);
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
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
      // console.log(chat);
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromList = async (groupId, memberId) => {
    try {
      const res = await axios.delete(
        `${DEV_API_GROUPSURL}/${groupId}/${memberId}/remove/`
      );

      const res1 = await axios.get(`${DEV_API_GROUPSURL}/${groupId}/`);
      setGroup(res1.data);
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

  const [showAlert, setShowAlert] = useState(false);
  const handleSaveClick = async () => {
    try {
      const res = await axios.put(`${DEV_API_GROUPSURL}/${groupId}/`, {
        name: groupData.name,
        description: groupData.description,
      });
      // setGroup(res.data);
      setGroupData({ name: res.data.name, description: res.data.description });
      setOriginalGroupData({
        name: res.data.name,
        description: res.data.description,
      });
      setEditable(false);
      setEditingField(null);
    } catch (err) {
      setError(err.response.data.error.name[0]);
      setShowAlert(true);
      console.log(err.response.data.error.name[0]);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

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

  const addLike = async (groupid) => {
    try {
      const res = await axios.post(`${DEV_API_GROUPSURL}/${groupid}/like/`);
      // console.log(res);
      const res2 = await axios.get(`${DEV_API_GROUPSURL}/${groupId}`);
      setGroup(res2.data);
      setClicked({ liked: true });
    } catch (err) {
      console.log(err);
    }
  };

  const addDislike = async (groupid) => {
    try {
      const res = await axios.post(`${DEV_API_GROUPSURL}/${groupid}/dislike/`);
      // console.log(res);
      const res2 = await axios.get(`${DEV_API_GROUPSURL}/${groupId}`);
      setGroup(res2.data);
      setClicked({ disliked: true });
    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();
  const clickMember = async (userid) => {
    navigate(`/users/${userid}`);
  };

  const foundMember =
    (group.members &&
      group.members.find((member) => member.username === user.username)) ||
    null;

  return (
    <div className="groupPage">
      {isLoading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <ul className="groupscard" key="title">
          <div className="cardetails">
            <div className="cardetails-body">
              <div className="popups">
                {!isOwner ? (
                  <OverlayTrigger
                    trigger="click"
                    placement="top"
                    overlay={
                      <Popover>
                        <Popover.Body>
                          Log in to join the group and chat with your fellow
                          members. Don't forget to leave a rating!
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <button type="button" className="btn btn-secondary">
                      Click here!
                    </button>
                  </OverlayTrigger>
                ) : (
                  <OverlayTrigger
                    trigger="click"
                    placement="top"
                    overlay={
                      <Popover>
                        <Popover.Body>
                          Edit your group details. Remove members by opening the
                          dropdown menu
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <button type="button" className="btn btn-secondary">
                      Click here!
                    </button>
                  </OverlayTrigger>
                )}
              </div>
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
              {error && (
                <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{error && error}</Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setShowAlert(false)}
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}
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
              <div className="likeDislikebtns">
                <p>Join and leave your rating!</p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addLike(groupId);
                  }}
                  className={
                    !loggedIn || clicked.liked || !foundMember
                      ? "disabledlike"
                      : "likebtn"
                  }
                  disabled={!loggedIn || clicked.liked || !foundMember}
                ></button>
                <span className="spanlike">{group.likes}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addDislike(groupId);
                  }}
                  className={
                    !loggedIn || clicked.disliked || !foundMember
                      ? "disableddislike"
                      : "dislikebtn"
                  }
                  disabled={!loggedIn || clicked.disliked || !foundMember}
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
                              <button
                                className="member-link"
                                onClick={(e) => {
                                  e.preventDefault();
                                  clickMember(member.user);
                                }}
                              >
                                {member.profile_image ? (
                                  <img
                                    src={member.profile_image}
                                    alt={member.username}
                                  />
                                ) : (
                                  <span style={{ visibility: "hidden" }}></span>
                                )}
                                {member.username}
                              </button>
                            ) : (
                              <div>
                                {member.profile_image ? (
                                  <img
                                    src={member.profile_image}
                                    alt={member.username}
                                  />
                                ) : (
                                  <span style={{ visibility: "hidden" }}></span>
                                )}
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
                group.groupchat_messages.length === 0 ? (
                  <h2 className="chatempty">No messages have been added yet</h2>
                ) : (
                  group.groupchat_messages &&
                  group.groupchat_messages.map((message, ind) => (
                    <div className="chat-message" key={ind}>
                      <p className="timestamp">{message.created_at}</p>
                      <h6 className="messageuser">{message.created_by}</h6>
                      <p>{message.message_text}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="inputmessage">
                {(loggedIn && isOwner) ||
                  (foundMember && (
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
                  ))}
              </div>
              <div className="joinleavebtns">
                {loggedIn && !isOwner && !foundMember && (
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
                {loggedIn && foundMember && (
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
      )}
    </div>
  );
};
export default GroupPage;
