<template>
  <main class="flex items-center flex-1 bg-gradient-to-br from-[#F6F3FF] to-white px-6 py-10">
  <div class="mx-auto max-w-5xl text-center">
    <div class="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400"></div>

    <h1 class="primary_text_color heading_h3_semibold_mobile md:heading_h3_semibold">Good Afternoon, Cliff</h1>

    <h2 class="heading_h3_semibold_mobile md:heading_h3_semibold gradient_text_color">
      How can I help your brand today?
    </h2>

    <PromptBox />
    <Cards />
  </div>
  </main>
</template>

<script setup>
import PromptBox from "../../components/Dashboard/PromptBox.vue";
import Cards from "../../components/Dashboard/Cards.vue";
</script>
