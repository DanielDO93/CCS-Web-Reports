import React, { Component } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chartjs-plugin-deferred";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  Button,
  ButtonGroup,
  CardGroup,
  CardHeader,
} from "reactstrap";
import Select from "react-select";

import { hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";
import Loader from "react-loader-spinner";

import withAuth from "../../../components/withAuth";
import API_CCS from "../../../components/API_CCS";
import WidgetCard from "../../../components/charts/WidgetCard";
import * as ChartConfig from "../ChartConfig";

import moment from "moment";
import "moment/locale/es";

const brandPrimary = "#C00327";

const customStyles = {
  control: (base, state) => ({
    ...base,
    border: "1px solid #e4e7ea",
    borderRadius: "0.25rem",
    fontSize: "0.875rem",
    boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(192, 3, 39, 0.25)" : 0,
    borderColor: state.isFocused ? brandPrimary : base.borderColor,
    "&:hover": {
      borderColor: state.isFocused ? brandPrimary : base.borderColor,
    },
    "&:active": {
      borderColor: state.isFocused ? brandPrimary : base.borderColor,
    },
  }),
};

const theme = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "rgba(192,3,39,.2)",
    primary50: "rgba(192,3,39,.2)",
    primary75: "rgba(192,3,39,.2)",
    primary: "rgba(192,3,39,.8)",
  },
});

class DashboardGenerico extends Component {
  constructor(props) {
    super(props);
    this.API_CCS = new API_CCS();
    this.fetchAll = this.fetchAll.bind(this);
    this.updateMainGraph = this.updateMainGraph.bind(this);
    this.updateClick = this.updateClick.bind(this);

    this.state = {
      loading: true,
      loadMainGraph: false,
      selectedKPI: 0,
      percentKPI: false,
      selectedInterval: 0,
      mainChartData: {},
      mainChartOpts: {},
      totalMarcaciones: 0,
      totalContactos: 0,
      totalEfectivos: 0,
      totalEncuestas: 0,
      baseSeleccionada: "",
      databases: [],
    };

    setInterval(() => this.fetchAll(), 900000);
  }

  handleChangeDBB = (e) => {
    try {
      this.setState({ baseSeleccionada: e.label }, () => {
        this.fetchAll();
      });
    } catch (err) {
      this.setState({ baseSeleccionada: "" }, () => {
        this.fetchAll();
      });
    }
  };

  async fetchAll() {
    this.setState({ loading: true });

    this.updateMainGraph();

    this.setState({ loading: false });
  }

  async updateMainGraph() {
    this.setState({ loadMainGraph: true });

    var arrayTotales = await this.requestTotales();
    var arrayGenerales = await this.requestGenerales();

    this.setState({
      totalMarcaciones: arrayTotales[0].MarcacionesBDD,
      totalContactos: arrayTotales[0].Contactos,
      totalEfectivos: arrayTotales[0].ContactosEfectivos,
      totalEncuestas: arrayTotales[0].Encuestas,
    });

    var marcacionesDataset = [];
    JSON.stringify(arrayGenerales, (key, value) => {
      if (key === "MarcacionesBDD") marcacionesDataset.push(value);
      return value;
    });
    var contactosDataset = [];
    JSON.stringify(arrayGenerales, (key, value) => {
      if (key === "Contactos") contactosDataset.push(value);
      return value;
    });
    var contactosEfectivosDataset = [];
    JSON.stringify(arrayGenerales, (key, value) => {
      if (key === "ContactosEfectivos") contactosEfectivosDataset.push(value);
      return value;
    });
    var encuestasDataset = [];
    JSON.stringify(arrayGenerales, (key, value) => {
      if (key === "Encuestas") encuestasDataset.push(value);
      return value;
    });

    var dataLabels = [];

    if (this.state.selectedInterval === 0) {
      JSON.stringify(arrayGenerales, (key, value) => {
        if (key === "Fecha") dataLabels.push(moment.utc(value).format("HH:mm"));
        return value;
      });
    } else if (this.state.selectedInterval === 1) {
      JSON.stringify(arrayGenerales, (key, value) => {
        if (key === "Fecha") dataLabels.push(moment.utc(value).format("dddd"));
        return value;
      });
    } else if (this.state.selectedInterval === 2) {
      JSON.stringify(arrayGenerales, (key, value) => {
        if (key === "Fecha")
          dataLabels.push(moment.utc(value).format("DD/MM/YYYY"));
        return value;
      });
    } else if (this.state.selectedInterval === 3) {
      JSON.stringify(arrayGenerales, (key, value) => {
        if (key === "Fecha")
          dataLabels.push(this.getYear(moment.utc(value).format("DD")));
        return value;
      });
    }

    var mainChartOpts;

    this.setState({ mainChartOpts: mainChartOpts });

    var mainChartData = {
      labels: dataLabels,
      datasets: [
        {
          label: "Marcaciones",
          backgroundColor: "rgba(0,0,0,0.1)",
          borderColor: hexToRgba("#000000", 100),
          pointHoverBackgroundColor: "#fff",
          borderWidth: 2,
          data: marcacionesDataset,
        },
        {
          label: "Contactos",
          backgroundColor: "rgba(192,3,39,0.1)",
          borderColor: "rgba(192,3,39,0.6)",
          pointHoverBackgroundColor: "#fff",
          borderWidth: 2,
          data: contactosDataset,
        },
        {
          label: "Contactos Efectivos",
          backgroundColor: "rgba(136, 112, 116,0.1)",
          borderColor: "rgba(136, 112, 116,0.5)",
          pointHoverBackgroundColor: "#fff",
          borderWidth: 2,
          data: contactosEfectivosDataset,
        },
        {
          label: "Encuestas",
          backgroundColor: "rgba(192,3,39,0.3)",
          borderColor: "rgba(192,3,39,1)",
          pointHoverBackgroundColor: "#fff",
          borderWidth: 2,
          data: encuestasDataset,
        },
      ],
    };

    this.setState({ mainChartData: mainChartData });

    this.setState({ loadMainGraph: false });
  }

  requestBases = async () => {
    const response = await this.API_CCS.getBasesAltanRedes();
    return response;
  };

  requestTotales = async () => {
    const response = await this.API_CCS.getAltanRedes(
      this.state.selectedInterval,
      1,
      this.state.baseSeleccionada === "" ? "NULL" : this.state.baseSeleccionada
    );
    return response;
  };

  requestGenerales = async () => {
    const response = await this.API_CCS.getAltanRedes(
      this.state.selectedInterval,
      0,
      this.state.baseSeleccionada === "" ? "NULL" : this.state.baseSeleccionada
    );
    return response;
  };

  getYear(numero) {
    switch (numero) {
      case "01":
        return "Enero";
      case "02":
        return "Febrero";
      case "03":
        return "Marzo";
      case "04":
        return "Abril";
      case "05":
        return "Mayo";
      case "06":
        return "Junio";
      case "07":
        return "Julio";
      case "08":
        return "Agosto";
      case "09":
        return "Septiembre";
      case "10":
        return "Octubre";
      case "11":
        return "Noviembre";
      case "12":
        return "Diciembre";
      default:
    }
  }

  selectInterval(selectedInterval) {
    this.setState({ selectedInterval: selectedInterval }, function () {
      this.updateMainGraph();
    });
  }

  updateClick() {
    this.fetchAll();
  }

  async componentDidMount() {
    this.fetchAll();
    var bases = await this.requestBases();
    var basesOK = [];
    bases.forEach((index) => {
      var temp = { value: index.base, label: index.base };
      basesOK.push(temp);
    });

    this.setState({ databases: basesOK });
  }

  render() {
    var today = new Date();
    var mes = this.getYear(moment.utc(today).format("MM"));
    var anio = moment.utc(today).format("YYYY");
    var tagFecha = mes + " " + anio;

    if (this.state.loading) {
      return (
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <Loader type="Bars" color={brandPrimary} height="100" width="100" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="animated fadeIn">
          <CardGroup className="mb-4">
            <WidgetCard
              icon="icon-speedometer"
              color="primary"
              header={this.state.totalMarcaciones}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Marcaciones
            </WidgetCard>
            <WidgetCard
              icon="icon-people"
              color="primary"
              header={this.state.totalContactos}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Contactos
            </WidgetCard>
            <WidgetCard
              icon="icon-notebook"
              color="primary"
              header={this.state.totalEfectivos}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Contactos Efectivos
            </WidgetCard>
            <WidgetCard
              icon="icon-graph"
              color="primary"
              header={this.state.totalEncuestas}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Encuestas
            </WidgetCard>
          </CardGroup>

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      <CardTitle className="h4">Resumen</CardTitle>
                      <div className="small text-muted">{tagFecha}</div>
                    </Col>
                    <div>
                      <Col style={{ float: "right" }}>
                        <div style={{ height: 5 }} />
                        <ButtonGroup className="flex-wrap">
                          <Button
                            className="flex-wrap"
                            style={{
                              width: 87,
                              fontSize: 10,
                              fontWeight: "bold",
                            }}
                            size="sm"
                            color="outline-secondary"
                            onClick={() => this.selectInterval(0)}
                            active={this.state.selectedInterval === 0}
                          >
                            Dia
                          </Button>
                          <Button
                            className="flex-wrap"
                            style={{
                              width: 87,
                              fontSize: 10,
                              fontWeight: "bold",
                            }}
                            size="sm"
                            color="outline-secondary"
                            onClick={() => this.selectInterval(1)}
                            active={this.state.selectedInterval === 1}
                          >
                            Semana
                          </Button>
                          <Button
                            className="flex-wrap"
                            style={{
                              width: 87,
                              fontSize: 10,
                              fontWeight: "bold",
                            }}
                            size="sm"
                            color="outline-secondary"
                            onClick={() => this.selectInterval(2)}
                            active={this.state.selectedInterval === 2}
                          >
                            Mes
                          </Button>
                          <Button
                            className="flex-wrap"
                            style={{
                              width: 87,
                              fontSize: 10,
                              fontWeight: "bold",
                            }}
                            size="sm"
                            color="outline-secondary"
                            onClick={() => this.selectInterval(3)}
                            active={this.state.selectedInterval === 3}
                          >
                            Año
                          </Button>
                        </ButtonGroup>
                        <br />
                        <div style={{ height: 5 }} />
                        <Select
                          options={this.state.databases}
                          styles={customStyles}
                          isClearable={true}
                          placeholder={"-Todas las Bases-"}
                          theme={theme}
                          onChange={this.handleChangeDBB}
                          value={
                            this.state.baseSeleccionada === ""
                              ? null
                              : {
                                  label: this.state.baseSeleccionada,
                                  value: this.state.baseSeleccionada,
                                }
                          }
                        />
                      </Col>
                    </div>
                  </Row>

                  {this.state.loadMainGraph ? (
                    <div
                      style={{
                        height: "340px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div>
                        <Loader
                          type="Oval"
                          color={brandPrimary}
                          height="70"
                          width="70"
                        />{" "}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="chart-wrapper animated fadeIn"
                      style={{ height: 300 + "px", marginTop: 40 + "px" }}
                    >
                      <Line
                        data={this.state.mainChartData}
                        options={ChartConfig.mainChartOpts}
                        height={300}
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <CardHeader>Top 5 </CardHeader>
                <CardBody>
                  <div className="chart-wrapper" style={{ height: 250 + "px" }}>
                    <Bar
                      data={this.state.secondaryChartData2}
                      options={ChartConfig.secondaryChart2}
                      height={250}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      );
    }
  }
}

export default withAuth(DashboardGenerico);
