import AuthService from "./AuthService";

export default class API_CCS {
  constructor() {
    this.Auth = new AuthService();
    this.fetch = this.fetch.bind(this); // React binding stuff
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

  salesForceAuth() {
    return this.fetch("https://api.ccscontactcenter.com/v1/auth/salesforceccsauth", {
      method: "GET"
    }).then(res => {
      return Promise.resolve(res);
    });
  }

  getGenerales(tipo, campania, totalizado) {
    return this.fetch(
      "https://api.ccscontactcenter.com/v1/Campaigns/General/General?tipo=" +
        tipo +
        "&campania=" +
        campania +
        "&totalizado=" +
        totalizado,
      {
        method: "GET"
      }
    ).then(res => {
      return Promise.resolve(res);
    });
  }

  getCampaignAvatar(id) {
    return this.fetch(
      "https://api.ccscontactcenter.com/v1/Campaigns/Avatar?id=" + id,
      {
        method: "GET"
      }
    ).then(res => {
      return Promise.resolve(res);
    });
  }

  getResumenEdenred(tipo) {
    return this.fetch(
      "https://api.ccscontactcenter.com/v1/Campaigns/Edenred/Resumen_Edenred?tipo=" +
        tipo,
      {
        method: "GET"
      }
    ).then(res => {
      return Promise.resolve(res);
    });
  }

  getTotalesEdenred(tipo) {
    return this.fetch(
      "https://api.ccscontactcenter.com/v1/Campaigns/Edenred/Totales_Edenred?tipo=" +
        tipo,
      {
        method: "GET"
      }
    ).then(res => {
      return Promise.resolve(res);
    });
  }

  getTeleviaMedioQuejas(tipo) {
    return this.fetch(
      "https://api.ccscontactcenter.com/v1/Campaigns/Televia//Quejas/Medio?tipo=" +
        tipo,
      {
        method: "GET"
      }
    ).then(res => {
      return Promise.resolve(res);
    });
  }

  getTeleviaTop5Motivos(tipo) {
    return this.fetch(
      "https://api.ccscontactcenter.com/v1/Campaigns/Televia//Quejas/Top_5_Motivos?tipo=" +
        tipo,
      {
        method: "GET"
      }
    ).then(res => {
      return Promise.resolve(res);
    });
  }

  getTeleviaTop5Vialidadess(tipo) {
    return this.fetch(
      "https://api.ccscontactcenter.com/v1/Campaigns/Televia//Quejas/Top_5_Vialidades?tipo=" +
        tipo,
      {
        method: "GET"
      }
    ).then(res => {
      return Promise.resolve(res);
    });
  }

  getReportes(campaign) {
    return this.fetch(
      "https://api.ccscontactcenter.com/v1/reports?campaign=" + campaign,
      {
        method: "GET"
      }
    ).then(res => {
      return Promise.resolve(res);
    });
  }

  getParameters(path) {
    return this.fetch(
      "https://api.ccscontactcenter.com/v1/reports/params?path=" + path,
      {
        method: "GET"
      }
    ).then(res => {
      return Promise.resolve(res);
    });
  }

  getParameterCatalog(parameter) {
    return this.fetch(
      "https://api.ccscontactcenter.com/v1/reports/ParamsList?Parametro=" +
        parameter,
      {
        method: "GET"
      }
    ).then(res => {
      return Promise.resolve(res);
    });
  }
}
