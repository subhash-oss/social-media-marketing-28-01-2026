<template>
     <div class="bg_white rounded-2xl py-7 px-4 border border-[#F1F2F4] mb-6">
            <h2 class="heading_h5_bold mb-2">Profile Information</h2>
            <p class="label_1_regular mb-6">
              Update your profile, secure your account, and manage connected apps.
            </p>

            <div class="space-y-6">
              <!-- Profile Picture -->
              <div class="flex items-start gap-6">
                <div class="relative">
                  <div
                    class="w-24 h-24 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 overflow-hidden flex items-center justify-center"
                  >
                    <img
                      src="https://ui-avatars.com/api/?name=Cliff+Booth&background=7950F2&color=fff&size=96"
                      alt="Profile"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    @click="editProfilePicture = !editProfilePicture"
                    class="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border border-[#F1F2F4] flex items-center justify-center hover:border-[#7950F2] transition-colors"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        stroke="#1D2125"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        stroke="#1D2125"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Name Field -->
              <div class="flex items-center gap-4">
                <label class="label_2_medium primary_text_color w-20 flex-shrink-0">
                  Name:
                </label>
                <div class="flex-1 flex items-center gap-3">
                  <input
                    v-model="profileForm.name"
                    type="text"
                    :disabled="!isEditing"
                    :class="[
                      'input_box flex-1',
                      !isEditing ? 'bg-[#F9FAFB] cursor-not-allowed' : ''
                    ]"
                  />
                  <div v-if="!isEditing" class="flex gap-2">
                    <button
                      @click="startEditing"
                      class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#F9FAFB] transition-colors"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                          stroke="#8590A2"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                          stroke="#8590A2"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div v-else class="flex gap-2">
                    <button
                      @click="cancelEditing"
                      class="px-4 py-2 rounded-md border border-[#E5E7EB] bg-white text-[#1D2125] label_2_semibold hover:bg-[#F9FAFB] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      @click="saveChanges"
                      class="px-4 py-2 rounded-md bg-[#7950F2] text-white label_2_semibold hover:bg-[#6E5DC6] transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <!-- Email Field -->
              <div class="flex items-center gap-4">
                <label class="label_2_medium primary_text_color w-20 flex-shrink-0">
                  Email:
                </label>
                <div class="flex-1 flex items-center gap-3">
                  <input
                    v-model="profileForm.email"
                    type="email"
                    :disabled="!isEditingEmail"
                    :class="[
                      'input_box flex-1',
                      !isEditingEmail ? 'bg-[#F9FAFB] cursor-not-allowed' : ''
                    ]"
                  />
                  <button
                    v-if="!isEditingEmail"
                    @click="startEditingEmail"
                    class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#F9FAFB] transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        stroke="#8590A2"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        stroke="#8590A2"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <div v-else class="flex gap-2">
                    <button
                      @click="cancelEditingEmail"
                      class="px-4 py-2 rounded-md border border-[#E5E7EB] bg-white text-[#1D2125] label_2_semibold hover:bg-[#F9FAFB] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      @click="saveEmailChanges"
                      class="px-4 py-2 rounded-md bg-[#7950F2] text-white label_2_semibold hover:bg-[#6E5DC6] transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Connected Social Accounts Section -->
          <div class="bg_white rounded-2xl py-7 px-4 border border-[#F1F2F4]">
            <h2 class="heading_h5_bold mb-2">Connected social accounts</h2>
            <p class="label_1_regular mb-6">
              Services that you use to log in to Genius AI
            </p>

            <div class="space-y-4">
              <!-- Google Account -->
              <div
                class="flex items-center justify-between p-4 rounded-lg border border-[#F1F2F4] bg-white"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-white border border-[#F1F2F4] flex items-center justify-center"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="label_1_semibold primary_text_color">Google</p>
                    <p class="label_2_regular">Charlene Reed</p>
                  </div>
                </div>
                <button
                  class="px-4 py-2 rounded-md border border-[#E5E7EB] bg-white text-[#1D2125] label_2_semibold hover:bg-[#F9FAFB] transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
</template>

<script setup>
import { ref, reactive, h } from "vue";
  // Profile form state
const profileForm = reactive({
  name: "Cliff Booth",
  email: "cliff Booth@iboson.io",
});

// Original values for cancel functionality
const originalValues = reactive({
  name: "Cliff Booth",
  email: "cliff Booth@iboson.io",
});

// Edit states
const isEditing = ref(false);
const isEditingEmail = ref(false);
const editProfilePicture = ref(false);

// Edit functions
const startEditing = () => {
  isEditing.value = true;
  originalValues.name = profileForm.name;
};

const cancelEditing = () => {
  isEditing.value = false;
  profileForm.name = originalValues.name;
};

const saveChanges = () => {
  isEditing.value = false;
  originalValues.name = profileForm.name;
  // Here you would typically make an API call to save the changes
};

const startEditingEmail = () => {
  isEditingEmail.value = true;
  originalValues.email = profileForm.email;
};

const cancelEditingEmail = () => {
  isEditingEmail.value = false;
  profileForm.email = originalValues.email;
};

const saveEmailChanges = () => {
  isEditingEmail.value = false;
  originalValues.email = profileForm.email;
  // Here you would typically make an API call to save the changes
};
</script>