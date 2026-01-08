<template>
  <div class="mb-8">
    <!-- Sub-navigation Tabs -->
    <div class="mb-6 flex gap-2 overflow-x-auto bg_white rounded-2xl p-4">
      <button
        @click="$emit('update:activeTab', 'product-info')"
        class="flex items-center gap-2 rounded-lg px-4 py-2 flex-shrink-0"
        :class="activeTab === 'product-info' ? 'bg_primary_color label_1_semibold' : 'label_2_semibold'"
      >
        <!-- Document Icon -->
        <img :src="ProductInfoIcon" alt="">
        <span>Product Info</span>
      </button>

      <button
        @click="$emit('update:activeTab', 'brand-colors')"
        class="flex items-center gap-2 rounded-lg px-4 py-2 flex-shrink-0"
        :class="activeTab === 'brand-colors' ? 'bg_primary_color label_1_semibold' : 'label_2_semibold'"
      >
        <!-- Paint Palette Icon -->
        <img :src="BrandColorIcon" alt="">
        <span>Brand Colors</span>
      </button>

      <button
        @click="$emit('update:activeTab', 'typography')"
        class="flex items-center gap-2 rounded-lg px-4 py-2 flex-shrink-0"
        :class="activeTab === 'typography' ? 'bg_primary_color label_1_semibold' : 'label_2_semibold'"
      >
        <!-- Typography Icon (A) -->
        <img :src="TypographyIcon" alt="">
        <span>Typography</span>
      </button>

      <button
        @click="$emit('update:activeTab', 'tone-style')"
        class="flex items-center gap-2 rounded-lg px-4 py-2 flex-shrink-0"
        :class="activeTab === 'tone-style' ? 'bg_primary_color label_1_semibold' : 'label_2_semibold'"
      >
        <!-- Sparkle/Star Icon -->
        <img :src="StyleIcon" alt="">
        <span>Tone & Style</span>
      </button>

      <button
        @click="$emit('update:activeTab', 'website-assets')"
        class="flex items-center gap-2 rounded-lg px-4 py-2 whitespace-nowrap transition-colors"
        :class="activeTab === 'website-assets' ? 'bg_primary_color label_1_semibold' : 'label_2_semibold'"
      >
        <!-- Folder Icon -->
        <img :src="FolderIcon" alt="">
        <span>Website & Brand Assets</span>
      </button>
    </div>

    <!-- Tab Content: Product Info -->
    <div v-if="activeTab === 'product-info'">
      <BrandInfoFields
        :product-name="productName"
        :description="description"
        @update:product-name="$emit('update:productName', $event)"
        @update:description="$emit('update:description', $event)"
      />
    </div>

    <!-- Placeholder for other tabs -->
     <div v-else-if="activeTab === 'brand-colors'" >
      <BrandColor/>
    </div>
   <!-- tab for typography -->
    <div v-else-if="activeTab === 'typography'">
      <BrandTypography/>
    </div>
    <!-- tab for typography -->
    <div v-else-if="activeTab === 'tone-style'">
      <BrandStyle/>
    </div>

    <div v-else>
      <p class="label_1_regular text-[#8590A2]">{{ activeTab }} content coming soon...</p>
    </div>

  </div>
</template>

<script setup>
import BrandInfoFields from "../product/BrandInfo/BrandInfoFields.vue";
import BrandColor from "../product/BrandInfo/BrandColor.vue";
import BrandTypography from "../product/BrandInfo/BrandTypography.vue"
import BrandStyle from "../product/BrandInfo/BrandStyle.vue"
import ProductInfoIcon from "../../../assets/images/ProductInfoIcon.svg" 
import BrandColorIcon from "../../../assets/images/BrandColorIcon.svg" 
import TypographyIcon from "../../../assets/images/TypographyIcon.svg" 
import StyleIcon from "../../../assets/images/StyleIcon.svg" 
import FolderIcon from "../../../assets/images/FolderIcon.svg" 

defineProps({
  activeTab: {
    type: String,
    default: "product-info",
  },
  productName: {
    type: String,
    default: "cvcbcvnb",
  },
  description: {
    type: String,
    default: "",
  },
});

defineEmits(["update:activeTab", "update:productName", "update:description"]);
</script>

