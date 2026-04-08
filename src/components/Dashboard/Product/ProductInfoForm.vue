<template>
  <div class="flex-1 bg_primary_color px-3xl py-12xl md:px-10xl lg:py-10xl">
    <!-- Card -->
    <div class="w-full h-[100%] flex flex-col">
      <!-- Header Section -->
      <div class=" bg_secondary_color rounded-2xl p-6xl primary_border_color">
        <h1 class="heading_h6_bold primary_text_color">
          Create a new product
        </h1>
        <p class="label_1_regular secondary_text_color mt-md">
          Add your brand details and link social platforms for automated posting.
        </p>
      <!-- Step Navigation -->
      <div ref="scrollContainer" class="overflow-x-auto mt-6xl scrollbar-hide">
        <div class="flex items-center  min-w-max gap-3xl">
          <!-- Step 1: Brand Info -->
          <div ref="step1Ref" class="flex items-center flex-shrink-0">
            <div
              class="flex items-center justify-center rounded-lg px-3xl md:px-3xl py-xl border border-blue-50 whitespace-nowrap profile_tab_border"
              :class="currentStep === 1 ? 'bg-blue-25' : currentStep > 1 ? 'bg-blue-25' : 'bg_secondary_color'"
            > 
              <span class="body_3_medium text-blue-300">1. Brand Info</span>
            </div>
          </div>
          <!-- Step 2: Brand Identity -->
          <div ref="step2Ref" class="flex items-center flex-shrink-0">
            <div
              class="flex items-center justify-center rounded-lg px-3xl md:px-3xl py-xl border border-blue-50 whitespace-nowrap profile_tab_border"
              :class="currentStep === 2 ? 'bg-blue-25' : currentStep > 2 ? 'bg-blue-25' : 'bg_secondary_color'"
            >
              <span class="body_3_medium text-blue-300">2. Brand Identity</span>
            </div>
          </div>
          <!-- Step 3: Social Connections -->
          <div ref="step3Ref" class="flex items-center flex-shrink-0">
            <div
              class="flex items-center justify-center rounded-lg px-3xl md:px-3xl py-xl border border-blue-50 whitespace-nowrap profile_tab_border"
              :class="currentStep === 3 ? 'bg-blue-25' : 'bg_secondary_color'"
            >
              <span class="body_3_medium text-blue-300">3. Social Connections</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    <div class="flex-1 mt-6xl">
      <!-- Step 1: Brand Info -->
      <BrandInfo
        v-if="currentStep === 1"
        v-model:website-url="websiteUrl"
        @files-selected="handleFilesSelected"
        @validation-change="handleValidationChange"
      />

      <!-- Step 2: Brand Identity -->
      <BrandIdentity
        ref="brandIdentityRef"
        v-if="currentStep === 2"
        v-model:active-tab="activeTab"
        v-model:product-name="productName"
        v-model:description="description"
      />

      <!-- Step 3: Social Connections -->
      <SocialConnections
        v-if="currentStep === 3"
        @connect-social="handleConnectSocial"
      />
    </div>
      <!-- Bottom Navigation -->
      <!-- Success Modal -->
      <BrandCreatedSuccessModal
        :open="showSuccessModal"
        @close="showSuccessModal = false"
        @view-product="handleViewProduct"
        @go-to-chat="handleGoToChat"
      />
      <div class="flex items-center justify-between bg_secondary_color mt-5xl px-6xl py-xl primary_border_color rounded-lg">
        <button
          @click="handleBack"
          class="label_1_semibold primary_text_color bg_primary_color primary_border_color px-5xl py-xl rounded-lg"
        >
          Back
        </button>
        <button
          @click="handleContinue"
          :disabled="currentStep === 1 && !isStep1Valid"
          :class="[
            'flex items-center gap-md rounded-lg px-5xl py-xl',
            currentStep === 1 && !isStep1Valid 
              ? 'modal_disabled_primary_button cursor-not-allowed label_1_semibold' 
              : 'modal_primary_button cursor-pointer'
          ]"
        >
          <span>{{ currentStep === 3 ? 'Proceed' : 'Continue' }}</span>
          <img :src="DoneArrowRight" alt="">
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import BrandInfo from "./BrandInfo.vue";
import BrandIdentity from "./BrandIdentity.vue";
import SocialConnections from "./SocialConnections.vue";
import BrandCreatedSuccessModal from "./BrandCreatedSuccessModal.vue";
import DoneArrowRight from "../../../assets/images/DoneArrowRight.svg"


const props = defineProps({
  currentStep: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["back", "continue", "close"]);

const router = useRouter();

const activeTab = ref("product-info");
const websiteUrl = ref("");
const productName = ref("Lumo Vibe");
const description = ref("It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.");
const isStep1Valid = ref(false);
const showSuccessModal = ref(false);
const brandIdentityRef = ref(null);

// Refs for step navigation scrolling
const scrollContainer = ref(null);
const step1Ref = ref(null);
const step2Ref = ref(null);
const step3Ref = ref(null);

// Auto-scroll to active step
const scrollToActiveStep = () => {
  nextTick(() => {
    if (!scrollContainer.value) return;
    
    let activeStepRef = null;
    switch (props.currentStep) {
      case 1:
        activeStepRef = step1Ref.value;
        break;
      case 2:
        activeStepRef = step2Ref.value;
        break;
      case 3:
        activeStepRef = step3Ref.value;
        break;
    }
    
    if (activeStepRef && scrollContainer.value) {
      activeStepRef.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  });
};

// Watch for step changes and scroll to active step
watch(() => props.currentStep, () => {
  scrollToActiveStep();
}, { immediate: true });

const handleBack = () => {
  if (props.currentStep === 1) {
    // Go back to intro page
    emit("back");
  } else {
    // Go back to previous step
    emit("back");
  }
};

const handleContinue = () => {
  // If on step 3, show success modal instead of moving to next step
  if (props.currentStep === 3) {
    showSuccessModal.value = true;
    return;
  }
  
  const identity = brandIdentityRef.value?.getBrandIdentitySelections?.() ?? {};

  emit("continue", {
    websiteUrl: websiteUrl.value,
    productName: productName.value,
    description: description.value,
    brandColors: identity.brandColors,
    brandVoice: identity.brandVoice,
    moveToNextStep: true,
  });
};

const handleFilesSelected = (files) => {
  // Handle file upload logic here
  console.log("Files selected:", files);
};

const handleValidationChange = (validation) => {
  console.log("Validation received in parent:", validation);
  isStep1Valid.value = validation.isValid;
  console.log("isStep1Valid updated to:", isStep1Valid.value);
};

const handleConnectSocial = (platform) => {
  // Handle social media connection logic here
  console.log("Connect to:", platform);
};

const handleViewProduct = () => {
  // Handle view product logic here
  console.log("View Product clicked");
  emit("close");
};

const handleGoToChat = () => {
  // Navigate to dashboard with chat tab active
  router.push({ path: '/dashboard', query: { tab: 'chat' } });
  emit("close");
};
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style>

