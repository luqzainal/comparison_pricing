<template>
  <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
    <h3 class="text-lg font-semibold mb-4">Sejarah Harga</h3>
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
    <div v-else-if="!chartData" class="flex items-center justify-center h-64 text-gray-500">
      <p>Tiada data sejarah harga tersedia.</p>
    </div>
    <Line v-else :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale
} from 'chart.js'
import 'chartjs-adapter-date-fns';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale
)

const props = defineProps({
  historyData: {
    type: Object,
    required: true,
    default: () => ({ shopee: [], lazada: [] })
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const chartData = computed(() => {
  if (!props.historyData || (!props.historyData.shopee?.length && !props.historyData.lazada?.length)) {
    return null;
  }

  const datasets = [];

  if (props.historyData.shopee?.length) {
    datasets.push({
      label: 'Shopee',
      backgroundColor: '#F97316',
      borderColor: '#F97316',
      data: props.historyData.shopee.map(item => ({ x: new Date(item.recordedAt), y: item.price })),
      tension: 0.1,
      fill: false,
    });
  }

  if (props.historyData.lazada?.length) {
    datasets.push({
      label: 'Lazada',
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
      data: props.historyData.lazada.map(item => ({ x: new Date(item.recordedAt), y: item.price })),
      tension: 0.1,
      fill: false,
    });
  }

  return { datasets };
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
        tooltipFormat: 'dd MMM yyyy',
        displayFormats: {
          day: 'dd MMM'
        }
      },
      title: {
        display: true,
        text: 'Tarikh'
      }
    },
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: 'Harga (RM)'
      },
      ticks: {
        callback: function(value) {
          return 'RM ' + value.toFixed(2);
        }
      }
    }
  },
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(context.parsed.y);
          }
          return label;
        }
      }
    }
  }
})
</script> 