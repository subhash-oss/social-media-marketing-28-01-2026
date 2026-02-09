<template>
  <!-- Backdrop -->
  <div
    v-if="open"
    class="fixed inset-0 z-[60] flex items-center justify-center bg_overlay backdrop-blur-sm"
    @click="$emit('close')"
  >
    <!-- Modal -->
    <div
      class="relative w-full max-w-xl mx-4 bg_secondary_color rounded-2xl shadow-2xl overflow-hidden p-6xl"
      @click.stop
    >
      <!-- Header -->
      <div >
        <div class="flex items-start justify-between">
          <h2 class="heading_h6_bold">{{ title }}</h2>
        </div>
        <p class="label_1_regular secondary_text_color mt-5xl">
          {{ description }}
        </p>
      </div>

      <!-- Content -->
      <div class="mt-5xl">
        <!-- Verification Code Input -->
        <div>
          <label class="label_2_medium primary_text_color block">
            Verification Code:
          </label>
          <div class="flex gap-2 justify-center mt-xl" ref="inputsContainer">
            <input
              v-for="(digit, index) in codeDigits"
              :key="index"
              v-model="codeDigits[index]"
              @input="handleCodeInput(index, $event)"
              @keydown="handleKeyDown(index, $event)"
              @paste="handlePaste"
              type="text"
              maxlength="1"
              class="w-12 h-14 text-center label_2_semibold primary_text_color inputbox_border_color rounded-lg"
            />
          </div>
        </div>

        <!-- Timer and Resend -->
        <div class="flex items-center  mt-5xl gap-3">
          <div class="label_1_regular primary_text_color">
            Code expires in: <span class="label_1_bold primary_text_color">{{ formattedTime }}</span>
          </div>
          <button
            @click="handleResend"
            class="label_2_semibold primary_text_color underline"
          >
            Resend Code
          </button>
        </div>
        
        <div class="block h-[2px] w-full hr_linr_bg mt-5xl"></div>
        <!-- Warning Message -->
        <div class="pending_text_style rounded-lg flex items-center gap-3 mt-5xl p-6xl">
          <img :src="WarningIconOrange" alt="">
          <p class="paragraph_p5_medium primary_text_color">
            Note: All your account data will be deleted permanently. This action cannot be undone.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex gap-5 mt-5xl">
        <button
          @click="$emit('close')"
          :disabled="isDeleting"
          class="lg:flex-1 rounded-lg p-3xl bg_button_secondary sub_button_semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          @click="handleDelete"
          :disabled="!isCodeComplete || isDeleting"
          class="flex-1 rounded-lg text-white sub_button_semibold disabled:opacity-50 disabled:cursor-not-allowed"
          :class="isCodeComplete ? 'bg_delete_button' : 'bg_delete_button'"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete Permanently' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import WarningIconOrange from "../../../assets/images/WarningIconOrange.svg"

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Confirm Data Deletion",
  },
  description: {
    type: String,
    default: "To keep your account secure, we've sent a 6-digit verification code to your registered email address. Please enter it below to permanently delete all stored data.",
  },
  initialTime: {
    type: Number,
    default: 120, // 2 minutes in seconds
  },
});

const emit = defineEmits(["close", "delete", "resend"]);

const codeDigits = ref(["", "", "", "", "", ""]);
const timeRemaining = ref(props.initialTime);
const inputsContainer = ref(null);
const isDeleting = ref(false);
let timerInterval = null;

const formattedTime = computed(() => {
  const minutes = Math.floor(timeRemaining.value / 60);
  const seconds = timeRemaining.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const isCodeComplete = computed(() => {
  return codeDigits.value.every((digit) => digit !== "");
});

const handleCodeInput = (index, event) => {
  const value = event.target.value.replace(/[^0-9]/g, "");
  codeDigits.value[index] = value;

  // Auto-focus next input
  if (value && index < 5) {
    const nextInput = event.target.parentElement.children[index + 1];
    if (nextInput) {
      nextInput.focus();
    }
  }
};

const handleKeyDown = (index, event) => {
  // Handle backspace
  if (event.key === "Backspace" && !codeDigits.value[index] && index > 0) {
    const prevInput = event.target.parentElement.children[index - 1];
    if (prevInput) {
      prevInput.focus();
      codeDigits.value[index - 1] = "";
    }
  }
  // Handle arrow keys
  else if (event.key === "ArrowLeft" && index > 0) {
    event.target.parentElement.children[index - 1].focus();
  } else if (event.key === "ArrowRight" && index < 5) {
    event.target.parentElement.children[index + 1].focus();
  }
};

const handlePaste = (event) => {
  event.preventDefault();
  const pastedData = event.clipboardData
    .getData("text")
    .replace(/[^0-9]/g, "")
    .slice(0, 6);

  for (let i = 0; i < pastedData.length && i < 6; i++) {
    codeDigits.value[i] = pastedData[i];
  }

  // Focus the next empty input or the last one
  const nextEmptyIndex = codeDigits.value.findIndex((digit) => digit === "");
  const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
  const inputs = event.target.parentElement.children;
  if (inputs[focusIndex]) {
    inputs[focusIndex].focus();
  }
};

const handleDelete = () => {
  if (isCodeComplete.value && !isDeleting.value) {
    const code = codeDigits.value.join("");
    isDeleting.value = true;
    
    // Emit delete event
    emit("delete", code);
    
    // Wait 2 seconds then close the modal
    setTimeout(() => {
      isDeleting.value = false;
      emit("close");
    }, 2000);
  }
};

const handleResend = () => {
  emit("resend");
  // Reset timer
  timeRemaining.value = props.initialTime;
  // Reset code
  codeDigits.value = ["", "", "", "", "", ""];
};

const startTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      // Reset code and timer when modal opens
      codeDigits.value = ["", "", "", "", "", ""];
      timeRemaining.value = props.initialTime;
      isDeleting.value = false;
      startTimer();
      // Focus first input after modal opens
      setTimeout(() => {
        if (inputsContainer.value) {
          const firstInput = inputsContainer.value.querySelector("input");
          if (firstInput) {
            firstInput.focus();
          }
        }
      }, 100);
    } else {
      stopTimer();
      isDeleting.value = false;
    }
  },
  { immediate: true }
);

watch(
  () => props.initialTime,
  (newTime) => {
    timeRemaining.value = newTime;
  }
);

onUnmounted(() => {
  stopTimer();
});
</script>

<style scoped>
input[type="text"]::-webkit-inner-spin-button,
input[type="text"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>

