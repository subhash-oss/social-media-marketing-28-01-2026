<template>
  <section class="pt-2">
    <!-- Header -->
    <div class="bg_white py-4 px-4 rounded-2xl primary_border_color">
      <h2 class="heading_h6_bold">Analytics</h2>
      <p class="label_1_regular">
        Track engagement, reach, and performance across all your connected platforms.
      </p>
    </div>

    <!-- Tabs and Dropdowns -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg_white py-4 px-4 rounded-2xl primary_border_color common_gap">
      
      <!-- Tabs -->
      <div class="flex gap-2 ">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="emit('update:activeTab', tab)"
          :class="props.activeTab === tab ? 'bg_white' : 'bg_primary_color'"
          class="px-4 py-1 rounded-full primary_border_color label_2_semibold"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Dropdowns -->
      <div class="flex gap-2 justify-center">
        <select
          v-model="selectedProduct"
          class="px-4 py-2 label_2_medium primary_border_color rounded-1xl"
        >
          <option value="">All products</option>
          <option v-for="product in products" :key="product" :value="product">{{ product }}</option>
        </select>

        <select
          v-model="selectedPlatform"
          class="px-4 py-2 label_2_medium primary_border_color rounded-1xl"
        >
          <option value="">All platforms</option>
          <option v-for="platform in platforms" :key="platform" :value="platform">{{ platform }}</option>
        </select>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  activeTab: {
    type: String,
    default: 'Month'
  }
});

const emit = defineEmits(['update:activeTab']);

const tabs = ['Day', 'Week', 'Month', 'Custom'];

const products = ['Product One', 'Product Two', 'Product Three', 'Product four'];
const selectedProduct = ref('');

const platforms = ['Instagram', 'Facebook', 'Twitter'];
const selectedPlatform = ref('');
</script>
