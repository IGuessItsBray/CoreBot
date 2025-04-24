// ------------------------------------------------------------------------------
import { Component } from 'react';
import PageLoading from '../components/loading';
import axios from 'axios';
// ------------------------------------------------------------------------------
import { getCacheItem, setCacheItem } from '../helpers';
// ------------------------------------------------------------------------------
const { APIAddress, ClientID } = require('../localStorage').config;
// ------------------------------------------------------------------------------
export default class Guilds extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			userId: props.userId,
			guilds: [],
		};
	}
	async componentDidMount() {
		await this.doRequests();
	}
	render() {
		return (
			<>
				<PageLoading loading={this.state.loading} text="Loading Your Guilds..." />
				<div class="row row-cols-1 row-cols-md-3 g-4">
					{this.state.guilds?.map(guild => {
						return (
							<div class="col" key={guild.id}>
								<div class={`card h-100 text-center ${!guild.owner && !guild.admin && !guild.bot ? 'disabled' : ''} ${!guild.bot ? 'noBot' : ''}`}>
									<img
										src={guild.icon}
										class={`card-img-top ${guild.admin ? 'admin' : ''} ${guild.owner ? 'owner' : ''}`}
										alt={`${guild.name} icon`} width="50" />
									<div class="card-body">
										<h5 class="card-title">{guild.name}</h5>
										{guild.owner ? (<span class="badge badge-owner">Owner</span>) : ''}
										{guild.admin && !guild.owner ? (<span class="badge badge-admin">Admin</span>) : ''}
										{guild.mod && !guild.admin && !guild.owner ? (<span class="badge badge-moderator">Moderator</span>) : ''}
									</div>
									<div class="btn-group btn-group-sm">
										{(guild.owner || guild.admin) && guild.bot ? (
											<>
												<button type="button" class="btn btn-light" onClick={() => this.props.setGuild(guild)}>Manage</button>
												{/* <button type="button" class="btn btn-light" onClick={() => this.props.setGuildPage('guildScheduler', guild.id)}>Scheduler</button>
												<button type="button" class="btn btn-light" onClick={() => this.props.setGuildPage('guildStats', guild.id)}>Stats</button> */}
											</>
										) : ''}
										{(guild.canAdd) && !guild.bot ? (
											<button type="button" class="btn btn-light" onClick={() => {
												const new_window = window.open(`https://discord.com/api/oauth2/authorize?client_id=${ClientID}&permissions=8&scope=bot%20applications.commands`, 'test', 'width=600,height=800,scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no');
												// console.log('done');
												const interval = setInterval(() => {
													if (new_window.closed) {
														this.setState({ loading: true });
														this.doRequests();
														clearInterval(interval);
													}
												}, 500);
											}}>Add Bot</button>
										) : ''}
									</div>
									<div class="card-footer">
										<small><code class="text-muted">{guild.id}</code></small>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</>
		);
	}
	reload() {
		window.location.reload();
	}
	async doRequests() {
		const token = localStorage.getItem('token');
		const url = APIAddress + 'client/guild';
		const headers = {
			'token':  token,
		};

		// load the cached version if it exists
		const resCached = await getCacheItem('guilds');
		if (resCached) {
			this.setState({ guilds: resCached });
		}
		else {
			this.setState({ loading: true });
		}

		// load the live version if it's different
		const res = await axios.get(url, { headers }).catch((err) => { return err.response; });
		if (res.status === 200 && res.data.guilds !== resCached) {
			this.setState({ guilds: res.data.guilds });
			setCacheItem('guilds', res.data.guilds);
		}
		this.setState({ loading: false });
	}
}
// ------------------------------------------------------------------------------
