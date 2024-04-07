"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// package.json
var require_package = __commonJS({
  "package.json"(exports2, module2) {
    module2.exports = {
      name: "riffy",
      description: "Riffy is a pro lavalink client. It is designed to be simple and easy to use, with a focus on stability and more features.",
      version: "2.0.0-beta.4",
      main: "./dist/index.js",
      module: "./dist/index.mjs",
      types: "./dist/index.d.ts",
      exports: {
        ".": {
          require: "./dist/index.js",
          import: "./dist/index.mjs",
          types: "./dist/index.d.ts"
        }
      },
      files: [
        "dist"
      ],
      dependencies: {
        "discord.js": "^14.14.1",
        ws: "^8.16.0"
      },
      license: "MIT",
      keywords: [
        "lavalink",
        "music",
        "discord",
        "discord.js",
        "discordjs",
        "riffy",
        "riffy.js",
        "riffyjs",
        "eris"
      ],
      scripts: {
        build: "tsup",
        "build:watch": "tsup --watch"
      },
      contributors: [
        "FlameFace (https://github.com/flameface)",
        "Elitex (https://github.com/Elitex07)",
        "UnschooledGamer (https://github.com/unschooledgamer/)"
      ],
      repository: {
        type: "git",
        url: "https://github.com/riffy-team/riffy.git"
      },
      bugs: {
        url: "https://github.com/riffy-team/riffy.js/issues"
      },
      homepage: "https://riffy.js.org/",
      devDependencies: {
        "@types/node": "^20.11.28",
        "@types/ws": "^8.5.10",
        tsup: "^8.0.2",
        typescript: "^5.4.2"
      }
    };
  }
});

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Connection: () => Connection,
  Filters: () => Filters,
  Node: () => Node,
  Player: () => Player2,
  Plugin: () => Plugin2,
  Queue: () => Queue,
  Rest: () => Rest,
  Riffy: () => Riffy2,
  Track: () => Track
});
module.exports = __toCommonJS(src_exports);

// src/structures/Connection.ts
var Connection = class {
  player;
  sessionId;
  region;
  voice;
  self_mute;
  self_deaf;
  constructor(player) {
    this.player = player;
    this.sessionId = null;
    this.voice = {
      sessionId: null,
      token: null,
      endpoint: null
    };
    this.region = null;
    this.self_deaf = false;
    this.self_mute = false;
  }
  setServerUpdate(data) {
    const { guild_id, endpoint, token } = data;
    if (!endpoint) {
      throw new Error("Endpoint not found in server update data.");
    }
    this.voice.endpoint = endpoint;
    this.voice.token = token;
    this.region = endpoint.split(".").shift()?.replace(/[0-9]/g, "") || null;
    if (this.player.paused) {
      this.player.riffy.emit(
        `debug`,
        `${this.player.node.name}`,
        `Unpaused ${this.player.guildId} player, expecting it to be paused while the player moved to ${this.player.voiceChannel}`
      );
      this.player.pause(false);
    }
    this.updatePlayerVoiceData();
  }
  setStateUpdate(data) {
    const { session_id, channel_id, self_deaf, self_mute } = data;
    if (!channel_id) {
      this.player.destroy();
      this.player.emit("playerDestroy", this.player);
    }
    if (this.player.voiceChannel && channel_id && this.player.voiceChannel !== channel_id) {
      this.player.emit("playerMove", this.player.voiceChannel, channel_id);
      this.player.voiceChannel = channel_id;
    }
    this.self_deaf = self_deaf;
    this.self_mute = self_mute;
    this.voice.sessionId = session_id || null;
  }
  updatePlayerVoiceData() {
    this.player.riffy.emit(
      `debug`,
      `${this.player.node.name}`,
      `Sending an update player request with data: ${JSON.stringify({ voice: this.voice })}`
    );
    this.player.node.rest.updatePlayer({
      guildId: this.player.guildId,
      data: { voice: this.voice }
    });
  }
};

// src/structures/Filters.ts
var Filters = class _Filters {
  player;
  volume;
  equalizer;
  karaoke;
  timescale;
  tremolo;
  vibrato;
  rotation;
  distortion;
  channelMix;
  lowPass;
  // Custom Filters
  bassboost;
  slowmode;
  nightcore;
  vaporwave;
  _8d;
  constructor(player, options) {
    this.player = player;
    this.volume = options?.volume || 1;
    this.equalizer = options?.equalizer || [];
    this.karaoke = options?.karaoke || null;
    this.timescale = options?.timescale || null;
    this.tremolo = options?.tremolo || null;
    this.vibrato = options?.vibrato || null;
    this.rotation = options?.rotation || null;
    this.distortion = options?.distortion || null;
    this.channelMix = options?.channelMix || null;
    this.lowPass = options?.lowPass || null;
    this.bassboost = options?.bassboost || null;
    this.slowmode = options?.slowmode || null;
    this.nightcore = options?.nightcore || null;
    this.vaporwave = options?.vaporwave || null;
    this._8d = options?._8d || null;
  }
  setEqualizer(band) {
    if (!this.player)
      return;
    this.equalizer = band;
    this.updateFilters();
    return this;
  }
  setKaraoke(options) {
    if (!this.player)
      return;
    this.karaoke = options;
    this.updateFilters();
    return this;
  }
  setTimescale(options) {
    if (!this.player)
      return;
    this.timescale = options;
    this.updateFilters();
    return this;
  }
  setTremolo(options) {
    if (!this.player)
      return;
    this.tremolo = options;
    this.updateFilters();
    return this;
  }
  setVibrato(options) {
    if (!this.player)
      return;
    this.vibrato = options;
    this.updateFilters();
    return this;
  }
  setRotation(options) {
    if (!this.player)
      return;
    this.rotation = options;
    this.updateFilters();
    return this;
  }
  setDistortion(options) {
    if (!this.player)
      return;
    this.distortion = options;
    this.updateFilters();
    return this;
  }
  setChannelMix(options) {
    if (!this.player)
      return;
    this.channelMix = options;
    this.updateFilters();
    return this;
  }
  setLowPass(options) {
    if (!this.player)
      return;
    this.lowPass = options;
    this.updateFilters();
    return this;
  }
  setBassboost(value) {
    if (!this.player)
      return;
    if (value < 0 && value > 6)
      throw Error("Bassboost value must be between 0 to 5");
    this.bassboost = value;
    let num = (value - 1) * (1.25 / 9) - 0.25;
    this.setEqualizer(Array(13).fill(0).map((n, i) => ({
      band: i,
      gain: num
    })));
    return null;
  }
  setSlowmode(value) {
    if (!this.player)
      return;
    this.slowmode = value;
    this.setTimescale(value ? { speed: 0.5, pitch: 1, rate: 0.8 } : null);
  }
  setNightcore(value) {
    if (!this.player)
      return;
    this.nightcore = value;
    if (value)
      this.vaporwave = false;
    this.setTimescale(value ? { rate: 1.5 } : null);
  }
  setVaporwave(value) {
    if (!this.player)
      return;
    this.vaporwave = value;
    if (value)
      this.nightcore = false;
    this.setTimescale(value ? {
      pitch: 0.5
    } : null);
  }
  set8D(value) {
    if (!this.player)
      return;
    this._8d = value;
    this.setRotation(value ? { rotationHz: 0.2 } : null);
  }
  async clearFilters() {
    this.player.filters = new _Filters(this.player);
    if (this.nightcore)
      this.setNightcore(false);
    if (this.equalizer.length !== 0)
      this.setEqualizer([]);
    if (this._8d)
      this.set8D(false);
    if (this.slowmode)
      this.setSlowmode(false);
    await this.updateFilters();
    return this;
  }
  async updateFilters() {
    const { equalizer, karaoke, timescale, tremolo, vibrato, rotation, distortion, channelMix, lowPass, volume } = this;
    await this.player.node.rest.updatePlayer({
      guildId: this.player.guildId,
      data: {
        filters: {
          volume,
          equalizer,
          karaoke,
          timescale,
          tremolo,
          vibrato,
          rotation,
          distortion,
          channelMix,
          lowPass
        }
      }
    });
    return this;
  }
};

// src/structures/Node.ts
var import_ws = __toESM(require("ws"));
var Node = class {
  riffy;
  name;
  host;
  port;
  password;
  restVersion;
  secure;
  sessionId;
  rest;
  restURL;
  socketURL;
  ws;
  regions;
  stats;
  connected;
  resumeKey;
  resumeTimeout;
  autoResume;
  reconnectTimeout;
  reconnectTries;
  reconnectAttempt;
  reconnectAttempted;
  constructor(riffy, node, options) {
    this.riffy = riffy;
    this.name = node.name || node.host;
    this.host = node.host || "localhost";
    this.port = node.port;
    this.password = node.password || "youshallnotpass";
    this.restVersion = options.restVersion || "v3";
    this.secure = node.secure || false;
    this.sessionId = node.sessionId;
    this.rest = new Rest(riffy, this);
    this.socketURL = `${this.secure ? "wss" : "ws"}://${this.host}${this.port ? `:${this.port}` : ""}${this.restVersion === "v4" ? "/v4/websocket" : ""}`;
    this.restURL = `${this.secure ? "https" : "http"}://${this.host}${this.port ? `:${this.port}` : ""}`;
    this.ws = null;
    this.regions = null;
    this.stats = {
      players: 0,
      playingPlayers: 0,
      uptime: 0,
      memory: {
        free: 0,
        used: 0,
        allocated: 0,
        reservable: 0
      },
      cpu: {
        cores: 0,
        systemLoad: 0,
        lavalinkLoad: 0
      },
      frameStats: {
        sent: 0,
        nulled: 0,
        deficit: 0
      }
    };
    this.connected = false;
    this.resumeKey = options.resumeKey || null;
    this.resumeTimeout = options.resumeTimeout || 60;
    this.autoResume = options.autoResume || false;
    this.reconnectTimeout = options.reconnectTimeout || 5e3;
    this.reconnectTries = options.reconnectTries || 5;
    this.reconnectAttempt = null;
    this.reconnectAttempted = 1;
  }
  connect() {
    if (this.ws)
      this.ws.close();
    const headers = {
      Authorization: this.password,
      "User-Id": this.riffy.clientId,
      "Client-Name": `Riffy/${this.riffy.version}`
    };
    if (this.restVersion === "v4" && this.sessionId) {
      headers["Session-Id"] = this.sessionId;
    } else if (this.resumeKey) {
      headers["Resume-Key"] = this.resumeKey;
    }
    this.ws = new import_ws.default(this.socketURL, { headers });
    this.ws.on("open", this.open.bind(this));
    this.ws.on("error", this.error.bind(this));
    this.ws.on("message", this.message.bind(this));
    this.ws.on("close", this.close.bind(this));
  }
  open() {
    if (this.reconnectTimeout)
      clearTimeout(this.reconnectTimeout);
    if (this.autoResume) {
      for (const player of this.riffy.players.values()) {
        if (player.node === this) {
          player.restart();
        }
      }
    }
    this.riffy.emit("nodeConnect", this);
    this.connected = true;
    this.riffy.emit("debug", this.name, `Connection with Lavalink established on ${this.socketURL}`);
  }
  error(error) {
    if (!error)
      return;
    this.riffy.emit("nodeError", this, error);
  }
  message(msg) {
    const payload = JSON.parse(msg.toString());
    if (!payload.op)
      return;
    this.riffy.emit("raw", payload);
    this.riffy.emit("debug", this.name, `Lavalink Node Update : ${JSON.stringify(payload)}`);
    if (payload.op === "stats") {
      this.stats = { ...payload };
    }
    if (payload.op === "ready") {
      if (this.sessionId !== payload.sessionId) {
        this.rest.setSessionId(payload.sessionId);
        this.sessionId = payload.sessionId;
      }
      this.riffy.emit("debug", this.name, `Ready Payload received ${JSON.stringify(payload)}`);
      if (this.restVersion === "v4" && this.sessionId) {
        this.rest.makeRequest(`PATCH`, `/${this.rest.version}/sessions/${this.sessionId}`, { resuming: true, timeout: this.resumeTimeout });
        this.riffy.emit("debug", this.name, `Resuming configured on Lavalink`);
      } else if (this.resumeKey) {
        this.rest.makeRequest(`PATCH`, `/${this.rest.version}/sessions/${this.sessionId}`, { resumingKey: this.resumeKey, timeout: this.resumeTimeout });
        this.riffy.emit("debug", this.name, `Resuming configured on Lavalink`);
      }
    }
    const player = this.riffy.players.get(payload.guildId);
    if (payload.guildId && player)
      player.emit(payload.op, payload);
  }
  close(event, reason) {
    this.riffy.emit("nodeDisconnect", this, { event, reason });
    this.riffy.emit("debug", `Connection with Lavalink closed with Error code : ${event || "Unknown code"}`);
    this.connected = false;
    this.reconnect();
  }
  reconnect() {
    this.reconnectAttempt = setTimeout(() => {
      if (this.reconnectAttempted >= this.reconnectTries) {
        const error = new Error(`Unable to connect with ${this.name} node after ${this.reconnectTries} attempts.`);
        this.riffy.emit("nodeError", this, error);
        return this.destroy();
      }
      if (this.ws) {
        this.ws.removeAllListeners();
        this.ws = null;
      }
      this.riffy.emit("nodeReconnect", this);
      this.connect();
      this.reconnectAttempted++;
    }, this.reconnectTimeout);
  }
  destroy() {
    if (!this.connected)
      return;
    const players = Array.from(this.riffy.players.values()).filter((player) => player.node === this);
    if (players.length > 0) {
      players.forEach((player) => player.destroy());
    }
    if (this.ws) {
      this.ws.close(1e3, "destroy");
      this.ws.removeAllListeners();
      this.ws = null;
    }
    this.reconnectAttempted = 1;
    if (this.reconnectAttempt) {
      clearTimeout(this.reconnectAttempt);
    }
    this.riffy.emit("nodeDestroy", this);
    players.forEach((player) => {
      this.riffy.destroyPlayer(player.guildId);
    });
    if (this.name !== null && this.name !== void 0) {
      this.riffy.nodeMap.delete(this.name);
    }
    this.connected = false;
  }
  send(payload) {
    const data = JSON.stringify(payload);
    this.ws?.send(data, (error) => {
      if (error) {
        this.riffy.emit("nodeError", this, error);
      }
    });
  }
  disconnect() {
    if (!this.connected)
      return;
    this.riffy.players.forEach((player) => {
      if (player.node === this) {
        player.destroy();
      }
    });
    if (this.ws) {
      this.ws.close(1e3, "destroy");
      this.ws.removeAllListeners();
      this.ws = null;
    }
    if (this.name !== null && this.name !== void 0) {
      this.riffy.players.delete(this.name);
    }
    this.riffy.emit("nodeDisconnect", this);
    this.connected = false;
  }
  get penalties() {
    let penalties = 0;
    if (!this.connected)
      return penalties;
    if (this.stats.players) {
      penalties += this.stats.players;
    }
    if (this.stats.cpu && this.stats.cpu.systemLoad) {
      penalties += Math.round(Math.pow(1.05, 100 * this.stats.cpu.systemLoad) * 10 - 10);
    }
    if (this.stats.frameStats) {
      if (this.stats.frameStats.deficit) {
        penalties += this.stats.frameStats.deficit;
      }
      if (this.stats.frameStats.nulled) {
        penalties += this.stats.frameStats.nulled * 2;
      }
    }
    return penalties;
  }
};

// src/structures/Riffy.ts
var import_events = require("events");
var versions = ["v3", "v4"];
var { version: pkgVersion } = require_package();
var Riffy2 = class extends import_events.EventEmitter {
  client;
  nodes;
  nodeMap;
  players;
  options;
  clientId;
  initiated;
  send;
  defaultSearchPlatform;
  restVersion;
  tracks;
  loadType;
  playlistInfo;
  pluginInfo;
  plugins;
  version;
  constructor(client, nodes, options) {
    super();
    if (!client)
      throw new Error("Client is required to initialize Riffy");
    if (!nodes)
      throw new Error("Nodes are required to initialize Riffy");
    if (!options.send)
      throw new Error("Send function is required to initialize Riffy");
    this.client = client;
    this.nodes = nodes;
    this.nodeMap = /* @__PURE__ */ new Map();
    this.players = /* @__PURE__ */ new Map();
    this.options = options;
    this.clientId = null;
    this.initiated = false;
    this.send = options.send || null;
    this.defaultSearchPlatform = options.defaultSearchPlatform || "ytmsearch";
    this.restVersion = options.restVersion || "v3";
    this.tracks = [];
    this.loadType = null;
    this.playlistInfo = null;
    this.pluginInfo = null;
    this.plugins = options.plugins = [];
    this.version = pkgVersion;
    if (this.restVersion && !versions.includes(this.restVersion))
      throw new RangeError(`${this.restVersion} is not a valid version`);
  }
  get leastUsedNodes() {
    return [...this.nodeMap.values()].filter((node) => node.connected).sort((a, b) => b.rest.calls - a.rest.calls);
  }
  init(clientId) {
    if (this.initiated)
      return this;
    this.clientId = clientId;
    Object.values(this.nodes).forEach((node) => {
      this.createNode(node);
    });
    this.initiated = true;
    if (this.plugins) {
      this.plugins.forEach((plugin) => {
        plugin.load(this);
      });
    }
  }
  createNode(options) {
    const node = new Node(this, options, this.options);
    this.nodeMap.set(options.name || options.host, node);
    node.connect();
    this.emit("nodeCreate", node);
    return node;
  }
  destroyNode(identifier) {
    const node = this.nodeMap.get(identifier);
    if (!node)
      return;
    node.disconnect();
    this.nodeMap.delete(identifier);
    this.emit("nodeDestroy", node);
  }
  updateVoiceState(packet) {
    if (!["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"].includes(packet.t))
      return;
    const player = this.players.get(packet.d.guild_id);
    if (!player)
      return;
    if (packet.t === "VOICE_SERVER_UPDATE") {
      player.connection.setServerUpdate(packet.d);
    } else if (packet.t === "VOICE_STATE_UPDATE") {
      if (packet.d.user_id !== this.clientId)
        return;
      player.connection.setStateUpdate(packet.d);
    }
  }
  fetchRegion(region) {
    const nodesByRegion = [...this.nodeMap.values()].filter((node) => node.connected && node.regions?.includes(region?.toLowerCase())).sort((a, b) => {
      const aLoad = a.stats.cpu ? a.stats.cpu.systemLoad / a.stats.cpu.cores * 100 : 0;
      const bLoad = b.stats.cpu ? b.stats.cpu.systemLoad / b.stats.cpu.cores * 100 : 0;
      return aLoad - bLoad;
    });
    return nodesByRegion;
  }
  createConnection(options) {
    if (!this.initiated)
      throw new Error("You have to initialize Riffy in your ready event");
    const player = this.players.get(options.guildId);
    if (player)
      return player;
    if (this.leastUsedNodes.length === 0)
      throw new Error("No nodes are available");
    let node;
    if (options.region) {
      const region = this.fetchRegion(options.region)[0];
      node = this.nodeMap.get(region.name || this.leastUsedNodes[0].name);
    } else {
      node = this.nodeMap.get(this.leastUsedNodes[0].name);
    }
    if (!node)
      throw new Error("No nodes are available");
    return this.createPlayer(node, options);
  }
  createPlayer(node, options) {
    const player = new Player2(this, node, options);
    this.players.set(options.guildId, player);
    player.connect(options);
    this.emit("playerCreate", player);
    return player;
  }
  destroyPlayer(guildId) {
    const player = this.players.get(guildId);
    if (!player)
      return;
    player.destroy();
    this.players.delete(guildId);
    this.emit("playerDestroy", player);
  }
  removeConnection(guildId) {
    this.players.get(guildId)?.destroy();
    this.players.delete(guildId);
  }
  async resolve({ query, source, requester }) {
    try {
      if (!this.initiated)
        throw new Error("You have to initialize Riffy in your ready event");
      const sources = source || this.defaultSearchPlatform;
      const node = this.leastUsedNodes[0];
      if (!node)
        throw new Error("No nodes are available.");
      const regex = /^https?:\/\//;
      const identifier = regex.test(query) ? query : `${sources}:${query}`;
      let response = await node.rest.makeRequest(`GET`, `/${node.rest.version}/loadtracks?identifier=${encodeURIComponent(identifier)}`);
      if (response.loadType === "empty" || response.loadType === "NO_MATCHES") {
        response = await node.rest.makeRequest(`GET`, `/${node.rest.version}/loadtracks?identifier=https://open.spotify.com/track/${query}`);
        if (response.loadType === "empty" || response.loadType === "NO_MATCHES") {
          response = await node.rest.makeRequest(`GET`, `/${node.rest.version}/loadtracks?identifier=https://www.youtube.com/watch?v=${query}`);
        }
      }
      if (node.rest.version === "v4") {
        if (response.loadType === "error") {
          this.emit("nodeError", node, new Error(response.data.message));
          return this;
        } else if (response.loadType === "track") {
          this.tracks = [new Track(response.data, requester)];
        } else if (response.loadType === "playlist") {
          this.tracks = response.data.tracks.map((track) => new Track(track, requester));
        } else {
          this.tracks = response.data.map((track) => new Track(track, requester));
        }
      } else {
        if (response.loadType === "error") {
          this.emit("nodeError", node, new Error(response.data.message));
          return this;
        }
        this.tracks = response.tracks.map((track) => new Track(track, requester));
      }
      if (node.rest.version === "v4" && response.loadType === "playlist") {
        this.playlistInfo = response.data.info;
      } else {
        this.playlistInfo = response.playlistInfo;
      }
      this.loadType = response.loadType;
      this.pluginInfo = response.pluginInfo;
      return this;
    } catch (error) {
      throw new Error(error);
    }
  }
  get(guildId) {
    const player = this.players.get(guildId);
    if (!player)
      throw new Error(`Player not found for ${guildId} guildId`);
    return player;
  }
};

// src/structures/Player.ts
var import_events2 = require("events");

// src/functions/autoplay.ts
async function Soundcloud(url) {
  try {
    const res = await fetch(`${url}/recommended`);
    if (res.status !== 200) {
      return Response.json(`Failed to fetch URL. Status code: ${res.status}`);
    }
    const html = await res.text();
    const hrefs = [];
    const regex = /<section\b[^>]*>([\s\S]*?)<\/section>/g;
    const sectionMatch = regex.exec(html);
    if (sectionMatch) {
      const sectionContent = sectionMatch[1];
      const aRegex = /<a\s+[^>]*itemprop="url"\s+[^>]*href="([^"]*)"/g;
      let match;
      while ((match = aRegex.exec(sectionContent)) !== null) {
        hrefs.push(`https://soundcloud.com${match[1]}`);
      }
    }
    return { status: 200, songs: hrefs[0] };
  } catch (error) {
    return Response.json({
      status: 400,
      error: "Something went wrong. Please check the URL and try again."
    });
  }
}
async function Spotify(track_id) {
  try {
    const data = await fetch("https://open.spotify.com/get_access_token?reason=transport&productType=embed");
    const body = await data.json();
    const res = await fetch(`https://api.spotify.com/v1/recommendations?limit=2&seed_tracks=${track_id}`, {
      headers: {
        Authorization: `Bearer ${body.accessToken}`,
        "Content-Type": "application/json"
      }
    });
    const json = await res.json();
    return { status: 200, songs: json.tracks[Math.floor(Math.random() * json.tracks.length)].id };
  } catch (error) {
    return Response.json({
      status: 400,
      error: "Something went wrong. Please check the URL and try again."
    });
  }
}

// src/structures/Player.ts
var Player2 = class extends import_events2.EventEmitter {
  riffy;
  node;
  connection;
  filters;
  queue;
  options;
  guildId;
  textChannel;
  voiceChannel;
  mute;
  deaf;
  volume;
  loop;
  data;
  position;
  current;
  previous;
  playing;
  paused;
  connected;
  timestamp;
  ping;
  isAutoplay;
  constructor(riffy, node, options) {
    super();
    this.riffy = riffy;
    this.node = node;
    this.connection = new Connection(this);
    this.filters = new Filters(this);
    this.queue = new Queue();
    this.options = options;
    this.guildId = options.guildId;
    this.textChannel = options.textChannel;
    this.voiceChannel = options.voiceChannel;
    this.mute = options.mute || false;
    this.deaf = options.deaf || false;
    this.volume = options.volume || 100;
    this.loop = options.loop || "none";
    this.data = {};
    this.position = 0;
    this.current = null;
    this.previous = null;
    this.playing = false;
    this.paused = false;
    this.connected = false;
    this.timestamp = 0;
    this.ping = 0;
    this.isAutoplay = false;
    this.on("playerUpdate", (packet) => {
      this.connected = packet.state.connected, this.position = packet.state.position, this.ping = packet.state.ping;
      this.timestamp = packet.state.time;
      this.riffy.emit("playerUpdate", this, packet);
    });
    this.on("event", (data) => {
      this.handleEvent(data);
    });
  }
  async play() {
    if (!this.connected)
      throw new Error("Player connection is not initiated. Kindly user Riffy.createConnection() and establish a connection");
    if (!this.queue.length)
      return;
    this.current = this.queue.shift();
    if (this.current === null || this.current?.track === void 0) {
      const resolvedTrack = await this.current?.resolve(this.riffy);
      if (resolvedTrack !== void 0) {
        this.current = resolvedTrack;
      }
    }
    this.playing = true;
    this.position = 0;
    const { track } = this.current;
    this.node.rest.updatePlayer({
      guildId: this.guildId,
      data: {
        encodedTrack: track
      }
    });
    return this;
  }
  async autoplay(player) {
    if (!player) {
      if (player == null) {
        this.isAutoplay = false;
        return this;
      } else if (player == false) {
        this.isAutoplay = false;
        return this;
      } else
        throw new Error("Missing argument. Quick Fix: player.autoplay(player)");
    }
    this.isAutoplay = true;
    if (player.previous) {
      if (player.previous.info.sourceName === "youtube") {
        try {
          let data = `https://www.youtube.com/watch?v=${player.previous.info.identifier}&list=RD${player.previous.info.identifier}`;
          let response = await this.riffy.resolve({ query: data, source: "ytmsearch", requester: player.previous.info.requester });
          if (this.node.rest.version === "v4") {
            if (!response || !response.tracks || ["error", "empty"].includes(response.loadType))
              return this.stop();
          } else {
            if (!response || !response.tracks || ["LOAD_FAILED", "NO_MATCHES"].includes(response.loadType))
              return this.stop();
          }
          let track = response.tracks[Math.floor(Math.random() * Math.floor(response.tracks.length))];
          this.queue.push(track);
          this.play();
          return this;
        } catch (e) {
          return this.stop();
        }
      } else if (player.previous.info.sourceName === "soundcloud") {
        try {
          Soundcloud(player.previous.info.uri).then(async (data) => {
            if (data.status !== 200)
              return this.stop();
            const response = await this.riffy.resolve({ query: data.songs, source: "scsearch", requester: player.previous?.info.requester });
            if (this.node.rest.version === "v4") {
              if (!response || !response.tracks || ["error", "empty"].includes(response.loadType))
                return this.stop();
            } else {
              if (!response || !response.tracks || ["LOAD_FAILED", "NO_MATCHES"].includes(response.loadType))
                return this.stop();
            }
            const track = response.tracks[Math.floor(Math.random() * Math.floor(response.tracks.length))];
            this.queue.push(track);
            this.play();
            return this;
          });
        } catch (e) {
          return this.stop();
        }
      } else if (player.previous.info.sourceName === "spotify") {
        try {
          Spotify(player.previous.info.identifier).then(async (data) => {
            if (data.status !== 200)
              return this.stop();
            const response = await this.riffy.resolve({ query: `https://open.spotify.com/track/${data.songs}`, requester: player.previous?.info.requester });
            if (this.node.rest.version === "v4") {
              if (!response || !response.tracks || ["error", "empty"].includes(response.loadType))
                return this.stop();
            } else {
              if (!response || !response.tracks || ["LOAD_FAILED", "NO_MATCHES"].includes(response.loadType))
                return this.stop();
            }
            const track = response.tracks[Math.floor(Math.random() * Math.floor(response.tracks.length))];
            this.queue.push(track);
            this.play();
            return this;
          });
        } catch (e) {
          return this.stop();
        }
      }
    } else
      return this;
  }
  connect(options) {
    const { guildId, voiceChannel, deaf = true, mute = false } = options;
    this.send({
      guild_id: guildId,
      channel_id: voiceChannel,
      self_deaf: deaf,
      self_mute: mute
    });
    this.connected = true;
    this.riffy.emit("debug", this.guildId, "Player has been connected");
  }
  stop() {
    this.position = 0;
    this.playing = false;
    this.node.rest.updatePlayer({
      guildId: this.guildId,
      data: { encodedTrack: null }
    });
  }
  pause(toggle = true) {
    this.node.rest.updatePlayer({
      guildId: this.guildId,
      data: { paused: toggle }
    });
    this.playing = !toggle;
    this.paused = toggle;
    return this;
  }
  seek(position) {
    const trackLength = this.current?.info.length ?? 0;
    this.position = Math.max(0, Math.min(trackLength, position));
    this.node.rest.updatePlayer({ guildId: this.guildId, data: { position } });
  }
  setVolume(volume) {
    if (volume < 0 || volume > 1e3) {
      throw new Error("[Volume] Volume must be between 0 to 1000");
    }
    this.node.rest.updatePlayer({ guildId: this.guildId, data: { volume } });
    this.volume = volume;
    return this;
  }
  setLoop(mode) {
    if (!mode) {
      throw new Error("You must provide the loop mode as an argument for setLoop");
    }
    if (!["none", "track", "queue"].includes(mode)) {
      throw new Error("setLoop arguments must be 'none', 'track', or 'queue'");
    }
    this.loop = mode;
    return this;
  }
  setTextChannel(channel) {
    if (typeof channel !== "string")
      throw new TypeError("Channel must be a non-empty string.");
    this.textChannel = channel;
    return this;
  }
  setVoiceChannel(channel, options = {}) {
    if (typeof channel !== "string")
      throw new TypeError("Channel must be a non-empty string.");
    if (this.connected && channel === this.voiceChannel) {
      throw new ReferenceError(`Player is already connected to ${channel}`);
    }
    this.voiceChannel = channel;
    if (options) {
      this.mute = options.mute ?? this.mute;
      this.deaf = options.deaf ?? this.deaf;
    }
    this.connect({
      deaf: this.deaf,
      guildId: this.guildId,
      voiceChannel: this.voiceChannel,
      textChannel: this.textChannel,
      mute: this.mute
    });
    return this;
  }
  disconnect() {
    if (!this.voiceChannel) {
      return;
    }
    this.connected = false;
    this.send({
      guild_id: this.guildId,
      channel_id: null,
      self_mute: false,
      self_deaf: false
    });
    this.voiceChannel = null;
    return this;
  }
  async restart() {
    if (!this.current?.track && !this.queue.length)
      return;
    if (!this.current?.track)
      return await this.play();
    await this.node.rest.updatePlayer({
      guildId: this.guildId,
      data: {
        position: this.position,
        track: this.current
      }
    });
    return this;
  }
  destroy() {
    this.disconnect();
    this.node.rest.destroyPlayer(this.guildId);
    this.riffy.emit("playerDisconnect", this);
    this.riffy.players.delete(this.guildId);
  }
  async handleEvent(payload) {
    const player = this.riffy.players.get(payload.guildId);
    if (!player)
      return;
    const track = this.current;
    switch (payload.type) {
      case "TrackStartEvent":
        this.trackStart(player, track, payload);
        break;
      case "TrackEndEvent":
        this.trackEnd(player, track, payload);
        break;
      case "TrackExceptionEvent":
        this.trackError(player, track, payload);
        break;
      case "TrackStuckEvent":
        this.trackStuck(player, track, payload);
        break;
      case "WebSocketClosedEvent":
        this.socketClosed(player, payload);
        break;
      default:
        const error = new Error(`Node encountered an unknown event: '${payload.type}'`);
        this.riffy.emit("nodeError", this, error);
        break;
    }
  }
  trackStart(player, track, payload) {
    this.playing = true;
    this.paused = false;
    this.riffy.emit("trackStart", player, track, payload);
  }
  trackEnd(player, track, payload) {
    this.previous = track;
    if (this.loop === "track") {
      player.queue.unshift(this.previous);
      this.riffy.emit("trackEnd", player, track, payload);
      return player.play();
    } else if (track && this.loop === "queue") {
      player.queue.push(this.previous);
      this.riffy.emit("trackEnd", player, track, payload);
      return player.play();
    }
    if (player.queue.length === 0) {
      this.playing = false;
      return this.riffy.emit("queueEnd", player);
    } else if (player.queue.length > 0) {
      this.riffy.emit("trackEnd", player, track, payload);
      return player.play();
    }
    this.playing = false;
    this.riffy.emit("queueEnd", player);
  }
  trackError(player, track, payload) {
    this.riffy.emit("trackError", player, track, payload);
    this.stop();
  }
  trackStuck(player, track, payload) {
    this.riffy.emit("trackStuck", player, track, payload);
    this.stop();
  }
  socketClosed(player, payload) {
    if ([4015, 4009].includes(payload.code)) {
      this.send({
        guild_id: payload.guildId,
        channel_id: this.voiceChannel,
        self_mute: this.mute,
        self_deaf: this.deaf
      });
    }
    this.riffy.emit("socketClosed", player, payload);
    this.pause(true);
    this.riffy.emit("debug", this.guildId, "Player paused, channel deleted, Or Client was kicked");
  }
  set(key, value) {
    return this.data[key] = value;
  }
  get(key) {
    return this.data[key];
  }
  send(data) {
    this.riffy.send({ op: 4, d: data });
  }
};

// src/structures/Plugins.ts
var Plugin2 = class {
  name;
  constructor(name) {
    this.name = name;
  }
  load(riffy) {
  }
  unload(riffy) {
  }
};

// src/structures/Queue.ts
var Queue = class extends Array {
  get size() {
    return this.length;
  }
  get first() {
    return this.length ? this[0] : null;
  }
  add(track) {
    this.push(track);
    return this;
  }
  remove(index) {
    if (index >= 0 && index < this.length) {
      return this.splice(index, 1)[0];
    } else {
      throw new Error("Index out of range");
    }
  }
  clear() {
    this.length = 0;
  }
  shuffle() {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }
  }
};

// src/structures/Rest.ts
var Rest = class {
  riffy;
  url;
  sessionId;
  password;
  version;
  calls;
  leastUsedNodes = [];
  constructor(riffy, options) {
    this.riffy = riffy;
    this.url = `http${options.secure ? "s" : ""}://${options.host}${options.port ? `:${options.port}` : ""}`;
    this.sessionId = options.sessionId;
    this.password = options.password;
    this.version = options.restVersion;
    this.calls = 0;
  }
  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }
  async makeRequest(method, endpoint, body = null) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.password
    };
    const requestOptions = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    };
    try {
      const response = await fetch(this.url + endpoint, requestOptions);
      this.calls++;
      if (response.status === 204) {
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error making request:", error);
      return null;
    }
  }
  async getPlayers() {
    return this.makeRequest("GET", `/${this.version}/sessions/${this.sessionId}/players`);
  }
  async updatePlayer(options) {
    const res = await this.makeRequest("PATCH", `/${this.version}/sessions/${this.sessionId}/players/${options.guildId}?noReplace=false`, options.data);
    this.riffy.emit("res", options.guildId, res);
    return res;
  }
  async destroyPlayer(guildId) {
    return this.makeRequest("DELETE", `/${this.version}/sessions/${this.sessionId}/players/${guildId}`);
  }
  async getTracks(identifier) {
    return this.makeRequest("GET", `/${this.version}/loadtracks?identifier=${encodeURIComponent(identifier)}`);
  }
  async decodeTrack(track, node) {
    if (!node)
      node = this.leastUsedNodes[0];
    return this.makeRequest(`GET`, `/${this.version}/decodetrack?encodedTrack=${encodeURIComponent(track)}`);
  }
  async decodeTracks(track) {
    return await this.makeRequest(`POST`, `/${this.version}/decodetracks`, track);
  }
  async getStats() {
    return this.makeRequest("GET", `/${this.version}/stats`);
  }
  async getInfo() {
    return this.makeRequest("GET", `/${this.version}/info`);
  }
  async getRoutePlannerStatus() {
    return await this.makeRequest(`GET`, `/${this.version}/routeplanner/status`);
  }
  async getRoutePlannerAddress(address) {
    return this.makeRequest(`POST`, `/${this.version}/routeplanner/free/address`, { address });
  }
  async parseResponse(req) {
    try {
      this.riffy.emit("raw", "Rest", await req.json());
      return await req.json();
    } catch (error) {
      console.error("Error parsing response:", error);
      return null;
    }
  }
};

// src/functions/fetchImage.ts
async function getImageUrl(info) {
  if (info.sourceName === "spotify") {
    try {
      const match = info.uri.match(/track\/([a-zA-Z0-9]+)/);
      if (match) {
        const res = await fetch(`https://open.spotify.com/oembed?url=${info.uri}`);
        const json = await res.json();
        return json.thumbnail_url;
      }
    } catch (error) {
      return null;
    }
  }
  if (info.sourceName === "soundcloud") {
    try {
      const res = await fetch(`https://soundcloud.com/oembed?format=json&url=${info.uri}`);
      const json = await res.json();
      const thumbnailUrl = json.thumbnail_url;
      return thumbnailUrl;
    } catch (error) {
      return null;
    }
  }
  if (info.sourceName === "youtube") {
    const maxResUrl = `https://img.youtube.com/vi/${info.identifier}/maxresdefault.jpg`;
    const hqDefaultUrl = `https://img.youtube.com/vi/${info.identifier}/hqdefault.jpg`;
    const mqDefaultUrl = `https://img.youtube.com/vi/${info.identifier}/mqdefault.jpg`;
    const defaultUrl = `https://img.youtube.com/vi/${info.identifier}/default.jpg`;
    try {
      const maxResResponse = await fetch(maxResUrl);
      if (maxResResponse.ok) {
        return maxResUrl;
      } else {
        const hqDefaultResponse = await fetch(hqDefaultUrl);
        if (hqDefaultResponse.ok) {
          return hqDefaultUrl;
        } else {
          const mqDefaultResponse = await fetch(mqDefaultUrl);
          if (mqDefaultResponse.ok) {
            return mqDefaultUrl;
          } else {
            const defaultResponse = await fetch(defaultUrl);
            if (defaultResponse.ok) {
              return defaultUrl;
            } else {
              return null;
            }
          }
        }
      }
    } catch (error) {
      return null;
    }
  }
  return null;
}

// src/structures/Track.ts
var escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
var Track = class {
  track;
  info;
  constructor(data, requester) {
    this.track = data.encoded;
    this.info = {
      identifier: data.info.identifier,
      seekable: data.info.isSeekable,
      author: data.info.author,
      length: data.info.length,
      stream: data.info.isStream,
      position: data.info.position,
      title: data.info.title,
      uri: data.info.uri,
      requester: requester || null,
      sourceName: data.info.sourceName,
      _cachedThumbnail: data.info.thumbnail ?? null,
      get thumbnail() {
        if (data.info.thumbnail)
          return data.info.thumbnail;
        if (data.info.artworkUrl) {
          this._cachedThumbnail = data.info.artworkUrl;
          return data.info.artworkUrl;
        } else {
          return !this._cachedThumbnail ? this._cachedThumbnail = getImageUrl(this) : this._cachedThumbnail ?? null;
        }
      },
      isrc: data.info.isrc
    };
  }
  async resolve(riffy) {
    try {
      const query = [this.info.author, this.info.title].filter(Boolean).join(" - ");
      const result = await riffy.resolve({ query, source: riffy.options.defaultSearchPlatform, requester: this.info.requester });
      if (!result || result.tracks.length === 0) {
        return;
      }
      const officialAudio = result.tracks.find((track) => {
        const author = [this.info.author, `${this.info.author} - Topic`];
        return author.some((name) => new RegExp(`^${escapeRegExp(name)}$`, "i").test(track.info.author)) || new RegExp(`^${escapeRegExp(this.info.title)}$`, "i").test(track.info.title);
      });
      if (officialAudio) {
        this.info.identifier = officialAudio.info.identifier;
        this.track = officialAudio.track;
        return this;
      }
      if (this.info.length) {
        const sameDuration = result.tracks.find((track) => Math.abs(track.info.length - (this.info.length || 0)) <= 2e3);
        if (sameDuration) {
          this.info.identifier = sameDuration.info.identifier;
          this.track = sameDuration.track;
          return this;
        }
        const sameDurationAndTitle = result.tracks.find((track) => track.info.title === this.info.title && Math.abs(track.info.length - (this.info.length || 0)) <= 2e3);
        if (sameDurationAndTitle) {
          this.info.identifier = sameDurationAndTitle.info.identifier;
          this.track = sameDurationAndTitle.track;
          return this;
        }
      }
      this.info.identifier = result.tracks[0].info.identifier;
      this.track = result.tracks[0].track;
      return this;
    } catch (error) {
      console.error("Error resolving track:", error);
      return;
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Connection,
  Filters,
  Node,
  Player,
  Plugin,
  Queue,
  Rest,
  Riffy,
  Track
});
