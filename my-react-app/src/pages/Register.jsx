import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { DEV_API_AUTH } from "../consts-data";
import { Modal } from "react-bootstrap";

const Register = () => {
  const [errorInvalid, setErrorInvalid] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    profile_image: "",
    description: "",
    discord_link: "",
  });
  const [buttonActive, setButtonActive] = useState(false);

  const onChange = (e) => {
    // console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setButtonActive(true);
  };

  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${DEV_API_AUTH}/register/`, formData);
      setFormData(formData);
      navigate("/login");
    } catch (err) {
      console.log(err);
      setShowAlert(true);
      setErrorInvalid(err.response.data);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  return (
    <div className="main-form-register">
      <form className="form-body-register" onSubmit={onSubmit}>
        <div className="registerinside">
          <h2 className="registertitle">Register</h2>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              type="text"
              placeholder="Username"
              name="username"
              onChange={onChange}
              value={formData.username}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              type="password"
              onChange={onChange}
              placeholder="Password"
              name="password"
              value={formData.password}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              name="password_confirmation"
              onChange={onChange}
              value={formData.password_confirmation}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              type="text"
              name="profile_image"
              placeholder="Add an image URL (optional)"
              value={formData.profile_image}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              type="text"
              placeholder="Description (optional)"
              name="description"
              onChange={onChange}
              value={formData.description}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              type="text"
              placeholder="Discord link (optional)"
              name="discord_link"
              onChange={onChange}
              value={formData.discord_link}
            />
          </Form.Group>
          <div className="btncontainer">
            <div className="registerbtn">
              {!formData.username &&
              !formData.email &&
              !formData.password &&
              !formData.password_confirmation ? (
                <Button
                  className="form-btn"
                  variant="secondary"
                  type="submit"
                  size="lg"
                  disabled
                >
                  Register
                </Button>
              ) : (
                <Button
                  className="form-btn"
                  variant="primary"
                  type="submit"
                  size="lg"
                  active
                >
                  Register
                </Button>
              )}
            </div>
          </div>
        </div>
        {errorInvalid && (
          <Modal show={showAlert} onHide={() => setShowAlert(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {errorInvalid.non_field_errors && (
                <p>{errorInvalid.non_field_errors}</p>
              )}
              {errorInvalid.message && <p>{errorInvalid.message}</p>}
              {errorInvalid.username && <p>{errorInvalid.username}</p>}
              {errorInvalid.email && <p>{errorInvalid.email}</p>}
              {errorInvalid.password && <p>{errorInvalid.password}</p>}
              {errorInvalid.password_confirmation && (
                <p>{errorInvalid.password_confirmation}</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAlert(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </form>
    </div>
  );
};

export default Register;
