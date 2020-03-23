export default class SalesforceAPI {
  constructor() {
    this.fetch = this.fetch.bind(this);
  }

  async fetch(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (await this.Auth.loggedIn()) {
      headers["Authorization"] = "Bearer " + (await this.Auth.getToken());
    } else {
      window.location.href = "/login";
    }

    return fetch(url, {
      headers,
      ...options
    })
      .then(this._checkStatus)
      .then(response => response.json());
  }

  salesforceQuery(query) {
    return this.fetch(
      "https://api.ccscontactcenter.com/v1/auth/salesforceQuery",
      {
        method: "GET",
        body: {
          token: localStorage.getItem("sfToken"),
          instance:
            localStorage.getItem("sfInstance") +
            "/services/data/v42.0/query/?q=",
          query: query
        }
      }
    ).then(res => {
      return Promise.resolve(res);
    });
  }
}
