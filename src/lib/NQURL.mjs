
const _locationParser  = document.createElement("a");

const kSchemePortMap = {
  ftp: 21,
  ssh: 22,
  smb: 445,
  http: 80,
  https: 443,
  ws: 80, 
  wss: 443,
  git: 9418,
};

const protocolToPort = (protocol) => {
  if (protocol) {
    protocol = this._protocol.slice(0, -1);
    if (kSchemePortMap.hasOwnProperty(protocol)) {
      return kSchemePortMap[protocol].toString();
    }
  }
  return "";
};

export default class NQURL {
  constructor(params) {
    if (typeof params === "string") {
      this.href = params;
    }
    else {
      this._init(params);
    }
  }

  _init({ href, protocol, host, hostname, port, pathname, hash, search, origin }) {
    this._href = href;
    this._protocol = protocol;
    this._host = host;
    this._hostname = hostname;
    this._port = port;
    this._pathname = pathname;
    this._hash = hash;
    this._search = search;
    this._origin = origin;
  }

  get href() {
    if (!this._href) {
      const protocol = this._protocol && this._protocol + "//";
      const path = this._pathname && this._pathname != "/" && this._pathname;
      const port = this.isDefaultPort() ? "" : `:${this._port}`;
      this._href = `${protocol}${this.__hostname}${port}${path}${this._search}${this._hash}`;
    }
    return this._href;
  }

  set href(value) {
    _locationParser.href = value;
    this._init(_locationParser);
  }

  get protocol() {
    return this._protocol;
  }

  set protocol(value) {
    this._protocol = value;
    this._href = "";
  }

  get host() {
    return this._host;
  }

  set host(value) {
    this._host = value;
    this._href = "";
  }

  get hostname() {
    return this._hostname;
  }

  set hostname(value) {
    this._hostname = value;
    this._href = "";
  }

  get port() {
    return this._port;
  }

  set port(value) {
    this._port = value;
    this._href = "";
  }

  get pathname() {
    return this._pathname;
  }

  set pathname(value) {
    this._pathname = value;
    this._href = "";
  }

  get hash() {
    return this._hash;
  }

  set hash(value) {
    this._hash = value;
    this._href = "";
  }

  get search() {
    return this._search;
  }

  set search(value) {
    this._search = value;
    this._href = "";
  }

  get origin() {
    return this._origin;
  }

  isDefaultPort() {
    if (this._port) {
      return !!protocolToPort(this._protocol);
    }
    return true;
  }
  
  toString() {
    return this.href;
  }

  static parse(href) {
    return new NQURL(href);
  }
};
