const barChartElement = document.getElementById('bar_chart');
const doughnutChartElement = document.getElementById('doughnut_chart');
const scatterChartElement = document.getElementById('scatter_chart');
const pieChartElement = document.getElementById('pie_chart');


function updateDoughnut(data) {
  doughnutChart.destroy();
  doughnut_config['data'] = data;
  doughnutChart = new Chart(doughnutChartElement, doughnut_config);
}

function updateBarChart(data){
  barChart.destroy();
  config['data'] = data;
  barChart = new Chart(barChartElement, config);
}

function updateScatterChart(data) {
  scatterChart.destroy();
  scatter_config['data'] = data;
  scatterChart = new Chart(scatterChartElement, scatter_config);
}

function updatePieChart(data) {
  pieChart.destroy();
  pieChart_config['data'] = data;
  pieChart = new Chart(pieChartElement, pieChart_config);
}

const pieChart_config = {
  type: 'pie',
  data: {},
  options: {
    plugins:{
      title: {
        display: true,
        text: "Transmission Types"
      }
    }
  }
};

const scatter_config = {
  type: 'scatter',
  data: {},
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Mileage vs. Price'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Price"
        }
      },
      y: {
        title: {
          display: true,
          text: "Mileage"
        }
      }
    }
  },
};

const config = {
  type: 'bar',
  data: {},
  options: {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Cars Sold"
        }
      },
      x: {
        title: {
          display: true,
          text: "Year"
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: "Number of Cars Sold By Model Year"
      },
      legend: {
        display: false,
      }
    }
  },
};

var doughnut_config = {
    type: 'doughnut',
    data: {},
};

function addData(chart, label, data, color) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
    dataset.backgroundColor.push(color);
  })
  chart.update();
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}

barChart = new Chart();
doughnutChart = new Chart();
scatterChart = new Chart();
pieChart = new Chart();
