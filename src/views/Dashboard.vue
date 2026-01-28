<template>
  <div class="flex min-h-screen bg_white overflow-hidden">
    <!-- Desktop Sidebar -->
    <Sidebar
      class="hidden lg:flex"
      :activeTab="activeTab"
      @changeTab="handleTabChange"
      @collapseChange="isSidebarCollapsed = $event"
      @newChat="handleNewChat"
    />

    <!-- Mobile Sidebar -->
    <SidebarMobile
      :is-open="showMobileSidebar"
      :activeTab="activeTab"
      @close="showMobileSidebar = false"
      @changeTab="handleTabChange"
      @newChat="handleNewChat"
    />

    <!-- Main Area -->
    <div 
      class="flex flex-1 flex-col overflow-y-auto transition-all duration-300"
      :class="isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'"
    >
      <!-- Mobile Header -->
      <header
        class="flex items-center gap-3 bg-transparent px-4 py-3 absolute lg:hidden"
      >
        <button @click="showMobileSidebar = true" class="text-xl">
          <img :src="MobileMenuIcon" alt="">
        </button>
      </header>

      <!-- Content -->
      
        <ChatView v-if="activeTab === 'chat'" :resetChat="resetChatFlag" :isSidebarCollapsed="isSidebarCollapsed" @reset-complete="resetChatFlag = false" />
        <CalendarView v-else-if="activeTab === 'calendar'" />
        <AnalyticsView v-else-if="activeTab === 'analytics'" />
        <ProductsView v-else-if="activeTab === 'products'" />
        <SettingsView v-else-if="activeTab === 'settings'" />
        <NotificationsView v-if="activeTab === 'notifications'" :open="true" :isCollapsed="false" @close="handleNotificationsClose" class="lg:hidden" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import Sidebar from "../components/Dashboard/Sidebar.vue";
import SidebarMobile from "../components/Dashboard/SidebarMobile.vue";

import ChatView from "./ChatView.vue";
import CalendarView from "./CalendarView.vue";
import AnalyticsView from "./AnalyticsView.vue";
import ProductsView from "./ProductsView.vue";
import SettingsView from "./SettingsView.vue";
import NotificationsView from "../components/Dashboard/NotificationsView.vue";
import SidebarIcon from "../assets/images/SidebarIcon.svg"
import MobileMenuIcon from "../assets/images/MobileMenuIcon.svg"

const route = useRoute();
const router = useRouter();
const activeTab = ref("chat");
const showMobileSidebar = ref(false);
const isSidebarCollapsed = ref(false);
const resetChatFlag = ref(false);

// Map route paths to tab names
const routeToTabMap = {
  '/chat' : 'chat',
  '/calendar': 'calendar',
  '/analytics': 'analytics',
  '/products': 'products',
  '/settings': 'settings',
  '/dashboard': 'chat' // default to chat
};

// Get active tab from route path
const getTabFromRoute = () => {
  const path = route.path;
  return routeToTabMap[path] || 'chat';
};

// Update active tab when route changes
const updateActiveTabFromRoute = () => {
  const tab = getTabFromRoute();
  if (activeTab.value !== tab) {
    activeTab.value = tab;
  }
};

// Navigate to route when tab changes
const navigateToTab = (tab) => {
  const tabToRouteMap = {
    'chat': '/chat',
    'calendar': '/calendar',
    'analytics': '/analytics',
    'products': '/products',
    'settings': '/settings'
  };
  
  const routePath = tabToRouteMap[tab];
  if (routePath && route.path !== routePath) {
    router.push(routePath);
  }
};

onMounted(() => {
  updateActiveTabFromRoute();
});

// Watch for route changes
watch(() => route.path, () => {
  updateActiveTabFromRoute();
});

const handleTabChange = (tab) => {
  // Set activeTab first
  activeTab.value = tab;
  
  // For notifications, don't navigate (no route), just close mobile sidebar
  if (tab === 'notifications') {
    showMobileSidebar.value = false;
    return;
  }
  
  // For other tabs, navigate to route
  navigateToTab(tab);
  showMobileSidebar.value = false;
};

const handleNewChat = () => {
  resetChatFlag.value = true;
};

const handleNotificationsClose = () => {
  activeTab.value = 'chat';
  router.push('/chat');
};
</script>
