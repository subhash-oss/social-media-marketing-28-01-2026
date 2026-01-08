<template>
  <div class="bg_white rounded-2xl py-7 px-4 brand_section_height">
    <ul class="space-y-6">

      <!-- Secondary -->
      <div class="gap-3 flex flex-col items-start justify-between lg:flex-row">
        <span class="label_2_medium primary_text_color">
          Heading
        </span>

        <div
          class="relative flex items-center rounded-xl w-[100%] lg:w-[70%]"
        >
          <select
            v-model="fonts.body"
            class="w-full appearance-none rounded-xl inputbox_border_color px-4 py-3 label_2_medium primary_text_color focus:border-[#E5DBFF] focus:outline-none"
          >
            <option value="Open Sans">Open Sans</option>
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Lato">Lato</option>
          </select>

          <!-- Chevron -->
          <svg
            class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        
        </div>
    </div>

      <!-- Font -->
      <li class="gap-3 flex flex-col items-start justify-between lg:flex-row">
        <span class="label_2_medium primary_text_color">
          Font
        </span>

        <div
          class="relative flex items-center rounded-xl w-[100%] lg:w-[70%]"
        >
          <select
            v-model="fonts.body"
            class="w-full appearance-none rounded-xl inputbox_border_color px-4 py-3 label_2_medium primary_text_color focus:border-[#E5DBFF] focus:outline-none"
          >
            <option value="Open Sans">Open Sans</option>
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Lato">Lato</option>
          </select>

          <!-- Chevron -->
          <svg
            class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const fonts = reactive({
  heading: 'Saraban',
  body: 'Open Sans',
});
</script>
