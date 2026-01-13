<template>
  <!-- Show Create Password Form -->
  <CreatePassword v-if="showCreatePassword" @back="showCreatePassword = false" />
  
  <!-- Show Security Settings -->
  <div v-else class="rounded-2xl bg_white common_inner_gap shadow-sm">
    <!-- Header -->
    <h2 class="heading_h6_bold">Security</h2>
    <p class="label_1_regular regular_gap medium_mb">
      Manage your password and login sessions securely.
    </p>

    <!-- Create your password -->
    <div class="flex flex-col items-start md:flex-row  md:justify-between gap-4 mb-8">
      <div class="flex-1">
        <h3 class="label_1_semibold">Create your password</h3>
        <p class="label_1_regular regular_gap">
          Create a strong password to keep your account safe.
        </p>
      </div>
      <button
        @click="showCreatePassword = true"
        class="button_thin px-5 rounded-lg inputbox_border_color bg_white sub_button_semibold "
      >
        Create password
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
      <button
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
        <div class="rounded-lg bg_white p-4 common_gap common_inner_gap secondary_button_border">
          <p class="label_2_medium">Chrome on Windows – Last active 12 mins ago</p>
        </div>
        <!-- Session 2 -->
        <div class="rounded-lg bg_white p-4 common_gap common_inner_gap secondary_button_border">
          <p class="label_2_medium">Safari on iPhone – Active now</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CreatePassword from "./CreatePassword.vue";

const showCreatePassword = ref(false);
</script>

