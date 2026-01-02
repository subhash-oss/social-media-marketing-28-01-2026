<template>
  <div class="flex min-h-screen bg-white">
    <!-- Desktop Sidebar -->
    <Sidebar
      class="hidden lg:flex"
      :activeTab="activeTab"
      @changeTab="activeTab = $event"
    />

    <!-- Mobile Sidebar -->
    <SidebarMobile
      :is-open="showMobileSidebar"
      :activeTab="activeTab"
      @close="showMobileSidebar = false"
      @changeTab="handleTabChange"
    />

    <!-- Main Area -->
    <div class="flex flex-1 flex-col">
      <!-- Mobile Header -->
      <header
        class="flex items-center gap-3 border-b bg-white px-4 py-3 lg:hidden"
      >
        <button @click="showMobileSidebar = true" class="text-xl">
          <img :src="SidebarIcon" alt="">
        </button>
        <span class="font-semibold">Genius AI</span>
      </header>

      <!-- Content -->
      <main class="flex-1 bg-gradient-to-br from-[#F6F3FF] to-white px-6 py-10">
        <ChatView v-if="activeTab === 'chat'" />
        <CalendarView v-else-if="activeTab === 'calendar'" />
        <AnalyticsView v-else-if="activeTab === 'analytics'" />
        <ProductsView v-else-if="activeTab === 'products'" />
        <SettingsView v-else-if="activeTab === 'settings'" />
        <NotificationsView v-if="activeTab === 'notifications'" :open="true" :isCollapsed="false" @close="activeTab = 'chat'" class="lg:hidden" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import Sidebar from "../components/Dashboard/Sidebar.vue";
import SidebarMobile from "../components/Dashboard/SidebarMobile.vue";

import ChatView from "../components/Dashboard/ChatView.vue";
import CalendarView from "../components/Dashboard/CalendarView.vue";
import AnalyticsView from "../components/Dashboard/AnalyticsView.vue";
import ProductsView from "../components/Dashboard/ProductsView.vue";
import SettingsView from "../components/Dashboard/SettingsView.vue";
import NotificationsView from "../components/Dashboard/NotificationsView.vue";
import SidebarIcon from "../assets/images/SidebarIcon.svg"

const activeTab = ref("chat");
const showMobileSidebar = ref(false);

const handleTabChange = (tab) => {
  activeTab.value = tab;
  showMobileSidebar.value = false;
};
</script>
