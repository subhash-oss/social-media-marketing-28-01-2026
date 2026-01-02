<template>
  <!-- Backdrop -->
  <div
    v-if="open"
    class="fixed top-0 bottom-0 right-0 z-40 bg-black/40"
    :class="isCollapsed ? 'left-16' : 'left-64'"
    @click="$emit('close')"
  ></div>

  <!-- Popup -->
  <div
    v-if="open"
    class="fixed inset-0 z-50 bg-white shadow-2xl lg:inset-auto lg:top-2 lg:rounded-xl lg:w-[40%]"
    :class="isCollapsed ? 'lg:left-20' : 'lg:left-[16.5em]'"
  >
    <!-- Header -->
    <div class="flex items-start justify-between border-b p-4">
      <div>
        <h2 class="heading_h6_semibold">Notifications</h2>
        <p class="body_3_regular">
          Stay updated with your latest activities
        </p>
      </div>

      <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
        ✕
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b bg-[#F1F2F4] px-4 py-3">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="flex items-center gap-1 rounded-md px-2 py-1"
        :class="
          activeTab === tab.key
            ? 'bg-white'
            : 'hover:bg-gray-100'
        "
      >
        <span class="label_2_semibold">{{ tab.label }}</span>
        <span class="label_3_regular">({{ tab.count }})</span>
      </button>
    </div>

    <!-- CONTENT -->
    <div class="p-4">
      <!-- EMPTY STATE -->
      <div
        v-if="filteredNotifications.length === 0"
        class="flex h-[68vh] flex-col items-center justify-center text-center"
      >
        <div
          class="mb-4 flex items-center justify-center rounded-full"
        >
         <img :src="BellIcon" alt="" class="h-32 w-32">
        </div>

        <p class="label_1_medium">Notification</p>
        <p class="body_3_regular">
          You have no notifications right now. <br />
          Come back later.
        </p>
      </div>

      <!-- NOTIFICATION LIST -->
      <div
        v-else
        class="max-h-[59vh] space-y-2 overflow-y-auto"
      >
        <div
          v-for="item in filteredNotifications"
          :key="item.id"
          class="relative rounded-lg border p-4"
        >
          <!-- Status Dot -->
          <span
            class="absolute right-3 top-2 h-2 w-2 rounded-full bg-[#155DFC]"
          ></span>

          <!-- Title -->
          <div class="mb-1 flex items-center gap-2">
            <p class="label_2_semibold">{{ item.title }}</p>

            <span
              class="rounded px-2 py-[2px] caption_1_medium"
              :class="item.badgeClass"
            >
              {{ item.badge }}
            </span>
          </div>

          <!-- Description -->
          <p class="label_2_regular">
            {{ item.description }}
          </p>

          <!-- Time -->
          <p class="body_4_regular">
            {{ item.time }}
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div
      v-if="notifications.length"
      class="m-2 flex cursor-pointer items-center justify-center gap-2 rounded-md border bg-[#F3F4F6] p-2 text-[#374151]"
      @click="clearAll"
    >
      <img :src="ClearIcon" />
      <span class="label_2_medium">Clear All</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ClearIcon from "../../assets/images/ClearIcon.svg";
import BellIcon from "../../assets/images/BellIcon.svg"

defineProps({
  open: Boolean,
  isCollapsed: Boolean,
});

const activeTab = ref("all");

/* 🔥 REACTIVE DATA */
const notifications = ref([
  {
    id: 1,
    type: "review",
    title: "AI draft ready for review",
    description:
      'Your post draft for "New Product Launch" is ready. Review and approve to publish.',
    badge: "Review",
    badgeClass: "bg-[#E9F2FF] text-[#1D7AFC] border border-[#CCE0FF]",
    time: "Just now",
  },
  {
    id: 2,
    type: "review",
    title: "AI suggested a rewrite",
    description:
      'A better headline is recommended for your blog post "Top 10 Social Tips".',
    badge: "Suggestion",
    badgeClass: "bg-[#F3F0FF] text-[#6E5DC6] border border-[#B8ACF6]",
    time: "15 minutes ago",
  },
  {
    id: 3,
    type: "reminder",
    title: "Scheduled post pending approval",
    description:
      '"Black Friday Offer" is scheduled for tomorrow. Approve before publishing.',
    badge: "Reminder",
    badgeClass: "bg-[#FFF7D6] text-[#B38600] border border-[#F5CD47]",
    time: "1 hour ago",
  },
  {
    id: 4,
    type: "error",
    title: "Publishing failed",
    description:
      "Instagram API connection failed. Reconnect to continue auto-posting.",
    badge: "Error",
    badgeClass: "bg-[#FFECEB] text-[#E2483D] border border-[#F87168]",
    time: "2 hours ago",
  },
]);

/* TABS (AUTO COUNTS) */
const tabs = computed(() => [
  { key: "all", label: "All", count: notifications.value.length },
  {
    key: "review",
    label: "Drafts & Review",
    count: notifications.value.filter(n => n.type === "review").length,
  },
  {
    key: "reminder",
    label: "Reminders",
    count: notifications.value.filter(n => n.type === "reminder").length,
  },
  {
    key: "error",
    label: "System Errors",
    count: notifications.value.filter(n => n.type === "error").length,
  },
]);

/* FILTER */
const filteredNotifications = computed(() => {
  if (activeTab.value === "all") return notifications.value;
  return notifications.value.filter(n => n.type === activeTab.value);
});

/* CLEAR ALL */
const clearAll = () => {
  notifications.value = [];
  activeTab.value = "all";
};
</script>
