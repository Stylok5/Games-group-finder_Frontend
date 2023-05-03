import { useState } from "react";
import axios from "axios";
import { DEV_API_AUTH } from "../consts-data";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Login = () => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response = await axios.post(`${DEV_API_AUTH}/login/`, formData);
      console.log("Response:", response);
      const { data } = response;
      console.log("Token:", data.token);
      const token = data.token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setFormData(formData);
      navigate("/browse");
    } catch (err) {
      console.log(err.response.data.detail);
      setError(err.response.data.detail);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="main-form-login">
      <span className="form-body-login">
        <form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={onChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="password"
              onChange={onChange}
              placeholder="Password"
              name="password"
              value={formData.password}
            />
          </Form.Group>
          {!formData.email && !formData.password ? (
            <Button
              className="form-btn"
              variant="secondary"
              type="submit"
              size="lg"
              disabled
            >
              Login
            </Button>
          ) : (
            <Button
              className="form-btn"
              variant="primary"
              type="submit"
              size="lg"
              active
            >
              Login
            </Button>
          )}
          <div className="mt-3">
            <p className="text-muted">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
          {error && <h4 className="error">{error}</h4>}
        </form>
      </span>
    </div>
  );
};

export default Login;
