<template>
  <div class="rounded-2xl bg_white common_inner_gap shadow-sm h-[100%] data-privacy-full-height">
    <!-- Password Success Modal -->
    <PasswordSuccessModal
      :open="showSuccessModal"
      title="Password updated!"
      message="You have successfully updated your password."
      button-text="Login Now"
      @close="showSuccessModal = false"
      @action="handleLoginNow"
    />

    <!-- Back to Security Header -->
    <button
      @click="$emit('back')"
      class="flex items-center gap-2 heading_h6_bold medium_mb"
    >
      <img :src="BackButtonArrow" alt="">
      <span>Back to Security</span>
    </button>

    <!-- Form -->
    <div class="space-y-9 lg:w-1/2">
      <!-- New Password Field -->
      <div>
        <label class="label_2_medium block ">New Password:</label>
        <div class="relative common_gap">
          <input
            v-model="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            placeholder="Enter new password"
            class="input_box w-full pr-10"
            :class="errors.newPassword ? '!border-[#E2483D]' : 'inputbox_border_color'"
            @input="validateNewPassword"
          />
          <button
            type="button"
            @click="showNewPassword = !showNewPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <img
              v-if="!showNewPassword"
              :src="EyeOpenIcon"
              alt="Show password"
              class="w-5 h-5"
            />
           <img  v-else :src="EyeCloseIcon" alt="">
          </button>
        </div>
        <p v-if="errors.newPassword" class="error_text mt-1">
          {{ errors.newPassword }}
        </p>
      </div>

      <!-- Confirm New Password Field -->
      <div>
        <label class="label_2_medium block">Confirm New Password:</label>
        <div class="relative common_gap">
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm new password"
            class="input_box w-full pr-10"
            :class="errors.confirmPassword ? '!border-[#E2483D]' : 'inputbox_border_color'"
            @input="validateConfirmPassword"
          />
          <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <img
              v-if="!showConfirmPassword"
              :src="EyeOpenIcon"
              alt="Show password"
              class="w-5 h-5"
            />
            <img  v-else :src="EyeCloseIcon" alt="">
          </button>
        </div>
        <p v-if="errors.confirmPassword" class="error_text mt-1">
          {{ errors.confirmPassword }}
        </p>
      </div>

      <!-- Reset Password Button -->
      <button
        type="button"
        @click="handleResetPassword"
        class="primary_button lg:button_width px-5"
      >
        Reset Password
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import EyeOpenIcon from "../../../assets/images/EyeOpen.svg";
import BackButtonArrow from "../../../assets/images/BackButtonArrow.svg";
import EyeCloseIcon from "../../../assets/images/EyeCloseIcon.svg";
import PasswordSuccessModal from "./PasswordSuccessModal.vue";

const emit = defineEmits(["back", "passwordCreated"]);

// State
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const newPassword = ref("");
const confirmPassword = ref("");
const showSuccessModal = ref(false);
const errors = reactive({
  newPassword: "",
  confirmPassword: "",
});

// Validation
const validateNewPassword = () => {
  errors.newPassword = "";
  if (!newPassword.value) {
    errors.newPassword = "Password is required";
    return false;
  }
  if (newPassword.value.length < 8) {
    errors.newPassword = "Password must be at least 8 characters";
    return false;
  }
  // Check for at least one capital letter
  if (!/[A-Z]/.test(newPassword.value)) {
    errors.newPassword = "Password must contain at least one capital letter";
    return false;
  }
  // Check for at least one small letter
  if (!/[a-z]/.test(newPassword.value)) {
    errors.newPassword = "Password must contain at least one small letter";
    return false;
  }
  // Check for at least one number
  if (!/[0-9]/.test(newPassword.value)) {
    errors.newPassword = "Password must contain at least one number";
    return false;
  }
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword.value)) {
    errors.newPassword = "Password must contain at least one special character";
    return false;
  }
  // Re-validate confirm password if it has a value
  if (confirmPassword.value) {
    validateConfirmPassword();
  }
  return true;
};

const validateConfirmPassword = () => {
  errors.confirmPassword = "";
  if (!confirmPassword.value) {
    errors.confirmPassword = "Please confirm your password";
    return false;
  }
  if (newPassword.value !== confirmPassword.value) {
    errors.confirmPassword = "Please make sure your password match.";
    return false;
  }
  return true;
};

const handleResetPassword = () => {
  const isNewPasswordValid = validateNewPassword();
  const isConfirmPasswordValid = validateConfirmPassword();

  if (isNewPasswordValid && isConfirmPasswordValid) {
    // Handle password reset logic here
    console.log("Password reset:", {
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    });
    // Show success modal
    showSuccessModal.value = true;
    // You can emit an event or call an API here
    // For now, we'll just log it
  }
};

const handleLoginNow = () => {
  // Handle login navigation logic here
  console.log("Login Now clicked");
  // Close modal
  showSuccessModal.value = false;
  // Emit event to notify parent that password was created (after modal is shown)
  emit("passwordCreated");
  // Go back to security
  emit("back");
  // You can navigate to login page or emit an event
  // For example: router.push('/login') or emit('login')
};
</script>

