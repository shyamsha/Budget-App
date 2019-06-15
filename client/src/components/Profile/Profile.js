import React, { Component } from "react";
import axios from "../../config/config";
import decode from "jwt-decode";
import "antd/dist/antd.css";
import { Card, Icon } from "antd";

const { Meta } = Card;

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {}
		};
	}

	componentDidMount() {
		const userId = localStorage.getItem("token");
		const decoded = decode(userId);

		axios
			.get(`/users/${decoded.user_id}`, {
				headers: { "x-auth": localStorage.getItem("token") }
			})
			.then(response => {
				this.setState(() => ({
					user: response.data
				}));
			})
			.catch(err => {
				console.log(err);
			});
	}
	render() {
		return (
			<div>
				<span style={{ color: "royleblue" }}>User Profile</span>
				<Card
					style={{ width: 300 }}
					cover={<img alt="userphoto" src={this.state.user.imageUrl} />}
					actions={[<Icon type="setting" />, <Icon type="home" />]}
				>
					<Meta
						title={this.state.user.username}
						description={this.state.user.occupation}
					/>
					<br />
					<p>{this.state.user.email}</p>
				</Card>
			</div>
		);
	}
}

export default Profile;
