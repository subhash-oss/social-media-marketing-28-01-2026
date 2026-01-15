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
    class="fixed z-50 bg_white shadow-sm profile_border bottom-[4.4em] w-64 lg:inset-auto lg:top-auto lg:bottom-[4.5em] lg:rounded-xl lg:w-56 px-2 py-4"
    :class="[
      isCollapsed ? 'left-4 lg:left-5' : 'left-4 lg:left-4',
      'rounded-xl'
    ]"
    @click.stop
  >
    <!-- User Account Card 1 -->
    <div>
      <div class="flex items-center gap-5 rounded-lg bg_white">
        <img 
          src="https://i.pravatar.cc/40" 
          class="h-10 w-10 rounded-full" 
          alt="Profile"
        />
        <div class="flex-1 min-w-0">
          <p class="title_1_semibold">Cliff Booth</p>
          <p class="title_2_regular">Cliffbooth@gmail.com</p>
        </div>
      </div>
    </div>
      
    <div class="block h-[2px] w-full hr_linr_bg common_gap"></div>
    <!-- Sign Out Option -->
    <div 
      class="flex items-center gap-2 cursor-pointer common_gap"
      @click="handleSignOut"
    >
      <img :src="SignOutIcon" alt="">
      <span class=" text_subtle_color title_1_semibold ">Sign out</span>
    </div>

   
  </div>
</template>

<script setup>
import SignOutIcon from "../../assets/images/SignOutIcon.svg"

defineProps({
  open: Boolean,
  isCollapsed: Boolean,
});

const emit = defineEmits(["close", "signOut"]);

const handleSignOut = () => {
  emit("signOut");
  emit("close");
};
</script>

