<template>
  <!-- Backdrop -->
  <div
    v-if="open"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
    @click="$emit('close')"
  >
    <!-- Modal -->
    <div
      class="relative w-full max-w-lg mx-4 bg_white rounded-2xl shadow-2xl overflow-hidden p-4"
      @click.stop
    >
       <img :src="SucessImage" alt="">

      <!-- Text Content Section -->
      <div class="px-6 py-6">
        <h2 class="label_1_bold ">
          Your brand has been created successfully!
        </h2>
        <p class="label_2_regular">
          You can now start planning posts or generating content.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="px-6  flex justify-between gap-3">
        <button
          @click="handleViewProduct"
          class=" px-4 py-3 rounded-lg bg_primary_color primary_border_color label_2_semibold"
        >
          View Product
        </button>
        <button
          @click="handleGoToChat"
          class=" flex items-center justify-center gap-2 px-4 py-3 rounded-lg primary_button "
        >
          <span>Go to Chat</span>
          <img :src="DoneArrowRight" alt="" class="w-4 h-4">
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import DoneArrowRight from "../../../assets/images/DoneArrowRight.svg";
import SucessImage from "../../../assets/images/SucessImage.png";

const props = defineProps({
  open: Boolean,
});

const emit = defineEmits(['close', 'viewProduct', 'goToChat']);

const handleViewProduct = () => {
  emit('viewProduct');
  emit('close');
};

const handleGoToChat = () => {
  emit('goToChat');
  emit('close');
};
</script>

<style scoped>
/* Additional styling if needed */
</style>

