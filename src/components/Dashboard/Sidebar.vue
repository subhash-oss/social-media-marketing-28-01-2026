<template>
  <aside
    class="fixed left-0 top-0 lg:top-[-20px] h-screen flex flex-col  bg_secondary_color transition-all duration-300 z-10"
    :class="isCollapsed ? 'w-20 px-3xl' : 'w-60 pl-4xl pr-xs'"
    @click="handleSidebarContainerClick"
  >
    <div class="flex-1 overflow-y-auto custom_scrollbar ">
    <!-- Logo + Toggle -->
    <div class=" flex items-center pt-6xl lg:pt-11xl" 
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
          class="heading_h5_semibold gradient_text_color"
        >
          Genius AI
        </span>
      </div>

      <button v-if="!isCollapsed"  @click="handleToggleCollapse">
        <img :src="SidebarIcon" alt="" />
      </button>
    </div>
 <div class="block h-[1px] w-full bg-gray-25 mt-6xl"></div>
    <!-- New Chat -->
    <div 
      class="relative group mt-6xl"
      @mouseenter="hoveredItem = 'chat'"
      @mouseleave="hoveredItem = null"
      :ref="el => { if (el) menuItemRefs['chat'] = el }"
    >
      <button
        @click="handleNewChatClick"
        class="w-full rounded-md secondary_bg_color secondary_text_brand_color px-3 py-3 label_1_bold"
        :class="isCollapsed ? 'justify-center' : ''"
      >
      <span class="flex gap-2 items-center">
        <img :src="PlusIcon" class="h-4 w-4" />
        <span v-if="!isCollapsed">New Chat</span>
      </span>
      </button>

      <Teleport to="body">
        <div
          v-if="isCollapsed && hoveredItem === 'chat'"
          :style="getTooltipStyle('chat')"
          class="pointer-events-none fixed whitespace-nowrap z-[1000] transition-all duration-200 "
        >
          <div class="relative bg_tooltip_color text-white label_2_medium rounded-lg px-2 py-2 outline-none ring-0 border_none">
            New Chat
            <!-- Speech Bubble Tail -->
            <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border_none ">
              <div class="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-[#38414A]"></div>
            </div>
          </div>
        </div>
      </Teleport>
    </div>

    <!-- Chat History -->
    <div v-if="!isCollapsed" class="mb-6 mt-4">
      <p class="mb-2 label_2_semibold primary_text_color">Chat history</p>
      <div class="space-y-1">
        <div class="px-2 py-2 body_3_regular secondary_text_color flex justify-between"><span>Create new product</span> <span class="dot_text_style text-2xl mt-[-0.45em]">...</span></div>
        <div class="px-2 py-2 body_3_regular secondary_text_color flex justify-between"><span>Generate marketing plan</span> <span class="dot_text_style text-2xl mt-[-0.45em]">...</span></div>
        <div class="px-2 py-2 body_3_regular secondary_text_color flex justify-between"><span>Create Instagram post</span> <span class="dot_text_style text-2xl mt-[-0.45em]">...</span></div>
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

        <span v-if="!isCollapsed" class="label_1_medium primary_text_color">
          {{ item.label }}
        </span>

        <Teleport to="body">
          <div
            v-if="isCollapsed && hoveredItem === item.tab"
            :style="getTooltipStyle(item.tab)"
            class="pointer-events-none fixed whitespace-nowrap z-[1000] transition-all duration-200"
          >
            <div class="relative bg_tooltip_color text-white label_2_medium rounded-lg px-2 py-2 outline-none ring-0 border_none">
              {{ item.label }}
              <!-- Speech Bubble Tail -->
              <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border_none">
                <div class="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-[#38414A]"></div>
              </div>
            </div>
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
        class="relative group flex cursor-pointer items-center gap-3 rounded-md py-2 mt-xl"
        :class=" showNotifications ? 'bg_primary_color' : '',
          isCollapsed ? 'justify-center' : 'px-2'
        "
        :ref="el => { if (el) menuItemRefs['notifications'] = el }"
      >
        <img :src="notification.icon" class="h-5 w-5" />

        <span v-if="!isCollapsed" class="label_1_medium primary_text_color">
          {{ notification.label }}
        </span>

        <Teleport to="body">
          <div
            v-if="isCollapsed && hoveredItem === 'notifications'"
            :style="getTooltipStyle('notifications')"
            class="pointer-events-none fixed whitespace-nowrap z-[1000] transition-all duration-200 "
          >
            <div class="relative bg_tooltip_color text-white label_2_medium rounded-lg px-2 py-2 outline-none ring-0 border_none">
              {{ notification.label }}
              <!-- Speech Bubble Tail -->
              <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border_none">
                <div class="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-[#38414A]"></div>
              </div>
            </div>
          </div>
        </Teleport>
      </div>

      <div class="block h-[2px] w-full bg_primary_color mt-xl"></div>


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
        <p class="label_2_semibold primary_text_color">Cliff Booth</p>
        <p class="label_3_regular secondary_text_color">cliffbooth@gmail.com</p>
      </div>
      <Teleport to="body">
        <div
          v-if="isCollapsed && hoveredItem === 'account'"
          :style="getTooltipStyle('account')"
          class="pointer-events-none fixed whitespace-nowrap z-[1000] transition-all duration-200"
        >
          <div class="relative bg_tooltip_color text-white label_2_medium rounded-lg px-2 py-2 outline-none ring-0 border_none">
            Account
            <!-- Speech Bubble Tail -->
            <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border_none">
              <div class="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-[#38414A]"></div>
            </div>
          </div>
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
import { useRouter } from "vue-router";

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

const emit = defineEmits(["changeTab", "collapseChange", "newChat"]);
const router = useRouter();
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

const handleNewChatClick = () => {
  // Close user account popup if open
  if (showUserAccount.value) {
    showUserAccount.value = false;
  }
  
  // Navigate to chat and emit newChat event
  router.push('/chat');
  emit('newChat');
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
