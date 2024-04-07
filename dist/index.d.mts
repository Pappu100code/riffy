import WebSocket from 'ws';
import { EventEmitter } from 'events';

interface VoiceData {
    sessionId: string | null;
    token: string | null;
    endpoint: string | null;
}
interface MemberData {
    user: {
        username: string;
        public_flags: number;
        id: string;
        global_name: string;
        display_name: string;
        discriminator: string;
        bot: boolean;
        avatar_decoration_data: string;
        avatar: string;
    };
    roles: string[];
    premium_since: string;
    pending: boolean;
    nick: string;
    mute: boolean;
    joined_at: string;
    flags: number;
    deaf: boolean;
    communication_disabled_until: string;
    avatar: string;
}
declare class Connection {
    player: Player;
    sessionId: string | null;
    region: string | null;
    voice: VoiceData;
    self_mute: boolean;
    self_deaf: boolean;
    constructor(player: Player);
    setServerUpdate(data: {
        guild_id: string;
        endpoint: string;
        token: string;
    }): void;
    setStateUpdate(data: {
        member: MemberData;
        user_id: string;
        suppress: boolean;
        session_id: string;
        self_video: boolean;
        self_mute: boolean;
        self_deaf: boolean;
        request_to_speak_timestamp: string;
        mute: boolean;
        guild_id: string;
        deaf: boolean;
        channel_id: string | null;
    }): void;
    private updatePlayerVoiceData;
}

/**
 * There are 15 bands (0-14) that can be changed. "gain" is the multiplier for the given band. The default value is 0. Valid values range from -0.25 to 1.0, where -0.25 means the given band is completely muted, and 0.25 means it is doubled. Modifying the gain could also change the volume of the output.
 * @interface
 * @property {number} band The band (0 to 14)
 * @property {number} gain The gain (-0.25 to 1.0)
 *
 */
interface Band {
    band: number;
    gain: number;
}
/**
 * Uses equalization to eliminate part of a band, usually targeting vocals.
 * @interface
 * @property {number} level The level (0 to 1.0 where 0.0 is no effect and 1.0 is full effect)
 * @property {number} monoLevel The mono level (0 to 1.0 where 0.0 is no effect and 1.0 is full effect)
 * @property {number} filterBand The filter band (in Hz)
 * @property {number} filterWidth The filter width
 *
 */
interface karaokeOptions {
    level?: number;
    monoLevel?: number;
    filterBand?: number;
    filterWidth?: number;
}
/**
 * Changes the speed, pitch, and rate. All default to 1.0.
 * @interface
 * @property {number} speed The playback speed 0.0 ≤ x
 * @property {number} pitch The pitch 0.0 ≤ x
 * @property {number} rate The rate 0.0 ≤ x
 *
 */
interface timescaleOptions {
    speed?: number;
    pitch?: number;
    rate?: number;
}
/**
 * Uses amplification to create a shuddering effect, where the volume quickly oscillates. Demo: https://en.wikipedia.org/wiki/File:Fuse_Electronics_Tremolo_MK-III_Quick_Demo.ogv
 * @interface
 * @property {number} frequency The frequency 0.0 < x
 * @property {number} depth The tremolo depth 0.0 < x ≤ 1.0
 */
interface tremoloOptions {
    frequency?: number;
    depth?: number;
}
/**
 * Similar to tremolo. While tremolo oscillates the volume, vibrato oscillates the pitch.
 * @interface
 * @property {number} frequency The frequency 0.0 < x ≤ 14.0
 * @property {number} depth The vibrato depth 0.0 < x ≤ 1.0
 *
 */
interface vibratoOptions {
    frequency?: number;
    depth?: number;
}
/**
 * Rotates the sound around the stereo channels/user headphones (aka Audio Panning). It can produce an effect similar to https://youtu.be/QB9EB8mTKcc (without the reverb).
 * @interface
 * @property {number} rotationHz The frequency of the audio rotating around the listener in Hz. 0.2 is similar to the example video above
 *
 */
interface rotationOptions {
    rotationHz?: number;
}
/**
 * Distortion effect. It can generate some pretty unique audio effects.
 * @interface
 * @property {number} sinOffset The sin offset
 * @property {number} sinScale The sin scale
 * @property {number} cosOffset The cos offset
 * @property {number} cosScale The cos scale
 * @property {number} tanOffset The tan offset
 * @property {number} tanScale The tan scale
 * @property {number} offset The offset
 * @property {number} scale The scale
 *
 */
interface distortionOptions {
    sinOffset?: number;
    sinScale?: number;
    cosOffset?: number;
    cosScale?: number;
    tanOffset?: number;
    tanScale?: number;
    offset?: number;
    scale?: number;
}
/**
 * Mixes both channels (left and right), with a configurable factor on how much each channel affects the other. With the defaults, both channels are kept independent of each other. Setting all factors to 0.5 means both channels get the same audio.
 * @interface
 * @property {number} leftToLeft The left to left channel mix factor (0.0 ≤ x ≤ 1.0)
 * @property {number} leftToRight The left to right channel mix factor (0.0 ≤ x ≤ 1.0)
 * @property {number} rightToLeft The right to left channel mix factor (0.0 ≤ x ≤ 1.0)
 * @property {number} rightToRight The right to right channel mix factor (0.0 ≤ x ≤ 1.0)
 *
 */
interface channelMixOptions {
    leftToLeft?: number;
    leftToRight?: number;
    rightToLeft?: number;
    rightToRight?: number;
}
/**
 * Higher frequencies get suppressed, while lower frequencies pass through this filter, thus the name low pass. Any smoothing values equal to or less than 1.0 will disable the filter.
 * @interface
 * @property {number} smoothing The smoothing factor (1.0 < x)
 */
interface lowPassOptions {
    smoothing?: number;
}
interface FiltersOptions {
    volume: number | null;
    equalizer: Band[];
    karaoke: karaokeOptions | null;
    tremolo: tremoloOptions | null;
    vibrato: vibratoOptions | null;
    rotation: rotationOptions | null;
    distortion: distortionOptions | null;
    channelMix: channelMixOptions | null;
    lowPass: lowPassOptions | null;
    timescale: timescaleOptions | null;
    bassboost: number | null;
    slowmode: boolean | null;
    nightcore: boolean | null;
    vaporwave: boolean | null;
    _8d: boolean | null;
}
declare class Filters {
    player: Player;
    volume: number | null;
    equalizer: Band[];
    karaoke: karaokeOptions | null;
    timescale: timescaleOptions | null;
    tremolo: tremoloOptions | null;
    vibrato: vibratoOptions | null;
    rotation: rotationOptions | null;
    distortion: distortionOptions | null;
    channelMix: channelMixOptions | null;
    lowPass: lowPassOptions | null;
    bassboost: number | null;
    slowmode: boolean | null;
    nightcore: boolean | null;
    vaporwave: boolean | null;
    _8d: boolean | null;
    constructor(player: Player, options?: FiltersOptions);
    setEqualizer(band: Band[]): this | undefined;
    setKaraoke(options: karaokeOptions | null): this | undefined;
    setTimescale(options: timescaleOptions | null): this | undefined;
    setTremolo(options: tremoloOptions | null): this | undefined;
    setVibrato(options: vibratoOptions | null): this | undefined;
    setRotation(options: rotationOptions | null): this | undefined;
    setDistortion(options: distortionOptions | null): this | undefined;
    setChannelMix(options: channelMixOptions | null): this | undefined;
    setLowPass(options: lowPassOptions | null): this | undefined;
    setBassboost(value: number): null | undefined;
    setSlowmode(value: boolean): void;
    setNightcore(value: boolean): void;
    setVaporwave(value: boolean): void;
    set8D(value: boolean): void;
    clearFilters(): Promise<this>;
    updateFilters(): Promise<this>;
}

type RestVersion = "v3" | "v4";
type SearchPlatform = "ytsearch" | "ytmsearch" | "scsearch" | "spsearch" | "amsearch" | "dzsearch" | "ymsearch";
interface NodeOptions {
    restVersion?: RestVersion;
    send: (payload: {
        op: number;
        d: {
            guild_id: string;
            channel_id: string;
            self_deaf: boolean;
            self_mute: boolean;
        };
    }) => void;
    defaultSearchPlatform?: SearchPlatform;
    resumeKey?: string;
    sessionId?: string;
    resumeTimeout?: number;
    autoResume?: boolean;
    reconnectTimeout?: number;
    reconnectTries?: number;
    plugins?: Plugin[];
}
interface RestOptions {
    name?: string;
    host: string;
    port: number;
    secure: boolean;
    sessionId?: string;
    password: string;
    restVersion?: string;
}
interface payloadOption {
    encodedTrack?: string;
    track?: string;
    guildId?: string;
    op?: string;
    type?: string;
}
interface RiffyEvents {
    nodeConnect: (node: Node) => void;
    nodeDisconnect: (node: Node, reason: string) => void;
    nodeReconnect: (node: Node) => void;
    nodeError: (node: Node, error: string) => void;
    trackStart: (player: Player, track: Track, payload: payloadOption) => void;
    trackEnd: (player: Player, track: Track, payload: payloadOption) => void;
    trackError: (player: Player, track: Track, payload: payloadOption) => void;
    trackStuck: (player: Player, track: Track, payload: payloadOption) => void;
    socketClosed: (player: Player, payload: payloadOption) => void;
    playerCreate: (player: Player) => void;
    playerDisconnect: (player: Player) => void;
    playerMove: (player: Player) => void;
    playerUpdate: (player: Player, payload: {
        state: {
            connected: boolean;
            position: number;
            ping: number;
            time: number;
        };
    }) => void;
    queueEnd: (player: Player) => void;
}
declare interface Riffy {
    on<K extends keyof RiffyEvents>(event: K, listener: RiffyEvents[K]): this;
}
declare class Riffy extends EventEmitter {
    client: any;
    nodes: RestOptions;
    nodeMap: Map<string, Node>;
    players: Map<string, Player>;
    options: NodeOptions;
    clientId: string | null;
    initiated: boolean;
    send: Function;
    defaultSearchPlatform: string;
    restVersion: RestVersion;
    tracks: Track[];
    loadType: string | any;
    playlistInfo: any;
    pluginInfo: any;
    plugins: Plugin[];
    version: string;
    constructor(client: any, nodes: RestOptions, options: NodeOptions);
    get leastUsedNodes(): Node[];
    init(clientId: string): this | undefined;
    createNode(options: RestOptions): Node;
    destroyNode(identifier: string): void;
    updateVoiceState(packet: any): void;
    fetchRegion(region: string): Node[];
    createConnection(options: any): Player;
    createPlayer(node: Node, options: any): Player;
    destroyPlayer(guildId: string): void;
    removeConnection(guildId: string): void;
    resolve({ query, source, requester }: any): Promise<this>;
    get(guildId: string): Player;
}

interface NodeStats {
    players: number;
    playingPlayers: number;
    memory: {
        reservable: number;
        used: number;
        free: number;
        allocated: number;
    };
    frameStats: {
        sent: number;
        deficit: number;
        nulled: number;
    };
    cpu: {
        cores: number;
        systemLoad: number;
        lavalinkLoad: number;
    };
    uptime: number;
}
declare class Node {
    riffy: Riffy;
    name?: string;
    host: string;
    port: number;
    password: string;
    restVersion?: RestVersion;
    secure: boolean;
    sessionId?: string;
    rest: Rest;
    readonly restURL: string;
    readonly socketURL: string;
    ws: WebSocket | null;
    regions: string | null;
    stats: NodeStats;
    connected: boolean;
    resumeKey: string | null;
    resumeTimeout: number;
    autoResume: boolean;
    reconnectTimeout: number;
    reconnectTries: number;
    reconnectAttempt: NodeJS.Timeout | null;
    reconnectAttempted: number;
    constructor(riffy: Riffy, node: RestOptions, options: NodeOptions);
    connect(): void;
    open(): void;
    error(error: string): void;
    message(msg: WebSocket.Data): void;
    close(event: number, reason: string): void;
    reconnect(): void;
    destroy(): void;
    send(payload: any): void;
    disconnect(): void;
    get penalties(): number;
}

type Loop = "none" | "track" | "queue";
interface PlayerOptions {
    guildId: string;
    textChannel: string;
    voiceChannel: string;
    mute?: boolean;
    deaf?: boolean;
    volume?: number;
    loop?: Loop;
}
declare class Player extends EventEmitter {
    riffy: Riffy;
    node: Node;
    connection: Connection;
    filters: Filters;
    queue: Queue;
    options: PlayerOptions;
    guildId: string;
    textChannel: string;
    voiceChannel: string | null;
    mute: boolean;
    deaf: boolean;
    volume: number;
    loop: Loop;
    data: any;
    position: number;
    current: Track | null;
    previous: Track | null;
    playing: boolean;
    paused: boolean;
    connected: boolean;
    timestamp: number;
    ping: number;
    isAutoplay: boolean;
    constructor(riffy: Riffy, node: Node, options: PlayerOptions);
    play(): Promise<this | undefined>;
    autoplay(player: Player): Promise<void | this>;
    connect(options: {
        guildId: string;
        voiceChannel: string;
        textChannel?: string;
        deaf?: boolean;
        mute?: boolean;
    }): void;
    stop(): void;
    pause(toggle?: boolean): this;
    seek(position: number): void;
    setVolume(volume: number): this;
    setLoop(mode: Loop): this;
    setTextChannel(channel: string): this;
    setVoiceChannel(channel: string, options?: {
        mute?: boolean;
        deaf?: boolean;
    }): this;
    disconnect(): this | undefined;
    restart(): Promise<this | undefined>;
    destroy(): void;
    handleEvent(payload: any): Promise<void>;
    trackStart(player: Player, track: Track, payload: {
        encodedTrack?: string;
        track?: string;
        guildId?: string;
        op?: string;
        type?: string;
    }): void;
    trackEnd(player: Player, track: Track, payload: {
        encodedTrack?: string;
        track?: string;
        reason?: string;
        guildId?: string;
        op?: string;
        type?: string;
    }): boolean | Promise<Player | undefined> | undefined;
    trackError(player: Player, track: Track, payload: {
        track?: string;
        exception?: {
            message?: string;
            severity?: string;
            cause?: string;
        };
    }): void;
    trackStuck(player: Player, track: Track, payload: {
        track?: string;
        thresholdMs?: number;
    }): void;
    socketClosed(player: Player, payload: {
        guildId?: string;
        code: number;
        reason?: string;
        byRemote?: boolean;
        op?: string;
    }): void;
    set(key: string, value: any): any;
    get(key: string): any;
    send(data: any): void;
}

declare class Plugin {
    name: string;
    constructor(name: string);
    load(riffy: Riffy): void;
    unload(riffy: Riffy): void;
}

declare class Queue extends Array {
    get size(): number;
    get first(): any;
    add(track: Track): this;
    remove(index: number): any;
    clear(): void;
    shuffle(): void;
}

declare class Rest {
    riffy: Riffy;
    url: string;
    sessionId?: string;
    password: string;
    version?: string;
    calls: number;
    leastUsedNodes: Node[];
    constructor(riffy: Riffy, options: RestOptions);
    setSessionId(sessionId: string): void;
    makeRequest(method: string, endpoint: string, body?: object | any): Promise<object | any>;
    getPlayers(): Promise<any>;
    updatePlayer(options: {
        guildId: string;
        data: object | any;
    }): Promise<any>;
    destroyPlayer(guildId: string): Promise<any>;
    getTracks(identifier: string): Promise<any>;
    decodeTrack(track: any, node: Node): Promise<any>;
    decodeTracks(track: Track): Promise<any>;
    getStats(): Promise<any>;
    getInfo(): Promise<any>;
    getRoutePlannerStatus(): Promise<any>;
    getRoutePlannerAddress(address: string | any): Promise<any>;
    parseResponse(req: Request): Promise<any>;
}

interface TrackData {
    encoded: string;
    info: {
        identifier: string;
        isSeekable: boolean;
        author: string;
        length: number;
        isStream: boolean;
        position: number;
        title: string;
        uri: string;
        artworkUrl?: string;
        requester: string;
        sourceName: string;
        isrc?: string;
        thumbnail?: string;
    };
}
declare class Track {
    track: string;
    info: {
        identifier: string;
        seekable: boolean;
        author: string;
        length: number;
        stream: boolean;
        position: number;
        title: string;
        uri: string;
        requester: string | null;
        sourceName: string;
        isrc?: string | any;
        _cachedThumbnail: Awaited<string | null>;
        thumbnail?: string | any;
    };
    constructor(data: TrackData, requester?: string);
    resolve(riffy: Riffy): Promise<this | undefined>;
}

export { Connection, Filters, Node, Player, Plugin, Queue, Rest, Riffy, Track };
