<template>
  <div>
    <h2>{{ header }}</h2>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, PieController, ArcElement, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components and plugins
Chart.register(PieController, ArcElement, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

export default {
  props: ['languages', 'type', 'contributions'],
  data() {
    return {
      chartInstance: null,
      header: '',
    };
  },
  async mounted() {
    await this.$nextTick();
    this.createChart();
  },
  watch: {
    contributions() {
      this.createChart();
    },
  },
  methods: {
    async createChart() {
      if (!this.$refs.chartCanvas) {
        console.error("❌ Canvas element is not available. Retrying...");
        setTimeout(() => this.createChart(), 500);
        return;
      }

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      try {
        let labels, data, chartType;

        if (this.type === 'repositories') {
          this.header = this.languages ? 'Repository Languages' : 'Repository Extensions';
          const languagesList = ['java', 'js', 'py', 'cpp', 'ruby'];
          const response = await this.$axios.get(
            !this.languages
              ? '/findTop5MostUsedExtensions'
              : `/findTop5MostUsedExtensions?extensions=${languagesList}`
          );
          const rawData = response.data;
          labels = rawData.map(item => Object.keys(item)[0]);
          data = rawData.map(item => Object.values(item)[0]);
          chartType = 'pie';
        } else if (this.type === 'contributors') {
          this.header = 'Ranking Contributors based on Contributions';
          const response = await this.$axios.get('/findTopContributors');
          const rawData = response.data.map(([email, contributions]) => ({ [email]: contributions }));
          labels = rawData.map(item => Object.keys(item)[0]);
          data = rawData.map(item => Object.values(item)[0]);
          chartType = 'bar';
        } else if (this.type === 'contributions') {
          this.header = 'Top 5 Contributions by Total';
          if (!this.contributions || !this.contributions.length) {
            throw new Error('No contributions data provided');
          }

          const sortedContributions = [...this.contributions]
            .sort((a, b) => b[3] - a[3])
            .slice(0, 5);

          labels = sortedContributions.map(contribution => contribution[0]);
          data = sortedContributions.map(contribution => contribution[3]);
          chartType = 'pie';
        }

        this.chartInstance = new Chart(this.$refs.chartCanvas.getContext('2d'), {
          type: chartType,
          data: {
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'],
              borderColor: '#fff',
              borderWidth: 2,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: chartType === 'pie',
                position: 'top',
                labels: {
                  font: {
                    size: 14,
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    let label = tooltipItem.label || '';
                    let value = tooltipItem.raw || 0;
                    return `${label}: ${value}`;
                  },
                },
              },
              datalabels: {
                color: '#fff',
                anchor: 'center',
                align: 'center',
                clamp: true,
                font: {
                  weight: 'bold',
                  size: 16,
                },
                formatter: (value, context) => {
                  // Display raw value for bar chart, percentage for pie charts
                  if (context.chart.config.type === 'bar') {
                    return value; // Show raw number for bar chart
                  } else {
                    const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${percentage}%`; // Show percentage for pie charts
                  }
                },
                display: true,
                offset: 10,
                padding: 5,
              },
            },
            layout: {
              padding: 20,
            },
            aspectRatio: 1.5,
            scales: chartType === 'bar' ? {
              x: {
                ticks: {
                  autoSkip: false,
                  maxRotation: 45,
                  minRotation: 45,
                },
                barPercentage: 0.9,
                categoryPercentage: 0.8,
              },
              y: {
                beginAtZero: true,
                ticks: {
                  suggestedMin: 0,
                },
              },
            } : {},
          },
          plugins: [ChartDataLabels],
        });
      } catch (error) {
        console.error("❌ Error loading chart data:", error);
      }
    },
  },
};
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 10px;
}

canvas {
  max-height: 500px;
  margin: auto;
  display: block;
  width: 100%;
}
</style>