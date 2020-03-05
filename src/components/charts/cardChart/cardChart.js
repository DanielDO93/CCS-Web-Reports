import React from 'react';
import {
  Button,
  Card,
  CardBody,

} from 'reactstrap';
import { Line } from 'react-chartjs-2';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities'
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

const brandPrimary = getStyle('--primary')
const brandInfo = getStyle('--info')


const defaultOptions = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent',
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        },

      }],
    yAxes: [
      {
        display: false,
        ticks: {
          display: false,
          //min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
         //max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5,
        },
      }],
  },
  elements: {
    line: {
      borderWidth: 1,
    },
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

const defaultDatosInfo = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: brandInfo,
      borderColor: 'rgba(255,255,255,.55)',
      data: [65, 59, 84, 84, 51, 55, 40],
    },
  ],
};

const defaultDatosPrimary = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: brandPrimary,
      borderColor: 'rgba(255,255,255,.55)',
      data: [65, 59, 84, 84, 51, 55, 40],
    },
  ],
};

class CardChartPrimary extends React.Component{



   render(){
       return (
        (this.props.refreshButton)

         ?  <Card className="text-white bg-primary">
              <CardBody className="pb-0">
                <Button className="float-right icon-refresh p-0" color="transparent" onClick={this.props.refreshFunction || null}/>
                <div className="text-value">{this.props.total || 0}</div>
                <div>{this.props.title || 0}</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                <Line data={this.props.data || defaultDatosPrimary} options={this.props.options || defaultOptions} height={70} />
              </div>
            </Card>

          : <Card className="text-white bg-primary">
              <CardBody className="pb-0">
                <div className="text-value">{this.props.total || 0}</div>
                <div>{this.props.title || 0}</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                <Line data={this.props.data || defaultDatosPrimary} options={this.props.options || defaultOptions} height={70} />
              </div>
            </Card>
       )
    }
}


class CardChartInfo extends React.Component{



   render(){
       return (
        (this.props.refreshButton)

         ?  <Card className="text-white bg-info">
              <CardBody className="pb-0">
                <Button className="float-right icon-refresh p-0" color="transparent" onClick={this.props.refreshFunction || null}/>
                <div className="text-value">{this.props.total || 0}</div>
                <div>{this.props.title || 0}</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                <Line data={this.props.data || defaultDatosInfo} options={this.props.options || defaultOptions} height={70} />
              </div>
            </Card>

          : <Card className="text-white bg-info">
              <CardBody className="pb-0">
                <div className="text-value">{this.props.total || 0}</div>
                <div>{this.props.title || 0}</div>
              </CardBody>
              <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
                <Line data={this.props.data || defaultDatosInfo} options={this.props.options || defaultOptions} height={70} />
              </div>
            </Card>
       )
    }
}

export {CardChartInfo, CardChartPrimary}




