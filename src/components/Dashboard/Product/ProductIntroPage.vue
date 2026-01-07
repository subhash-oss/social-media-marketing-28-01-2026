<template>
    <div class="flex min-h-screen items-center justify-center bg_primary_color px-4">
    <!-- Card -->
    <div
      class="w-full  rounded-2xl bg_white px-6 h-[90%] shadow-sm flex items-center justify-center"
    >
      <div class="flex flex-col items-center text-center">
        <!-- Illustration -->
        <img
          :src="ProductIntroImage"
          alt="Empty State"
          class="mb-6 h-44 w-auto"
        />

        <!-- Title -->
        <h2 class="heading_h6_bold primary_text_color">
          Add Your First Product
        </h2>

        <!-- Description -->
        <p class="mt-2 label_1_regular">
          Manage your brands, connect their channels, and keep assets in one place.
        </p>

        <!-- Button -->
        <button
          @click="$emit('add-product')"
          class="common_gap flex items-center gap-2 rounded-lg primary_button px-5 py-1"
        >
          <img :src="PlusIconWhite" alt="">
          Add Product
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
    import ProductIntroImage from "../../../assets/images/ProductIntroImage.png"
    import PlusIconWhite from "../../../assets/images/PlusIconWhite.svg"
    
    defineEmits(["add-product"]);
</script>
