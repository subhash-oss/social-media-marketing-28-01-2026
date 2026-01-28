<template>
  <!-- Overlay -->
  <div
    class="fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity duration-300 ease-in-out"
    :class="{ 'opacity-0': !isOpen, 'pointer-events-none': !isOpen }"
    @click="$emit('close')"
  ></div>

  <!-- Sidebar -->
  <aside
    class="fixed left-0 top-0 z-50 h-full w-72 bg_white p-4 shadow-lg lg:hidden transform transition-transform duration-300 ease-in-out overflow-auto hide-scrollbar"
    :class="{ '-translate-x-full': !isOpen, 'pointer-events-none': !isOpen }"
    @click="handleSidebarContainerClick"
  >
    <!-- Header -->
    <div class=" flex items-center justify-between">
      <div class="flex items-center gap-2 heading_h5_semibold_logo gradient_text_color">
        <div
          class="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
        ></div>
        Genius AI
      </div>
      <button @click="$emit('close')" class="text-xl">✕</button>
    </div>
    <div class="block h-[2px] w-full bg_primary_color common_gap"></div>
    <!-- New Chat -->
    <button
      @click="handleNewChatClick"
      class="mb-6 w-full rounded-md secondary_bg_color py-3 text-sm font-medium secondary_text_color secondary_label_medium flex gap-2 common_gap"
    >
      <img :src="PlusIcon" alt="" class="ml-3"> New Chat
    </button>

    <!-- Chat History -->
    <p class="mb-2 label_2_semibold">Chat history</p>
    <div class="mb-6 space-y-1 text-sm">
      <div class="px-2 py-2 body_3_regular flex justify-between">
        <span>Create new product</span> <span class="dot_text_style text-2xl mt-[-0.45em]">...</span>
      </div>
      <div class=" px-2 py-2 body_3_regular flex justify-between">
        <span>Generate marketing plan</span> <span class="dot_text_style text-2xl mt-[-0.45em]">...</span>
      </div>
      <div class=" px-2 py-2 body_3_regular flex justify-between">
       <span>Create Instagram post</span> <span class="dot_text_style text-2xl mt-[-0.45em]">...</span>
      </div>
    </div>

    <!-- Menu -->
    <nav class="space-y-2 text-sm">
      <div
        v-for="item in menuItems"
        :key="item.tab"
        @click="handleSidebarClick(item.tab)"
        class="flex cursor-pointer items-center gap-3  px-2 py-2"
      >
        <img :src="item.icon" alt="">
        <span v-if="!isCollapsed" class="label_1_medium">{{ item.label }}</span>
      </div>
    </nav>

    <!-- User -->
  <div>
  <div class="sidebar_bottom_section absolute bottom-3"
  :class="isCollapsed ? 'w-[2.875em] ' : 'w-64'">

     <div class="block h-[2px] w-full bg_primary_color " :class="isCollapsed ? 'hidden' : ''"></div>
    <div
        @click="handleSidebarClick(notification.tab)"
        class="relative group flex cursor-pointer items-center gap-3 rounded-md py-2 regular_gap"
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

      <div class="block h-[2px] w-full bg_primary_color regular_gap"></div>


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
  </aside>

  <!-- 👤 USER ACCOUNT POPUP (Mobile) -->
  <UserAccountPopup
    :open="showUserAccount"
    :isCollapsed="false"
    @close="showUserAccount = false"
    @signOut="handleSignOut"
  />
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import PlusIcon from "../../assets/images/PlusIcon.svg";
import CalenderIcon from "../../assets/images/CalendarIcon.svg";
import SettingsIcon from "../../assets/images/SettingsIcon.svg";
import NotificationIcon from "../../assets/images/NotificationIcon.svg";
import ProductIcon from "../../assets/images/ProductIcon.svg";
import AnalyticsIcon from "../../assets/images/AnalyticsIcon.svg";
import UserAccountPopup from "../../components/Dashboard/UserAccountPopup.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["changeTab", "close", "newChat"]);
const router = useRouter();

const select = (tab) => emit("changeTab", tab);

const showUserAccount = ref(false);

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
  select(tab);
  // Close mobile sidebar after selecting
  emit('close');
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
