<template>
  <!-- Backdrop -->
  <div
    v-if="open"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40"
    @click="$emit('close')"
  >
    <!-- Modal -->
    <div
      class="relative w-full max-w-md mx-4 bg_white rounded-2xl shadow-2xl overflow-hidden p-3"
      @click.stop
    >

     <img :src="SucessImage" alt="">

      <!-- Text Content -->
      <div class="common_gap">
        <h2 class="label_1_semibold">Post scheduled</h2>
        <p class="label_2_regular">
          Your post is set for {{ scheduledDate }}.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="common_gap pb-2 flex justify-between gap-3">
        <button
          @click="handleViewCalendar"
          class=" px-5 py-3 rounded-lg border label_2_semibold bg_primary_color primary_border_color"
        >
          View in calendar
        </button>
        <button
          @click="handleDone"
          class="primary_button flex items-center justify-center gap-2 py-3 px-5 rounded-lg"
        >
          Done
          <img :src="DoneArrowRight" alt="">
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import SucessImage from "../../../assets/images/SucessImage.png"
  import DoneArrowRight from "../../../assets/images/DoneArrowRight.svg"
const props = defineProps({
  open: Boolean,
  scheduledDate: {
    type: String,
    default: 'Oct 30 at 10:00 AM',
  },
});

const emit = defineEmits(['close', 'viewCalendar']);

const handleViewCalendar = () => {
  emit('viewCalendar');
  emit('close');
};

const handleDone = () => {
  emit('close');
};
</script>

