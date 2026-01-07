<template>
  <div class="rounded-2xl bg_white p-6 primary_border_color shadow-sm common_gap">
    <!-- Header -->
    <div class="flex items-start justify-between mb-2">
      <div>
        <h3 class="label_1_semibold">
          Performance by platform
        </h3>
      </div>

      <!-- Dropdown -->
      <div class="relative metric-dropdown-container">
        <button
          @click.stop="toggleMetricDropdown"
          class="flex items-center gap-2 rounded-lg border px-3 py-2 label_2_medium bg_white primary_border_color"
        >
          <img :src="getMetricIcon(selectedMetric)" alt="" class="h-4 w-4" />
          <span class="label_2_medium">{{ getMetricLabel(selectedMetric) }}</span>
          <img :src="DownArrow" alt="" class="h-4 w-4" />
        </button>
        
        <!-- Dropdown Menu -->
        <div
          v-if="showMetricDropdown"
          class="absolute right-0 top-10 z-50 min-w-[160px] rounded-lg bg_white shadow-lg primary_border_color py-2"
        >
          <div
            v-for="metric in metrics"
            :key="metric.value"
            @click.stop="selectMetric(metric.value)"
            class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50"
            :class="selectedMetric === metric.value ? 'bg-gray-50' : ''"
          >
            <span class="label_2_medium text-gray-900">{{ metric.label }}</span>
            <img 
              :src="metric.icon" 
              alt="" 
              class="h-4 w-4"
              :style="metric.value === 'shares' ? 'filter: opacity(0.7)' : ''"
            />
          </div>
        </div>
      </div>
    </div>
    <p class="label_2_regular mb-6 lg:mt-[-24px]">
          Compare reach, engagement, likes, comments, and shares across all platforms.
        </p>
    <!-- Chart -->
    <canvas ref="chartRef" height="70"></canvas>

    <!-- X Axis Labels (Icons + Text) -->
    <ul class="mt-4 grid grid-cols-6 text-center label_2_medium pl-8 lg:pl-6">
      <li v-for="p in platforms" :key="p.name" class="flex justify-center items-center gap-1 label_2_medium">
        <img :src="p.icon" class="h-5 w-5" />
        <span class="hidden lg:inline">{{ p.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
);
import InstagramIcon from "../../../assets/images/InstagramIcon.svg"
import FacebookIcon from "../../../assets/images/FacebookIcon.svg"
import LinkedInIcon from "../../../assets/images/LinkedInIcon.svg"
import TwitterIcon from "../../../assets/images/TwitterIcon.svg"
import TikTokIcon from "../../../assets/images/TikTokIcon.svg"
import YoutubeIcon from "../../../assets/images/YoutubeIcon.svg"
import DownArrow from "../../../assets/images/DownArrow.svg"
import TotalReach from "../../../assets/images/ReachIcon.svg"
import MessageIcon from "../../../assets/images/MessageUp.svg"
import LikeIcon from "../../../assets/images/HeartIcon.svg"
import CommentIcon from "../../../assets/images/MessageCircleIcon.svg"
import ShareIcon from "../../../assets/images/ShareIcon.svg"



const chartRef = ref(null);
let chartInstance = null;

const selectedMetric = ref('reach');
const showMetricDropdown = ref(false);


// Metrics with icons
const metrics = [
  { value: 'reach', label: 'Reach', icon: TotalReach },
  { value: 'engagement', label: 'Engagement', icon: MessageIcon },
  { value: 'likes', label: 'Likes', icon: LikeIcon },
  { value: 'comments', label: 'Comments', icon: CommentIcon },
  { value: 'shares', label: 'Shares', icon: ShareIcon },
];

const getMetricIcon = (metric) => {
  const metricObj = metrics.find(m => m.value === metric);
  return metricObj ? metricObj.icon : TotalReach;
};

const getMetricLabel = (metric) => {
  const metricObj = metrics.find(m => m.value === metric);
  return metricObj ? metricObj.label : 'Reach';
};

const toggleMetricDropdown = () => {
  showMetricDropdown.value = !showMetricDropdown.value;
};

const selectMetric = (metric) => {
  selectedMetric.value = metric;
  showMetricDropdown.value = false;
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.metric-dropdown-container')) {
    showMetricDropdown.value = false;
  }
};

/* Platform Icons (CDN for demo) */
const platforms = [
  { name: 'Instagram', icon: InstagramIcon },
  { name: 'Facebook', icon: FacebookIcon },
  { name: 'LinkedIn', icon: LinkedInIcon },
  { name: 'Twitter (X)', icon: TwitterIcon },
  { name: 'TikTok', icon: TikTokIcon },
  { name: 'YouTube', icon: YoutubeIcon },
];

/* Dummy Data */
const metricsData = {
  reach: [80, 60, 90, 45, 70, 25],
  engagement: [65, 50, 75, 40, 60, 20],
  likes: [70, 55, 85, 35, 65, 20],
  comments: [50, 40, 60, 30, 50, 15],
  shares: [45, 35, 55, 25, 45, 12],
};

const barColors = [
  '#FFECF8',
  '#E9F2FF',
  '#F3F0FF',
  '#E7F9FF',
  '#FFF3EB',
  '#FFECEB',
];

const borderColors = [
  '#EC4899',
  '#85B8FF',
  '#D0BFFF',
  '#9DD9EE',
  '#FEC195',
  '#FD9891',
];

const createChart = () => {
  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: platforms.map(p => p.name),
      datasets: [
        {
          data: metricsData[selectedMetric.value],
          backgroundColor: barColors,
          borderColor: borderColors,
          borderWidth: 1,
          borderRadius: {
            topLeft: 8,
            topRight: 8,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: 'bottom',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { display: false },
        y: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          ticks: { stepSize: 25 },
        },
      },
    },
  });
};

const updateChart = () => {
  chartInstance.data.datasets[0].data =
    metricsData[selectedMetric.value];
  chartInstance.update();
};

onMounted(() => {
  createChart();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

watch(selectedMetric, updateChart);
</script>
