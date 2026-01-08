<template>
  <div class="bg_white rounded-2xl py-7 px-4 brand_section_height">
    <ul class="space-y-6">
      <!-- Primary -->
      <div class="gap-3 flex flex-col items-start justify-between lg:flex-row">
        <span class="label_2_medium primary_text_color">
          Primary
        </span>

        <div
          class="relative flex items-center rounded-xl px-4 py-4 w-[100%] lg:w-[70%]"
          :style="{ backgroundColor: colors.primary }"
        >
          <input
            type="color"
            v-model="colors.primary"
            class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <span class="label_2_medium text-white">
            {{ colors.primary.toUpperCase() }}
          </span>
        </div>
    </div>

      <!-- Secondary -->
      <div class="gap-3 flex flex-col items-start justify-between lg:flex-row">
        <span class="label_2_medium primary_text_color">
          Secondary
        </span>

        <div
          class="relative flex items-center rounded-xl px-4 py-4 w-[100%] lg:w-[70%]"
          :style="{ backgroundColor: colors.secondary }"
        >
          <input
            type="color"
            v-model="colors.secondary"
            class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <span class="label_2_medium text-white">
            {{ colors.secondary.toUpperCase() }}
          </span>
        </div>
    </div>

      <!-- Font -->
      <li class="gap-3 flex flex-col items-start justify-between lg:flex-row">
        <span class="label_2_medium primary_text_color">
          Font
        </span>

        <div
          class="relative flex items-center rounded-xl px-4 py-4 w-[100%] lg:w-[70%]"
          :style="{ backgroundColor: colors.font }"
        >
          <input
            type="color"
            v-model="colors.font"
            class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <span class="label_2_medium text-white">
            {{ colors.font.toUpperCase() }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const colors = reactive({
  primary: '#2684FF',
  secondary: '#8CB9FF',
  font: '#5A6772',
});
</script>
