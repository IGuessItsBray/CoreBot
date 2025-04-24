// ------------------------------------------------------------------------------
import { Component } from "react";
import PageLoading from "../components/loading";
import axios from "axios";
// ------------------------------------------------------------------------------
import { getCacheItem, setCacheItem } from "../helpers";
// ------------------------------------------------------------------------------
const { APIAddress, ClientID } = require("../localStorage").config;
// ------------------------------------------------------------------------------
export default class Members extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userProxyMembers: [],
    };
  }
  async componentDidMount() {
    await this.doRequests();
  }
  render() {
    return (
      <>
        <PageLoading
          loading={this.state.loading}
          text="Loading Your Members..."
        />
        <div class="row row-cols-1 row-cols-md-3 g-4">
          {this.state.userProxyMembers?.map((u) => {
            return (
              <div class="col" key={u._id}>
                <div
                  class={("card h-100 text-center ")}
                >
                    
                    
                  <img
                    src={
                      u.avatar ??
                      `https://cdn.discordapp.com/embed/avatars/1.png`
                    }
                    class={"card-img-top"}
                    alt={`${u.name} icon`}
                    width="50"
                  />
                  <div class="card-body">
                    <h5 class="card-title">{u.name}</h5>
                    <p class="card-text">{u.pronouns}</p>
                    <p class="card-text">{u.desc}</p>
                  </div>
                  <div class="card-footer">
                    <small>
                      <code class="text-muted">{`ID: ${u._id}`}</code>
                    </small>
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
    // api request happens here
    // and then the state is set by the api or cache
    await this.fetchRegisteredMembers();

    this.setState({ loading: false });
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
