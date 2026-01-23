<template>
  <!-- Initial View (No Messages) -->
  <main
    v-if="!hasMessages"
    class="flex items-center flex-1 bg-gradient-to-br from-[#F6F3FF] to-white px-6 py-10"
  >
    <div class="mx-auto max-w-5xl text-center">
      <div
        class="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400"
      ></div>

      <h1
        class="primary_text_color heading_h3_semibold_mobile md:heading_h3_semibold"
      >
        Good Afternoon, Cliff
      </h1>

      <h2
        class="heading_h3_semibold_mobile md:heading_h3_semibold gradient_text_color"
      >
        How can I help your brand today?
      </h2>
      <div class="block md:hidden">
     <p class="caption_2_medium text-start mt-20">
      Start with the example below
    </p>
   </div>
   <div class="block md:hidden flex text-center justify-center gap-5 mb-[-2.5em] py-3">
    <p class="caption_2_semibold primary_text_color cursor-pointer px-2 py-3 bg_white rounded-lg">Set Up Your Brand</p>
    <p class="caption_2_semibold primary_text_color cursor-pointer px-2 py-3 bg_white rounded-lg">Plan Weekly Posts</p>
    <p class="caption_2_semibold primary_text_color cursor-pointer px-2 py-3 bg_white rounded-lg">Create Social Posts</p>
   </div>
      <PromptBox @send-message="handleFirstMessage" />
      <Cards />
    </div>
  </main>

  <!-- Chat Page (With Messages) -->
  <ChatPage v-else :initial-messages="messages" :isSidebarCollapsed="isSidebarCollapsed" ref="chatPageRef" class="flex-1" />
</template>

<script setup>
import { ref, watch } from "vue";
import PromptBox from "../../components/Dashboard/PromptBox.vue";
import Cards from "../../components/Dashboard/Cards.vue";
import ChatPage from "../../components/Dashboard/Chat/ChatPage.vue";

const props = defineProps({
  resetChat: {
    type: Boolean,
    default: false
  },
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
});

const hasMessages = ref(false);
const messages = ref([]);
const chatPageRef = ref(null);

const emit = defineEmits(['reset-complete']);

// Watch for resetChat prop changes
watch(() => props.resetChat, (newVal) => {
  if (newVal) {
    handleNewChat();
    // Reset the flag after handling
    emit('reset-complete');
  }
});

const handleFirstMessage = (messageData) => {
  // Add the first message
  messages.value = [
    {
      text: messageData.text,
      product: messageData.product,
      model: messageData.model,
      files: messageData.files,
      isLoading: true,
      aiResponse: null
    }
  ];
  
  hasMessages.value = true;
  
  // Show loading for 3 seconds, then show dummy messages
  setTimeout(() => {
    if (messages.value[0]) {
      messages.value[0].isLoading = false;
      messages.value[0].aiResponse = "Great! ✨ Let's set up your brand. You can share your <strong>website</strong>, upload <strong>brand documents</strong>, or simply describe your <strong>products</strong> and style here in the chat. I'll use this info to understand your brand's tone, personality, and style.";
      
      // Add second dummy message after a short delay
      setTimeout(() => {
        messages.value.push({
          text: "",
          isLoading: false,
          aiResponse: "I've created a product using your brand details. You can edit the name, logo, colors, or fonts anytime in the <strong>Products section</strong>.",
          isUser: false,
          product: null,
          model: null,
          files: []
        });
      }, 500);
    }
  }, 3000);
};

const handleNewChat = () => {
  hasMessages.value = false;
  messages.value = [];
};
</script>
