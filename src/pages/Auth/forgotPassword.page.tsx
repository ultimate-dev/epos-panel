import React from "react";
import { Row, Col, Alert, Card, CardBody, Container } from "reactstrap";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  return (
    <React.Fragment>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <CardBody className="pt-0">
                  <h3 className="text-center mt-5 mb-4">
                    <Link to="/" className="d-block auth-logo">
                      <img
                        src={require("assets/images/logo-light.png")}
                        alt=""
                        height="30"
                        className="auth-logo-light"
                      />
                    </Link>
                  </h3>
                  <div className="p-3">
                    <h4 className="text-muted font-size-18 mb-3 text-center">
                      Reset Password
                    </h4>
                    <div className="alert alert-info" role="alert">
                      Enter your Email and instructions will be sent to you!
                    </div>

                    <Alert color="danger" style={{ marginTop: "13px" }}>
                      danger
                    </Alert>

                    <Alert color="success" style={{ marginTop: "13px" }}>
                      success
                    </Alert>

                    <form className="form-horizontal mt-4">
                      <div className="mb-3">
                        <input
                          name="email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          required
                        />
                      </div>
                      <Row className="mb-3">
                        <Col className="text-end">
                          <button
                            className="btn btn-primary w-md waves-effect waves-light"
                            type="submit"
                          >
                            Reset
                          </button>
                        </Col>
                      </Row>
                    </form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Remember It ?{" "}
                  <Link to="/auth/login" className="text-primary">
                    Sign In Here
                  </Link>{" "}
                </p>
                <p>
                  © {new Date().getFullYear()} Lexa{" "}
                  <span className="d-none d-sm-inline-block">
                    {" "}
                    - Crafted with <i className="mdi mdi-heart text-danger"></i> by
                    Themesbrand.
                  </span>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ForgotPasswordPage;
