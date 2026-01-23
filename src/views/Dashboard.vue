<template>
  <div class="flex min-h-screen bg_white overflow-hidden">
    <!-- Desktop Sidebar -->
    <Sidebar
      class="hidden lg:flex"
      :activeTab="activeTab"
      @changeTab="activeTab = $event"
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
        <NotificationsView v-if="activeTab === 'notifications'" :open="true" :isCollapsed="false" @close="activeTab = 'chat'" class="lg:hidden" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import Sidebar from "../components/Dashboard/Sidebar.vue";
import SidebarMobile from "../components/Dashboard/SidebarMobile.vue";

import ChatView from "../components/Dashboard/ChatView.vue";
import CalendarView from "../components/Dashboard/CalendarView.vue";
import AnalyticsView from "../components/Dashboard/AnalyticsView.vue";
import ProductsView from "../components/Dashboard/ProductsView.vue";
import SettingsView from "../components/Dashboard/SettingsView.vue";
import NotificationsView from "../components/Dashboard/NotificationsView.vue";
import SidebarIcon from "../assets/images/SidebarIcon.svg"
import MobileMenuIcon from "../assets/images/MobileMenuIcon.svg"

const route = useRoute();
const router = useRouter();
const activeTab = ref("chat");
const showMobileSidebar = ref(false);
const isSidebarCollapsed = ref(false);
const resetChatFlag = ref(false);

// Check query parameter on mount and route changes
const checkTabQuery = () => {
  if (route.query.tab && typeof route.query.tab === 'string') {
    const validTabs = ['chat', 'calendar', 'analytics', 'products', 'settings'];
    if (validTabs.includes(route.query.tab)) {
      activeTab.value = route.query.tab;
    }
    // Remove query parameter after using it to clean up the URL
    router.replace({ query: {} });
  }
};

onMounted(() => {
  checkTabQuery();
});

watch(() => route.query, () => {
  checkTabQuery();
}, { deep: true });

const handleTabChange = (tab) => {
  activeTab.value = tab;
  showMobileSidebar.value = false;
};

const handleNewChat = () => {
  resetChatFlag.value = true;
};
</script>
