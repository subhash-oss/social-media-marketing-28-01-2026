<template>
  <div
    class="flex items-start gap-4 rounded-2xl bg_white px-6 py-5 primary_border_color shadow-sm w-72 flex-shrink-0 md:w-auto"
  >
    <!-- Content -->
    <div class="flex flex-col">
        <div class="mb-2">
             <img :src="icon" alt=""> 
        </div>
      
      <span class="label_1_medium">
        {{ title }}
      </span>

      <span class=" heading_h5_bold">
        {{ value }}
      </span>

      <span class="regular_gap label_3_regular">
        {{ description }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  description: String,
  icon: Object,
  iconBg: String,
  iconColor: String,
});
</script>
