<template>
  <!-- Backdrop -->
  <div
    v-if="open"
    class="fixed inset-0 z-[60] flex items-center justify-center bg_overlay backdrop-blur-sm"
    @click="$emit('close')"
  >
    <!-- Modal -->
    <div
      class="relative w-full max-w-md mx-4 bg_secondary_color rounded-2xl shadow-2xl overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 pt-6">
        <div class="flex items-start justify-between mb-2">
          <h2 class="heading_h6_bold">{{ title }}</h2>
          <button
            @click="$emit('close')" class="bg_primary_color"
          >
            <img :src="CloseIcon" alt="">
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 pb-6 pt-3">
        <p class="label_1_regular secondary_text_color">
          {{ description }}
        </p>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t primary_border_color flex justify-center gap-3 ">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg label_2_semibold primary_text_color bg_primary_color primary_border_color w-[100%]"
        >
          Cancel
        </button>
        <button
          @click="handleDisconnect"
          class="px-4 py-2 rounded-lg  primary_button w-[100%]"
        >
          Disconnect
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import CloseIcon from "../../../assets/images/CloseIcon.svg";
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Disconnect Google Account?",
  },
  description: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "disconnect"]);

const handleDisconnect = () => {
  emit("disconnect");
  emit("close");
};
</script>

<style scoped>
/* Additional styling if needed */
</style>

