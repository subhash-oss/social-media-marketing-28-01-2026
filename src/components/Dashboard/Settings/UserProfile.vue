<template>
     <div class="bg_secondary_color rounded-2xl p-6xl primary_border_color h-[100%] data-privacy-full-height">
            <h2 class="heading_h6_semibold">Profile Information</h2>
            <p class="label_1_regular secondary_text_color mt-md">
              Update your profile, secure your account, and manage connected apps.
            </p>
            <div class="mt-10xl">
              <p
                v-if="isUserLoading"
                class="label_1_regular secondary_text_color"
              >
                Loading profile…
              </p>
              <template v-else>
              <!-- Profile Picture -->
              <div class="flex items-start gap-6xl">
                <div class="relative">
                  <div
                    class="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-gray-25"
                  >
                    <img
                      :src="profilePictureUrl"
                      alt="Profile"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    @click="openProfilePictureEditor"
                    class="absolute bottom-0 right-0 w-7 h-7 bg_primary_color rounded-full border border-white flex items-center justify-center "
                  >
                    <img :src="ImageEditIcon" alt="">
                  </button>
                </div>
              </div>

              <!-- Name Field -->
              <div class="flex flex-col items-start mt-10xl">
                <label class="label_2_semibold primary_text_color w-20 flex-shrink-0 flex items-center gap-lg"
                :class="[!isEditing ? 'disable_text_color cursor-not-allowed' : '']">
                  Name: <span><img :src="WarningGrayIcon" alt=""></span>
                </label>
              <div class="flex w-[100%] gap-xl items-center mt-sm"> 
                <div class="flex items-center gap-xl w-1/2">
                  <input
                    v-model="profileForm.name"
                    type="text"
                    :disabled="!isEditing"
                    :class="[
                      ' flex-1 h-12 px-3xl py-xl rounded-lg border border-black-50  w-1/2 ',
                      !isEditing ? ' disable_text_color cursor-not-allowed bg-info-50' : 'Label_2_Medium'
                    ]"
                    :style="isEditing ? {
                      border: '1px solid #0068CF',
                      boxShadow: '0px 0px 0px 3px #D9E2FC'
                    } : {}"
                  />
                  
                </div>
                <div v-if="!isEditing" class="flex gap-xl">
                    <button
                      @click="startEditing"
                      class="flex items-center Label_2_Medium primary_text_color justify-center rounded-lg"
                    >
                      <img :src="InputboxEditIcon" alt="">
                    </button>
                  </div>
                  <div v-else class="flex gap-xl">
                    <button
                      type="button"
                      :disabled="isSavingName"
                      @click="cancelEditing"
                      class="px-xxl py-xl rounded-lg primary_border_color bg-gray-25 label_1_semibold h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      :disabled="isSavingName"
                      @click="saveChanges"
                      class="px-xxl py-xl rounded-lg primary_button h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ isSavingName ? "Saving…" : "Save" }}
                    </button>
                  </div>
              </div>
              <p
                v-if="nameSaveError"
                class="label_2_semibold text-error-600 mt-sm"
                role="alert"
              >
                {{ nameSaveError }}
              </p>
              </div> 

              <!-- Email Field -->
              <div class="flex flex-col items-start mt-10xl">
                <label class="label_2_semibold primary_text_color w-20 flex-shrink-0"
                :class="[!isEditingEmail ? 'disable_text_color cursor-not-allowed' : '']"
                >
                  Email:
                </label>
                <div class="flex w-[100%] gap-xl items-center mt-sm"> 
                  <div class="flex items-center gap-xl w-1/2">
                    <input
                      v-model="profileForm.email"
                      type="email"
                      :disabled="!isEditingEmail"
                      :class="[
                        ' flex-1 h-12 px-3xl py-xl rounded-lg border border-black-50  w-1/2 ',
                        !isEditingEmail ? ' disable_text_color cursor-not-allowed bg-info-50' : 'Label_2_Medium'
                      ]"
                      :style="isEditingEmail ? {
                        border: '1px solid #0068CF',
                        boxShadow: '0px 0px 0px 3px #D9E2FC'
                      } : {}"
                    />
                  </div>
                  <div v-if="!isEditingEmail" class="flex gap-xl">
                    <button
                      @click="startEditingEmail"
                      class="flex items-center Label_2_Medium primary_text_color justify-center rounded-lg"
                    >
                      <img :src="InputboxEditIcon" alt="">
                    </button>
                  </div>
                  <div v-else class="flex gap-xl">
                    <button
                      @click="cancelEditingEmail"
                      class="px-xxl py-xl rounded-lg primary_border_color bg-gray-25 label_1_semibold h-12"
                    >
                      Cancel
                    </button>
                    <button
                      @click="saveEmailChanges"
                      class="px-xxl py-xl rounded-lg primary_button h-12"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
              </template>
            </div>

            
          <!-- Connected Social Accounts Section -->
            <h2 class="heading_h6_semibold mt-10xl primary_text_color">Connected social accounts</h2>
            <p class="label_1_regular secondary_text_color mt-md">
              Services that you use to log in to Genius AI
            </p>

            <div class="mt-10xl w-[100%] md:w-1/2">
              <!-- Google Account -->
              <div
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-6xl">
                  <div
                    class="w-10 h-10 flex items-center justify-center"
                  >
                    <img :src="GoogleIcon" alt="">
                  </div>
                  <div>
                    <p class="label_1_medium primary_text_color">Google</p>
                    <p class="label_1_bold primary_text_color">{{ profileForm.name || "—" }}</p>
                  </div>
                </div>
                <button
                  @click="openDisconnectModal"
                  class="px-5xl md:px-12xl py-md rounded-md bg-gray-25 label_1_semibold primary_text_color hover:bg-black-25 active:bg-black-25"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        
          

  <!-- Profile Picture Upload & Crop Modal -->
  <div
    v-if="editProfilePicture"
    class="fixed inset-0 z-[60] flex items-center justify-center bg_overlay backdrop-blur-sm"
    @click.self="closeProfilePictureModal"
  >
    <div
      class="relative w-full max-w-2xl mx-4 bg_secondary_color rounded-2xl shadow-2xl overflow-hidden"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="p-6xl border-b border-gray-25">
        <h2 class="heading_h5_bold heading_h5_bold">Edit Profile Picture</h2>
        <p class="label_1_regular secondary_text_color mt-xl">
          {{
            showUploadPanel
              ? 'Upload a new image and crop it to your preference'
              : uploadedImage
                ? 'Crop and adjust your new image'
                : 'Crop and adjust your current photo'
          }}
        </p>
      </div>

      <!-- Modal Content -->
      <div class="p-6">
        <!-- File Upload Section -->
        <div v-if="showUploadPanel" class="space-y-4">
          <div
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            @dragleave="isDragOver = false"
            @dragenter="isDragOver = true"
            :class="[
              'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
              isDragOver ? 'border-[#7950F2] bg-gray-25' : 'border-gray-25'
            ]"
            @click="fileInputRef?.click()"
          >
            <div class="flex flex-col items-center gap-4">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="text-[#8590A2]"
              >
                <path
                  d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <polyline
                  points="17 8 12 3 7 8"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <line
                  x1="12"
                  y1="3"
                  x2="12"
                  y2="15"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div>
                <p class="label_1_semibold primary_text_color">
                  Drag & drop your image here
                </p>
                <p class="label_2_regular secondary_text_color mt-sm">
                  or <span class="text-[#7950F2] font-semibold">browse</span> to
                  upload
                </p>
                <p class="label_3_regular secondary_text_color mt-md">
                  Accepted formats: JPG, PNG | Max size: 5MB
                </p>
              </div>
            </div>
          </div>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            class="hidden"
            @change="handleFileSelect"
          />
        </div>

        <!-- Image Cropper Section: current profile photo or newly uploaded image -->
        <div v-else-if="cropperSrc" class="space-y-4">
          <div class="relative w-full h-[400px] bg-info-50 rounded-lg overflow-hidden">
            <Cropper
              ref="cropperRef"
              class="cropper"
              :key="cropperSrc"
              :src="cropperSrc"
              :stencil-props="{
                aspectRatio: 1,
                movable: true,
                resizable: true,
              }"
              :default-size="{
                width: 100,
                height: 100,
              }"
            />
          </div>
          <div class="flex gap-2 justify-center">
            <button
              v-if="isExistingImage"
              @click="removeExistingImage"
              class="px-4 py-2 rounded-md border border-gray-25 bg_secondary_color text-[#DC2626] label_2_semibold hover:bg-info-50 transition-colors"
            >
              Remove Image
            </button>
            <button
              @click="resetImage"
              class="px-4 py-2 rounded-md border border-gray-25 bg_secondary_color text_primary_color label_2_semibold hover:bg-info-50transition-colors"
            >
              {{ isExistingImage ? 'Upload New Image' : 'Choose Different Image' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-6 border-t border-gray-25 flex justify-end gap-3">
        <button
          @click="closeProfilePictureModal"
          class="px-3xl py-md rounded-md border border-gray-25 bg_secondary_color text_primary_color label_2_semibold hover:bg-info-50transition-colors"
        >
          Cancel
        </button>
        <button
          v-if="!showUploadPanel && cropperSrc"
          type="button"
          @click="saveProfilePicture"
          class="px-4 py-2 rounded-md bg-black-400 text-white label_2_semibold hover:bg-black-700 transition-colors"
        >
          Save Changes
        </button>
              </div>
            </div>
          </div>

  <!-- Email Verification Modal -->
  <EmailVerificationModal
    :open="showEmailVerificationModal"
    :title="verificationTitle"
    :description="verificationDescription"
    :email="verificationEmail"
    @close="closeEmailVerificationModal"
    @verify="handleVerifyCode"
    @resend="handleResendVerificationCode"
  />

  <!-- Disconnect Account Modal -->
  <DisconnectAccountModal
    :open="showDisconnectModal"
    :title="'Disconnect Google Account?'"
    :description="disconnectDescription"
    :email="googleAccountEmail"
    @close="closeDisconnectModal"
    @disconnect="handleDisconnectGoogle"
  />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import api from "../../../services/api.js";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import EmailVerificationModal from "./EmailVerificationModal.vue";
import DisconnectAccountModal from "./DisconnectAccountModal.vue";
import ImageEditIcon from "../../../assets/images/ImageEditIcon.svg";
import InputboxEditIcon from "../../../assets/images/InputboxEditIcon.svg";
import GoogleIcon from "../../../assets/images/GoogleIcon.svg";
import WarningGrayIcon from "../../../assets/images/WarningGrayIcon.svg";

// Profile form state (name = API `username`)
const profileForm = reactive({
  name: "",
  email: "",
});

// Original values for cancel functionality
const originalValues = reactive({
  name: "",
  email: "",
});

const isUserLoading = ref(true);

function buildFallbackAvatar(seed) {
  const label = (seed && String(seed).trim()) || "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=7950F2&color=fff&size=96`;
}

async function fetchUserProfile() {
  isUserLoading.value = true;
  try {
    const { data } = await api.get("/auth/me");
    const user = data?.data?.user ?? data?.user ?? null;
    if (!user || typeof user !== "object") return;

    const username = user.username != null ? String(user.username).trim() : "";
    const email = user.email != null ? String(user.email).trim() : "";

    profileForm.name = username;
    profileForm.email = email;
    originalValues.name = username;
    originalValues.email = email;

    const fallback = buildFallbackAvatar(username || email);
    defaultAvatarUrl.value = fallback;
    const pic = user.profilePictureUrl != null ? String(user.profilePictureUrl).trim() : "";
    profilePictureUrl.value = pic || fallback;

    googleAccountEmail.value = email;
  } catch (e) {
    console.error("Failed to load user profile:", e);
  } finally {
    isUserLoading.value = false;
  }
}

onMounted(() => {
  fetchUserProfile();
});

// Edit states
const isEditing = ref(false);
const isEditingEmail = ref(false);
const editProfilePicture = ref(false);
const isSavingName = ref(false);
const nameSaveError = ref("");

// Email verification state
const showEmailVerificationModal = ref(false);
const verificationAction = ref("edit"); // 'edit' or 'save'
const verificationEmail = ref("");
const verificationTitle = ref("We've sent you a code");
const verificationDescription = ref("");

// Disconnect account modal state
const showDisconnectModal = ref(false);
const googleAccountEmail = ref("");
const disconnectDescription = ref("");

// Profile picture state
const defaultAvatarUrl = ref(buildFallbackAvatar("User"));
const profilePictureUrl = ref(defaultAvatarUrl.value);
const uploadedImage = ref(null);
const fileInputRef = ref(null);
const cropperRef = ref(null);
const isDragOver = ref(false);
const isExistingImage = ref(false);
/** When true, show file picker instead of cropper (e.g. after "Choose Different Image"). */
const forceUploadPanel = ref(false);

const showUploadPanel = computed(() => {
  if (forceUploadPanel.value) return true;
  return !uploadedImage.value && !profilePictureUrl.value;
});

/** Cropper source: new upload takes precedence over saved profile picture URL. */
const cropperSrc = computed(() => uploadedImage.value || profilePictureUrl.value || "");

function extractProfileUpdateError(e) {
  const d = e?.response?.data;
  if (d == null) {
    return e?.message || "Something went wrong. Please try again.";
  }
  if (typeof d === "string") return d;
  if (d.message != null) {
    const m = d.message;
    return Array.isArray(m) ? m.join(", ") : String(m);
  }
  if (d.error != null) {
    return typeof d.error === "string" ? d.error : JSON.stringify(d.error);
  }
  if (Array.isArray(d.errors)) {
    const parts = d.errors.map((x) =>
      typeof x === "string" ? x : x?.message || x?.msg || String(x)
    );
    const msg = parts.filter(Boolean).join(" ");
    if (msg) return msg;
  }
  if (d.errors && typeof d.errors === "object" && !Array.isArray(d.errors)) {
    const parts = Object.entries(d.errors).flatMap(([k, v]) =>
      Array.isArray(v) ? v.map((item) => `${k}: ${item}`) : [`${k}: ${v}`]
    );
    if (parts.length) return parts.join(" ");
  }
  return "Could not update username.";
}

// Edit functions
const startEditing = () => {
  nameSaveError.value = "";
  isEditing.value = true;
  originalValues.name = profileForm.name;
};

const cancelEditing = () => {
  nameSaveError.value = "";
  isEditing.value = false;
  profileForm.name = originalValues.name;
};

const saveChanges = async () => {
  nameSaveError.value = "";
  const username = String(profileForm.name ?? "").trim();
  if (!username) {
    nameSaveError.value = "Username is required.";
    return;
  }
  if (username === String(originalValues.name ?? "").trim()) {
    isEditing.value = false;
    return;
  }
  isSavingName.value = true;
  try {
    await api.put("/auth/profile", { username });
    originalValues.name = username;
    profileForm.name = username;
    isEditing.value = false;
    defaultAvatarUrl.value = buildFallbackAvatar(username);
    if (String(profilePictureUrl.value).includes("ui-avatars.com")) {
      profilePictureUrl.value = defaultAvatarUrl.value;
    }
  } catch (e) {
    nameSaveError.value = extractProfileUpdateError(e);
  } finally {
    isSavingName.value = false;
  }
};

const startEditingEmail = () => {
  // Show verification modal first
  verificationAction.value = "edit";
  verificationEmail.value = profileForm.email;
  verificationTitle.value = "We've sent you a code";
  verificationDescription.value = `Before you make changes to your account, you'll need to enter the code we've sent to ${profileForm.email}`;
  showEmailVerificationModal.value = true;
};

const cancelEditingEmail = () => {
  isEditingEmail.value = false;
  profileForm.email = originalValues.email;
};

const saveEmailChanges = () => {
  // Always show verification modal when saving email (even if not changed, for security)
  verificationAction.value = "save";
  verificationEmail.value = profileForm.email;
  verificationTitle.value = "Confirm your new email";
  verificationDescription.value = `We've sent a 4-digit verification code to ${profileForm.email}. Enter the code below to verify your new email address.`;
  showEmailVerificationModal.value = true;
};

const handleVerifyCode = (code) => {
  // Here you would typically verify the code with your backend
  // For now, we'll just accept any 4-digit code
  if (code.length === 4 && /^[0-9]{4}$/.test(code)) {
    if (verificationAction.value === "edit") {
      // Enable email editing
      closeEmailVerificationModal();
      isEditingEmail.value = true;
      originalValues.email = profileForm.email;
    } else if (verificationAction.value === "save") {
      // Save the email after verification
      closeEmailVerificationModal();
      isEditingEmail.value = false;
      originalValues.email = profileForm.email;
      // Here you would typically make an API call to save the changes
      // Example: await updateUserEmail(profileForm.email);
    }
  }
};

const handleResendVerificationCode = (email) => {
  // Here you would typically resend the verification code
  // Example: await sendVerificationCode(email);
  console.log("Resending verification code to:", email);
};

const closeEmailVerificationModal = () => {
  showEmailVerificationModal.value = false;
  verificationAction.value = "edit";
};

// Disconnect account functions
const openDisconnectModal = () => {
  disconnectDescription.value = `You'll need to use your email address ${googleAccountEmail.value} and password next time you log in to Genius AI`;
  showDisconnectModal.value = true;
};

const closeDisconnectModal = () => {
  showDisconnectModal.value = false;
};

const handleDisconnectGoogle = () => {
  // Here you would typically make an API call to disconnect the Google account
  // Example: await disconnectGoogleAccount();
  console.log("Disconnecting Google account:", googleAccountEmail.value);
  // After successful disconnection, you might want to update the UI
  // to remove the Google account from the connected accounts list
};

// Profile picture functions
const handleFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    processImageFile(file);
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;
  const file = event.dataTransfer.files?.[0];
  if (file) {
    processImageFile(file);
  }
};

const processImageFile = (file) => {
  // Validate file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!validTypes.includes(file.type)) {
    alert("Please select a valid image file (JPG or PNG)");
    return;
  }

  // Validate file size (5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    alert("File size must be less than 5MB");
    return;
  }

  // Create image URL from file
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImage.value = e.target.result;
    isExistingImage.value = false;
    forceUploadPanel.value = false;
  };
  reader.readAsDataURL(file);
};

const openProfilePictureEditor = () => {
  editProfilePicture.value = true;
  forceUploadPanel.value = false;
  uploadedImage.value = null;
  isExistingImage.value =
    Boolean(profilePictureUrl.value) &&
    String(profilePictureUrl.value) !== String(defaultAvatarUrl.value);
};

const resetImage = () => {
  uploadedImage.value = null;
  isExistingImage.value = false;
  forceUploadPanel.value = true;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const removeExistingImage = () => {
  if (profilePictureUrl.value && profilePictureUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(profilePictureUrl.value);
  }
  profilePictureUrl.value = defaultAvatarUrl.value;
  uploadedImage.value = null;
  forceUploadPanel.value = false;
  isExistingImage.value = false;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
  closeProfilePictureModal();
};

const saveProfilePicture = () => {
  if (!cropperRef.value) {
    return;
  }

  const { canvas } = cropperRef.value.getResult();
  if (canvas) {
    // Convert canvas to blob and create URL
    canvas.toBlob((blob) => {
      // Revoke old blob URL to free memory
      if (profilePictureUrl.value && profilePictureUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(profilePictureUrl.value);
      }
      
      const url = URL.createObjectURL(blob);
      profilePictureUrl.value = url;
      isExistingImage.value = true;
      
      // Here you would typically upload the blob to your server
      // Example: await uploadProfilePicture(blob);
      
      closeProfilePictureModal();
    }, "image/jpeg", 0.9);
  }
};

const closeProfilePictureModal = () => {
  editProfilePicture.value = false;
  // Reset state after a short delay to allow modal animation
  setTimeout(() => {
    resetImage();
    isDragOver.value = false;
  }, 300);
  };
</script>

<style scoped>
.cropper {
  width: 100%;
  height: 100%;
}

input:focus-visible {
  outline: none;
}

:deep(.vue-simple-handler) {
  background-color: #7950F2;
  border-color: #7950F2;
}

:deep(.vue-simple-handler-wrapper--west-north),
:deep(.vue-simple-handler-wrapper--east-south) {
  color: #7950F2;
}

:deep(.vue-simple-stencil) {
  outline-color: #7950F2;
}
</style>