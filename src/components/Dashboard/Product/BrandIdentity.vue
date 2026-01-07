<template>
  <div class="mb-8">
    <!-- Sub-navigation Tabs -->
    <div class="mb-6 flex gap-2 overflow-x-auto pb-2">
      <button
        @click="$emit('update:activeTab', 'product-info')"
        class="flex items-center gap-2 rounded-lg px-4 py-2 whitespace-nowrap transition-colors"
        :class="activeTab === 'product-info' ? 'bg-[#38414A] text-white' : 'text-[#8590A2] hover:text-[#38414A]'"
      >
        <!-- Document Icon -->
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span class="label_1_semibold">Product Info</span>
      </button>

      <button
        @click="$emit('update:activeTab', 'brand-colors')"
        class="flex items-center gap-2 rounded-lg px-4 py-2 whitespace-nowrap transition-colors"
        :class="activeTab === 'brand-colors' ? 'bg-[#38414A] text-white' : 'text-[#8590A2] hover:text-[#38414A]'"
      >
        <!-- Paint Palette Icon -->
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        <span class="label_1_semibold">Brand Colors</span>
      </button>

      <button
        @click="$emit('update:activeTab', 'typography')"
        class="flex items-center gap-2 rounded-lg px-4 py-2 whitespace-nowrap transition-colors"
        :class="activeTab === 'typography' ? 'bg-[#38414A] text-white' : 'text-[#8590A2] hover:text-[#38414A]'"
      >
        <!-- Typography Icon (A) -->
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        <span class="label_1_semibold">Typography</span>
      </button>

      <button
        @click="$emit('update:activeTab', 'tone-style')"
        class="flex items-center gap-2 rounded-lg px-4 py-2 whitespace-nowrap transition-colors"
        :class="activeTab === 'tone-style' ? 'bg-[#38414A] text-white' : 'text-[#8590A2] hover:text-[#38414A]'"
      >
        <!-- Sparkle/Star Icon -->
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <span class="label_1_semibold">Tone & Style</span>
      </button>

      <button
        @click="$emit('update:activeTab', 'website-assets')"
        class="flex items-center gap-2 rounded-lg px-4 py-2 whitespace-nowrap transition-colors"
        :class="activeTab === 'website-assets' ? 'bg-[#38414A] text-white' : 'text-[#8590A2] hover:text-[#38414A]'"
      >
        <!-- Folder Icon -->
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <span class="label_1_semibold">Website & Brand Assets</span>
      </button>
    </div>

    <!-- Tab Content: Product Info -->
    <div v-if="activeTab === 'product-info'" class="space-y-6">
      <!-- Product name field -->
      <div class="flex gap-6">
        <label class="label_2_semibold primary_text_color w-32 flex-shrink-0 pt-3">
          Product name
        </label>
        <div class="flex-1">
          <input
            :model-value="productName"
            @input="$emit('update:productName', $event.target.value)"
            type="text"
            placeholder="Enter product name"
            class="input_box w-full"
          />
        </div>
      </div>

      <!-- Description field -->
      <div class="flex gap-6">
        <label class="label_2_semibold primary_text_color w-32 flex-shrink-0 pt-3">
          Description
        </label>
        <div class="flex-1">
          <textarea
            :model-value="description"
            @input="$emit('update:description', $event.target.value)"
            placeholder="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
            class="input_box w-full min-h-[120px] resize-y"
            rows="4"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Placeholder for other tabs -->
    <div v-else class="text-center py-12">
      <p class="label_1_regular text-[#8590A2]">{{ activeTab }} content coming soon...</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeTab: {
    type: String,
    default: "product-info",
  },
  productName: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});

defineEmits(["update:activeTab", "update:productName", "update:description"]);
</script>

