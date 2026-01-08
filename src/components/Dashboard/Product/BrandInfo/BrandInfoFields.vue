<template>
  <div class="space-y-6 bg_white rounded-2xl py-7 px-4">
    <!-- Product name field -->
    <div class="flex gap-5 flex-col lg:gap-48 lg:flex-row">
      <label class="label_2_medium primary_text_color w-32 flex-shrink-0 ">
        Product name
      </label>
      <div class="flex-1 ">
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
    <div class="flex gap-5 flex-col lg:gap-48 lg:flex-row">
      <label class="label_2_medium primary_text_color w-32 flex-shrink-0">
        Description
      </label>
      <div class="flex-1">
        <textarea
          :model-value="description"
          @input="$emit('update:description', $event.target.value)"
          placeholder="description...."
          class="input_box w-full min-h-[120px] resize-y"
          rows="4"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  productName: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});

defineEmits(["update:productName", "update:description"]);
</script>

