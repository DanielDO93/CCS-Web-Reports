export default class SalesforceAPI {
  constructor() {
    this.fetch = this.fetch.bind(this);
  }

  async fetch(url, options) {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("sfToken")
    };

    return fetch(url, {
      headers,
      ...options
    }).then(response => response.json());
  }

  salesforceQuery(query) {
    return this.fetch(
      localStorage.getItem("sfInstance") +
        "/services/data/v42.0/query/?q=" +
        query,
      {
        method: "GET"
      }
    ).then(res => {
      return Promise.resolve(res);
    });
  }
}
