<template>
     <div class="bg_white rounded-2xl common_inner_gap primary_border_color h-[100%] data-privacy-full-height">
            <h2 class="heading_h6_bold">Profile Information</h2>
            <p class="label_1_regular regular_gap medium_mb">
              Update your profile, secure your account, and manage connected apps.
            </p>

            <div class="space-y-6">
              <!-- Profile Picture -->
              <div class="flex items-start gap-6">
                <div class="relative">
                  <div
                    class="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
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
              <div class="flex flex-col items-start">
                <label class="label_2_medium primary_text_color w-20 flex-shrink-0"
                :class="[!isEditing ? 'disable_text_color cursor-not-allowed' : '']">
                  Name:
                </label>
              <div class="flex w-[100%] gap-3 items-center medium_gap"> 
                <div class="flex items-center gap-3 w-1/2">
                  <input
                    v-model="profileForm.name"
                    type="text"
                    :disabled="!isEditing"
                    :class="[
                      ' flex-1 h-12 px-3 rounded-lg inputbox_border_color bg_primary_color w-1/2 ',
                      !isEditing ? ' disable_text_color cursor-not-allowed ' : 'Label_2_Medium'
                    ]"
                  />
                  
                </div>
                <div v-if="!isEditing" class="flex gap-2">
                    <button
                      @click="startEditing"
                      class="flex items-center Label_2_Medium justify-center rounded-lg"
                    >
                      <img :src="InputboxEditIcon" alt="">
                    </button>
                  </div>
                  <div v-else class="flex gap-2">
                    <button
                      @click="cancelEditing"
                      class="px-4 py-2 rounded-lg primary_border_color bg_white label_2_medium h-12"
                    >
                      Cancel
                    </button>
                    <button
                      @click="saveChanges"
                      class="px-4 py-2 rounded-lg primary_button h-12"
                    >
                      Save
                    </button>
                  </div>
              </div>
              </div> 

              <!-- Email Field -->
              <div class="flex flex-col items-start ">
                <label class="label_2_medium primary_text_color w-20 flex-shrink-0"
                :class="[!isEditingEmail ? 'disable_text_color cursor-not-allowed' : '']"
                >
                  Email:
                </label>
                <div class="flex w-[100%] gap-3 items-center medium_gap" > 
                <div class="flex items-center gap-3  w-1/2">
                  <input
                    v-model="profileForm.email"
                    type="email"
                    :disabled="!isEditingEmail"
                    :class="[
                      ' flex-1 h-10 md:h-12 px-3 rounded-lg inputbox_border_color bg_primary_color w-1/2',
                      !isEditingEmail ? ' disable_text_color cursor-not-allowed ' : 'Label_2_Medium'
                    ]"
                  />
                  </div>
                  <button
                    v-if="!isEditingEmail"
                    @click="startEditingEmail"
                    class="flex items-center Label_2_Medium justify-center rounded-lg"
                  >
                    <img :src="InputboxEditIcon" alt="">
                  </button>
                  <div v-else class="flex gap-2">
                    <button
                      @click="cancelEditingEmail"
                      class="px-4 py-2 rounded-lg primary_border_color bg_white label_2_medium h-12"
                    >
                      Cancel
                    </button>
                    <button
                      @click="saveEmailChanges"
                      class="px-4 py-2 rounded-lg primary_button h-12"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            
          <!-- Connected Social Accounts Section -->
            <h2 class="heading_h6_bold mt-6">Connected social accounts</h2>
            <p class="label_1_regular mini-gap">
              Services that you use to log in to Genius AI
            </p>

            <div class="space-y-4 common_gap w-[100%] md:w-1/2">
              <!-- Google Account -->
              <div
                class="flex items-center justify-between md:p-4"
              >
                <div class="flex items-center gap-5">
                  <div
                    class="w-10 h-10 flex items-center justify-center"
                  >
                    <img :src="GoogleIcon" alt="">
                  </div>
                  <div>
                    <p class="label_1_regular ">Google</p>
                    <p class="label_1_semibold ">Charlene Reed</p>
                  </div>
                </div>
                <button
                  @click="openDisconnectModal"
                  class="px-5 md:px-12 py-2 rounded-md bg_primary_color label_2_medium primary_border_color"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        
          

  <!-- Profile Picture Upload & Crop Modal -->
  <div
    v-if="editProfilePicture"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
    @click.self="closeProfilePictureModal"
  >
    <div
      class="relative w-full max-w-2xl mx-4 bg_white rounded-2xl shadow-2xl overflow-hidden"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="p-6 border-b border-[#F1F2F4]">
        <h2 class="heading_h5_bold mb-2">Edit Profile Picture</h2>
        <p class="label_1_regular text-[#8590A2]">
          {{ uploadedImage ? 'Crop and adjust your image' : 'Upload a new image and crop it to your preference' }}
        </p>
      </div>

      <!-- Modal Content -->
      <div class="p-6">
        <!-- File Upload Section -->
        <div v-if="!uploadedImage" class="space-y-4">
          <div
            @drop="handleDrop"
            @dragover.prevent
            @dragenter.prevent
            @dragleave="isDragOver = false"
            @dragenter="isDragOver = true"
            :class="[
              'border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
              isDragOver ? 'border-[#7950F2] bg-[#F9FAFB]' : 'border-[#E5E7EB]'
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
                <p class="label_1_semibold primary_text_color mb-1">
                  Drag & drop your image here
                </p>
                <p class="label_2_regular text-[#8590A2]">
                  or <span class="text-[#7950F2] font-semibold">browse</span> to
                  upload
                </p>
                <p class="label_3_regular text-[#A7ABB3] mt-2">
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

        <!-- Image Cropper Section -->
        <div v-else class="space-y-4">
          <div class="relative w-full h-[400px] bg-[#F9FAFB] rounded-lg overflow-hidden">
            <Cropper
              ref="cropperRef"
              class="cropper"
              :src="uploadedImage"
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
              class="px-4 py-2 rounded-md border border-[#E5E7EB] bg-white text-[#DC2626] label_2_semibold hover:bg-[#FEF2F2] transition-colors"
            >
              Remove Image
            </button>
            <button
              @click="resetImage"
              class="px-4 py-2 rounded-md border border-[#E5E7EB] bg-white text-[#1D2125] label_2_semibold hover:bg-[#F9FAFB] transition-colors"
            >
              {{ isExistingImage ? 'Upload New Image' : 'Choose Different Image' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="p-6 border-t border-[#F1F2F4] flex justify-end gap-3">
        <button
          @click="closeProfilePictureModal"
          class="px-4 py-2 rounded-md border border-[#E5E7EB] bg-white text-[#1D2125] label_2_semibold hover:bg-[#F9FAFB] transition-colors"
        >
          Cancel
        </button>
        <button
          v-if="uploadedImage"
          @click="saveProfilePicture"
          class="px-4 py-2 rounded-md bg-[#7950F2] text-white label_2_semibold hover:bg-[#6E5DC6] transition-colors"
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
import { ref, reactive, h } from "vue";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import EmailVerificationModal from "./EmailVerificationModal.vue";
import DisconnectAccountModal from "./DisconnectAccountModal.vue";
import ImageEditIcon from "../../../assets/images/ImageEditIcon.svg";
import InputboxEditIcon from "../../../assets/images/InputboxEditIcon.svg";
import GoogleIcon from "../../../assets/images/GoogleIcon.svg";

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

// Email verification state
const showEmailVerificationModal = ref(false);
const verificationAction = ref("edit"); // 'edit' or 'save'
const verificationEmail = ref("");
const verificationTitle = ref("We've sent you a code");
const verificationDescription = ref("");

// Disconnect account modal state
const showDisconnectModal = ref(false);
const googleAccountEmail = ref("cliffbooth@gmail.com"); // This should come from your auth provider
const disconnectDescription = ref("");

// Profile picture state
const defaultAvatarUrl = "https://ui-avatars.com/api/?name=Cliff+Booth&background=7950F2&color=fff&size=96";
const profilePictureUrl = ref(defaultAvatarUrl);
const uploadedImage = ref(null);
const fileInputRef = ref(null);
const cropperRef = ref(null);
const isDragOver = ref(false);
const isExistingImage = ref(false);

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
  verificationDescription.value = `We’ve sent a 6-digit verification code to ${profileForm.email}. Enter the code below to verify your new email address.`;
  showEmailVerificationModal.value = true;
};

const handleVerifyCode = (code) => {
  // Here you would typically verify the code with your backend
  // For now, we'll just accept any 6-digit code
  if (code.length === 6 && /^[0-9]{6}$/.test(code)) {
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
    isExistingImage.value = false; // This is a new upload
  };
  reader.readAsDataURL(file);
};

const openProfilePictureEditor = () => {
  editProfilePicture.value = true;
  // If there's an existing uploaded image (not the default avatar), load it for editing
  if (profilePictureUrl.value && profilePictureUrl.value !== defaultAvatarUrl) {
    // Check if it's a blob URL (from previous upload) or a regular image URL
    if (profilePictureUrl.value.startsWith('blob:') || (!profilePictureUrl.value.startsWith('http') && !profilePictureUrl.value.startsWith('data:'))) {
      // It's a blob URL or local file URL from a previous upload, load it for editing
      loadExistingImageForEditing();
    } else if (profilePictureUrl.value.startsWith('data:')) {
      // It's already a data URL, use it directly
      uploadedImage.value = profilePictureUrl.value;
      isExistingImage.value = true;
    } else {
      // It's an external URL (like the default avatar), try to load it for editing
      loadExistingImageForEditing();
    }
  }
};

const loadExistingImageForEditing = async () => {
  try {
    // Convert blob URL to data URL for the cropper
    const response = await fetch(profilePictureUrl.value);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImage.value = e.target.result;
      isExistingImage.value = true;
    };
    reader.readAsDataURL(blob);
  } catch (error) {
    console.error('Error loading existing image:', error);
    // If there's an error, allow user to upload a new image
    uploadedImage.value = null;
    isExistingImage.value = false;
  }
};

const resetImage = () => {
  uploadedImage.value = null;
  isExistingImage.value = false;
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const removeExistingImage = () => {
  // Reset to default avatar
  if (profilePictureUrl.value && profilePictureUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(profilePictureUrl.value);
  }
  profilePictureUrl.value = defaultAvatarUrl;
  resetImage();
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