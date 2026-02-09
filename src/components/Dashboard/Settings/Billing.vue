<template>
  <div class="rounded-2xl bg_secondary_color p-6xl shadow-sm h-[100%] data-privacy-full-height">
    <!-- Header -->
    <h2 class="heading_h6_bold">Billing & Plan</h2>
    <p class="label_1_regular secondary_text_color mt-xs pb-10xl">
      View your plan, manage payments, and track AI credits.
    </p>

    <!-- Current Plan -->
    <div class="mt-6">
      <h3 class="label_1_semibold primary_text_color">Current Plan</h3>

      <div class="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 primary_border_color rounded-lg p-6xl mt-xl">
        <!-- Plan Info -->
        <div>
          <p class="label_2_medium primary_text_color">Monthly plan</p>
          <p class="heading_h6_semibold mt-xl seconary_title_text_color">$20 Monthly</p>

          <div class="mt-xl flex items-center gap-3">
            <button
              class="primary_add_button p-md w-4/5 lg:button_width"
            >
              Upgrade Plan
            </button>

            <div class="relative dropdown-container">
              <button
                @click.stop="toggleDropdown"
                class="h-9 w-9 rounded-lg profile_border text-black-50 flex items-center justify-center"
              >
                ⋯
              </button>
              
              <!-- Dropdown Menu -->
              <div
                v-if="showDropdown"
                class="absolute left-1/2 -translate-x-1/2 top-10 z-50 min-w-[120px] rounded-lg bg_secondary_color shadow-xl primary_border_color"
              >
                <div
                  @click.stop="handleCancelPlan"
                  class="flex items-center justify-center p-3 cursor-pointer rounded-lg"
                >
                  <span class="label_2_regular secondary_text_color">Cancel Plan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
         <!-- Horizontal line (Mobile only) -->
        <div class="block md:hidden h-[2px] w-full bg-gray-25  my-4"></div>
        <!-- Renew -->
        <div class="flex">
            <!-- Vertical line (Desktop only) -->
           <div class=" hidden md:block w-[3px] h-28 bg-gray-25  mr-5"></div>

          <div class="w-[100%]">
          <p class="label_2_medium primary_text_color">Renew at</p>
          <p class="heading_h6_semibold mt-xl seconary_title_text_color">Oct 26, 2025</p>

          <button
            class="mt-xl rounded-lg p-md secondary_bg_color w-4/5 lg:button_width"
          >
            Refill Credits
          </button>
          </div>
        </div>
      </div>
    </div>

<!-- plan -->
      
     <h3 class="label_1_semibold primary_text_color mt-5xl">Usage</h3>
     <div class="gap-4 mt-xl flex overflow-x-auto hide-scrollbar md:overflow-x-visible">
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
      <h3 class="tlabel_1_semibold primary_text_color">
        Payment Method
      </h3>
      <p class="label_1_regular secondary_text_color mt-xl">
        Manage your saved payment methods and billing details securely.
      </p>

      <button
        class="rounded-lg bg_primary_color mt-xl body_3_medium font-semibold text_primary_color p-md w-48"
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
