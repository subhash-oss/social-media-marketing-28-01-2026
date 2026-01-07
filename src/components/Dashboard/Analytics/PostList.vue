<template>
  <div class="overflow-auto rounded-2xl bg_white primary_border_color common_gap lg:overflow-hidden">
    <!-- Table -->
    <table class="w-full border-collapse">
      <!-- Header -->
      <thead class="bg_white">
        <tr class="text-left paragraph_p5_medium primary_text_color">
          <th class="px-6 py-3">Preview</th>
          <th class="px-6 py-3">Caption / Title</th>
          <th class="px-6 py-3">Platform</th>
          <th class="px-6 py-3">Date / Time</th>
          <th class="px-6 py-3">Reach</th>
          <th class="px-6 py-3">Engagement</th>
          <th class="px-6 py-3">Status</th>
          <th class="px-6 py-3 text-center">Actions</th>
        </tr>
      </thead>

      <!-- Body -->
      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="index"
          class="border-t"
        >
          <!-- Preview -->
          <td class="px-8 py-6">
            <img
              :src="row.image"
              class="h-20 w-20 rounded-lg object-cover"
            />
          </td>

          <!-- Caption -->
          <td class="px-6 py-4">
            <p class="label_2_regular">
              {{ row.title }}
            </p>
          </td>

          <!-- Platforms -->
          <td class="px-6 py-4">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="p in row.platforms"
                :key="p"
                class="rounded-md bg_primary_color px-2 py-1 label_3_medium"
              >
                {{ p }}
              </span>
            </div>
          </td>

          <!-- Date -->
          <td class="px-6 py-4 paragraph_p5_regular">
            <div>{{ row.date }}</div>
            <div>{{ row.time }}</div>
          </td>

          <!-- Reach -->
          <td class="px-6 py-4 label_2_regular">
            {{ row.reach }}
          </td>

          <!-- Engagement -->
          <td class="px-6 py-4 paragraph_p5_regular">
            {{ row.engagement }}
          </td>

          <!-- Status -->
          <td class="px-6 py-4">
            <span
              class="rounded-lg px-3 py-1 paragraph_p5_regular"
              :class="statusClass(row.status)"
            >
              {{ row.status }}
            </span>
          </td>

          <!-- Actions -->
          <td class="px-6 py-4 text-center">
            <div class="relative dropdown-container">
              <button
                @click.stop="toggleDropdown(index)"
                class="flex h-8 w-8 items-center justify-center rounded-full primary_border_color hover:bg_primary_color"
              >
                ⋯
              </button>
              
              <!-- Dropdown Menu -->
              <div
                v-if="openDropdownIndex === index"
                class="absolute right-0 top-10 z-50 min-w-[140px] rounded-lg bg_white shadow-lg primary_border_color"
              >
                <div
                  @click.stop="handleViewPost(row)"
                  class="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-gray-50 first:rounded-t-lg"
                >
                  <span class="label_2_regular">View post</span>
                  <img :src="ViewPostIcon" alt="">
                </div>
                <div
                  @click.stop="handleRepost(row)"
                  class="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-gray-50 last:rounded-b-lg"
                >
                  <span class="label_2_regular">Repost</span>
                  <img :src="RepostIcon" alt="">
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- View Post Modal -->
  <ViewPostModal
    :open="showViewPostModal"
    :postData="selectedPost"
    @close="closeViewPostModal"
    @repost="handleRepostFromModal"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ViewPostModal from './ViewPostModal.vue';
import ViewPostIcon from  "../../../assets/images/ViewPostIcon.svg"
import RepostIcon from "../../../assets/images/RepostIcon.svg"

defineProps({
  rows: Array,
});

const openDropdownIndex = ref(null);
const showViewPostModal = ref(false);
const selectedPost = ref(null);

const statusClass = (status) => {
  if (status === 'Published')
    return 'publish_text_style';
  if (status === 'Pending')
    return 'pending_text_style';
  if (status === 'Approved')
    return 'approve_text_style';
};

const toggleDropdown = (index) => {
  if (openDropdownIndex.value === index) {
    openDropdownIndex.value = null;
  } else {
    openDropdownIndex.value = index;
  }
};

const handleViewPost = (row) => {
  selectedPost.value = row;
  showViewPostModal.value = true;
  openDropdownIndex.value = null;
};

const closeViewPostModal = () => {
  showViewPostModal.value = false;
  selectedPost.value = null;
};

const handleRepost = (row) => {
  console.log('Repost:', row);
  openDropdownIndex.value = null;
  // Add your repost logic here
};

const handleRepostFromModal = (postData) => {
  console.log('Repost from modal:', postData);
  // Add your repost logic here
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.dropdown-container')) {
    openDropdownIndex.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
