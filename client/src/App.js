import React, { Component } from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
// import Register from "./components/users/Register";
// import Login from "./components/users/Login";
// import Logout from "./components/users/Logout";
import EditableFormTable from "./components/Home/Expenses";
import "./App.css";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import "antd/dist/antd.css";
import { Layout, Menu, Icon } from "antd";
const { Content, Sider, Footer } = Layout;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//login: false,
			//logout: false
		};
	}
	// handleLogin = () => {
	// 	this.setState(() => ({
	// 		// login: true,
	// 		// logout: false
	// 	}));
	// };
	// handleLogout = () => {
	// 	this.setState(() => ({
	// 		// logout: true,
	// 		// login: false
	// 	}));
	// };

	render() {
		// let login = false;
		// let logout = false;

		// if (localStorage.getItem("token")) {
		// 	login = true;
		// } else {
		// 	logout = true;
		// }

		return (
			<BrowserRouter>
				<div className="App-header">
					<IconButton style={{ color: "white" }}>
						<MenuIcon />
					</IconButton>
					<Link
						to="/user/home"
						style={{
							color: "white",
							textDecoration: "none",
							marginLeft: "2rem",
							marginTop: "0.6rem"
						}}
					>
						Onet
					</Link>
					{/* {logout && (
						<div>
							<Link
								to="/user/register"
								style={{
									color: "white",
									textDecoration: "none",
									marginTop: "15rem",
									marginLeft: "50rem"
								}}
							>
								Register
							</Link>
							{" / "}
							<Link
								to="/user/login"
								style={{
									color: "white",
									textDecoration: "none",
									marginBottom: "2rem"
								}}
							>
								Login
							</Link>
						</div>
					)}
					{login && (
						<div>
							<Link
								to="/user/logout"
								style={{
									color: "white",
									textDecoration: "none",
									marginLeft: "50rem"
								}}
							>
								Logout
							</Link> 
						</div>
					)}*/}
				</div>
				<div>
					<Layout>
						<Sider>
							<Menu theme="dark">
								<Menu.Item>
									<Icon type="home" />
									<span className="nav-text">
										<Link to="/user/home" style={{ color: "white" }}>
											Home
										</Link>
									</span>
								</Menu.Item>
								<Menu.Item>
									<Icon type="setting" />
									<span className="nav-text">
										<Link to="/user/settings" style={{ color: "white" }}>
											Settings
										</Link>
									</span>
								</Menu.Item>
								<Menu.Item>
									<Icon type="user" />
									<span className="nav-text">
										<Link to="/user/profile" style={{ color: "white" }}>
											profile
										</Link>
									</span>
								</Menu.Item>
							</Menu>
						</Sider>
						<Layout>
							<Content style={{ margin: "24px 16px 0" }}>
								<div style={{ padding: 0, minHeight: 525 }}>
									<Switch>
										{/* <Route
							path="/user/login"
							render={props => {
								return (
									<Login {...props} handleLogin={this.handleLogin} exact />
								);
							}}
							exact
						/>
						<Route path="/user/register" component={Register} exact />
						<Route
							path="/user/logout"
							render={props => {
								return (
									<Logout {...props} handleLogout={this.handleLogout} exact />
								);
							}}
							exact
						/> */}
										<Route
											path="/user/home"
											component={EditableFormTable}
											exact
										/>
										{/* <Route path="/" component={Login} exact /> */}
										{/* <Route path="/user/settings" component={Threads} exact />
						<Route path="/user/profile" component={ThreadAdd} exact /> */}
									</Switch>
								</div>
							</Content>
							<Footer style={{ textAlign: "center" }}>
								Budget_Desktop_App ©2019 Created by sHyaM
							</Footer>
						</Layout>
					</Layout>
				</div>
			</BrowserRouter>
		);
	}
}

export default App;
