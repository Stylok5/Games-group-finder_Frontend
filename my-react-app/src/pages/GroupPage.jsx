import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DEV_API_GROUPSURL } from "../consts-data";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import { DEV_API_AUTH } from "../consts-data";

const GroupPage = () => {
  const location = useLocation();
  const { groupId } = useParams();
  const [loggedIn, setLoggedIn] = useState(false);
  const [group, setGroup] = useState({});

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

  const navigate = useNavigate();

  const getUserById = async (userId) => {
    console.log("getUserById called with userId:", userId);
    try {
      const res = await axios.get(`${DEV_API_AUTH}/users/${userId}`);
      setUser(res.data);
      navigate(`/users/${userId}`);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const joinGroup = async (ssss) => {
    try {
      const res1 = await axios.post(`${DEV_API_GROUPSURL}/${ssss}/join/`);
      console.log(res1.data);
      const res2 = await axios.get(`${DEV_API_GROUPSURL}/${groupId}`);
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
          (member) => member._id !== memberId
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
      setGroup(res.data);
      setGroupData({ name: res.data.name, description: res.data.description });
      setOriginalGroupData({
        name: res.data.name,
        description: res.data.description,
      });
      setEditable(false);
      setEditingField(null);
      window.location.reload();
    } catch (err) {
      console.log(err);
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

  const isOwner = group.owner && group.owner.email === user.email;

  return (
    <div className="groupPage">
      <ul key="title">
        <div className="card">
          <div className="card-body">
            <h3>
              {editable && editingField === "name" && isOwner ? (
                <input
                  className="input-group-text"
                  id="addon-wrapping"
                  name="name"
                  value={groupData.name}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  onClick={(e) => handleTextareaClick(e, "name")}
                />
              ) : (
                <>
                  <span>{`Group name: ${groupData.name}`}</span>
                  {isOwner && (
                    <button
                      className="groupEdit"
                      onClick={() => toggleEditable("name")}
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </h3>
            <h3>
              {editable && editingField === "description" && isOwner ? (
                <input
                  className="input-group-text"
                  id="addon-wrapping"
                  name="description"
                  value={groupData.description}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  onClick={(e) => handleTextareaClick(e, "description")}
                />
              ) : (
                <>
                  <span>{`Description: ${groupData.description}`}</span>
                  {isOwner && (
                    <button
                      className="groupEdit"
                      onClick={() => toggleEditable("description")}
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
            </h3>
            {editable && isOwner && (
              <div>
                <button onClick={handleSaveClick}>Save</button>
                <button onClick={handleInputBlur}>Cancel</button>
              </div>
            )}
            Owner:
            <h4 className="ownergroup">
              {group.owner && (
                <>
                  {group.game.title}
                  <img src={group.owner.profile_image} />
                  <Link to={`/users/${group.owner.id}`}>
                    {group.owner.username}
                  </Link>
                </>
              )}
            </h4>
            <Dropdown>
              <Dropdown.Toggle
                as={Button}
                variant="secondary"
                id="dropdown-basic"
              >
                Members
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {group.members &&
                  group.members.map((member, ind) => (
                    <Dropdown.Item className="member" key={ind}>
                      <span>
                        <Link
                          className="member-link"
                          to={`/users/${member.user}`}
                        >
                          <img src={member.profile_image} /> {member.username}
                        </Link>
                      </span>
                      {group.owner &&
                        group.owner.username === user.username && ( // add this check
                          <button
                            type="button"
                            className="removeMember"
                            onClick={() => removeFromList(group.id, member.id)}
                          >
                            Remove member
                          </button>
                        )}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
            <div
              className="textbox"
              style={{ height: "40vh", overflow: "scroll" }}
              ref={chatBoxRef}
            >
              {group.groupchat_messages &&
                group.groupchat_messages.map((message, ind) => (
                  <li key={ind}>
                    <h5>{message.created_by}</h5>
                    {message.created_at}
                    {message.message_text}
                  </li>
                ))}
            </div>
            {loggedIn &&
              group.owner &&
              !isOwner && // only see the button if these conditions are met
              group.members &&
              !group.members.find(
                (member) => member.username === user.username
              ) && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    joinGroup(groupId);
                  }}
                >
                  Join group
                </button>
              )}
            {loggedIn &&
              (isOwner ||
                (group.members &&
                  group.members.find(
                    (member) => member.username === user.username
                  ))) && (
                <form
                  className="review-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addChat(groupId);
                  }}
                >
                  {" "}
                  <Button className="submitbtn" variant="light" type="submit">
                    Submit
                  </Button>
                  <textarea
                    className="form-control"
                    id="floatingTextarea"
                    type="text"
                    placeholder="Add a message"
                    onChange={onChangeHandler}
                    value={chat}
                  />
                </form>
              )}
          </div>
        </div>
      </ul>
    </div>
  );
};
export default GroupPage;
