logbookweb.constant('CHART_CONF', {
	labels:{
		year: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
	},
	options:{
		scales: {
			yAxes: [
				{
					id: 'y-axis-1',
					type: 'linear',
					display: true,
					position: 'left',
					gridLines:{
						color: 'rgba(255,255,255,0.4)',
						drawBorder: false,
						zeroLineColor:'white'
					},
					ticks:{
						fontColor: '#ffffff'
					}
				}
			],
			xAxes: [
				{
					id: 'x-axis-1',
					display: true,
					position: 'bottom',
					gridLines:{
						color: 'rgba(255,255,255,0.4)',
						drawBorder: false,
						zeroLineColor:'white'
					},
					ticks:{
						fontColor: '#ffffff'
					}
				}
			],

		},
		legend: {
            display: false,
            labels: {
                fontColor: 'rgb(255, 255, 255)'
            }
        }
	},
	optionsHorizontal:{
		scales: {
			yAxes: [
				{
					display: true,
					gridLines:{
						color: 'rgba(255,255,255,0.4)',
						drawBorder: false,
						zeroLineColor:'white'
					},
					ticks:{
						fontColor: '#ffffff'
					}
				}
			],
			xAxes: [
				{
					gridLines:{
						color: 'rgba(255,255,255,0.4)',
						drawBorder: false,
						zeroLineColor:'white'
					},
					ticks:{
						fontColor: '#ffffff'
					}
				}
			],

		},
		legend: {
            display: false,
            labels: {
                fontColor: 'rgb(255, 255, 255)'
            }
        }
	},
	pie:{
		legend: {
            display: true,
            position: 'left'
        },
        override: { 
        	borderWidth: 0
        }
	},
	optionsLine:{
		scales: {
			yAxes: [
				{
					id: 'y-axis-1',
					type: 'linear',
					display: true,
					position: 'left',
					gridLines:{
						color: 'rgba(255,255,255,0.4)',
						drawBorder: false,
						zeroLineColor:'white'
					},
					ticks:{
						fontColor: '#ffffff'
					}
				}
			],
			xAxes: [
				{
					id: 'x-axis-1',
					display: true,
					position: 'bottom',
					gridLines:{
						color: 'rgba(255,255,255,0.4)',
						drawBorder: false,
						zeroLineColor:'white'
					},
					ticks:{
						fontColor: '#ffffff'
					}
				}
			],

		},
		legend: {
            display: true,
            labels: {
                fontColor: 'rgb(255, 255, 255)'
            }
        }
	},
	optionsLineDarkGrids:{
		scales: {
			yAxes: [
				{
					id: 'y-axis-1',
					type: 'linear',
					display: true,
					position: 'left',
					gridLines:{
						color: 'rgba(0,0,0,0.4)',
						drawBorder: false,
						zeroLineColor:'white'
					},
					ticks:{
						fontColor: '#000000'
					}
				}
			],
			xAxes: [
				{
					id: 'x-axis-1',
					display: true,
					position: 'bottom',
					gridLines:{
						color: 'rgba(0,0,0,0.4)',
						drawBorder: false,
						zeroLineColor:'white'
					},
					ticks:{
						fontColor: '#000000'
					}
				}
			],

		},
		legend: {
            display: true,
            labels: {
                fontColor: 'rgb(0, 0, 0)'
            }
        }
	}
})