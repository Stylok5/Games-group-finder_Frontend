import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { DEV_API_AUTH } from "../consts-data";

const Register = () => {
  const [error, setError] = useState("");
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
    console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setButtonActive(true);
  };

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password.length < 7 || formData.username.length < 3) {
        setError("Invalid input please try again");
        setTimeout(() => {
          setError("");
        }, 3000);
      } else {
        const res = await axios.post(`${DEV_API_AUTH}/register/`, formData);
        console.log(res);
        setFormData(formData);
        navigate("/login");
      }
    } catch (err) {
      console.log(err.response.data);
      const errorMessages = [];
      if (err.response.data.email) {
        errorMessages.push(err.response.data.email.join(", "));
      }
      if (err.response.data.username) {
        errorMessages.push(err.response.data.username.join(", "));
      }
      const errorMessage = errorMessages.join("\n");
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="main-form">
      <div className="back-form-register"></div>
      <span className="form-body">
        <h1 className="form-title">Register</h1>
        <form onSubmit={onSubmit}>
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
          <Form.Control
            type="text"
            name="profile_image"
            placeholder="Add an image URL(not required)"
            value={formData.profile_image}
            onChange={onChange}
          />
          <Form.Control
            type="text"
            placeholder="Description(not required)"
            name="description"
            onChange={onChange}
            value={formData.description}
          />
          <Form.Control
            type="text"
            placeholder="Discord link(not required)"
            name="discord_link"
            onChange={onChange}
            value={formData.discord_link}
          />
          {buttonActive ? (
            <Button
              className="form-btn"
              variant="primary"
              type="submit"
              size="lg"
              active
            >
              Register
            </Button>
          ) : (
            <Button
              className="form-btn"
              variant="secondary"
              type="submit"
              size="lg"
              disabled
            >
              Register
            </Button>
          )}
          {formData.status}
          {error && (
            <h4 className="error">{<pre className="error">{error}</pre>}</h4>
          )}
        </form>
      </span>
    </div>
  );
};

export default Register;
