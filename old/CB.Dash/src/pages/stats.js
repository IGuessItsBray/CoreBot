// ------------------------------------------------------------------------------
import { Component } from "react";
import PageLoading from "../components/loading";
import axios from "axios";
// ------------------------------------------------------------------------------
import { getCacheItem, setCacheItem } from "../helpers";
// ------------------------------------------------------------------------------
const { APIAddress, ClientID } = require("../localStorage").config;
// ------------------------------------------------------------------------------
export default class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      stats: {},
      userProxyMembers: [],
    };
  }
  async componentDidMount() {
    await this.doRequests();
  }
  render() {
    return (
      <>
        <PageLoading loading={this.state.loading} text={"Loading Stats"} />
        {/* YOUR HTML STARTS HERE */}
        <table class="table">
          <thead>
            <tr>
              <th>Guilds</th>
              <th>Channels</th>
              <th>Shard Count</th>
              <th>Proxied Messages</th>
              <th>Your Registered Members</th>
            </tr>
          </thead>
          <tr>
            <td>{this.state.stats.gsize}</td>
            <td>{this.state.stats.csize}</td>
            <td>{this.state.stats.shardCount}</td>
            <td>{this.state.stats.proxyMsgs}</td>
            <td>{this.state.userProxyMembers.length}</td>
          </tr>
        </table>
        {/* YOUR HTML ENDS HERE */}
      </>
    );
  }
  reload() {
    window.location.reload();
  }
  async doRequests() {
    // api request happens here
    // and then the state is set by the api or cache
    await this.fetchStats();
    await this.fetchRegisteredMembers();

    this.setState({ loading: false });
  }
  async fetchStats() {
    const token = localStorage.getItem("token");
    const url = APIAddress + "stats";
    const headers = {
      token: token,
    };

    // load the cached version if it exists
    const resCached = await getCacheItem("stats");
    if (resCached) {
      this.setState({ stats: resCached });
    } else {
      this.setState({ loading: true });
    }

    // load the live version if it's different
    const res = await axios
      .get(url, { headers, crossdomain: true })
      .catch((err) => {
        return err.response;
      });
    if (res.status === 200 && res.data !== resCached) {
      this.setState({ stats: res.data });
      setCacheItem("stats", res.data);
    }
  }
  async fetchRegisteredMembers() {
    const token = localStorage.getItem("token");
    const url = APIAddress + "getRegisteredMembers";
    const headers = {
      token: token,
    };

    // load the cached version if it exists
    const resCached = await getCacheItem("userProxyMembers");
    if (resCached) {
      this.setState({ userProxyMembers: resCached });
    } else {
      this.setState({ loading: true });
    }

    // load the live version if it's different
    const res = await axios
      .get(url, { headers, crossdomain: true })
      .catch((err) => {
        return err.response;
      });
    if (res.status === 200 && res.data !== resCached) {
      this.setState({ userProxyMembers: res.data });
      setCacheItem("userProxyMembers", res.data);
    }
  }
}
// ------------------------------------------------------------------------------
