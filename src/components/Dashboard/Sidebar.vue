<template>
  <aside
    class="flex h-screen flex-col border-r bg_white transition-all duration-300"
    :class="isCollapsed ? 'w-16 px-2' : 'w-64 px-4'"
    @click="handleSidebarContainerClick"
  >
    <!-- Logo + Toggle -->
    <div class=" flex items-center  pt-6" 
    :class="isCollapsed ? 'justify-center':'justify-between' "
   >
      <div class="flex items-center gap-2">
        <div @click="handleToggleCollapse"
          class="h-7 w-7 rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
        ></div>

        <span
          v-if="!isCollapsed"
          class="heading_h5_semibold_logo gradient_text_color"
        >
          Genius AI
        </span>
      </div>

      <button v-if="!isCollapsed"  @click="handleToggleCollapse">
        <img :src="SidebarIcon" alt="" />
      </button>
    </div>
 <div class="block h-[2px] w-full bg_primary_color common_gap"></div>
    <!-- New Chat -->
    <div class="relative group common_gap">
      <button
        @click="handleSidebarClick('chat')"
        class="flex w-full items-center gap-2 rounded-md secondary_bg_color secondary_text_color px-3 py-3"
        :class="isCollapsed ? 'justify-center' : ''"
      >
        <img :src="PlusIcon" class="h-5 w-5" />
        <span v-if="!isCollapsed">New Chat</span>
      </button>

      <div
        v-if="isCollapsed"
        class="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 rounded-md bg-gray-900 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
      >
        New Chat
      </div>
    </div>

    <!-- Chat History -->
    <div v-if="!isCollapsed" class="mb-6 mt-4">
      <p class="mb-2 label_2_semibold">Chat history</p>
      <div class="space-y-1">
        <div class="px-2 py-2 body_3_regular flex justify-between"><span>Create new product</span> <span class="dot_text_style text-2xl mt-[-0.45em]">...</span></div>
        <div class="px-2 py-2 body_3_regular flex justify-between"><span>Generate marketing plan</span> <span class="dot_text_style text-2xl mt-[-0.45em]">...</span></div>
        <div class="px-2 py-2 body_3_regular flex justify-between"><span>Create Instagram post</span> <span class="dot_text_style text-2xl mt-[-0.45em]">...</span></div>
      </div>
    </div>

    <!-- Menu -->
    <nav class=" space-y-2 mt-12">
      <div
        v-for="item in menuItems"
        :key="item.tab"
        @click="handleSidebarClick(item.tab)"
        class="relative group flex cursor-pointer items-center gap-3 rounded-md py-2"
        :class="[
          activeTab === item.tab ? 'bg_primary_color' : '',
          isCollapsed ? 'justify-center' : 'px-2'
        ]"
      >
        <img :src="item.icon" class="h-5 w-5" />

        <span v-if="!isCollapsed" class="label_1_medium">
          {{ item.label }}
        </span>

        <div
          v-if="isCollapsed"
          class="pointer-events-none absolute left-14 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
        >
          {{ item.label }}
        </div>
      </div>
    </nav>
    
<div>
  <div class="absolute bottom-3 "
  :class="isCollapsed ? 'w-[2.875em]' : 'w-56'">

     <div class="block h-[2px] w-full bg_primary_color " :class="isCollapsed ? 'hidden' : ''"></div>
    <div
        @click="handleSidebarClick(notification.tab)"
        class="relative group flex cursor-pointer items-center gap-3 rounded-md py-2 medium_gap"
        :class=" showNotifications ? 'bg_primary_color' : '',
          isCollapsed ? 'justify-center' : 'px-2'
        "
      >
        <img :src="notification.icon" class="h-5 w-5" />

        <span v-if="!isCollapsed" class="label_1_medium">
          {{ notification.label }}
        </span>

        <div
          v-if="isCollapsed"
          class="pointer-events-none absolute left-14 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
        >
          {{ notification.label }}
        </div>
      </div>

      <div class="block h-[2px] w-full bg_primary_color medium_gap"></div>


    <!-- User -->
    <div
      class=" mt-7 p-2 flex items-center gap-3 rounded-md border cursor-pointer"
      :class="isCollapsed ? 'justify-center' : ''"
      @click.stop="showUserAccount = true"
    >
      <img src="https://i.pravatar.cc/40" class="h-8 w-8 rounded-full" />
      <div v-if="!isCollapsed">
        <p class="label_2_semibold">Cliff Booth</p>
        <p class="label_3_regular">cliffbooth@gmail.com</p>
      </div>
    </div>
   </div> 
   </div> 
      <!-- 🔔 NOTIFICATION POPUP -->
  <NotificationPopup
    :open="showNotifications"
    :isCollapsed="isCollapsed"
    @close="showNotifications = false"
  />
  <!-- 👤 USER ACCOUNT POPUP -->
  <UserAccountPopup
    :open="showUserAccount"
    :isCollapsed="isCollapsed"
    @close="showUserAccount = false"
    @signOut="handleSignOut"
  />
  </aside>


</template>

<script setup>
import { ref } from "vue";

/* ✅ IMPORT POPUP */
import NotificationPopup from "../../components/Dashboard/NotificationsView.vue";
import UserAccountPopup from "../../components/Dashboard/UserAccountPopup.vue";

import SidebarIcon from "../../assets/images/SidebarIcon.svg";
import PlusIcon from "../../assets/images/PlusIcon.svg";
import CalenderIcon from "../../assets/images/CalendarIcon.svg";
import SettingsIcon from "../../assets/images/SettingsIcon.svg";
import NotificationIcon from "../../assets/images/NotificationIcon.svg";
import ProductIcon from "../../assets/images/ProductIcon.svg";
import AnalyticsIcon from "../../assets/images/AnalyticsIcon.svg";

defineProps({
  activeTab: String,
});

const emit = defineEmits(["changeTab"]);
const changeTab = (tab) => emit("changeTab", tab);

const isCollapsed = ref(false);
const showNotifications = ref(false);
const showUserAccount = ref(false);

const handleSignOut = () => {
  // Handle sign out logic here
  console.log("Sign out clicked");
  // You can add router navigation or API call here
};

const handleSidebarClick = (tab) => {
  // Close user account popup if open
  if (showUserAccount.value) {
    showUserAccount.value = false;
  }
  
  // Handle the tab click
  if (tab === 'notifications') {
    showNotifications.value = true;
  } else {
    changeTab(tab);
  }
};

const handleToggleCollapse = () => {
  // Close user account popup if open
  if (showUserAccount.value) {
    showUserAccount.value = false;
  }
  isCollapsed.value = !isCollapsed.value;
};

const handleSidebarContainerClick = (event) => {
  // Close user account popup if open and click is not on the user div
  // The user div has @click.stop so it won't trigger this
  if (showUserAccount.value) {
    showUserAccount.value = false;
  }
};

const menuItems = [
  { icon: CalenderIcon, label: "Calendar", tab: "calendar" },
  { icon: AnalyticsIcon, label: "Analytics", tab: "analytics" },
  { icon: ProductIcon, label: "Products", tab: "products" },
  { icon: SettingsIcon, label: "Settings", tab: "settings" },
  // { icon: NotificationIcon, label: "Notifications", tab: "notifications" },
];

const notification = { icon: NotificationIcon, label: "Notifications", tab: "notifications" }
</script>
