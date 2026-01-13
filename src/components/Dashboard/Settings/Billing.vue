<template>
  <div class="rounded-2xl bg-white common_inner_gap shadow-sm">
    <!-- Header -->
    <h2 class="heading_h6_bold">Billing & Plan</h2>
    <p class="label_1_regular regular_gap medium_mb">
      View your plan, manage payments, and track AI credits.
    </p>

    <!-- Current Plan -->
    <div class="mt-6">
      <h3 class="label_1_semibold">Current Plan</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 primary_border_color rounded-lg common_inner_gap medium_gap">
        <!-- Plan Info -->
        <div>
          <p class="label_2_medium">Monthly plan</p>
          <p class="heading_h6_semibold medium_gap seconary_title_text_color">$20 Monthly</p>

          <div class="medium_gap flex items-center gap-3">
            <button
              class="primary_add_button button_thin w-4/5 lg:button_width"
            >
              Upgrade Plan
            </button>

            <div class="relative dropdown-container">
              <button
                @click.stop="toggleDropdown"
                class="h-9 w-9 rounded-lg primary_border_color dot_text_style flex items-center justify-center"
              >
                ⋯
              </button>
              
              <!-- Dropdown Menu -->
              <div
                v-if="showDropdown"
                class="absolute left-1/2 -translate-x-1/2 top-10 z-50 min-w-[120px] rounded-lg bg_white shadow-xl primary_border_color"
              >
                <div
                  @click.stop="handleCancelPlan"
                  class="flex items-center justify-center p-3 cursor-pointer rounded-lg"
                >
                  <span class="label_2_regular">Cancel Plan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
         <!-- Horizontal line (Mobile only) -->
        <div class="block lg:hidden h-[2px] w-full hr_linr_bg my-4"></div>
        <!-- Renew -->
        <div class="flex">
            <!-- Vertical line (Desktop only) -->
           <div class=" hidden lg:block w-[4px] h-28 hr_linr_bg mr-5"></div>

          <div class="w-[100%]">
          <p class="label_2_medium">Renew at</p>
          <p class="heading_h6_semibold medium_gap seconary_title_text_color">Oct 26, 2025</p>

          <button
            class="medium_gap rounded-lg button_thin secondary_bg_color w-4/5 lg:button_width"
          >
            Refill Credits
          </button>
          </div>
        </div>
      </div>
    </div>

<!-- plan -->
      
     <div class="gap-4 common_gap flex overflow-x-auto hide-scrollbar md:overflow-x-visible">
      <Plan
        title="AI Credits"
        :used="820"
        :total="2000"
        :icon="Gemini"
      />

      <Plan
        title="Generated Posts"
        :used="15"
        :total="1000"
        :icon="PostIcon"
      />

      <Plan
        title="Products (Brands)"
        :used="4"
        :total="6"
        :icon="PcircleIcon"
      />
    </div>

    <!-- Payment Method -->
    <div class="mt-10">
      <h3 class="tlabel_1_semibold">
        Payment Method
      </h3>
      <p class="label_1_regular medium_gap">
        Manage your saved payment methods and billing details securely.
      </p>

      <button
        class="rounded-lg bg_primary_color medium_gap body_3_medium font-semibold text_primary_color button_thin w-48"
      >
        View Invoices
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Plan from "./Plan.vue"
import Gemini from "../../../assets/images/Gemini.svg";
import PostIcon from "../../../assets/images/PostIcon.svg";
import PcircleIcon from "../../../assets/images/PcircleIcon.svg";

const showDropdown = ref(false);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleCancelPlan = () => {
  // Add your cancel plan logic here
  console.log('Cancel Plan clicked');
  showDropdown.value = false;
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.dropdown-container')) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
