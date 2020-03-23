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

    return fetch(url, {
      headers,
      ...options
    }).then(response => response.json());
  }

  salesforceQuery(query) {
    var cuerpo = {
      token: localStorage.getItem("sfToken"),
      instance:
        localStorage.getItem("sfInstance") + "/services/data/v42.0/query/?q=",
      query: query
    };

    return this.fetch(
      "https://api.ccscontactcenter.com/v1/auth/salesforceQuery",
      {
        method: "POST",
        body: JSON.stringify(cuerpo)
      }
    ).then(res => {
      return Promise.resolve(res);
    });
  }
}
