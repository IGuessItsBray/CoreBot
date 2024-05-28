// ------------------------------------------------------------------------------
import { Component } from "react";
import PageLoading from "../components/loading";
import { CopyBlock, googlecode } from "@discostudioteam/react-code-blocks";
import axios from "axios";
// ------------------------------------------------------------------------------
import { getCacheItem, setCacheItem } from "../helpers";
// ------------------------------------------------------------------------------
const { APIAddress } = require("../localStorage").config;
// ------------------------------------------------------------------------------
export default class Guild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      guild: this.props.guild,
      guildPage: this.props.guildPage ?? "overview",
    };
  }
  async componentDidMount() {
    await this.doRequests();
  }
  // ------------------------------------------------------------------------------
  render() {
    return (
      <>
        <PageLoading
          loading={this.state.loading}
          text={`Loading ${this.state.guild.name}`}
        />
        <button
          class="btn btn-sm text-muted"
          onClick={() => this.props.setPage("guilds")}
        >
          ←Back to Guilds
        </button>
        <div class="card">
          <div class="card-header row" style={{ "--bs-gutter-x": "0" }}>
            <div class="col-auto">
              <img
                src={this.state.guild.icon}
                class={"card-img-top card-img-top-small"}
                alt={`${this.state.guild.name} icon`}
                width="10"
              />
            </div>
            <div class="col">
              <h5 class="card-title">{this.state.guild.name}</h5>
              <h6 class="card-subtitle">
                {this.state.guildPage}
                <br />
                <code class="mb-2 text-muted">{this.state.guild.id}</code>
              </h6>
            </div>
          </div>
          <div
            class="btn-group btn-group-sm"
            style={{
              borderTop: "none",
              borderBottom: "1px solid rgba(0,0,0,.125)",
              borderRadius: 0,
            }}
          >
            <button
              type="button"
              class={`btn btn-light ${
                this.state.guildPage === "overview" ? "" : ""
              }`}
              onClick={() => this.setGuildPage("guilds")}
            >
              Overview
            </button>
            <button
              type="button"
              class={`btn btn-light ${
                this.state.guildPage === "scheduler" ? "" : ""
              }`}
              onClick={() => this.setGuildPage("scheduler")}
            >
              Scheduler
            </button>
            <button
              type="button"
              class={`btn btn-light ${this.state.guildPage === "" ? "" : ""}`}
              onClick={() => this.setGuildPage("stats")}
            >
              Stats
            </button>
          </div>
          <div class="card-body">{this.renderSwitch()}</div>
        </div>
      </>
    );
  }
  renderSwitch() {
    switch (this.state.guildPage) {
      default:
      case "overview":
        return (
          <CopyBlock
            text={JSON.stringify(this.state.guild, null, 2)}
            language={"json"}
            showLineNumbers={false}
            theme={googlecode}
            wrapLines
          />
        );
      case "scheduler":
        return (
          <CopyBlock
            text={JSON.stringify(this.state.guild, null, 2)}
            language={"json"}
            showLineNumbers={false}
            theme={googlecode}
            wrapLines
          />
        );
      case "stats":
        return (
          <CopyBlock
            text={JSON.stringify(this.state.guild, null, 2)}
            language={"json"}
            showLineNumbers={false}
            theme={googlecode}
            wrapLines
          />
        );
    }
  }
  // ------------------------------------------------------------------------------
  setGuildPage(guildPage) {
    this.setState({ guildPage });
  }
  // ------------------------------------------------------------------------------
  async doRequests() {
    await this.fetchGuild(this.state.guild.id);

    this.setState({ loading: false });
  }
  async fetchGuild(guildId) {
    const token = localStorage.getItem("token");
    const url = APIAddress + `client/guild/${guildId}`;
    const headers = {
      token: token,
    };

    // load the cached version if it exists
    const resCached = await getCacheItem(`guild-${guildId}`);
    if (resCached) {
      this.setState({ guilds: resCached });
    } else {
      this.setState({ loading: true });
    }

    // load the live version if it's different
    const res = await axios.get(url, { headers }).catch((err) => {
      return err.response;
    });
    if (res.status === 200 && res.data !== resCached) {
      this.setState({ guilds: res.data });
      setCacheItem(`guild-${guildId}`, res.data);
    }
    this.setState({ loading: false });
  }
}
// ------------------------------------------------------------------------------
