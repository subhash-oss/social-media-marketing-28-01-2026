<template>
  <!-- Overlay -->
  <div
    class="fixed inset-0 z-40 bg_overlay lg:hidden transition-opacity duration-300 ease-in-out"
    :class="{ 'opacity-0': !isOpen, 'pointer-events-none': !isOpen }"
    @click="$emit('close')"
  ></div>

  <!-- Sidebar -->
  <aside
    class="fixed left-0 top-0 z-50 h-full w-72 bg_secondary_color p-4 shadow-lg lg:hidden transform transition-transform duration-300 ease-in-out overflow-auto hide-scrollbar"
    :class="{ '-translate-x-full': !isOpen, 'pointer-events-none': !isOpen }"
    @click="handleSidebarContainerClick"
  >
    <!-- Header -->
    <div class=" flex items-center justify-between">
      <div class="flex items-center gap-lg heading_h5_semibold gradient_text_color">
        <div
          class="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
        ></div>
        Genius AI
      </div>
      <button @click="$emit('close')" class="text-xl secondary_text_color">✕</button>
    </div>
    <div class="block h-[1px] w-full bg-gray-25 mt-6xl"></div>
    <!-- New Chat -->
    <button class="button-gradient w-full" @click="handleNewChatClick">
          <span class="flex gap-md items-center w-full p-xl bg_primary_color primary_text_color label_2_semibold"
           :class="isCollapsed ? 'justify-center' : ''"
          >
            <img :src="PlusIcon" class="h-4 w-4" />
            <span v-if="!isCollapsed">New Chat</span>
          </span>
        </button>

    <!-- Chat History -->
    <p class="mt-6xl label_3_semibold primary_text_color">Chat history</p>
    <div class="mt-xl">
      <div class="cursor-pointer mt-lg p-md md:mt-xl md:p-xl label_2_regular primary_text_color flex justify-between hover:bg-info-50-hover border border-transparent hover:border-gray-50 rounded-lg">
        <span>Create new product</span> <span class="text-black-50 text-2xl mt-[-0.45em]">...</span>
      </div>
      <div class=" cursor-pointer mt-xl p-xl label_2_regular primary_text_color flex justify-between hover:bg-info-50-hover border border-transparent hover:border-gray-50 rounded-lg">
        <span>Generate marketing plan</span> <span class="text-black-50 text-2xl mt-[-0.45em]">...</span>
      </div>
      <div class=" cursor-pointer mt-xl p-xl label_2_regular primary_text_color flex justify-between hover:bg-info-50-hover border border-transparent hover:border-gray-50 rounded-lg">
       <span>Create Instagram post</span> <span class="text-black-50 text-2xl mt-[-0.45em]">...</span>
      </div>
    </div>

    <!-- Menu -->
    <nav class="">
      <div
        v-for="item in menuItems"
        :key="item.tab"
        @click="handleSidebarClick(item.tab)"
        class="flex cursor-pointer items-center gap-lg  p-xl"
      >
        <img :src="item.icon" alt="">
        <span v-if="!isCollapsed" class="label_2_semibold primary_text_color">{{ item.label }}</span>
      </div>
    </nav>

    <!-- User -->
  <div>
  <div class="sidebar_bottom_section absolute bottom-3"
  :class="isCollapsed ? 'w-[2.875em] ' : 'w-64'">

    <div class="block h-[1px] w-full bg-gray-25 mt-6xl " :class="isCollapsed ? 'hidden' : ''"></div>
   
      <div
        @click="handleSidebarClick(notification.tab)"
        class="relative group flex cursor-pointer items-center gap-lg rounded-md py-md mt-md"
        :class=" showNotifications ? 'bg_primary_color' : '',
          isCollapsed ? 'justify-center' : 'px-2'
        "
      >
        <img :src="notification.icon" class="h-5 w-5" />

        <span v-if="!isCollapsed" class="label_1_medium primary_text_color">
          {{ notification.label }}
        </span>

        <div
          v-if="isCollapsed"
          class="pointer-events-none absolute left-14 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
        >
          {{ notification.label }}
        </div>
      </div>

      <div class="block h-[1px] w-full bg-gray-25 mt-md"></div>


    <!-- User -->
    <div
      class=" mt-7 p-2 flex items-center gap-3 rounded-md border cursor-pointer"
      :class="isCollapsed ? 'justify-center' : ''"
      @click.stop="showUserAccount = true"
    >
      <img src="https://i.pravatar.cc/40" class="h-8 w-8 rounded-full" />
      <div v-if="!isCollapsed">
        <p class="label_2_semibold primary_text_color">Cliff Booth</p>
        <p class="label_3_regular secondary_text_color">cliffbooth@gmail.com</p>
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
  // Close mobile sidebar after clicking
  emit('close');
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
