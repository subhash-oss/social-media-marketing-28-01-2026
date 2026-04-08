<template>
  <aside
    class="fixed left-0 top-0 lg:top-[-20px] h-screen flex flex-col  bg_secondary_color transition-all duration-300 z-10 border primary_border_color"
    :class="isCollapsed ? 'w-20 px-3xl' : 'w-64 pl-4xl pr-xs'" @click="handleSidebarContainerClick">
    <div class="flex-1 overflow-y-auto custom_scrollbar pr-3xl">
      <!-- Logo + Toggle -->
      <div class="relative group flex items-center pt-6xl lg:pt-11xl" 
        :class="isCollapsed ? 'justify-center':'justify-between' "
        @mouseenter="hoveredItem = 'logo'" 
        @mouseleave="hoveredItem = null"
        :ref="el => { if (el) menuItemRefs['logo'] = el }">
        <div class="flex items-center gap-lg">
          <div @click="handleToggleCollapse" @mouseenter="() => { if (isCollapsed) hoverLogo = true }"
            @mouseleave="() => { if (isCollapsed) hoverLogo = false }"
            class="relative h-7 w-7 rounded-full cursor-pointer overflow-hidden flex items-center justify-center transition-all duration-200"
            :class="isCollapsed ? (hoverLogo ? 'opacity-100 bg-transparent' : 'bg-gradient-to-r from-pink-500 to-purple-600') : 'bg-gradient-to-r from-pink-500 to-purple-600'">
            <img v-if="isCollapsed" :src="SidebarIcon" alt=""
              class="h-4 w-4 transition-opacity duration-200 relative z-10"
              :class="hoverLogo ? 'opacity-100' : 'opacity-0'" />
          </div>

          <span v-if="!isCollapsed" class="heading_h5_semibold gradient_text_color">
            Genius AI
          </span>
        </div>

        <button v-if="!isCollapsed" @click="handleToggleCollapse">
          <img :src="SidebarIcon" alt="" />
        </button>

        <Teleport to="body">
          <div v-if="isCollapsed && hoveredItem === 'logo'" :style="getTooltipStyle('logo')"
            class="pointer-events-none fixed whitespace-nowrap z-[1000] transition-all duration-200 ">
            <div
              class="relative bg-black-400 primary_2_text_color label_2_medium rounded-lg px-xl py-md outline-none ring-0 border_none mt-11xl">
              Open sidebar
              <!-- Speech Bubble Tail -->
              <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border_none ">
                <div class="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-black-400">
                </div>
              </div>
            </div>
          </div>
        </Teleport>
      </div>
      <div class="block h-[1px] w-full bg-gray-25 mt-6xl"></div>
      <!-- New Chat -->
      <div class="relative group mt-6xl" @mouseenter="hoveredItem = 'chat'" @mouseleave="hoveredItem = null"
        :ref="el => { if (el) menuItemRefs['chat'] = el }">

        <button class="button-gradient w-full" @click="handleNewChatClick">
          <span class="flex gap-md items-center w-full bg_primary_color primary_text_color label_2_semibold"
           :class="isCollapsed ? 'justify-center p-md' : 'p-xl'"
          >
            <img :src="PlusIcon" class="h-4 w-4" />
            <span v-if="!isCollapsed">New Chat</span>
          </span>
        </button>

        <Teleport to="body">
          <div v-if="isCollapsed && hoveredItem === 'chat'" :style="getTooltipStyle('chat')"
            class="pointer-events-none fixed whitespace-nowrap z-[1000] transition-all duration-200 ">
            <div
              class="relative bg-black-400 primary_2_text_color label_2_medium rounded-lg px-xl py-md outline-none ring-0 border_none">
              New Chat
              <!-- Speech Bubble Tail -->
              <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border_none ">
                <div class="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-black-400">
                </div>
              </div>
            </div>
          </div>
        </Teleport>
      </div>

      <!-- Chat History -->
      <div v-if="!isCollapsed" class="mt-6xl">
        <p class="label_3_semibold primary_text_color">Chat history</p>
        <div class="mt-xl max-h-[180px] overflow-y-auto custom_scrollbar pr-1">
          <!-- Dynamic Chat Sessions from API -->
          <div 
            v-for="session in chatSessions" 
            :key="session.id"
            :data-session-id="session.id"
            @click="handleSessionClick(session.id)"
            class="cursor-pointer mt-xl p-xl label_2_regular primary_text_color flex justify-between hover:bg-info-50-hover border border-transparent hover:border-gray-50 rounded-lg"
          >
            <span class="truncate">{{ session.title || 'Untitled Chat' }}</span>
            <span class="text-black-50 text-2xl mt-[-0.45em]">...</span>
          </div>
          <!-- Loading State -->
          <div v-if="isLoadingSessions" class="mt-xl p-xl label_2_regular secondary_text_color">
            Loading...
          </div>
          <!-- Empty State -->
          <div v-else-if="chatSessions.length === 0" class="mt-xl p-xl label_2_regular secondary_text_color">
            No chat history
          </div>
        </div>
      </div>
      <div class="block h-[1px] w-full bg-gray-25 mt-6xl"></div>
      <!-- Menu -->
      <nav class="mt-6xl">
        <div v-for="item in menuItems" :key="item.tab" @click="handleSidebarClick(item.tab)"
          @mouseenter="hoveredItem = item.tab" @mouseleave="hoveredItem = null"
          class="relative group flex cursor-pointer items-center gap-lg rounded-lg py-xl mt-md hover:bg-info-50-hover" :class="[
          activeTab === item.tab ? 'bg-info-50-hover' : '',
          isCollapsed ? 'justify-center' : 'px-2'
        ]" :ref="el => { if (el) menuItemRefs[item.tab] = el }">
          <img :src="item.icon" class="h-5 w-5" />

          <span v-if="!isCollapsed" class="label_2_semibold primary_text_color">
            {{ item.label }}
          </span>

          <Teleport to="body">
            <div v-if="isCollapsed && hoveredItem === item.tab" :style="getTooltipStyle(item.tab)"
              class="pointer-events-none fixed whitespace-nowrap z-[1000] transition-all duration-200">
              <div
                class="relative bg-black-400 primary_2_text_color label_2_medium rounded-lg px-xl py-md outline-none ring-0 border_none">
                {{ item.label }}
                <!-- Speech Bubble Tail -->
                <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border_none">
                  <div
                    class="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-black-400">
                  </div>
                </div>
              </div>
            </div>
          </Teleport>
        </div>
      </nav>

      <div>
        <div class="sidebar_bottom_section" :class="isCollapsed ? 'w-[2.875em] absolute bottom-0' : 'w-52'">

          <div class="block h-[1px] w-full bg-info-50 " :class="isCollapsed ? 'hidden' : ''"></div>

          <div @click="handleSidebarClick(notification.tab)" @mouseenter="hoveredItem = 'notifications'"
            @mouseleave="hoveredItem = null"
            class="relative group flex cursor-pointer items-center gap-lg rounded-md py-xl mt-xl hover:bg-info-50-hover" :class=" showNotifications ? 'bg-info-50-hover' : '',
          isCollapsed ? 'justify-center' : 'px-md'
        " :ref="el => { if (el) menuItemRefs['notifications'] = el }">
            <img :src="notification.icon" class="h-5 w-5" />

            <span v-if="!isCollapsed" class="label_2_semibold primary_text_color">
              {{ notification.label }}
            </span>

            <Teleport to="body">
              <div v-if="isCollapsed && hoveredItem === 'notifications'" :style="getTooltipStyle('notifications')"
                class="pointer-events-none fixed whitespace-nowrap z-[1000] transition-all duration-200 ">
                <div
                  class="relative bg-black-400 primary_2_text_color label_2_medium rounded-lg px-xl py-md outline-none ring-0 border_none">
                  {{ notification.label }}
                  <!-- Speech Bubble Tail -->
                  <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border_none">
                    <div
                      class="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-black-400">
                    </div>
                  </div>
                </div>
              </div>
            </Teleport>
          </div>

           <div class="block h-[1px] w-full bg-info-50 mt-xl" :class="isCollapsed ? 'hidden' : ''"></div>


          <!-- User -->
          <div class="relative group mt-7xl p-md flex items-center gap-md cursor-pointer rounded-md hover:bg_primary_color"
            :class="isCollapsed ? 'justify-center' : ''" @click.stop="showUserAccount = true"
            @mouseenter="hoveredItem = 'account'" @mouseleave="hoveredItem = null"
            :ref="el => { if (el) menuItemRefs['account'] = el }">
            <img
              :src="sidebarAvatarUrl"
              :alt="sidebarDisplayName || 'Profile'"
              class="h-8 w-8 rounded-full object-cover"
            />
            <div v-if="!isCollapsed">
              <p class="label_2_semibold primary_text_color">{{ sidebarDisplayName || "—" }}</p>
              <p class="label_3_regular secondary_text_color">{{ sidebarUserEmail || "—" }}</p>
            </div>
            <Teleport to="body">
              <div v-if="isCollapsed && hoveredItem === 'account'" :style="getTooltipStyle('account')"
                class="pointer-events-none fixed whitespace-nowrap z-[1000] transition-all duration-200">
                <div
                  class="relative bg-black-400 primary_2_text_color label_2_medium rounded-lg px-xl py-md outline-none ring-0 border_none">
                  Account
                  <!-- Speech Bubble Tail -->
                  <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border_none">
                    <div
                      class="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-black-400">
                    </div>
                  </div>
                </div>
              </div>
            </Teleport>
          </div>
        </div>
      </div>
    </div>
    <!-- 🔔 NOTIFICATION POPUP -->
    <NotificationPopup :open="showNotifications" :isCollapsed="isCollapsed" @close="showNotifications = false" />
    <!-- 👤 USER ACCOUNT POPUP -->
    <UserAccountPopup
      :open="showUserAccount"
      :is-collapsed="isCollapsed"
      :avatar-url="sidebarAvatarUrl"
      :display-name="sidebarDisplayName"
      :email="sidebarUserEmail"
      @close="showUserAccount = false"
      @signOut="handleSignOut"
    />
  </aside>


</template>

<script setup>
  import { ref, onMounted, nextTick } from "vue";
  import { useRouter } from "vue-router";
  import api, { TOKEN_KEY } from "../../services/api.js";

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

  const emit = defineEmits(["changeTab", "collapseChange", "newChat", "loadSession"]);
  const router = useRouter();
  const changeTab = (tab) => emit("changeTab", tab);

  const isCollapsed = ref(false);
  const showNotifications = ref(false);
  const showUserAccount = ref(false);
  const hoveredItem = ref(null);
  const menuItemRefs = ref({});
  const hoverLogo = ref(false);
  
  /* Chat Sessions */
  const chatSessions = ref([]);
  const isLoadingSessions = ref(false);

  const sidebarDisplayName = ref("");
  const sidebarUserEmail = ref("");
  const sidebarAvatarUrl = ref(
    "https://ui-avatars.com/api/?name=User&background=7950F2&color=fff&size=96"
  );

  function sidebarFallbackAvatar(seed) {
    const label = (seed && String(seed).trim()) || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=7950F2&color=fff&size=96`;
  }

  async function fetchSidebarUser() {
    try {
      const { data } = await api.get("/auth/me");
      const user = data?.data?.user ?? data?.user ?? null;
      if (!user || typeof user !== "object") return;

      const email = user.email != null ? String(user.email).trim() : "";
      const fullName = user.fullName != null ? String(user.fullName).trim() : "";
      const username = user.username != null ? String(user.username).trim() : "";
      const name = username || fullName;

      sidebarDisplayName.value = name;
      sidebarUserEmail.value = email;

      const pic = user.profilePictureUrl != null ? String(user.profilePictureUrl).trim() : "";
      sidebarAvatarUrl.value = pic || sidebarFallbackAvatar(name || email);
    } catch (e) {
      console.error("Failed to load user for sidebar:", e);
    }
  }

  /** Milliseconds for sorting; prefers updated time so active threads rise to the top. */
  const getSessionActivityMs = (s) => {
    const raw =
      s.updatedAt ??
      s.updated_at ??
      s.lastActive ??
      s.last_active_at ??
      s.createdAt ??
      s.created_at ??
      0;
    const t = new Date(raw).getTime();
    return Number.isFinite(t) ? t : 0;
  };

  const handleSignOut = async () => {
    showUserAccount.value = false;
    try {
      await api.post("/api/logout");
    } catch (e) {
      console.error("Logout request failed:", e);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/signin";
    }
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
  
  // Fetch chat sessions from API
  const fetchChatSessions = async () => {
    isLoadingSessions.value = true;
    try {
      const response = await api.get('/api/ai/sessions');
      
      let sessions = [];
      
      // Extract sessions from response
      if (response.data && Array.isArray(response.data)) {
        sessions = response.data;
      } else if (response.data && response.data.sessions && Array.isArray(response.data.sessions)) {
        sessions = response.data.sessions;
      }
      
      chatSessions.value = [...sessions].sort(
        (a, b) => getSessionActivityMs(b) - getSessionActivityMs(a)
      );
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      chatSessions.value = [];
    } finally {
      isLoadingSessions.value = false;
    }
  };
  
  // Handle session click
  const handleSessionClick = (sessionId) => {
    console.log('Session clicked:', sessionId);
    // Navigate to chat with session ID
    router.push('/chat');
    // Emit event to load the specific session
    emit('loadSession', sessionId);
  };

  // Function to refresh chat sessions (called when new chat is created)
  const refreshChatSessions = () => {
    fetchChatSessions();
  };

  // Emit initial collapsed state and fetch sessions
  onMounted(() => {
    emit("collapseChange", isCollapsed.value);
    fetchChatSessions();
    fetchSidebarUser();
  });
  
  // Expose refresh function to parent
  defineExpose({
    refreshChatSessions
  });
</script>