// ------------------------------------------------------------------------------
import { Component } from 'react';
import axios from 'axios';
// ------------------------------------------------------------------------------
const { APIAddress, ClientID } = require('../localStorage').config;
export default class NavLogin extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	render() {
		return (
			<div>
				{this.props.user ?
					(<span>{this.props.user}&nbsp;</span>)
					: undefined
				}
				<span style={{ all: 'unset', color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
					{this.props.user ?
						(<span onClick={async ()=>{
							const token = localStorage.getItem('token');
							const url = APIAddress + 'auth';
							const headers = {
								'token':  token,
							};
							await axios.delete(url, { headers }).catch((err) => { return err.response; });
							localStorage.removeItem('token');
							localStorage.removeItem('cache');
							window.location.href = '';
						}}>Logout</span>) :
						(<span onClick={()=>{
							let callback = window.location.href;
							callback = callback.substring(0, callback.length - 1);
							callback = encodeURIComponent(callback);
							window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${ClientID}&redirect_uri=${callback}&response_type=code&scope=identify+guilds`;
							// console.log(callback);
						}}>Login with Discord</span>)}
				</span>
			</div>
		);
	}
}