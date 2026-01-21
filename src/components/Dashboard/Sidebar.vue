<template>
  <aside
    class="fixed left-0 top-0 lg:top-[-20px] h-screen flex flex-col border-r bg_white transition-all duration-300 z-10"
    :class="isCollapsed ? 'w-16 px-2' : 'w-64 pl-4 pr-1'"
    @click="handleSidebarContainerClick"
  >
    <div class="flex-1 overflow-y-auto custom_scrollbar pr-3">
    <!-- Logo + Toggle -->
    <div class=" flex items-center pt-6 lg:pt-12" 
    :class="isCollapsed ? 'justify-center':'justify-between' "
   >
      <div class="flex items-center gap-2">
        <div 
          @click="handleToggleCollapse"
          @mouseenter="() => { if (isCollapsed) hoverLogo = true }"
          @mouseleave="() => { if (isCollapsed) hoverLogo = false }"
          class="relative h-7 w-7 rounded-full cursor-pointer overflow-hidden flex items-center justify-center transition-all duration-200"
          :class="isCollapsed ? (hoverLogo ? 'opacity-100 bg-transparent' : 'bg-gradient-to-r from-pink-500 to-purple-600') : 'bg-gradient-to-r from-pink-500 to-purple-600'"
        >
          <img 
            v-if="isCollapsed"
            :src="SidebarIcon" 
            alt="" 
            class="h-4 w-4 transition-opacity duration-200 relative z-10"
            :class="hoverLogo ? 'opacity-100' : 'opacity-0'"
          />
        </div>

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
    <div 
      class="relative group common_gap"
      @mouseenter="hoveredItem = 'chat'"
      @mouseleave="hoveredItem = null"
      :ref="el => { if (el) menuItemRefs['chat'] = el }"
    >
      <button
        @click="handleSidebarClick('chat')"
        class="flex w-full items-center gap-2 rounded-md secondary_bg_color secondary_text_color px-3 py-3 label_1_bold"
        :class="isCollapsed ? 'justify-center' : ''"
      >
        <img :src="PlusIcon" class="h-4 w-4" />
        <span v-if="!isCollapsed">New Chat</span>
      </button>

      <Teleport to="body">
        <div
          v-if="isCollapsed && hoveredItem === 'chat'"
          :style="getTooltipStyle('chat')"
          class="pointer-events-none fixed whitespace-nowrap rounded-md bg-gray-900 px-3 py-1 text-xs text-white z-[9999] transition-opacity duration-200"
        >
          New Chat
        </div>
      </Teleport>
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
        @mouseenter="hoveredItem = item.tab"
        @mouseleave="hoveredItem = null"
        class="relative group flex cursor-pointer items-center gap-3 rounded-md py-2"
        :class="[
          activeTab === item.tab ? 'bg_primary_color' : '',
          isCollapsed ? 'justify-center' : 'px-2'
        ]"
        :ref="el => { if (el) menuItemRefs[item.tab] = el }"
      >
        <img :src="item.icon" class="h-5 w-5" />

        <span v-if="!isCollapsed" class="label_1_medium">
          {{ item.label }}
        </span>

        <Teleport to="body">
          <div
            v-if="isCollapsed && hoveredItem === item.tab"
            :style="getTooltipStyle(item.tab)"
            class="pointer-events-none fixed whitespace-nowrap rounded-md bg-gray-900 px-3 py-1 text-xs text-white z-[9999] transition-opacity duration-200"
          >
            {{ item.label }}
          </div>
        </Teleport>
      </div>
    </nav>
    
<div>
  <div class="sidebar_bottom_section"
  :class="isCollapsed ? 'w-[2.875em] absolute bottom-0' : 'w-52'">

     <div class="block h-[2px] w-full bg_primary_color " :class="isCollapsed ? 'hidden' : ''"></div>
    <div
        @click="handleSidebarClick(notification.tab)"
        @mouseenter="hoveredItem = 'notifications'"
        @mouseleave="hoveredItem = null"
        class="relative group flex cursor-pointer items-center gap-3 rounded-md py-2 medium_gap"
        :class=" showNotifications ? 'bg_primary_color' : '',
          isCollapsed ? 'justify-center' : 'px-2'
        "
        :ref="el => { if (el) menuItemRefs['notifications'] = el }"
      >
        <img :src="notification.icon" class="h-5 w-5" />

        <span v-if="!isCollapsed" class="label_1_medium">
          {{ notification.label }}
        </span>

        <Teleport to="body">
          <div
            v-if="isCollapsed && hoveredItem === 'notifications'"
            :style="getTooltipStyle('notifications')"
            class="pointer-events-none fixed whitespace-nowrap rounded-md bg-gray-900 px-3 py-1 text-xs text-white z-[9999] transition-opacity duration-200"
          >
            {{ notification.label }}
          </div>
        </Teleport>
      </div>

      <div class="block h-[2px] w-full bg_primary_color medium_gap"></div>


    <!-- User -->
    <div
      class="relative group mt-7 p-2 flex items-center gap-3 rounded-md border cursor-pointer"
      :class="isCollapsed ? 'justify-center' : ''"
      @click.stop="showUserAccount = true"
      @mouseenter="hoveredItem = 'account'"
      @mouseleave="hoveredItem = null"
      :ref="el => { if (el) menuItemRefs['account'] = el }"
    >
      <img src="https://i.pravatar.cc/40" class="h-8 w-8 rounded-full" />
      <div v-if="!isCollapsed">
        <p class="label_2_semibold">Cliff Booth</p>
        <p class="label_3_regular">cliffbooth@gmail.com</p>
      </div>
      <Teleport to="body">
        <div
          v-if="isCollapsed && hoveredItem === 'account'"
          :style="getTooltipStyle('account')"
          class="pointer-events-none fixed whitespace-nowrap rounded-md bg-gray-900 px-3 py-1 text-xs text-white z-[9999] transition-opacity duration-200"
        >
          Account
        </div>
      </Teleport>
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
import { ref, onMounted, nextTick } from "vue";

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

const emit = defineEmits(["changeTab", "collapseChange"]);
const changeTab = (tab) => emit("changeTab", tab);

const isCollapsed = ref(false);
const showNotifications = ref(false);
const showUserAccount = ref(false);
const hoveredItem = ref(null);
const menuItemRefs = ref({});
const hoverLogo = ref(false);

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
  emit("collapseChange", isCollapsed.value);
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

const getTooltipStyle = (itemKey) => {
  const element = menuItemRefs.value[itemKey];
  if (!element) return { display: 'none' };
  
  const rect = element.getBoundingClientRect();
  return {
    left: `${rect.right + 8}px`,
    top: `${rect.top + rect.height / 2}px`,
    transform: 'translateY(-50%)',
  };
};

// Emit initial collapsed state
onMounted(() => {
  emit("collapseChange", isCollapsed.value);
});
</script>
