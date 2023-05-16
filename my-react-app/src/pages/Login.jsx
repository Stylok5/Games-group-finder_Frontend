import { useEffect, useState } from "react";
import axios from "axios";
import { DEV_API_AUTH } from "../consts-data";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";

const Login = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [buttonActive, setButtonActive] = useState(false);

  useEffect(() => {
    setIsLoading(false); // Set isLoading to false when the component mounts
  }, []);

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
      const response = await axios.post(`${DEV_API_AUTH}/login/`, formData);
      // console.log("Response:", response);
      const { data } = response;
      // console.log("Token:", data.token);
      const token = data.token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setFormData(formData);
      navigate("/browse");
    } catch (err) {
      setShowAlert(true);
      console.log(err.response.data.detail);
      setError(err.response.data.detail);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  return (
    <div className="main-form-login">
      {isLoading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <span className="form-body-login">
          <div className="insidecard">
            <h2 className="logintitle">Log in</h2>
            <form onSubmit={onSubmit}>
              <div className="inputs">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
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
              </div>
              <div className="loginbtn">
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
              </div>
              {error && (
                <Modal show={showAlert} onHide={() => setShowAlert(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>{error}</Modal.Body>
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
            </form>
          </div>
        </span>
      )}
    </div>
  );
};

export default Login;
