

import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

export const cardChartOpts1 = {

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
          //min: 0,
          max: 20,
        },
      }],
  },
  elements: {
    line: {
      //tension: 0.00001,
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
};



/*export const cardChartOpts2 = {
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
  }
}*/


export const cardChartOpts2 = {
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
          max: 20,
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

export const cardChartOpts3 = {
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
          //min: 0,
          max: 20,
        },
      }],
  },
  elements: {
    line: {
      //tension: 0.00001,
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
};

export const cardChartOpts4 = {
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
          //min: 0,
          max: 105,
        },
      }],
  },
  elements: {
    line: {
      //tension: 0.00001,
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
};

export const mainChartOpts = {
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
    display: true,
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


export const mainChartOpts2 = {
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
          return tick.toString() + '%';
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

export const secondaryChart1 = {
  tooltips: {
    enabled: true,
    intersect: true,
    mode: 'index',
    position: 'nearest',
  },
  title: {
  	display: false,
  },
  legend: {
  	position: 'bottom',
  	labels: {
  		fontSize: 10
  	}
  },
  maintainAspectRatio: false,
  plugins: {
        deferred: {
          delay: 200
        }
      }


};

export const secondaryChart2 = {

		scales: {
			xAxes: [{
				beginAtZero: true,
				ticks: {
					display: false
				}
			}],


		},
		legend: {
			display: false,

		},
		tooltips: {
			enabled: true,
			intersect: true,
			mode: 'index',
			position: 'nearest',
		},

		maintainAspectRatio: false,
      plugins: {
        deferred: {
          delay: 200
        }
      }

};