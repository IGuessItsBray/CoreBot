// ------------------------------------------------------------------------------
import { Component } from 'react';
import Navbar from './components/navbar';
// ------------------------------------------------------------------------------
import Guilds from './pages/guilds';
import Guild from './pages/guild';
// ------------------------------------------------------------------------------
import { initCache, getCacheItem, setCacheItem } from './helpers';
// ------------------------------------------------------------------------------
import axios from 'axios';
// ------------------------------------------------------------------------------
const { APIAddress } = require('./localStorage').config;
// ------------------------------------------------------------------------------

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loadingUser: true,
			page: 'login',
			ui : {
				name: undefined,
				logo: undefined,
			},
		};
	}
	async componentDidMount() {
		this.versionCheck();
		await initCache();
		this.getAppInfo();
		this.doRequests();
	}
	// ------------------------------------------------------------------------------
	render() {
		return (
			<>
				<Navbar value={this.state.ui.name} image={this.state.ui.logo} user={this.state.user} loading={this.state.loadingUser}/>
				<div class="container">
					{this.renderswitch()}
				</div>
				<div class="text-center session-hash">
					<small><code class="text-muted">{localStorage.getItem('token')}</code></small>
				</div>
			</>
		);
	}
	renderswitch() {
		document.title = `${this.state.page}${this.state.ui.name ? ' - ' + this.state.ui.name : ''}`;
		// console.log(this.state);
		switch(this.state.page) {
		default:
		case 'login':
			return (
				<div class="alert alert-warning text-center">
					Please sign in to proceed.
				</div>
			);
		case 'guilds':
			return (<Guilds userId={this.state.userId} setGuild={this.setGuild}/>);
		case 'guild':
			return (<Guild guild={this.state.guild} setPage={this.setPage} />);
		}
	}
	// ------------------------------------------------------------------------------
	setPage = (page) => {
		this.setState({ page, guild: undefined });
	};
	setGuild = (guild) => {
		this.setState({ page: 'guild', guild });
	};
	// ------------------------------------------------------------------------------
	async doRequests() {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
		const token = localStorage.getItem('token');
		window.history.replaceState(null, null, window.location.pathname);
		if (code) await this.authenticate(code);
		if (token) await this.getUser(token);
		this.setState({ loadingUser: false });
	}
	async versionCheck() {
		const url = APIAddress + 'client';
		const res = await axios.get(url).catch((err) => { return err.response; });
		
		if (res.status !== 200) return;
		const liveVersion = res.data.api.tag;
		const storageVersion = localStorage.getItem('version');

		// if the version is different, clear the cache and reload
		// this is to prevent issues with the cache when the api is updated
		// mostly because of cors issues
		if (liveVersion !== storageVersion) {
			localStorage.clear();
			localStorage.setItem('version', liveVersion);
			window.location.reload();
		}
	}
	async getAppInfo() {
		const url = APIAddress + 'client';
		// const res = await axios.get(url).catch((err) => { return err.response; });

		// load the cached version if it exists
		const resCached = await getCacheItem('client');
		if (resCached) {
			this.setState({ ui: { name: resCached.bot.name, logo: resCached.bot.avatar } });
			let link = document.querySelector('link[rel~=\'icon\']');
			if (!link) {
				link = document.createElement('link');
			  	link.rel = 'icon';
			  	document.getElementsByTagName('head')[0].appendChild(link);
			}
			link.href = resCached.bot.avatar;
		}

		// load the live version if it's different
		const res = await axios.get(url).catch((err) => { return err.response; });
		if (res.status === 200 && res.data !== resCached) {
			this.setState({ ui: { name: res.data.bot.name, logo: res.data.bot.avatar } });
			let link = document.querySelector('link[rel~=\'icon\']');
			if (!link) {
			  link = document.createElement('link');
			  link.rel = 'icon';
			  document.getElementsByTagName('head')[0].appendChild(link);
			}
			link.href = res.data.bot.avatar;
			await setCacheItem('client', res.data);
		}
	}
	async authenticate(code) {
		let callback = window.location.href;
		callback = callback.substring(0, callback.length - 1);
		callback = encodeURIComponent(callback);
		const res = await axios
			.get(APIAddress + `auth?code=${encodeURIComponent(code)}&redirect=${callback}`)
			.catch((err) => { return err.response; });
		if (res.status !== 200) return;
		localStorage.setItem('token', res.data.token);
		this.getUser(res.data.token);
	}
	async getUser(token) {
		const url = APIAddress + 'user';
		const headers = {
			'token':  token,
		};

		// load the cached version if it exists
		const resCached = await getCacheItem('user');
		if (resCached) {
			this.setState({
				user: `${resCached.username}`,
				userId: resCached.id,
				page: 'guilds',
				loadingUser: false,
			});
		}

		// load the live version if it's different
		const res = await axios.get(url, { headers }).catch((err) => { return err.response; });
		if (res.status === 200 && res.data !== resCached) {
			await setCacheItem('user', res.data);
			this.setState({
				user: `${res.data.username}`,
				userId: res.data.id,
				page: 'guilds',
			});
		}
		if (res.status !== 200) {
			localStorage.removeItem('token');
			localStorage.removeItem('cache');
			window.location.href = '';
			return;
		}

	}
}