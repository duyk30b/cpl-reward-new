import moment from 'moment'

export const SERIES = [
  {
    name: 'Current',
    data: ['2'],
  },
  {
    name: 'Preview',
    data: ['2'],
  },
]

export const CHART_OPITIONS = {
  chart: {
    type: 'line',
    zoom: {
      enabled: true,
    },
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: false,
        selection: false,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: false,
        reset: false,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'straight',
    width: 2,
  },
  title: {
    text: 'Data trend price setting',
    align: 'center',
    style: {
      fontSize: '18px',
      fontWeight: 700,
      cssClass: 'apexcharts-xaxis-title',
    },
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5,
    },
  },
  colors: ['#00ff00', '#ff0000'],
  xaxis: {
    type: 'datetime',
    labels: {
      show: true,
      formatter: (value) => {
        return moment(value).format('HH:mm')
      },
    },
    categories: [] as number[],
    title: {
      text: 'Timestamp',
      offsetY: 10,
      style: {
        fontSize: '16px',
        fontWeight: 500,
        cssClass: 'apexcharts-xaxis-title',
      },
    },
  },
  yaxis: {
    title: {
      text: 'Price',
      style: {
        fontSize: '16px',
        fontWeight: 500,
        cssClass: 'apexcharts-xaxis-title',
      },
    },
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'right',
    offsetY: 0,
    offsetX: 0,
    floating: true,
    onItemClick: {
      toggleDataSeries: false,
    },
  },
}
