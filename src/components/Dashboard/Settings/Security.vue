<template>
  <!-- Show delete comformation popup -->
  <ConfirmDataDeletionModal
      :open="showDeleteModal"
      title="Delete Your Account"
      description="To confirm, we've sent a 6-digit code to your registered email. Please enter the code below to verify your request. "
      @close="showDeleteModal = false"
      @delete="handleDeleteData"
      @resend="handleResendCode"
    />
  
  <!-- Show Logout Confirmation Modal -->
  <LogoutConfirmationModal
    :open="showLogoutModal"
    title="Log Out From All Devices?"
    description="This will immediately sign you out from all logged-in devices, including desktop, mobile, and web sessions."
    additional-info="You'll stay signed in on this current device."
    confirm-button-text="Log Out All Devices"
    @close="showLogoutModal = false"
    @confirm="handleLogoutAllDevices"
  />
  
  <!-- Show Create Password Form -->
  <CreatePassword 
    v-if="showCreatePassword && !hasPasswordCreated" 
    @back="showCreatePassword = false"
    @passwordCreated="handlePasswordCreated"
  />
  
  <!-- Show Update Password Form -->
  <UpdatePassword 
    v-else-if="showUpdatePassword && hasPasswordCreated" 
    @back="showUpdatePassword = false"
    @passwordUpdated="handlePasswordUpdated"
  />
  
  <!-- Show Security Settings -->
  <div v-if="!showCreatePassword && !showUpdatePassword" class="rounded-2xl bg_white common_inner_gap shadow-sm h-[100%] data-privacy-full-height">
    <!-- Header -->
    <h2 class="heading_h6_bold">Security</h2>
    <p class="label_1_regular regular_gap medium_mb">
      Manage your password and login sessions securely.
    </p>

    <!-- Create/Update your password -->
    <div class="flex flex-col items-start md:flex-row  md:justify-between gap-4 mb-8">
      <div class="flex-1">
        <h3 class="label_1_semibold">{{ hasPasswordCreated ? 'Update your password' : 'Create your password' }}</h3>
        <p class="label_1_regular regular_gap">
          {{ hasPasswordCreated ? 'Update your password to keep your account secure.' : 'Create a strong password to keep your account safe.' }}
        </p>
      </div>
      <button
        @click="hasPasswordCreated ? showUpdatePassword = true : showCreatePassword = true"
        class="button_thin px-5 rounded-lg inputbox_border_color bg_white sub_button_semibold "
      >
        {{ hasPasswordCreated ? 'Update password' : 'Create password' }}
      </button>
    </div>

    <!-- Delete your account -->
    <div class="flex flex-col md:flex-row items-start md:justify-between gap-4 mb-8">
      <div class="flex-1">
        <h3 class="label_1_semibold">Delete your account</h3>
        <p class="label_1_regular regular_gap">
          Deleting your account will permanently remove access to all designs.
        </p>
      </div>
      <button @click="showDeleteModal = true"
        class="button_thin px-5 rounded-lg inputbox_border_color bg_white sub_button_semibold"
      >
        Delete account
      </button>
    </div>

    <!-- Forgot to sign out on a shared device? -->
    <div class="flex flex-col md:flex-row items-start md:justify-between gap-4 medium_mb">
      <div class="flex-1">
        <h3 class="label_1_semibold">Forgot to sign out on a shared device?</h3>
        <p class="label_1_regular regular_gap">
          Secure your account by signing out from all sessions.
        </p>
      </div>
      <button
        @click="showLogoutModal = true"
        class="button_thin px-5 rounded-lg inputbox_border_color bg_white sub_button_semibold"
      >
        Log Out From All Devices
      </button>
    </div>

    <!-- Active Sessions -->
    <div>
      <h3 class="label_1_semibold">Active Sessions</h3>
      <div class="space-y-3">
        <!-- Session 1 -->
        <div class="rounded-lg bg_white p-3 common_gap common_inner_gap secondary_button_border md:w-1/2">
          <p class="label_2_medium">Chrome on Windows – Last active 12 mins ago</p>
        </div>
        <!-- Session 2 -->
        <div class="rounded-lg bg_white p-3 common_gap common_inner_gap secondary_button_border md:w-1/2">
          <p class="label_2_medium">Safari on iPhone – Active now</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"
import CreatePassword from "./CreatePassword.vue";
import UpdatePassword from "./UpdatePassword.vue";
import ConfirmDataDeletionModal from "./ConfirmDataDeletionModal.vue";
import LogoutConfirmationModal from "./LogoutConfirmationModal.vue";

const router = useRouter()
const showCreatePassword = ref(false);
const showUpdatePassword = ref(false);
const hasPasswordCreated = ref(false);
const showDeleteModal = ref(false);
const showLogoutModal = ref(false);

const handlePasswordCreated = () => {
  hasPasswordCreated.value = true;
  showCreatePassword.value = false;
};

const handlePasswordUpdated = () => {
  // Password was updated, you can add any additional logic here
  showUpdatePassword.value = false;
};

const handleLogoutAllDevices = () => {
  // Handle logout from all devices logic here
  console.log("Logging out from all devices");
  // You can add API call here
  showLogoutModal.value = false;
};

const handleDeleteData = (code) => {
  // Handle data deletion logic here
  console.log("Deleting account with code:", code);
  // You can add API call here
  setTimeout(() => {
    router.push("/deleted-message")
  }, 2000);
  
};

const handleResendCode = () => {
  // Handle resend code logic here
  console.log("Resending verification code");
  // You can add API call here
};
</script>

