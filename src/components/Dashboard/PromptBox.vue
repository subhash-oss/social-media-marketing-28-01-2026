<template>

  <div
    class="mx-auto mt-10 max-w-3xl block"
    :class="isAiGenerating ? 'prompt-box-animated' : 'button-gradient'"
  >

   

    <div class="rounded-xl bg_secondary_color p-5xl">
      <!-- Prompt Input -->
      <input
        v-model="prompt"
        type="text"
        placeholder="What's on your mind?"
        class="w-full border-none outline-none label_1_regular"
        :class="[
          prompt ? 'primary_text_color' : 'secondary_text_color',
          props.isAiGenerating ? 'opacity-50 cursor-not-allowed' : ''
        ]"
        @keyup.enter="handleSend"
        @focus="isInputFocused = true"
        @blur="isInputFocused = false"
        :disabled="props.isAiGenerating"
      />

      <!-- Toolbar -->
      <div class="mt-12 flex items-center justify-between">
        <div class="flex gap-2">
          <!-- All Products -->
          <div class="relative" ref="productsDropdownRef">
            <button
              @click="toggleProducts"
              class="flex items-center gap-md rounded-lg border primary_border_color px-xl py-xs label_2_medium primary_text_color hover:bg-gray-25"
            >
              <img :src="ProductIcon" alt="" />

              <!-- Desktop text -->
              <span class="hidden md:inline">
                {{ selectedProduct }}
              </span>

              <img :src="DownArrow" alt="" />
            </button>

            <!-- Dropdown -->
            <div
              v-if="showProducts"
              ref="productsDropdownMenuRef"
              :class="[
                'absolute left-0 z-10 w-40 rounded-md border primary_border_color bg_secondary_color max-h-48 overflow-y-auto',
                productsDropdownPosition === 'above' ? 'bottom-full mb-xs' : 'top-9'
              ]"
            >
              <div
                v-for="item in products"
                :key="item"
                @click="selectProduct(item)"
                class="cursor-pointer px-xl py-md label_2_medium secondary_text_color hover:bg-gray-50"
              >
                {{ item }}
              </div>
            </div>
          </div>

          <!-- Add Files -->
          <label
            class="flex cursor-pointer items-center gap-md rounded-md border primary_border_color  px-xl py-xs label_2_medium primary_text_color hover:bg-gray-25"
          >
            <img :src="AttachmentIcon" alt="" />

            <!-- Desktop text -->
            <span class="hidden md:inline">
              Add files
            </span>

            <input
              type="file"
              class="hidden"
              multiple
              @change="handleFiles"
            />
          </label>

          <!-- Gemini Model -->
          <div class="relative" ref="modelsDropdownRef">
            <button
              @click="toggleModels"
              class="flex items-center gap-md rounded-md border primary_border_color bg_secondary_color  px-xl py-xs label_2_medium primary_text_color hover:bg-gray-25"
            >
              <img :src="GeminiIcon" alt="" />

              <!-- Desktop text -->
              <span class="hidden md:inline">
                {{ selectedModel }}
              </span>

              <img :src="DownArrow" alt="" />
            </button>

            <!-- Dropdown -->
            <div
              v-if="showModels"
              ref="modelsDropdownMenuRef"
              :class="[
                'absolute left-0 z-10 w-40 rounded-md  border primary_border_color bg_secondary_color shadow max-h-48 overflow-y-auto',
                modelsDropdownPosition === 'above' ? 'bottom-full mb-xs' : 'top-9'
              ]"
            >
              <div
                v-for="model in models"
                :key="model"
                @click="selectModel(model)"
                class="cursor-pointer  px-xl py-xs label_2_medium secondary_text_color hover:bg-gray-50"
              >
                {{ model }}
              </div>
              <!-- Loading State -->
              <div
                v-if="isLoadingModels"
                class="px-xl py-xs label_2_medium secondary_text_color"
              >
                Loading...
              </div>
            </div>
          </div>
        </div>

        <!-- Mic / Send -->
        <button 
          class="rounded-full" 
          @click="handleSend"
          :disabled="props.isAiGenerating"
          :class="props.isAiGenerating ? 'opacity-50 cursor-not-allowed' : ''"
        >
          <img v-if="!prompt.trim()" :src="MikeIcon" alt="Microphone" />
          <img v-else :src="SendIcon" alt="">
        </button>
      </div>

      <!-- Selected Files Preview -->
      <div v-if="files.length" class="mt-3 flex flex-wrap gap-2">
        <span
          v-for="file in files"
          :key="file.name"
          class="rounded bg_primary_color px-md py-xs label_2_medium secondary_text_color"
        >
          {{ file.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import api from "../../services/api.js";

import ProductIcon from "../../assets/images/ProductIcon.svg";
import AttachmentIcon from "../../assets/images/AttachmentIcon.svg";
import GeminiIcon from "../../assets/images/GeminiIcon.svg";
import DownArrow from "../../assets/images/DownArrow.svg";
import MikeIcon from "../../assets/images/MikeIcon.svg";
import SendIcon from "../../assets/images/SendIcon.svg";

/* Props */
const props = defineProps({
  isAiGenerating: {
    type: Boolean,
    default: false
  }
});

/* Emit */
const emit = defineEmits(['send-message']);

/* Prompt */
const prompt = ref("");
const isInputFocused = ref(false);

/* Products */
const products = ref([]);
const selectedProduct = ref("All products");
const showProducts = ref(false);
const productsDropdownRef = ref(null);
const productsDropdownMenuRef = ref(null);
const productsDropdownPosition = ref("below");
const isLoadingProducts = ref(false);

/* Models */
const models = ref([]);
const selectedModel = ref("");
const showModels = ref(false);
const modelsDropdownRef = ref(null);
const modelsDropdownMenuRef = ref(null);
const modelsDropdownPosition = ref("below");
const isLoadingModels = ref(false);

/* Files */
const files = ref([]);

/* Methods */
const calculateDropdownPosition = (dropdownRef, menuRef, positionRef) => {
  if (!dropdownRef || !menuRef) return;

  nextTick(() => {
    const rect = dropdownRef.getBoundingClientRect();
    const menuRect = menuRef.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Calculate space below and above
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const menuHeight = menuRect.height || 200; // Approximate height if not rendered yet
    
    // If not enough space below but enough space above, position above
    if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
      positionRef.value = "above";
    } else {
      positionRef.value = "below";
    }
  });
};

const toggleProducts = () => {
  showProducts.value = !showProducts.value;
  showModels.value = false;
  
  if (showProducts.value) {
    calculateDropdownPosition(
      productsDropdownRef.value,
      productsDropdownMenuRef.value,
      productsDropdownPosition
    );
  }
};

const toggleModels = () => {
  showModels.value = !showModels.value;
  showProducts.value = false;
  
  if (showModels.value) {
    calculateDropdownPosition(
      modelsDropdownRef.value,
      modelsDropdownMenuRef.value,
      modelsDropdownPosition
    );
  }
};

const selectProduct = (item) => {
  selectedProduct.value = item;
  showProducts.value = false;
};

// Fetch products from API
const fetchProducts = async () => {
  isLoadingProducts.value = true;
  try {
    const response = await api.get('/api/products');
    
    // Extract product names from response
    if (response.data && Array.isArray(response.data)) {
      products.value = response.data.map(product => product.name || product);
    } else if (response.data && response.data.products && Array.isArray(response.data.products)) {
      products.value = response.data.products.map(product => product.name || product);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    products.value = [];
  } finally {
    isLoadingProducts.value = false;
  }
};

const selectModel = (model) => {
  selectedModel.value = model;
  showModels.value = false;
};

// Fetch models from API
const fetchModels = async () => {
  isLoadingModels.value = true;
  try {
    const response = await api.get('/api/ai/models');
    
    // Extract model names from response
    if (response.data && Array.isArray(response.data)) {
      models.value = response.data.map(model => model.name || model);
    } else if (response.data && response.data.models && Array.isArray(response.data.models)) {
      models.value = response.data.models.map(model => model.name || model);
    }
    
    // Set default selected model if available
    if (models.value.length > 0 && !selectedModel.value) {
      selectedModel.value = models.value[0];
    }
  } catch (error) {
    console.error('Error fetching models:', error);
    models.value = [];
  } finally {
    isLoadingModels.value = false;
  }
};

const handleFiles = (e) => {
  files.value = Array.from(e.target.files);
};

const handleSend = () => {
  // Prevent sending if AI is generating or input is empty
  if (props.isAiGenerating || !prompt.value.trim()) {
    return;
  }
  
  emit('send-message', {
    text: prompt.value.trim(),
    product: selectedProduct.value,
    model: selectedModel.value,
    files: files.value
  });
  prompt.value = "";
  files.value = [];
};

/* Click outside handler */
const handleClickOutside = (event) => {
  // Check if click is outside products dropdown
  if (
    showProducts.value &&
    productsDropdownRef.value &&
    !productsDropdownRef.value.contains(event.target)
  ) {
    showProducts.value = false;
  }

  // Check if click is outside models dropdown
  if (
    showModels.value &&
    modelsDropdownRef.value &&
    !modelsDropdownRef.value.contains(event.target)
  ) {
    showModels.value = false;
  }
};

/* Recalculate position on window resize */
const handleResize = () => {
  if (showProducts.value) {
    calculateDropdownPosition(
      productsDropdownRef.value,
      productsDropdownMenuRef.value,
      productsDropdownPosition
    );
  }
  if (showModels.value) {
    calculateDropdownPosition(
      modelsDropdownRef.value,
      modelsDropdownMenuRef.value,
      modelsDropdownPosition
    );
  }
};

/* Watch for dropdown visibility changes to recalculate position */
watch(showProducts, (newVal) => {
  if (newVal) {
    nextTick(() => {
      calculateDropdownPosition(
        productsDropdownRef.value,
        productsDropdownMenuRef.value,
        productsDropdownPosition
      );
    });
  }
});

watch(showModels, (newVal) => {
  if (newVal) {
    nextTick(() => {
      calculateDropdownPosition(
        modelsDropdownRef.value,
        modelsDropdownMenuRef.value,
        modelsDropdownPosition
      );
    });
  }
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  window.addEventListener("resize", handleResize);
  window.addEventListener("scroll", handleResize, true);
  
  // Fetch products and models from API
  fetchProducts();
  fetchModels();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("scroll", handleResize, true);
});
</script>

<style scoped>
</style>
