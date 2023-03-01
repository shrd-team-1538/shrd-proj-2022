<template>
    <Bar :data="chartData" :options="chartOptions" />
  </template>
  <script>
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
  export default {
    name: 'BarChart',
    components: { Bar },
    computed: {
        chartData() { return this.chartData } },
        chartOptions() { return return this.options }
      },
    props: {
        chartData: {
            type: Object,
            required: true,
        },
        options: {
            type: Object,
            required: true,
        }
    }
  }
  </script>