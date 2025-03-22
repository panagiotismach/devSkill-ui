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

        // Adjust aspect ratio and orientation based on screen size
        const isMobile = window.innerWidth < 768;
        const aspectRatio = isMobile ? 1 : 1.5;

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
            maintainAspectRatio: false, // Allow custom sizing
            aspectRatio: aspectRatio, // Dynamic aspect ratio
            indexAxis: chartType === 'bar' && isMobile ? 'y' : 'x', // Horizontal bars on mobile for bar charts
            plugins: {
              legend: {
                display: chartType === 'pie',
                position: 'top',
                labels: {
                  font: {
                    size: isMobile ? 12 : 14, // Smaller font on mobile
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
                  size: isMobile ? 12 : 16, // Smaller font on mobile
                },
                formatter: (value, context) => {
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
              padding: isMobile ? 10 : 20, // Less padding on mobile
            },
            scales: chartType === 'bar' ? {
              [isMobile ? 'x' : 'y']: { // Adjust axis based on orientation
                beginAtZero: true,
                ticks: {
                  suggestedMin: 0,
                  font: {
                    size: isMobile ? 10 : 12,
                  },
                },
              },
              [isMobile ? 'y' : 'x']: {
                ticks: {
                  autoSkip: true, // Prevent label overlap
                  maxRotation: isMobile ? 0 : 45, // No rotation for horizontal bars
                  minRotation: isMobile ? 0 : 45,
                  callback: function(value) {
                    // Truncate long labels (e.g., emails) on mobile
                    return value.length > 15 ? value.substring(0, 15) + '...' : value;
                  },
                  font: {
                    size: isMobile ? 10 : 12,
                  },
                },
                barPercentage: 0.9,
                categoryPercentage: 0.8,
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
  font-size: clamp(16px, 4vw, 20px); /* Responsive font size */
}

canvas {
  max-height: 400px; /* Reduced max height for better mobile fit */
  margin: auto;
  display: block;
  width: 100% !important; /* Ensure full width */
  height: auto !important; /* Maintain aspect ratio */
}

@media (max-width: 768px) {
  canvas {
    max-height: 300px; /* Further reduce on smaller screens */
  }
}
</style>