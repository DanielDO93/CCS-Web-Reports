import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  FormGroup,
  Label,
  Form
} from "reactstrap";
//import Iframe from 'react-iframe'
import withAuth from "../../components/withAuth";
import API_CCS from "../../components/API_CCS";
//import ReportViewer from 'reactreportviewer'
import ReportViewer from "../../components/ReportViewer";

class Reportes extends Component {
  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Cargando...</div>
  );

  state = {
    data: null,
    path: "",
    parametersForm: []
  };

  getQueryString() {
    var parameters = this.state.parametersForm;

    var queryString = "";

    parameters.forEach(data => {
      queryString = queryString + data.key + "=" + this.state[data.key] + "&";
    });

    var trimedQuery = queryString.substring(0, queryString.length - 1);
    return trimedQuery;
  }

  async populateReports() {
    var reportesJSON = await this.requestReportes();

    return reportesJSON.map(function(data, i) {
      return (
        <option key={data.id} value={data.path}>
          {data.name}
        </option>
      );
    });
  }

  renderForm(model) {
    let formUI = model.map(m => {
      let key = m.key;
      let type = m.type || "text";
      let props = m.props || {};
      let name = m.name;
      let value = m.value;

      let target = key;
      value = this.state[target] || "";

      let input = (
        <input
          {...props}
          id={key}
          type={type}
          key={key}
          className="form-control"
          name={name}
          value={value}
          onChange={e => {
            this.handleChange(e, target, type);
          }}
        />
      );

      if (type === "select") {
        if (m.options === undefined) {
          input = "";
        } else {
          input = m.options.map(o => {
            return (
              <option
                {...props}
                className="form-control"
                key={o.key}
                value={o.value}
              >
                {o.value}
              </option>
            );
          });
        }

        input = (
          <select
            {...props}
            id={key}
            value={value}
            className="form-control"
            onChange={e => {
              this.handleChange(e, m.key, type);
            }}
          >
            <option value="">-Selecciona-</option>
            {input}
          </select>
        );
      }

      return (
        <Col className="col-sm-6" key={"g" + key}>
          <FormGroup key={"g" + key}>
            <Label key={"l" + key} htmlFor={key}>
              {m.label}
            </Label>
            {input}
          </FormGroup>
        </Col>
      );
    });

    return formUI;
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.API_CCS = new API_CCS();
  }

  async componentDidMount() {
    this.setState({
      reports: await this.populateReports(await this.requestReportes())
    });
  }

  handleChange(e, key, type) {
    this.setState({
      [key]: [e.target.value]
    });
  }

  async handleChangeInput(e) {
    this.setState({
      report: e.target.value
    });

    var data = await this.requestParameters(e.target.value);

    var parametros = data.Parameters.Parameter;

    var model = [];

    parametros.forEach(async datos => {
      var tipo = "";

      if (datos.Type === "DateTime") {
        tipo = "date";
      } else {
        tipo = "select";
      }

      var parameter = {
        key: datos.Name,
        label: datos.Prompt,
        type: tipo,
        props: { required: true }
      };

      model.push(parameter);

      this.fillSelects(datos.Name);
    });

    this.setState({
      parametersForm: model
    });
  }

  async fillSelects(parameter) {

    parameter = parameter.replace(/\s+/g, '');
    //console.log(parameter);

    

    var list = "";

    if (parameter === "CAMPANIA") {
      list = await this.requestParameterCatalog("CAMPANIAS");
      
      list.forEach(option => {
        var o = document.createElement("option");
        o.value = option.id_campania;
        o.text = option.Result;
        document.getElementById("CAMPANIA").appendChild(o);
      });
    } else if (parameter === "AGRUPADO") {
      list = await this.requestParameterCatalog("AGRUPADO");
      list.forEach(option => {
        var o = document.createElement("option");
        o.value = option.id;
        o.text = option.Agrupado;
        document.getElementById("AGRUPADO").appendChild(o);
      });
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();

    this.setState({
      path: this.state.report,
      parametersString: this.getQueryString()
    });
  }

  requestReportes = async () => {
    const response = await this.API_CCS.getReportes(this.props.user.campania);
    return response;
  };

  requestParameters = async path => {
    const response = await this.API_CCS.getParameters(path);
    return response;
  };

  requestParameterCatalog = async param => {
    const response = await this.API_CCS.getParameterCatalog(param);
    return response;
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <Card>
              <CardHeader className="text-center">Reportes</CardHeader>
              <CardBody className="text-center">
                <Form onSubmit={this.handleFormSubmit}>
                  <Row>
                    <Col className="col-sm-6">
                      <FormGroup>
                        <Label>Reporte</Label>

                        <select
                          className="form-control"
                          required
                          onChange={this.handleChangeInput}
                        >
                          <option value=""> -Selecciona- </option>
                          {this.state.reports}
                        </select>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>{this.renderForm(this.state.parametersForm)}</Row>

                  <Row>
                    <Col>
                      <button type="submit" className="btn btn-primary">
                        Ejecutar
                      </button>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <h4>&nbsp;</h4>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <ReportViewer
                        server={"https://reportes.ccscontactcenter.com/reports"}
                        path={this.state.path}
                        showtoolbar="true"
                        showparameters="false"
                        parameters={this.state.parametersString}
                      />
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withAuth(Reportes);
