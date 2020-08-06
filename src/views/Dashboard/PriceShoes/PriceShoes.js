import React, { Component } from "react";
import { Line } from "react-chartjs-2";
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
  Input,
  Label,
  FormGroup,
} from "reactstrap";

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

class DashboardGenerico extends Component {
  constructor(props) {
    super(props);
    this.API_CCS = new API_CCS();
    this.fetchAll = this.fetchAll.bind(this);
    this.updateMainGraph = this.updateMainGraph.bind(this);
    this.getNameKPI = this.getNameKPI.bind(this);
    this.selectKPI = this.selectKPI.bind(this);
    this.updateClick = this.updateClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      loading: true,
      loadMainGraph: false,
      selectedKPI: 0,
      percentKPI: false,
      selectedInterval: 2,
      mainChartData: {},
      mainChartOpts: {},
      fecha_ini: moment().format("YYYY-MM-DD"),
      fecha_fin: moment().format("YYYY-MM-DD"),
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

    var AHTFormat = moment("2015-01-01")
      .startOf("day")
      .seconds(Math.round(arrayTotales[0].AHT).toString())
      .format("H:mm:ss");

    var ASAFormat = moment("2015-01-01")
      .startOf("day")
      .seconds(Math.round(arrayTotales[0].ASA).toString())
      .format("H:mm:ss");

    this.setState({
      totalSLA: (arrayTotales[0].SLA * 100).toPrecision(3) + "%",
      totalABA: (arrayTotales[0].ABA * 100).toPrecision(3) + "%",
      totalAHT: AHTFormat,
      totalASA: ASAFormat,
      totalQA: (arrayTotales[0].Calidad * 100).toPrecision(3) + "%",
      totalOfrecidas: arrayTotales[0].Entrantes,
      totalAtendidas: arrayTotales[0].Atendidas,
      totalAbandonadas: arrayTotales[0].Abandonadas,
    });

    var data = await this.API_CCS.getGeneralesPS(
      this.state.selectedInterval,
      this.props.user.campania,
      0,
      moment(this.state.fecha_ini).format("MM/DD/YYYY"),
      moment(this.state.fecha_fin).format("MM/DD/YYYY")
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
    } else if (
      this.state.selectedInterval === 2 ||
      this.state.selectedInterval === 4
    ) {
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

  handleChange(e) {
    this.setState(
      {
        [e.target.id]: e.target.value,
      },
      () => {
        this.fetchAll();
      }
    );
  }

  requestTotales = async () => {
    const response = await this.API_CCS.getGeneralesPS(
      this.state.selectedInterval,
      this.props.user.campania,
      1,
      moment(this.state.fecha_ini).format("MM/DD/YYYY"),
      moment(this.state.fecha_fin).format("MM/DD/YYYY")
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

  componentDidMount() {
    this.fetchAll();
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
              icon="icon-call-in"
              color="primary"
              header={0}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Recibidas (IVR)
            </WidgetCard>
            <WidgetCard
              icon="icon-people"
              color="primary"
              header={this.state.totalOfrecidas}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Ofrecidas
            </WidgetCard>
            <WidgetCard
              icon="icon-phone"
              color="primary"
              header={this.state.totalAtendidas}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Atendidas
            </WidgetCard>
            <WidgetCard
              icon="icon-ghost"
              color="primary"
              header={this.state.totalAbandonadas}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Abandonadas
            </WidgetCard>
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
              icon="icon-notebook"
              color="primary"
              header={this.state.totalASA}
              value="100"
              loading={this.state.loadMainGraph}
            >
              ASA
            </WidgetCard>
            {/*<WidgetCard
              icon="icon-graph"
              color="primary"
              header={this.state.totalQA}
              value="100"
              loading={this.state.loadMainGraph}
            >
              Calidad
            </WidgetCard>*/}
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
                            ASA
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
                            IVR
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
                          <Button
                            className="flex-wrap"
                            style={{
                              width: 87,
                              fontSize: 10,
                              fontWeight: "bold",
                            }}
                            size="sm"
                            color="outline-secondary"
                            onClick={() => this.selectInterval(4)}
                            active={this.state.selectedInterval === 4}
                          >
                            Custom
                          </Button>
                        </ButtonGroup>
                        <br />
                        {this.state.selectedInterval === 4 ? (
                          <div>
                            <FormGroup
                              style={{ float: "left", textAlign: "center" }}
                            >
                              <Label htmlFor="prospecto">Fecha Ini</Label>
                              <Input
                                type="date"
                                date-format="dd/mm/yyyy"
                                placeholder="Fecha Ini"
                                onChange={this.handleChange}
                                id="fecha_ini"
                                value={this.state.fecha_ini}
                                lang="es"
                              ></Input>
                            </FormGroup>
                            <FormGroup
                              style={{
                                float: "left",
                                textAlign: "center",
                                marginLeft: "105px",
                              }}
                            >
                              <Label htmlFor="prospecto">Fecha Fin</Label>
                              <Input
                                type="date"
                                date-format="dd/mm/yyyy"
                                placeholder="Fecha Ini"
                                onChange={this.handleChange}
                                id="fecha_fin"
                                value={this.state.fecha_fin}
                                min={this.state.fecha_ini}
                                lang="es"
                              ></Input>
                            </FormGroup>
                          </div>
                        ) : null}
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
        </div>
      );
    }
  }
}

export default withAuth(DashboardGenerico);
