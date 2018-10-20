import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { Navbar, MenuItem, Nav, NavItem, NavDropdown } from "react-bootstrap";
import "./App.css";
import { Auth } from "aws-amplify";
import Routes from "./Routes";
import React, { Component, Fragment } from "react";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      email: ''
    };

    this.updateEmail = this.updateEmail.bind(this);
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/");
  }

  updateEmail = (email) => {
    this.setState({ email });
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      updateEmail: this.updateEmail,
      email: this.state.email
    };

    return (
      <div className="App container">
       <Navbar inverse fluid fixedTop >
        <Navbar.Header>
          <Navbar.Brand>
           <Link to="/">Anonymous Heroes</Link>
          </Navbar.Brand>
        <Navbar.Toggle />
        </Navbar.Header>
          <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#">Initiative </NavItem>
            <NavDropdown eventKey={2} title="Get Involved" id="basic-nav-dropdown">
              <MenuItem eventKey={2.1}>How?</MenuItem>
              <MenuItem eventKey={2.2}>Where?</MenuItem>
              <MenuItem eventKey={2.3}>Why?</MenuItem>
            </NavDropdown>
          </Nav>

          <Nav pullRight>
            {this.state.isAuthenticated
              ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
              : <Fragment>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </Fragment>
              }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes childProps={childProps} />
      </div>
    );
  }


}

export default App;
