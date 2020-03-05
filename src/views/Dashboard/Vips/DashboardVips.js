import React, { Component } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-deferred';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row

} from 'reactstrap';

import { hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'
import Loader from 'react-loader-spinner'

import withAuth from '../../../components/withAuth';
import AuthService from '../../../components/AuthService';

import {CardChartInfo, CardChartPrimary} from '../../../components/charts/cardChart';

import * as ChartConfig from '../ChartConfig';


const Auth = new AuthService();


const brandPrimary = "#C00327"
const brandInfo = "#c8ced3"







class DashboardVips extends Component {
  constructor(props) {
    super(props);
    this.fetchData = this.fetchData.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.updateClick = this.updateClick.bind(this);

    this.state = {
      loading: true,
      dropdownOpen: false,
      radioSelected: 2,
      cardChartData1:{},
      cardChartTotal1: 0,
      cardChartData2:{},
      cardChartTotal2: 0,
      cardChartData3:{},
      cardChartTotal3: 0,
      cardChartData4:{},
      cardChartTotal4: 0,
      secondaryChartData1: {},
      secondaryChartData2: {},
      mainChartData: {}

    };
  }

 async fetchData(){
      
        try {
          this.setState({loading:true})
          let [quejasDiario,tipoQuejas, topMotivos, resumenMensual] = await Promise.all([
            Auth.fetch("https://api.ccscontactcenter.com/v1/Campaigns/Vips/Quejas_Diario"),
            Auth.fetch("https://api.ccscontactcenter.com/v1/Campaigns/Vips/Tipo_Quejas"),
            Auth.fetch("https://api.ccscontactcenter.com/v1/Campaigns/Vips/Top5_Motivos"),
            Auth.fetch("https://api.ccscontactcenter.com/v1/Campaigns/Vips/Resumen_Mensual")
          ]);
          //Aqui se dibujan las graficas

              var cChrtLl = [];
              JSON.stringify(quejasDiario[0], (key, value) => {
                if (key === 'Dias') cChrtLl.push(value);
                return value
              });
              var cChrtD1 = [];
              JSON.stringify(quejasDiario[0], (key, value) => {
                if (key === 'Quejas') cChrtD1.push(value);
                return value
              });
              var cChrtD2 = [];
              JSON.stringify(quejasDiario[0], (key, value) => {
                if (key === 'Abiertas') cChrtD2.push(value);
                return value
              });
              var cChrtD3 = [];
              JSON.stringify(quejasDiario[0], (key, value) => {
                if (key === 'Cerradas') cChrtD3.push(value);
                return value
              }); 
              var cChrtD4 = [];
              JSON.stringify(quejasDiario[0], (key, value) => {
                if (key === 'PCierre') cChrtD4.push(value);
                return value
              });



                 var cardChartData1 = {
                    labels: cChrtLl,
                    datasets: [
                      {
                        label: 'Quejas',
                        backgroundColor: brandInfo,
                        borderColor: 'rgba(255,255,255,.55)',
                        data: cChrtD1,
                      },
                    ],
                  };

                var cardChartData2 = {
                    labels: cChrtLl,
                    datasets: [
                      {
                        label: 'Abiertas',
                        backgroundColor: brandPrimary,
                        borderColor: 'rgba(255,255,255,.55)',
                        data: cChrtD2,
                      },
                    ],
                  };

                var cardChartData3 = {
                    labels: cChrtLl,
                    datasets: [
                      {
                        label: 'Cerradas',
                        backgroundColor: brandInfo,
                        borderColor: 'rgba(255,255,255,.55)',
                        data: cChrtD3,
                      },
                    ],
                  };

                var cardChartData4 = {
                    labels: cChrtLl,
                    datasets: [
                      {
                        label: '% Cierre',
                        backgroundColor: brandPrimary,
                        borderColor: 'rgba(255,255,255,.55)',
                        data: cChrtD4,
                      },
                    ],
                  };
        
              this.setState({cardChartTotal1:cChrtD1.reduce(function(a, b){ return a + b; })})
              this.setState({cardChartData1:cardChartData1})

              this.setState({cardChartTotal2:cChrtD2.reduce(function(a, b){ return a + b; })})
              this.setState({cardChartData2:cardChartData2})

              this.setState({cardChartTotal3:cChrtD3.reduce(function(a, b){ return a + b; })})
              this.setState({cardChartData3:cardChartData3})

              this.setState({cardChartTotal4:((this.state.cardChartTotal3/this.state.cardChartTotal1)*100).toPrecision(4)})
              this.setState({cardChartData4:cardChartData4})

              var sChrtLl = [];
              JSON.stringify(tipoQuejas[0], (key, value) => {
                if (key === 'medio') sChrtLl.push(value);
                return value
              });
              var sChrtD1 = [];
              JSON.stringify(tipoQuejas[0], (key, value) => {
                if (key === 'quejas') sChrtD1.push(value);
                return value
              });

              var secondaryChartData1 = {
                labels: sChrtLl,
                datasets: [
                {
                  label: '',
                  backgroundColor: [hexToRgba(brandPrimary,100), hexToRgba(brandPrimary,80), hexToRgba(brandPrimary,60),hexToRgba(brandPrimary,40)],
                  pointHoverBackgroundColor: '#fff',
                  borderWidth: 2,
                  data: sChrtD1,
                },
                ],
              };

              this.setState({secondaryChartData1:secondaryChartData1})

              var sChrtL2 = [];
              JSON.stringify(topMotivos[0], (key, value) => {
                if (key === 'Motivo') sChrtL2.push(value);
                return value
              });
              var sChrtD2 = [];
              JSON.stringify(topMotivos[0], (key, value) => {
                if (key === 'quejas') sChrtD2.push(value);
                return value
              });




              var secondaryChartData2 = {
                labels: sChrtL2,
                datasets: [
                {

                  backgroundColor: [hexToRgba(brandPrimary,100), hexToRgba(brandPrimary,80), hexToRgba(brandPrimary,60),hexToRgba(brandPrimary,40)],
                  pointHoverBackgroundColor: '#fff',
                  borderWidth: 2,
                  data: sChrtD2,
                },
                ],
              };


              this.setState({secondaryChartData2:secondaryChartData2})

              var mChrtL1 = [];
              JSON.stringify(resumenMensual[0], (key, value) => {
                if (key === 'Fecha') mChrtL1.push(value);
                return value
              });
              var mChrtD1 = [];
              JSON.stringify(resumenMensual[0], (key, value) => {
                if (key === 'Entrantes') mChrtD1.push(value);
                return value
              });
              var mChrtD2 = [];
              JSON.stringify(resumenMensual[0], (key, value) => {
                if (key === 'Atendidas') mChrtD2.push(value);
                return value
              });
              var mChrtD3 = [];
              JSON.stringify(resumenMensual[0], (key, value) => {
                if (key === 'Abandonadas') mChrtD3.push(value);
                return value
              });
              var mChrtD4 = [];
              JSON.stringify(resumenMensual[0], (key, value) => {
                if (key === 'Totales') mChrtD4.push(value);
                return value
              });
              var mChrtD5 = [];
              JSON.stringify(resumenMensual[0], (key, value) => {
                if (key === 'Abiertas') mChrtD5.push(value);
                return value
              });
              var mChrtD6 = [];
              JSON.stringify(resumenMensual[0], (key, value) => {
                if (key === 'Cerradas') mChrtD6.push(value);
                return value
              });



              var mainChartData = {
                labels: mChrtL1,
                datasets: [
                {
                  label: 'Quejas Totales',
                  backgroundColor: hexToRgba('#000000',1),
                  borderColor: hexToRgba('#000000',100),
                  pointHoverBackgroundColor: '#fff',
                  borderWidth: 2,
                  data: mChrtD4,
                },
                {
                  label: 'Llamadas Atendidas',
                  backgroundColor: hexToRgba(brandInfo, 10),
                  borderColor: brandInfo,
                  pointHoverBackgroundColor: '#fff',
                  borderWidth: 2,
                  data: mChrtD2,
                },                                                                
                {
                  label: 'Llamadas Recibidas',
                  backgroundColor: hexToRgba(brandPrimary, 8),
                  borderColor: brandPrimary,
                  pointHoverBackgroundColor: '#fff',
                  borderWidth: 2,
                  data: mChrtD1,
                },                                                                
                ],
              };


              this.setState({mainChartData:mainChartData})
              this.setState({loading:false})

        } catch(err) {
          console.log(err);
        };

  };

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  updateClick(){
    this.fetchData()
  }

  componentDidMount(){

    this.fetchData()

  }



  loading = () => <div className="animated fadeIn pt-1 text-center">Cargando...</div>

  render() {


if (this.state.loading) {

      return(
        <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent:'center'}}>
        <div>
        <Loader 
         type="Bars"
         color={brandPrimary}
         height="100" 
         width="100"
      /> 
      </div>
      </div>
      );

    } else { 

    return (



      <div className="animated fadeIn">

        <Row>
          <Col xs="12" sm="6" lg="3">

            <CardChartInfo 
              title="Quejas Semana" 
              total={this.state.cardChartTotal1} 
              data={this.state.cardChartData1} 
              refreshButton={true}
              refreshFunction={this.updateClick}
            />

          </Col>


          <Col xs="12" sm="6" lg="3">

            <CardChartPrimary 
              title="Quejas Abiertas" 
              total={this.state.cardChartTotal2} 
              data={this.state.cardChartData2} 
              refreshButton={true}
              refreshFunction={this.updateClick}
            />

          </Col>

          <Col xs="12" sm="6" lg="3">

            <CardChartInfo 
              title="Quejas Cerradas" 
              total={this.state.cardChartTotal3} 
              data={this.state.cardChartData3} 
              refreshButton={true}
              refreshFunction={this.updateClick}
            />

          </Col>

          <Col xs="12" sm="6" lg="3">

            <CardChartPrimary 
              title="Quejas Cerradas" 
              total={this.state.cardChartTotal4 + "%"} 
              data={this.state.cardChartData4} 
              refreshButton={true}
              refreshFunction={this.updateClick}
            />

          </Col>
        </Row>


        <Row>
          <Col>
            <Card>
            <CardHeader>Medio Quejas</CardHeader>
              <CardBody>
                <div className="chart-wrapper" style={{ height: 250 + 'px' }}>
                  <Doughnut data={this.state.secondaryChartData1} options={ChartConfig.secondaryChart1} height={250} />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card>
            <CardHeader>Top 5 Motivos de Queja</CardHeader>
              <CardBody>
                <div className="chart-wrapper" style={{ height: 250 + 'px'}}>
                  <Bar data={this.state.secondaryChartData2} options={ChartConfig.secondaryChart2} height={250} />
                </div>
              </CardBody>
            </Card>
          </Col>          
        </Row>

        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Interacciones</CardTitle>
                    <div className="small text-muted">Septiembre 2019</div>
                  </Col>
                  {/*<Col sm="7" className="d-none d-sm-inline-block">
                    <Button color="primary" className="float-right"><i className="icon-cloud-download"></i></Button>
                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                      <ButtonGroup className="mr-3" aria-label="First group">
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(1)} active={this.state.radioSelected === 1}>Dia</Button>
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(2)} active={this.state.radioSelected === 2}>Mes</Button>
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(3)} active={this.state.radioSelected === 3}>Año</Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>*/}
                </Row>
                <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
                  <Line data={this.state.mainChartData} options={ChartConfig.mainChartOpts} height={300} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>


      </div>
    )};
  }
}

export default withAuth(DashboardVips);