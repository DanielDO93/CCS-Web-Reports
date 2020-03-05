import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-deferred';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  Button,
  ButtonGroup,
  CardGroup

} from 'reactstrap';

import { hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'
import Loader from 'react-loader-spinner'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import withAuth from '../../../components/withAuth';
import API_CCS from '../../../components/API_CCS';
import WidgetCard from '../../../components/charts/WidgetCard';


import moment from 'moment' 
import 'moment/locale/es';


const brandPrimary = "#C00327"
//const brandInfo = getStyle('--info')







class DashboardEdenred extends Component {

  constructor(props) {
    super(props);
    this.API_CCS = new API_CCS();
    this.fetchAll = this.fetchAll.bind(this);
    this.updateMainGraph = this.updateMainGraph.bind(this)
    this.getNameKPI = this.getNameKPI.bind(this)
    this.selectKPI = this.selectKPI.bind(this);
    this.updateClick = this.updateClick.bind(this);

    this.state = {
      loading: true,
      loadMainGraph: false,
      selectedKPI: 0,
      percentKPI:false,
      selectedInterval:2,
      mainChartData: {},
      mainChartOpts: {}

    };

    setInterval(() => this.fetchAll(), 900000);
  }

async fetchAll(){
      
    this.setState({loading:true})
      

        this.updateMainGraph()



    this.setState({loading:false})


  };



async updateMainGraph(){

  this.setState({loadMainGraph:true})

    var arrayTotales = await this.requestTotales()


    this.setState({
      totalVPH: arrayTotales[0].VPH.toPrecision(2),
      totalContactacion: (arrayTotales[0].Contactacion*100).toPrecision(3) + '%',
      totalCitas: arrayTotales[0].Citas.toString(),
      totalConversion: (arrayTotales[0].Conversion*100).toPrecision(3) + '%'
    })

    

    var data = await this.API_CCS.getResumenEdenred(this.state.selectedInterval)

    var dataLabels = []

       if (this.state.selectedInterval === 0) {

                JSON.stringify(data, (key, value) => {
                  if (key === 'Fecha') dataLabels.push(moment.utc(value).format('HH:mm'));
                  return value
                });

        }  else if (this.state.selectedInterval === 1) {

                JSON.stringify(data, (key, value) => {
                  if (key === 'Fecha') dataLabels.push(moment.utc(value).format('dddd'));
                  return value
                });        

        }  else if (this.state.selectedInterval === 2) {

                JSON.stringify(data, (key, value) => {
                  if (key === 'Fecha') dataLabels.push(moment.utc(value).format('DD/MM/YYYY'));
                  return value
                });

        }  else if (this.state.selectedInterval === 3) {

                JSON.stringify(data, (key, value) => {
                  if (key === 'Fecha') dataLabels.push(this.getYear(moment.utc(value).format('DD')));
                  return value
                });        

        }

              


    var dataSet = []


        if (this.state.selectedKPI === 0) {

                      JSON.stringify(data, (key, value) => {
                        if (key === this.getNameKPI()) dataSet.push(value.toPrecision(2));
                        return value
                      });     
                      this.setState({percentKPI:false})

        } else if (this.state.selectedKPI === 1) {

                      JSON.stringify(data, (key, value) => {
                        if (key === this.getNameKPI()) dataSet.push((value*100).toPrecision(4));
                        return value
                      });     
                      this.setState({percentKPI:true})
        } else if (this.state.selectedKPI === 2) {

                      JSON.stringify(data, (key, value) => {
                        if (key === this.getNameKPI()) dataSet.push(value);
                        return value
                      });     
                      this.setState({percentKPI:false})
        } else if (this.state.selectedKPI === 3) {

                      JSON.stringify(data, (key, value) => {
                        if (key === this.getNameKPI()) dataSet.push((value*100).toPrecision(4));
                        return value
                      });   
                      this.setState({percentKPI:true})  
        }


    var mainChartOpts

        this.state.percentKPI ? 
                mainChartOpts = {
                  tooltips: {
                    enabled: false,
                    custom: CustomTooltips,
                    intersect: true,
                    mode: 'index',
                    position: 'nearest',
                    callbacks: {
                      labelColor: function(tooltipItem, chart) {
                        return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
                      },
                      label:  function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';

                        if (label) {
                            label += ': ';
                        }
                        label += Math.round(tooltipItem.yLabel * 100) / 100;
                        return label + '%';
                }
                    }
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
                      }],
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                          maxTicksLimit: 5,
                          callback: function(tick) {
                              return tick.toString() + '%'
                        }

                        },
                      }],
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
                          delay: 200
                        }
                      }
                }

              : mainChartOpts = {
                  tooltips: {
                    enabled: false,
                    custom: CustomTooltips,
                    intersect: true,
                    mode: 'index',
                    position: 'nearest',
                    callbacks: {
                      labelColor: function(tooltipItem, chart) {
                        return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
                      }
                    }
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
                      }],
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                          maxTicksLimit: 5,
                          callback: function(tick) {
                              return tick.toString()
                        }

                        },
                      }],
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
                          delay: 200
                        }
                      }
                };


        this.setState({mainChartOpts: mainChartOpts})

        

        var mainChartData = {
          labels: dataLabels,
          datasets: [

          {
            label: this.getNameKPI(),
            backgroundColor: hexToRgba(brandPrimary, 8),
            borderColor: brandPrimary,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 2,
            data: dataSet,
          },                                                                
          ],
        };


        this.setState({mainChartData:mainChartData})

  this.setState({loadMainGraph:false})
   

  }

  requestTotales = async () => {
    const response = await this.API_CCS.getTotalesEdenred(this.state.selectedInterval)
    return response
}

  getYear(numero){

   switch(numero) {
                    case "01":
                      return "Enero"
                    case "02":
                      return "Febrero"
                    case "03":
                      return "Marzo"
                    case "04":
                      return "Abril"
                    case "05":
                      return "Mayo"
                    case "06":
                      return "Junio"
                    case "07":
                      return "Julio"
                    case "08":
                      return "Agosto"
                    case "09":
                      return "Septiembre"
                    case "10":
                      return "Octubre"
                    case "11":
                      return "Noviembre"
                    case "12":
                      return "Diciembre"                                                             
                    default:
                      // code block
              }

  }

  getNameKPI(){

    switch(this.state.selectedKPI){
      case 0:
        return 'VPH'
      case 1: 
        return 'Contactacion'
      case 2:
        return 'Citas'
      case 3:
        return 'Conversion'
      default:

    }

  }


  selectKPI(selectedKPI) {

    this.setState({selectedKPI: selectedKPI}, function () {
        this.updateMainGraph()
    });
    
  }

  selectInterval(selectedInterval) {

    this.setState({selectedInterval: selectedInterval}, function () {
        this.updateMainGraph()
    });

  }

  updateClick(){
    this.fetchAll()
  }

  componentDidMount(){

    this.fetchAll()

  }





render() {

    var today = new Date();
    var mes = this.getYear(moment.utc(today).format('MM'))
    var anio = moment.utc(today).format('YYYY')
    var tagFecha = mes + ' ' + anio 

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

        <CardGroup className="mb-4">
          <WidgetCard icon="icon-speedometer" color="primary" header={this.state.totalVPH} value="100" loading={this.state.loadMainGraph}>VPH</WidgetCard>
          <WidgetCard icon="icon-people" color="primary" header={this.state.totalContactacion} value="100" loading={this.state.loadMainGraph}>Contactación</WidgetCard>
          <WidgetCard icon="icon-notebook" color="primary" header={this.state.totalCitas} value="100" loading={this.state.loadMainGraph}>Citas</WidgetCard>
          <WidgetCard icon="icon-graph" color="primary" header={this.state.totalConversion} value="100" loading={this.state.loadMainGraph}>Conversión</WidgetCard>
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
                  <Col style={{float:'right'}}>
 
                  


                      <ButtonGroup className="flex-wrap">
                        <Button className="flex-wrap" style={{width:87, fontSize:10, fontWeight: 'bold'}} size="sm" color="outline-secondary" onClick={() => this.selectKPI(0)} active={this.state.selectedKPI === 0}>VPH</Button>
                        <Button className="flex-wrap" style={{width:87, fontSize:10, fontWeight: 'bold'}} size="sm" color="outline-secondary" onClick={() => this.selectKPI(1)} active={this.state.selectedKPI === 1}>Contactación</Button>
                        <Button className="flex-wrap" style={{width:87, fontSize:10, fontWeight: 'bold'}} size="sm" color="outline-secondary" onClick={() => this.selectKPI(2)} active={this.state.selectedKPI === 2}>Citas</Button>
                        <Button className="flex-wrap" style={{width:87, fontSize:10, fontWeight: 'bold'}} size="sm" color="outline-secondary" onClick={() => this.selectKPI(3)} active={this.state.selectedKPI === 3}>Conversión</Button>
                      </ButtonGroup> 
                      <br /><div style={{height:5}}/>
                      <ButtonGroup className="flex-wrap">
                        <Button className="flex-wrap" style={{width:87, fontSize:10, fontWeight: 'bold'}} size="sm" color="outline-secondary" onClick={() => this.selectInterval(0)} active={this.state.selectedInterval === 0}>Dia</Button>
                        <Button className="flex-wrap" style={{width:87, fontSize:10, fontWeight: 'bold'}} size="sm" color="outline-secondary" onClick={() => this.selectInterval(1)} active={this.state.selectedInterval === 1}>Semana</Button>
                        <Button className="flex-wrap" style={{width:87, fontSize:10, fontWeight: 'bold'}} size="sm" color="outline-secondary" onClick={() => this.selectInterval(2)} active={this.state.selectedInterval === 2}>Mes</Button>
                        <Button className="flex-wrap" style={{width:87, fontSize:10, fontWeight: 'bold'}} size="sm" color="outline-secondary" onClick={() => this.selectInterval(3)} active={this.state.selectedInterval === 3}>Año</Button>
                      </ButtonGroup>                  
                 </Col>

        
                 </div>


                </Row>
  
                {this.state.loadMainGraph 
                  ? <div style={{height:'340px',display: 'flex', alignItems: 'center', justifyContent:'center'}}><div><Loader type="Oval" color={brandPrimary} height="70" width="70"/> </div></div>
                  : <div className="chart-wrapper animated fadeIn" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
              
                      <Line data={this.state.mainChartData} options={this.state.mainChartOpts} height={300} />
                
                    </div> }


              
              </CardBody>



            </Card>
          </Col>
        </Row>


        {/*<Row>
          <Col>

            <Card>
            <CardHeader>Medio Quejas</CardHeader>
              <CardBody>
                <div className="chart-wrapper" style={{ height: 250 + 'px' }}>
                  
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card>
            <CardHeader>Top 5 Motivos de Queja</CardHeader>
              <CardBody>
                <div className="chart-wrapper" style={{ height: 250 + 'px'}}>
              
                </div>
              </CardBody>
            </Card>
          </Col>          
        </Row>*/}




      </div>
    )};
  }
}

export default withAuth(DashboardEdenred);