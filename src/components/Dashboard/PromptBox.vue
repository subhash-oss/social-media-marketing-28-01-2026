<template>

  <div
    class="mx-auto mt-10 max-w-3xl rounded-xl bg-gradient-to-r from-[#CD519D] to-[#7950F2] p-[1px] shadow-lg"
  >

   

    <div class="rounded-xl bg_white p-4">
      <!-- Prompt Input -->
      <input
        v-model="prompt"
        type="text"
        placeholder="What's on your mind?"
        class="w-full border-none outline-none Body_2_Medium"
        :class="prompt ? 'primary_text_color' : ''"
        @keyup.enter="handleSend"
      />

      <!-- Toolbar -->
      <div class="mt-12 flex items-center justify-between">
        <div class="flex gap-2">
          <!-- All Products -->
          <div class="relative" ref="productsDropdownRef">
            <button
              @click="toggleProducts"
              class="flex items-center gap-2 rounded-md border profile_border px-3 py-1 label_2_medium text-[#596773]"
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
                'absolute left-0 z-10 w-40 rounded-md profile_border bg_white shadow max-h-48 overflow-y-auto',
                productsDropdownPosition === 'above' ? 'bottom-full mb-1' : 'top-9'
              ]"
            >
              <div
                v-for="item in products"
                :key="item"
                @click="selectProduct(item)"
                class="cursor-pointer px-3 py-2 label_2_medium text-[#596773] hover:bg-gray-50"
              >
                {{ item }}
              </div>
            </div>
          </div>

          <!-- Add Files -->
          <label
            class="flex cursor-pointer items-center gap-2 rounded-md profile_border px-3 py-1 label_2_medium text-[#596773]"
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
              class="flex items-center gap-2 rounded-md profile_border bg_white px-3 py-1 label_2_medium text-[#596773]"
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
                'absolute left-0 z-10 w-40 rounded-md border profile_border bg_white shadow max-h-48 overflow-y-auto',
                modelsDropdownPosition === 'above' ? 'bottom-full mb-1' : 'top-9'
              ]"
            >
              <div
                v-for="model in models"
                :key="model"
                @click="selectModel(model)"
                class="cursor-pointer px-3 py-2 label_2_medium text-[#596773] hover:bg-gray-50"
              >
                {{ model }}
              </div>
            </div>
          </div>
        </div>

        <!-- Mic / Send -->
        <button class="rounded-full" @click="handleSend">
          <img v-if="!prompt.trim()" :src="MikeIcon" alt="Microphone" />
          <img v-else :src="SendIcon" alt="">
        </button>
      </div>

      <!-- Selected Files Preview -->
      <div v-if="files.length" class="mt-3 flex flex-wrap gap-2">
        <span
          v-for="file in files"
          :key="file.name"
          class="rounded bg-gray-100 px-2 py-1 label_2_medium text-[#596773]"
        >
          {{ file.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";

import ProductIcon from "../../assets/images/ProductIcon.svg";
import AttachmentIcon from "../../assets/images/AttachmentIcon.svg";
import GeminiIcon from "../../assets/images/GeminiIcon.svg";
import DownArrow from "../../assets/images/DownArrow.svg";
import MikeIcon from "../../assets/images/MikeIcon.svg";
import SendIcon from "../../assets/images/SendIcon.svg";

/* Emit */
const emit = defineEmits(['send-message']);

/* Prompt */
const prompt = ref("");

/* Products */
const products = ["All products", "Instagram", "LinkedIn", "Twitter"];
const selectedProduct = ref("All products");
const showProducts = ref(false);
const productsDropdownRef = ref(null);
const productsDropdownMenuRef = ref(null);
const productsDropdownPosition = ref("below");

/* Models */
const models = ["Gemini 2.5 pro", "Gemini 2.0", "GPT-4"];
const selectedModel = ref("Gemini 2.5 pro");
const showModels = ref(false);
const modelsDropdownRef = ref(null);
const modelsDropdownMenuRef = ref(null);
const modelsDropdownPosition = ref("below");

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

const selectModel = (model) => {
  selectedModel.value = model;
  showModels.value = false;
};

const handleFiles = (e) => {
  files.value = Array.from(e.target.files);
};

const handleSend = () => {
  if (prompt.value.trim()) {
    emit('send-message', {
      text: prompt.value.trim(),
      product: selectedProduct.value,
      model: selectedModel.value,
      files: files.value
    });
    prompt.value = "";
    files.value = [];
  }
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
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("scroll", handleResize, true);
});
</script>
