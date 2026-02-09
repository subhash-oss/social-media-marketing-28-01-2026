<template>
  <!-- Backdrop -->
  <div
    v-if="open"
    class="fixed inset-0 z-[60] flex items-center justify-center bg_overlay "
    @click="$emit('close')"
  >
    <!-- Modal -->
    <div
      class="relative  max-w-xl w-[90%] md:w-full  bg_secondary_color rounded-lg shadow-2xl overflow-hidden "
      @click.stop
    >
      <!-- Header -->
      <div class="flex justify-between items-center p-6xl">
        <h2 class="heading_h5_semibold primary_text_color">Delete post?</h2>
        <button
          @click="$emit('close')"
          aria-label="Close"
        >
          <svg class="w-5 h-5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.4697 3.46973C11.7626 3.17685 12.2374 3.17684 12.5303 3.46973C12.8231 3.76262 12.8231 4.23741 12.5303 4.53027L9.06055 8L12.5303 11.4697C12.8231 11.7626 12.8231 12.2374 12.5303 12.5303C12.2374 12.8231 11.7626 12.8231 11.4697 12.5303L8 9.06055L4.53027 12.5303C4.23741 12.8231 3.76263 12.8231 3.46973 12.5303C3.17683 12.2374 3.17683 11.7626 3.46973 11.4697L6.93945 8L3.46973 4.53027C3.17683 4.23738 3.17683 3.76262 3.46973 3.46973C3.76262 3.17685 4.23739 3.17684 4.53027 3.46973L8 6.93945L11.4697 3.46973Z" fill="#1D2125"/>
          </svg>
        </button>
      </div>
 
      <div class="block h-[1px] w-full hr_calendar_bg"></div>
     <div class="px-6xl"> 
      <!-- Question -->
      <div class="mt-5xl">
        <p class="paragraph_p3_regular">
          Are you sure you want to delete this post?
        </p>
      </div >

      <!-- Warning Box -->
      <div class="mt-5xl ">
        <div class="flex items-center gap-3 bg_warning_color rounded-lg p-6xl">
          <img :src="WarningIconOrange" alt="Warning" class="w-5 h-5 flex-shrink-0 mt-0.5">
          <p class="paragraph_p5_medium primary_text_color">
            Note: This action cannot be undone, and the post will be permanently removed from your calendar.
          </p>
        </div>
      </div>
    </div>

    <div class="block h-[1px] w-full hr_calendar_bg mt-5xl"></div>
      <!-- Footer Buttons -->
      <div class="flex items-center justify-end gap-3 mt-5xl px-6xl pb-6xl">
        <button
          @click="$emit('close')"
          class="p-xlp rounded-lg bg_primary_color label_2_semibold primary_text_color "
        >
          Cancel
        </button>
        <button
          @click="handleDelete"
          class="p-xlp rounded-lg modal_primary_button"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import CloseIcon from "../../assets/images/CloseIcon.svg";
import WarningIconOrange from "../../assets/images/WarningIconOrange.svg";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "confirm"]);

const handleDelete = () => {
  emit("confirm");
};
</script>

<style scoped>
/* Component-specific styles if needed */
</style>

