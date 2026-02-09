<template>
  <!-- Backdrop -->
  <div
    v-if="open"
    class="fixed inset-0 z-[60] flex items-center justify-center bg_overlay"
    @click="$emit('close')"
  >
    <!-- Modal -->
    <div
      class="relative w-full max-w-md mx-4 bg_secondary_color rounded-2xl shadow-2xl overflow-hidden p-6xl"
      @click.stop
    >
      <!-- Text Content Section -->
      <div>
        <h2 class="heading_h6_bold">
          {{ title }}
        </h2>
        <p class="label_1_regular secondary_text_color mt-5xl">
          {{ message }}
        </p>
      </div>
       <div class="block h-[2px] w-full hr_linr_bg mt-5xl"></div>
      <!-- Action Button -->
      <div class="flex justify-center mt-5xl">
        <button
          @click="handleAction"
          class="primary_button_semibold rounded-lg w-full"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Success!',
  },
  message: {
    type: String,
    default: 'Operation completed successfully.',
  },
  buttonText: {
    type: String,
    default: 'OK',
  },
});

const emit = defineEmits(['close', 'action']);

const handleAction = () => {
  emit('action');
  emit('close');
};
</script>

