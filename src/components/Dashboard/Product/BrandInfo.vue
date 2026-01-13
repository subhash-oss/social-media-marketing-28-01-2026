<template>
  <div class="bg_white rounded-2xl p-6">
  <div class="mb-4 ">
    <div class="mb-4 gap-8 lg:w-1/2">
      <!-- Left Side: Illustration -->
      <div class=" flex-shrink-0">
        <img
          :src="BrandIllustration"
          alt="Brand Setup Illustration"
          class="h-auto w-48"
        />
      </div>

      <!-- Right Side: Form Content -->
      <div class="flex-1">
        <h2 class="heading_h6_bold primary_text_color mb-\">
          Tell us about your brand
        </h2>
        <p class="label_1_regular mb-6">
          Paste your website URL or upload documents so AI can learn your brand's style, tone, and personality.
        </p>

        <!-- Website URL Input -->
        <div class="mb-4">
          <label class="label_2_medium mb-2 block primary_text_color">
            Website URL
          </label>
          <input
            :value="getWebsiteUrl()"
            @input="handleUrlInput"
            type="url"
            placeholder="Enter your website URL here..."
            class="input_box w-full Label_2_Medium bg_primary_color"
          />
        </div>

        <!-- Upload Files Link -->
        <div class="mt-4">
          <span class="label_1_regular">Or </span>
          <button
            @click="showUploadModal = true"
            class="label_1_semibold primary_text_color underline"
          >
            click here to upload files
          </button>
          <span class="label_1_regular"> to help AI learn your brand.</span>
          <input
            ref="fileInput"
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg"
            class="hidden"
            @change="handleFileChange"
          />
        </div>
      </div>
    </div>

    <!-- Upload Brand Files Modal -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <!-- Modal -->
      <div
        class="relative w-full max-w-md mx-4 bg_white rounded-2xl shadow-2xl overflow-hidden p-6"
        @click.stop
      >
        <!-- Title -->
        <h2 class="heading_h5_semibold  mb-2">
          Upload brand files
        </h2>
        
        <!-- Subtitle -->
        <p class="label_2_regular mb-2">
          Add your brand or product documents to help AI understand your identity.
        </p>

        <!-- File Upload Area -->
        <div
          ref="dropZone"
          @drop="handleDrop"
          @dragover.prevent
          @dragenter.prevent
          @dragleave="isDragOver = false"
          @dragenter="isDragOver = true"
          :class="[
            'border-2 border-dashed rounded-lg pt-20 text-center cursor-pointer transition-colors',
            isDragOver ? 'sub_border_color bg_white' : 'primary_border_color'
          ]"
          @click="fileInput?.click()"
        >
          <!-- Cloud Upload Icon -->
          <div class="flex justify-center mb-4">
            <img :src="UploadImageIcon" alt="">
          </div>
          
          <p class="body_3_medium text_color mb-20">
            Drag & drop your files here or <span class="font-semibold primary_text_color">browse</span> to upload.
          </p>
          
          <p class="label_3_regular text-[#A7ABB3] mb-2">
            Accepted formats - .pdf, .png, .jpg, .jpeg | Max file size - 5MB
          </p>
        </div>

        <!-- File Upload Status List -->
        <div v-if="fileList.length > 0" class="mt-4 space-y-3">
          <div
            v-for="(fileItem, index) in fileList"
            :key="fileItem.id"
            class="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3"
          >
            <!-- File Name -->
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1 min-w-0 flex gap-1">
                <img :src="UploadaImageIcon" alt="">
              <div>
                <p class="label_2_semibold primary_text_color truncate">
                  {{ fileItem.name }}
                </p>
                <!-- File Size and Status -->
                <div class="flex items-center gap-2 regular_gap">
                  <p v-if="fileItem.status === 'uploading'" class="label_3_regular">
                    {{ formatFileSize(fileItem.uploaded) }} of {{ formatFileSize(fileItem.size) }}
                  </p>
                  <p v-else class="label_3_regular">
                    {{ formatFileSize(fileItem.size) }}
                  </p>
                </div>
                </div>
              </div>
             
            </div>
             <div class="flex justify-between">
                  <span
                    v-if="fileItem.status === 'completed'"
                    class="flex items-center gap-1 label_3_regular text-[#2ABB7F]"
                  >
                    <!-- Checkmark Icon -->
                    <img :src="GreenTickIcon" alt="">
                    Completed
                  </span>
                   <!-- Cancel/Delete Button -->
              <button
                @click="removeFile(index)"
                class="ml-2 text-[#6B7280]"
              >
              <span v-if="fileItem.status === 'uploading'">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4L4 12M4 4L12 12"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
                </span>
                <!-- Trash Icon -->
                <span v-else><img :src="TrashIcon" alt=""></span>
              </button>
                  </div>
            <!-- Progress Bar (only for uploading files) -->
            <div v-if="fileItem.status === 'uploading'" class="flex items-center gap-2">
              <!-- Spinner Icon -->
              <svg
                class="animate-spin"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="#E5E7EB"
                  stroke-width="2"
                  fill="none"
                />
                <path
                  d="M8 1C10.7614 1 13 3.23858 13 6"
                  stroke="#22C55E"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-dasharray="15 15"
                />
              </svg>
              <!-- Progress Bar -->
              <div class="flex-1 h-2 bg-[#DCFFF1] rounded-full overflow-hidden">
                <div
                  class="h-full bg-[#2ABB7F] rounded-full transition-all duration-300 ease-out"
                  :style="{ width: `${fileItem.progress}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="fileError"
          class="mt-4 flex items-center justify-between bg_white border bg-[#FFECEB] rounded-lg px-4 py-3"
        >
          <div class="flex items-center gap-3">
            <!-- Error Icon -->
           <img :src="WarningIcon" alt="">
            <span class="error_text">
              {{ fileError }}
            </span>
          </div>
          <button
            @click="fileError = null"
            class="error_text"
          >
            <img :src="CloseIcon" alt="">
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 mt-6">
          <button
            @click="closeModal"
            class="px-5 py-3 rounded-lg label_2_medium primary_border_color bg_primary_color"
          >
            Cancel
          </button>
          <button
            @click="handleContinue"
            :disabled="fileError || completedFilesCount === 0"
            :class="[
              ' px-5 py-3 rounded-lg flex items-center justify-center gap-2 ',
              fileError || completedFilesCount === 0
                ? 'label_2_medium disabled_primary_button cursor-not-allowed text-white'
                : 'label_2_medium primary_button cursor-pointer text-white'
            ]"
          >
            Continue
            <img :src="DoneArrowRight" alt="">
          </button>
        </div>
      </div>
    </div>
  </div>
 </div> 
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import BrandIllustration from "../../../assets/images/ProductIntroImage.png";
import UploadImageIcon from "../../../assets/images/UploadImageIcon.svg"
import UploadaImageIcon from "../../../assets/images/UploadaImageIcon.svg"
import GreenTickIcon from "../../../assets/images/GreenTickIcon.svg"
import TrashIcon from "../../../assets/images/TrashIcon.svg"
import CloseIcon from "../../../assets/images/CloseIcon.svg"
import WarningIcon from "../../../assets/images/WarningIcon.svg"
import DoneArrowRight from "../../../assets/images/DoneArrowRight.svg"

const props = defineProps({
  websiteUrl: {
    type: String,
    default: "",
  },
  "website-url": {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:websiteUrl", "update:website-url", "files-selected", "validation-change"]);

const fileInput = ref(null);
const dropZone = ref(null);
const hasFiles = ref(false);
const showUploadModal = ref(false);
const isDragOver = ref(false);
const fileError = ref(null);
const selectedFiles = ref([]);
const fileList = ref([]);
const uploadIntervals = ref({});

// Store uploaded files to preserve on navigation
const uploadedFiles = ref([]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ACCEPTED_FORMATS = ['.pdf', '.png', '.jpg', '.jpeg'];

// Computed property for completed files count
const completedFilesCount = computed(() => {
  return fileList.value.filter(f => f.status === 'completed').length;
});

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${Math.round(kb)} KB`;
  }
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
};

// URL validation function
const isValidUrl = (urlString) => {
  if (!urlString || urlString.trim() === "") {
    return false;
  }
  
  try {
    // Add protocol if missing
    let url = urlString.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    
    const urlObj = new URL(url);
    // Check if it has a valid hostname with at least one dot
    return urlObj.hostname.length > 0 && urlObj.hostname.includes(".");
  } catch {
    return false;
  }
};

// Get the website URL from props (handle both naming conventions)
const getWebsiteUrl = () => {
  return props.websiteUrl || props["website-url"] || "";
};

// Function to emit validation status
const emitValidation = () => {
  const urlValue = getWebsiteUrl();
  const isValid = isValidUrl(urlValue);
  const finalIsValid = isValid || hasFiles.value;
  
  console.log("Validation check:", {
    websiteUrl: urlValue,
    isValid,
    hasFiles: hasFiles.value,
    finalIsValid
  });
  
  emit("validation-change", {
    isValid: finalIsValid,
    hasUrl: isValid,
    hasFiles: hasFiles.value,
  });
};

// Validate URL whenever it changes (watch both prop names)
watch(() => [props.websiteUrl, props["website-url"]], () => {
  emitValidation();
}, { immediate: true });

// Validate file size and format
const validateFiles = (files) => {
  fileError.value = null;
  const invalidFiles = [];
  
  Array.from(files).forEach(file => {
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    // Check file format
    if (!ACCEPTED_FORMATS.includes(fileExtension)) {
      invalidFiles.push(`${file.name} (Invalid format)`);
      return;
    }
    
    // Check file size (only show error if > 5MB)
    if (file.size > MAX_FILE_SIZE) {
      invalidFiles.push(`${file.name} (File size exceeded 5 MB)`);
    }
  });
  
  if (invalidFiles.length > 0) {
    fileError.value = invalidFiles[0]; // Show first error
    return false;
  }
  
  return true;
};

// Simulate file upload with progress
const uploadFile = (file, id) => {
  const fileItem = {
    id,
    name: file.name,
    size: file.size,
    uploaded: 0,
    progress: 0,
    status: 'uploading',
    file: file
  };
  
  fileList.value.push(fileItem);
  
  // Simulate upload progress (simulate based on file size - larger files take longer)
  const totalSteps = 20; // 20 steps to complete
  const stepSize = file.size / totalSteps;
  let currentStep = 0;
  
  const interval = setInterval(() => {
    const item = fileList.value.find(f => f.id === id);
    if (item) {
      currentStep++;
      // Increment progress
      item.uploaded = Math.min(currentStep * stepSize, file.size);
      item.progress = Math.min((item.uploaded / item.size) * 100, 100);
      
      // Complete upload when done
      if (item.progress >= 100 || currentStep >= totalSteps) {
        item.uploaded = item.size;
        item.progress = 100;
        item.status = 'completed';
        clearInterval(interval);
        delete uploadIntervals.value[id];
      }
    } else {
      // File was removed, clear interval
      clearInterval(interval);
      delete uploadIntervals.value[id];
    }
  }, 150); // Update every 150ms for smoother animation
  
  uploadIntervals.value[id] = interval;
};

// Remove file from list
const removeFile = (index) => {
  const fileItem = fileList.value[index];
  
  // Clear upload interval if exists
  if (uploadIntervals.value[fileItem.id]) {
    clearInterval(uploadIntervals.value[fileItem.id]);
    delete uploadIntervals.value[fileItem.id];
  }
  
  // Remove from list
  fileList.value.splice(index, 1);
  
  // Update selectedFiles
  selectedFiles.value = fileList.value
    .filter(f => f.status === 'completed')
    .map(f => f.file);
};

// Handle file drop
const handleDrop = (event) => {
  event.preventDefault();
  isDragOver.value = false;
  
  const files = event.dataTransfer.files;
  if (files && files.length > 0) {
    processFiles(Array.from(files));
  }
};

const handleFileChange = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    processFiles(Array.from(files));
  }
};

// Process and upload files
const processFiles = (files) => {
  fileError.value = null;
  
  files.forEach(file => {
    // Validate file
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!ACCEPTED_FORMATS.includes(fileExtension)) {
      fileError.value = `${file.name} (Invalid format)`;
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      fileError.value = `${file.name} (File size exceeded 5 MB)`;
      return;
    }
    
    // Add to selected files
    if (!selectedFiles.value.find(f => f.name === file.name && f.size === file.size)) {
      selectedFiles.value.push(file);
      
      // Start upload simulation
      const id = Date.now() + Math.random();
      uploadFile(file, id);
    }
  });
};

// Close modal and reset
const closeModal = () => {
  // Clear all upload intervals
  Object.values(uploadIntervals.value).forEach(interval => {
    clearInterval(interval);
  });
  uploadIntervals.value = {};
  
  showUploadModal.value = false;
  fileError.value = null;
  isDragOver.value = false;
  // Don't reset fileList and selectedFiles here - keep them for continue
  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Handle continue button
const handleContinue = () => {
  // Only allow continue if no errors and files are selected
  if (fileError.value) {
    return;
  }
  
  // Get completed files
  const completedFiles = fileList.value
    .filter(f => f.status === 'completed')
    .map(f => f.file);
  
  if (completedFiles.length > 0) {
    hasFiles.value = true;
    uploadedFiles.value = [...completedFiles];
    
    // Create a FileList-like object for emit
    const dataTransfer = new DataTransfer();
    completedFiles.forEach(file => {
      dataTransfer.items.add(file);
    });
    
    emit("files-selected", dataTransfer.files);
    emitValidation();
    
    // Clear intervals before closing
    Object.values(uploadIntervals.value).forEach(interval => {
      clearInterval(interval);
    });
    uploadIntervals.value = {};
    
    // Close modal but keep completed files visible for reference
    showUploadModal.value = false;
    fileError.value = null;
    isDragOver.value = false;
  } else if (fileList.value.length > 0) {
    // If there are files but none completed, just show message or wait
    // For now, allow closing
    closeModal();
  } else {
    closeModal();
  }
};

// Check if files exist on mount (preserve state when navigating back)
onMounted(() => {
  if (uploadedFiles.value.length > 0) {
    hasFiles.value = true;
  }
  emitValidation();
});

// Handle URL input
const handleUrlInput = (event) => {
  const value = event.target.value;
  // Emit the update event - Vue will handle kebab-case conversion
  emit("update:websiteUrl", value);
  emit("update:website-url", value);
};
</script>

