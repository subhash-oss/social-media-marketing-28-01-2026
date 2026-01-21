<template>
  <div class="rounded-2xl bg_white common_inner_gap shadow-sm h-[100%] data-privacy-full-height">
    <!-- Header -->
    <h2 class="heading_h6_bold">Localization</h2>
    <p class="label_1_regular regular_gap medium_mb">
      Set your preferred language, region, and time format.
    </p>

    <!-- Settings Fields -->
    <div class="space-y-9">
      <!-- Interface Language -->
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
        <label class="label_2_medium flex-shrink-0">
          Interface Language
        </label>
        <div class="relative flex items-center rounded-lg w-full md:w-[70%]">
          <select
            v-model="localizationSettings.interfaceLanguage"
            class="w-full appearance-none rounded-lg inputbox_border_color px-4 py-3 label_2_medium bg_white"
          >
            <option value="English (US)">English (US)</option>
            <option value="English (UK)">English (UK)</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
            <option value="Japanese">Japanese</option>
          </select>
          <!-- Chevron -->
          <img :src="DownArrow" alt="" class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2">
        </div>
      </div>

      <!-- Region -->
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
        <label class="label_2_medium flex-shrink-0">
          Region
        </label>
        <div class="relative flex items-center rounded-lg w-full md:w-[70%]">
          <select
            v-model="localizationSettings.region"
            class="w-full appearance-none rounded-lg inputbox_border_color px-4 py-3 label_2_medium bg_white"
          >
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Japan">Japan</option>
            <option value="China">China</option>
          </select>
          <!-- Chevron -->
          <img :src="DownArrow" alt="" class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2">
        </div>
      </div>

      <!-- Time Format -->
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
        <label class="label_2_medium flex-shrink-0">
          Time Format:
        </label>
        <div class="relative flex items-center rounded-lg w-full md:w-[70%]">
          <select
            v-model="localizationSettings.timeFormat"
            class="w-full appearance-none rounded-lg inputbox_border_color px-4 py-3 label_2_medium bg_white"
          >
            <option value="24-hour">24-hour</option>
            <option value="12-hour">12-hour</option>
          </select>
          <!-- Chevron -->
          <img :src="DownArrow" alt="" class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2">
        </div>
      </div>

      <!-- Timezone -->
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
        <label class="label_2_medium flex-shrink-0">
          Timezone:
        </label>
        <div class="relative flex items-center rounded-lg w-full md:w-[70%]">
          <select
            v-model="localizationSettings.timezone"
            class="w-full appearance-none rounded-lg inputbox_border_color px-4 py-3 label_2_medium bg_white"
          >
            <option value="(GMT+5:30) Asia/Kolkata">(GMT+5:30) Asia/Kolkata</option>
            <option value="(GMT-5:00) America/New_York">(GMT-5:00) America/New_York</option>
            <option value="(GMT+0:00) Europe/London">(GMT+0:00) Europe/London</option>
            <option value="(GMT-8:00) America/Los_Angeles">(GMT-8:00) America/Los_Angeles</option>
            <option value="(GMT+10:00) Australia/Sydney">(GMT+10:00) Australia/Sydney</option>
            <option value="(GMT+1:00) Europe/Berlin">(GMT+1:00) Europe/Berlin</option>
            <option value="(GMT+9:00) Asia/Tokyo">(GMT+9:00) Asia/Tokyo</option>
            <option value="(GMT+8:00) Asia/Shanghai">(GMT+8:00) Asia/Shanghai</option>
          </select>
          <!-- Chevron -->
          <img :src="DownArrow" alt="" class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2">
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-center md:justify-end gap-4 md:gap-8 mt-10">
      <button
        @click="resetToDefault"
        class="secondary_button_thin rounded-lg primary_border_color label_2_semibold md:px-6 bg_primary_color text_primary_color"
      >
        Reset to Default
      </button>
      <button
        @click="saveChanges"
        class="secondary_button_thin rounded-lg primary_button md:px-6 "
      >
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import DownArrow from "../../../assets/images/DownArrow.svg";

// Localization settings state
const localizationSettings = reactive({
  interfaceLanguage: 'English (US)',
  region: 'India',
  timeFormat: '24-hour',
  timezone: '(GMT+5:30) Asia/Kolkata',
});

// Default values for reset functionality
const defaultValues = {
  interfaceLanguage: 'English (US)',
  region: 'India',
  timeFormat: '24-hour',
  timezone: '(GMT+5:30) Asia/Kolkata',
};

const resetToDefault = () => {
  Object.assign(localizationSettings, defaultValues);
  // Here you would typically make an API call to reset settings
};

const saveChanges = () => {
  // Here you would typically make an API call to save the changes
  console.log('Saving localization settings:', localizationSettings);
};
</script>

