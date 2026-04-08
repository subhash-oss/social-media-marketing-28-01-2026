<template>
  <!-- Backdrop -->
  <div
    v-if="open"
    class="fixed inset-0 z-40 lg:inset-auto lg:top-0 lg:bottom-0 lg:right-0"
    :class="isCollapsed ? 'lg:left-16' : 'lg:left-64'"
    @click="$emit('close')"
  ></div>

  <!-- Popup -->
  <div
    v-if="open"
    class="fixed z-50 bg_secondary_color shadow-sm border primary_border_color bottom-[4.4em] w-64 lg:inset-auto lg:top-auto  popup_position lg:rounded-xl lg:w-52 px-2 py-4 "
    :class="[
      isCollapsed ? 'left-4 lg:left-5' : 'left-4 lg:left-4',
      'rounded-xl'
    ]"
    @click.stop
  >
    <!-- User Account Card 1 -->
    <div>
      <div class="flex items-center gap-5 rounded-lg bg_secondary_color">
        <img
          :src="avatarUrl || fallbackAvatar"
          class="h-10 w-10 rounded-full object-cover"
          alt="Profile"
        />
        <div class="flex-1 min-w-0">
          <p class="label_2_semibold primary_text_color truncate">{{ displayName || "—" }}</p>
          <p class="body_4_regular tertiary_text_color truncate">{{ email || "—" }}</p>
        </div>
      </div>
    </div>
      
    <div class="block h-[2px] w-full hr_linr_bg mt-5xl"></div>
    <!-- Sign Out Option -->
    <div 
      class="flex items-center gap-2 cursor-pointer mt-5xl"
      @click="handleSignOut"
    >
      <img :src="SignOutIcon" alt="">
      <span class="body_2_medium primary_text_color">Sign out</span>
    </div>

   
  </div>
</template>

<script setup>
import { computed } from "vue";
import SignOutIcon from "../../assets/images/SignOutIcon.svg";

const props = defineProps({
  open: Boolean,
  isCollapsed: Boolean,
  avatarUrl: { type: String, default: "" },
  displayName: { type: String, default: "" },
  email: { type: String, default: "" },
});

const fallbackAvatar = computed(() => {
  const seed = (props.displayName || props.email || "User").trim() || "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&background=7950F2&color=fff&size=96`;
});

const emit = defineEmits(["close", "signOut"]);

const handleSignOut = () => {
  emit("signOut");
  emit("close");
};
</script>

