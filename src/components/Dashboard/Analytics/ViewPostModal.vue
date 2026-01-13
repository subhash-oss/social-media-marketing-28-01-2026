<template>
  <!-- Backdrop -->
  <div
    v-if="open"
    class="fixed inset-0 z-50 bg-black/40"
    @click="$emit('close')"
  >
    <!-- Modal - Positioned on the right -->
    <div
      class="fixed right-0 top-0 bottom-0 w-full lg:max-w-lg max-h-screen overflow-y-auto bg_white shadow-2xl"
      @click.stop
    >
      <!-- Header -->
      <div class="sticky top-0 bg_white border-b  px-6 py-4 flex  z-10">
        <h2 class="heading_h6_semibold primary_text_color">View post</h2>
        <button
          @click="$emit('close')"
          class="absolute right-6 secondary_text_color leading-none"
        >
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 bg_primary_color">
        <!-- Performance Banner -->
        <div class="bg_white rounded-2xl secondary_border_color px-4 py-3 flex items-center justify-center">
          <img :src="LogoImage" alt="" class="h-7 ">
          <span class="label_1_regular_withount_color gradient_text_color">
            This post performed 38% better than your average image post.
          </span>
        </div>

        <!-- Status and Post Type -->
        <div class="flex items-center gap-3 justify-center mt-6">
          <span
            class="rounded-lg px-3 py-1.5 paragraph_p5_regular flex items-center gap-2 w-36 md::w-52"
            :class="statusClass(postData?.status)"
          >
            <img :src="PublishIcon" alt="">
            {{ postData?.status || 'Published' }}
          </span>
          <div class="relative platform-dropdown-container">
            <button
              @click.stop="togglePlatformDropdown"
              class="flex items-center gap-2 paragraph_p5_regular primary_text_color primary_border_color p-1"
            >
              <img :src="PostFilter" alt="">
              <span>{{ getPostType() }}</span>
              <img :src="DownArrow" alt="" class="h-4 w-4" />
            </button>
            
            <!-- Platform Dropdown -->
            <div
              v-if="showPlatformDropdown"
              class="absolute left-0 top-8 z-50 min-w-[180px] rounded-lg bg_white shadow-lg primary_border_color py-2"
            >
              <div
                v-for="platform in availablePlatforms"
                :key="platform"
                @click.stop="selectPlatform(platform)"
                class="px-4 py-2 cursor-pointer paragraph_p5_regular"
                :class="selectedPlatform === platform ? 'paragraph_p5_regular' : ''"
              >
                {{ platform }} post (4:5)
              </div>
            </div>
          </div>
        </div>

        <!-- Post Image -->
        <div class="rounded-lg overflow-hidden bg_white flex justify-center regular_gap">
          <img
            :src="postData?.image"
            :alt="postData?.title"
            class="w-[30em] object-cover"
          />
        </div>

        <!-- Caption -->
        <div class="regular_gap">
          <p class="body_1_regular primary_text_color pt-3 border-b pb-3">
            {{ getFullCaption() }}
          </p>
        </div>
      
        <!-- Date/Time -->
         <p class="label_2_semibold common_gap">Date/Time</p>
        <div class="body_1_regular primary_text_color mt-2 mb-3">
          {{ formatDateTime() }}
        </div>

        <!-- Metrics Grid -->
        <div class=" flex flex-col justify-center items-center lg:grid grid-cols-1 gap-4 lg:grid-cols-2 ">

        <AnalyticsStatCard
          v-for="(stat, index) in stats"
          :key="index"
          v-bind="stat"
        />
        </div>

        <!-- Repost Button -->
        <button
          @click="handleRepost"
          class="w-full primary_button flex items-center justify-center gap-2 py-3 rounded-lg common_gap"
        >
          <img :src="RepostBottonIcon" alt="">
          Repost
        </button>
      </div>
    </div>
  </div>

  <!-- Post Scheduled Modal -->
  <PostScheduledModal
    :open="showScheduledModal"
    :scheduledDate="scheduledDate"
    @close="closeScheduledModal"
    @viewCalendar="handleViewCalendar"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import PostScheduledModal from './PostScheduledModal.vue';
import AnalyticsStatCard from "./AnalyticsCard.vue"
import LogoImage from '../../../assets/images/LogoImage.png';
import PublishIcon from '../../../assets/images/PublishIcon.svg';
import DownArrow from '../../../assets/images/DownArrow.svg';
import PostFilter from '../../../assets/images/PostFilter.svg';
import TotalReach from '../../../assets/images/TotalReach.svg';
import MessageIcon from '../../../assets/images/MessageIcon.svg';
import LikeIcon from '../../../assets/images/LikeIcon.svg';
import CommentIcon from '../../../assets/images/CommentIcon.svg';
import RepostBottonIcon from "../../../assets/images/RepostBottonIcon.svg";


const props = defineProps({
  open: Boolean,
  postData: Object,
});

const emit = defineEmits(['close', 'repost', 'viewCalendar']);

const showScheduledModal = ref(false);
const showPlatformDropdown = ref(false);
const selectedPlatform = ref(null);

const statusClass = (status) => {
  if (status === 'Published') return 'publish_text_style';
  if (status === 'Pending') return 'pending_text_style';
  if (status === 'Approved') return 'approve_text_style';
  return 'publish_text_style';
};

const availablePlatforms = computed(() => {
  return props.postData?.platforms || ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'TikTok', 'YouTube'];
});

const getPostType = () => {
  const platform = selectedPlatform.value || availablePlatforms.value[0] || 'Instagram';
  return `${platform} post (4:5)`;
};

const togglePlatformDropdown = () => {
  showPlatformDropdown.value = !showPlatformDropdown.value;
};

const selectPlatform = (platform) => {
  selectedPlatform.value = platform;
  showPlatformDropdown.value = false;
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.platform-dropdown-container')) {
    showPlatformDropdown.value = false;
  }
};

const getFullCaption = () => {
  const title = props.postData?.title || 'Big Sale this weekend!';
  return `${title} Don't miss your chance to grab your favorites at exclusive prices. #WeekendSale #LimitedOffer #ShopSmart`;
};

const formatDateTime = () => {
  const date = props.postData?.date || 'Oct 28,';
  const time = props.postData?.time || '10:00 AM';
  return `${date} ${time}`;
};

const getMetricValue = (type) => {
  const metrics = {
    reach: props.postData?.reach || '128K',
    engagement: props.postData?.engagement || '6.8%',
    likes: props.postData?.likes || '3.2K',
    comments: props.postData?.comments || '210',
  };
  return metrics[type] || '0';
};

const scheduledDate = computed(() => {
  // Format: "Oct 30 at 10:00 AM"
  const date = props.postData?.date?.replace(',', '') || 'Oct 30';
  const time = props.postData?.time || '10:00 AM';
  return `${date} at ${time}`;
});

const handleRepost = () => {
  emit('repost', props.postData);
  // Show scheduled modal instead of closing
  showScheduledModal.value = true;
};

const closeScheduledModal = () => {
  showScheduledModal.value = false;
  // Close the view post modal as well
  emit('close');
};

const handleViewCalendar = () => {
  emit('viewCalendar');
};

// Watch for postData changes to update selected platform
watch(() => props.postData, (newData) => {
  if (newData && availablePlatforms.value.length > 0) {
    selectedPlatform.value = availablePlatforms.value[0];
  }
}, { immediate: true });

// Initialize selected platform
onMounted(() => {
  if (availablePlatforms.value.length > 0 && !selectedPlatform.value) {
    selectedPlatform.value = availablePlatforms.value[0];
  }
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});


//analystics 
const baseStats = [
  {
    title: 'Total reach',
    description: 'Total users who saw your posts',
    icon: TotalReach,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    valueMonth: '',
    
  },
  {
    title: 'Engagement rate',
    description: 'Likes, comments, shares vs impressions',
    icon: MessageIcon,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    valueMonth: '',
    
  },
  {
    title: 'Likes',
    description: 'Total reactions',
    icon: LikeIcon,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    valueMonth: '+1,230',
   
  },
  {
    title: 'comments',
    description: 'Total replies',
    icon: CommentIcon,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    valueMonth: '210',
  },
];

const stats = computed(() => {
  // Use 'Month' as default since there's no activeTab in this component
  const defaultTab = 'Month';
  
  return baseStats.map(stat => {
    // Use post data values where available, otherwise use default values
    let value = stat[`value${defaultTab}`];
    
    // Map post data to stats if available
    if (stat.title === 'Total reach' && props.postData?.reach) {
      value = props.postData.reach;
    } else if (stat.title === 'Engagement rate' && props.postData?.engagement) {
      value = props.postData.engagement;
    }
    
    return {
      ...stat,
      value: value
    };
  });
});


</script>

