<template>
  <!-- Backdrop -->
  <div
    v-if="open"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    @click="$emit('close')"
  >
    <!-- Modal -->
    <div
      class="relative w-full max-w-xl mx-4 bg_white rounded-2xl shadow-2xl overflow-hidden common_inner_gap"
      @click.stop
    >
      <!-- Header -->
      <div>
        <div class="flex items-start justify-between">
          <h2 class="heading_h6_bold">{{ title }}</h2>
          <button
            @click="$emit('close')"
            class="bg_primary_color"
          >
            <img :src="CloseIcon" alt="Close">
          </button>
        </div>
        <div class="common_gap">
          <p class="label_1_regular">{{ description }}</p>
          <p v-if="additionalInfo" class="common_gap label_1_medium">
            {{ additionalInfo }}
          </p>
        </div>
      </div>
    <div class="block h-[2px] w-full hr_linr_bg common_gap"></div>
      <!-- Footer -->
      <div class="flex gap-5 common_gap">
        <button
          @click="$emit('close')"
          class="lg:flex-1 rounded-lg button_thin bg_button_secondary sub_button_semibold"
        >
          Cancel
        </button>
        <button
          @click="handleConfirm"
          class="flex-1 rounded-lg text-white sub_button_semibold bg_delete_button"
        >
          {{ confirmButtonText }}
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
    default: "Log Out From All Devices?",
  },
  description: {
    type: String,
    default: "This will immediately sign you out from all logged-in devices, including desktop, mobile, and web sessions.",
  },
  additionalInfo: {
    type: String,
    default: "You'll stay signed in on this current device.",
  },
  confirmButtonText: {
    type: String,
    default: "Log Out All Devices",
  },
});

const emit = defineEmits(["close", "confirm"]);

const handleConfirm = () => {
  emit("confirm");
};
</script>

