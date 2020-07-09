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
import * as ChartConfig from "../ChartConfig";
import { hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";
import Loader from "react-loader-spinner";
import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";

import withAuth from "../../../components/withAuth";
import API_CCS from "../../../components/API_CCS";
import WidgetCard from "../../../components/charts/WidgetCard";

import moment from "moment";
import "moment/locale/es";

const brandPrimary = "#C00327";
//const brandInfo = getStyle('--info')
const brandColor = "#fc4669";

const customStyles = {
  control: (base, state) => ({
    ...base,
    border: "1px solid #e4e7ea",
    borderRadius: "0.25rem",
    fontSize: "0.875rem",
    boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(192, 3, 39, 0.25)" : 0,
    borderColor: state.isFocused ? brandColor : base.borderColor,
    "&:hover": {
      borderColor: state.isFocused ? brandColor : base.borderColor,
    },
    "&:active": {
      borderColor: state.isFocused ? brandColor : base.borderColor,
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
    this.getNameKPI = this.getNameKPI.bind(this);
    this.selectKPI = this.selectKPI.bind(this);
    this.updateClick = this.updateClick.bind(this);

    this.state = {
      loading: true,
      loadMainGraph: false,
      selectedKPI: 0,
      percentKPI: false,
      selectedInterval: 2,
      mainChartData: {},
      mainChartOpts: {},
      colegios: [],
      selectedColegio: "",
    };

    setInterval(() => this.fetchAll(), 900000);
  }

  async fetchAll() {
    this.setState({ loading: true });

    this.updateMainGraph();

    this.setState({ loading: false });
  }

  async updateMainGraph() {
    this.setState({ loadMainGraph: true });

    var arrayTotales = await this.requestTotales();

    var arrayTop10Colegios = await this.requestTop10Colegios();

    var sChrtL2 = [];
    JSON.stringify(arrayTop10Colegios, (key, value) => {
      if (key === "Tipificacion") sChrtL2.push(value);
      return value;
    });
    var sChrtD2 = [];
    JSON.stringify(arrayTop10Colegios, (key, value) => {
      if (key === "Cuenta") sChrtD2.push(value);
      return value;
    });
    var sChrtD2P = [];
    JSON.stringify(arrayTop10Colegios, (key, value) => {
      if (key === "Porcentaje") sChrtD2P.push(value);
      return value;
    });

    var secondaryChartData2 = {
      labels: sChrtL2,
      datasets: [
        {
          label: "Registros",
          backgroundColor: [
            hexToRgba(brandPrimary, 100),
            hexToRgba(brandPrimary, 80),
            hexToRgba(brandPrimary, 60),
            hexToRgba(brandPrimary, 40),
          ],
          pointHoverBackgroundColor: "#fff",
          borderWidth: 2,
          data: sChrtD2,
        },
        {
          label: "Porcentaje",
          backgroundColor: [
            hexToRgba(brandPrimary, 100),
            hexToRgba(brandPrimary, 80),
            hexToRgba(brandPrimary, 60),
            hexToRgba(brandPrimary, 40),
          ],
          pointHoverBackgroundColor: "#fff",
          borderWidth: 2,
          data: sChrtD2P,
        },
      ],
    };

    var AHTFormat = moment("2015-01-01")
      .startOf("day")
      .seconds(Math.round(arrayTotales[0].AHT).toString())
      .format("H:mm:ss");

    this.setState({
      totalVoz: arrayTotales[0].Entrantes,
      totalAtendidas: arrayTotales[0].Atendidas,
      totalLlamadasSLA: arrayTotales[0].AtendidasSLA,
      totalAbandonadas: arrayTotales[0].Abandonadas,
      totalSLA: (arrayTotales[0].SLA * 100).toPrecision(3) + "%",
      totalABA: (arrayTotales[0].ABA * 100).toPrecision(3) + "%",
      totalAHT: AHTFormat,
      totalQA: (arrayTotales[0].Calidad * 100).toPrecision(3) + "%",
      secondaryChartData2: secondaryChartData2,
    });

    var data = await this.API_CCS.getGenerales(
      this.state.selectedInterval,
      this.props.user.campania,
      0
    );

    var dataLabels = [];

    if (this.state.selectedInterval === 0) {
      JSON.stringify(data, (key, value) => {
        if (key === "Fecha") dataLabels.push(moment.utc(value).format("HH:mm"));
        return value;
      });
    } else if (this.state.selectedInterval === 1) {
      JSON.stringify(data, (key, value) => {
        if (key === "Fecha") dataLabels.push(moment.utc(value).format("dddd"));
        return value;
      });
    } else if (this.state.selectedInterval === 2) {
      JSON.stringify(data, (key, value) => {
        if (key === "Fecha")
          dataLabels.push(moment.utc(value).format("DD/MM/YYYY"));
        return value;
      });
    } else if (this.state.selectedInterval === 3) {
      JSON.stringify(data, (key, value) => {
        if (key === "Fecha")
          dataLabels.push(this.getYear(moment.utc(value).format("DD")));
        return value;
      });
    }

    var dataSet = [];

    if (this.state.selectedKPI === 0) {
      JSON.stringify(data, (key, value) => {
        if (key === this.getNameKPI())
          dataSet.push((value * 100).toPrecision(4));
        return value;
      });
      this.setState({ percentKPI: true });
    } else if (this.state.selectedKPI === 1) {
      JSON.stringify(data, (key, value) => {
        if (key === this.getNameKPI())
          dataSet.push((value * 100).toPrecision(4));
        return value;
      });
      this.setState({ percentKPI: true });
    } else if (this.state.selectedKPI === 2) {
      JSON.stringify(data, (key, value) => {
        if (key === this.getNameKPI()) dataSet.push(value);
        return value;
      });
      this.setState({ percentKPI: false });
    } else if (this.state.selectedKPI === 3) {
      JSON.stringify(data, (key, value) => {
        if (key === this.getNameKPI())
          dataSet.push((value * 100).toPrecision(4));
        return value;
      });
      this.setState({ percentKPI: true });
    }

    var mainChartOpts;

    this.state.percentKPI
      ? (mainChartOpts = {
          tooltips: {
            enabled: false,
            custom: CustomTooltips,
            intersect: true,
            mode: "index",
            position: "nearest",
            callbacks: {
              labelColor: function (tooltipItem, chart) {
                return {
                  backgroundColor:
                    chart.data.datasets[tooltipItem.datasetIndex].borderColor,
                };
              },
              label: function (tooltipItem, data) {
                var label = data.datasets[tooltipItem.datasetIndex].label || "";

                if (label) {
                  label += ": ";
                }
                label += Math.round(tooltipItem.yLabel * 100) / 100;
                return label + "%";
              },
            },
          },
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  drawOnChartArea: false,
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 5,
                  callback: function (tick) {
                    return tick.toString() + "%";
                  },
                },
              },
            ],
          },
          elements: {
            point: {
              radius: 4,
              hitRadius: 10,
              hoverRadius: 4,
            },
          },
          plugins: {
            deferred: {
              delay: 200,
            },
          },
        })
      : (mainChartOpts = {
          tooltips: {
            enabled: false,
            custom: CustomTooltips,
            intersect: true,
            mode: "index",
            position: "nearest",
            callbacks: {
              labelColor: function (tooltipItem, chart) {
                return {
                  backgroundColor:
                    chart.data.datasets[tooltipItem.datasetIndex].borderColor,
                };
              },
            },
          },
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          scales: {
            xAxes: [
              {
                gridLines: {
                  drawOnChartArea: false,
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  maxTicksLimit: 5,
                  callback: function (tick) {
                    return tick.toString();
                  },
                },
              },
            ],
          },
          elements: {
            point: {
              radius: 4,
              hitRadius: 10,
              hoverRadius: 4,
            },
          },
          plugins: {
            deferred: {
              delay: 200,
            },
          },
        });

    this.setState({ mainChartOpts: mainChartOpts });

    var mainChartData = {
      labels: dataLabels,
      datasets: [
        {
          label: this.getNameKPI(),
          backgroundColor: hexToRgba(brandPrimary, 8),
          borderColor: brandPrimary,
          pointHoverBackgroundColor: "#fff",
          borderWidth: 2,
          data: dataSet,
        },
      ],
    };

    this.setState({ mainChartData: mainChartData });

    this.setState({ loadMainGraph: false });
  }

  requestTotales = async () => {
    const response = await this.API_CCS.getGenerales(
      this.state.selectedInterval,
      this.props.user.campania,
      1
    );
    return response;
  };

  requestMedioQuejas = async () => {
    const response = await this.API_CCS.getTeleviaMedioQuejas(
      this.state.selectedInterval
    );
    return response;
  };

  requestTop10Colegios = async () => {
    const response = await this.API_CCS.getTop10Ezetera(
      this.state.selectedInterval,
      this.state.selectedColegio === "" ? "NULL" : this.state.selectedColegio
    );
    return response;
  };

  requestColegios = async () => {
    const response = await this.API_CCS.getColegiosEzetera();
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
      // code block
    }
  }

  getNameKPI() {
    switch (this.state.selectedKPI) {
      case 0:
        return "SLA";
      case 1:
        return "ABA";
      case 2:
        return "AHT";
      case 3:
        return "Calidad";
      default:
    }
  }

  selectKPI(selectedKPI) {
    this.setState({ selectedKPI: selectedKPI }, function () {
      this.updateMainGraph();
    });
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
    var datos = await this.requestColegios();
    this.setState({ colegios: datos });
  }

  handleChangeColegio = (e) => {
    try {
      this.setState({ selectedColegio: e.label }, async () => {
        this.fetchAll();
      });
    } catch (err) {
      this.setState({ selectedColegio: "" }, () => {
        this.fetchAll();
      });
    }
  };

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
              icon="icon-phone"
              color="primary"
              header={this.state.totalVoz}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Total Voz
            </WidgetCard>
            <WidgetCard
              icon="icon-bubble"
              color="primary"
              header={"0"}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Total Chat
            </WidgetCard>
            {/*<WidgetCard
              icon="icon-envelope"
              color="primary"
              header={"0"}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Total Whatsapp
            </WidgetCard>*/}
          </CardGroup>
          <CardGroup className="mb-4">
            <WidgetCard
              icon="icon-speedometer"
              color="primary"
              header={this.state.totalSLA}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Nivel de Servicio
            </WidgetCard>
            <WidgetCard
              icon="icon-people"
              color="primary"
              header={this.state.totalABA}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Abandono
            </WidgetCard>
            <WidgetCard
              icon="icon-notebook"
              color="primary"
              header={this.state.totalAHT}
              value="100"
              loading={this.state.loadMainGraph}
            >
              AHT
            </WidgetCard>
            <WidgetCard
              icon="icon-graph"
              color="primary"
              header={this.state.totalQA}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Calidad
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
                            onClick={() => this.selectKPI(0)}
                            active={this.state.selectedKPI === 0}
                          >
                            SLA
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
                            onClick={() => this.selectKPI(1)}
                            active={this.state.selectedKPI === 1}
                          >
                            ABA
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
                            onClick={() => this.selectKPI(2)}
                            active={this.state.selectedKPI === 2}
                          >
                            AHT
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
                            onClick={() => this.selectKPI(3)}
                            active={this.state.selectedKPI === 3}
                          >
                            QA
                          </Button>
                        </ButtonGroup>
                        <br />
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
                        options={this.state.mainChartOpts}
                        height={300}
                      />
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>

          <CardGroup className="mb-4">
            <WidgetCard
              icon="icon-phone"
              color="primary"
              header={this.state.totalVoz}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Llamadas Recibidas
            </WidgetCard>
            <WidgetCard
              icon="icon-bubble"
              color="primary"
              header={this.state.totalLlamadasSLA}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Llamadas Atendidas &lt; 20''
            </WidgetCard>
            <WidgetCard
              icon="icon-call-in"
              color="primary"
              header={this.state.totalAtendidas}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Total Llamadas Atendidas
            </WidgetCard>
            <WidgetCard
              icon="icon-close"
              color="primary"
              header={this.state.totalAbandonadas}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Llamadas Abandonadas
            </WidgetCard>
          </CardGroup>

          <Row>
            <Col>
              <Card>
                <CardHeader>Top 10 Tipificaciones (Por Colegio)</CardHeader>
                <CardBody>
                  <Select
                    options={this.state.colegios}
                    styles={customStyles}
                    isClearable={true}
                    placeholder={"-Selecciona-"}
                    theme={theme}
                    onChange={this.handleChangeColegio}
                    value={
                      this.state.selectedColegio === ""
                        ? null
                        : {
                            label: this.state.selectedColegio,
                            value: this.state.selectedColegio,
                          }
                    }
                  />
                  <input
                    tabIndex={-1}
                    style={{ opacity: 0, height: 0 }}
                    onChange={(e) => {}}
                    value={this.state.selectedColegio}
                    required
                  />
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
