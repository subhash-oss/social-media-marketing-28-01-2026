<template>
  <div class="flex flex-col h-full bg-gradient-to-br from-[#F6F3FF] to-white">
    <!-- Chat Messages Container -->
    <div class="flex-1 overflow-y-auto px-4 md:px-6 py-6  custom_scrollbar">
      <div class="mx-auto max-w-3xl space-y-6">
        <!-- Message Pair -->
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="space-y-4"
        >
          <!-- User Message Bubble (Right Aligned) - Only show if there's user text -->
          <div v-if="message.text" class="flex flex-row justify-end gap-3 items-center group">
            <!-- Copy and Edit Buttons (Show on Hover, Hide when editing) -->
            <div v-if="editingIndex !== index" class="flex gap-3  opacity-0 group-hover:opacity-100 transition-opacity border_transparent">
              <!-- Copy Button with Tooltip -->
              <div class="relative group/button">
                <button
                  @click="handleCopy(message.text)"
                  class="flex items-center gap-1.5 rounded-lg bg_secondary_color p-2 "
                >
                  <img :src="TextCopyIcon" alt="Copy" />
                </button>
                <!-- Speech Bubble Tooltip -->
                <div class=" absolute bottom-full left-1/2 -translate-x-1/2 mb-2 invisible group-hover/button:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-[1000] ">
                  <div class="relative bg-black-400 text-white label_2_medium rounded-lg px-2 py-2  outline-none ring-0">
                    Copy
                    <!-- Speech Bubble Tail -->
                    <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                      <div class="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-[#38414A]"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Edit Button with Tooltip -->
              <div class="relative group/button">
                <button
                  @click="handleEdit(index)"
                  class="flex items-center gap-1.5 rounded-lg bg_secondary_color p-2 "
                >
                  <img :src="ImageEditIcon" alt="Edit"  />
                </button>
                <!-- Speech Bubble Tooltip -->
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 invisible group-hover/button:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-[1000]">
                  <div class="relative bg-black-400 text-white label_2_medium rounded-lg px-2 py-2 outline-none ring-0">
                    Edit
                    <!-- Speech Bubble Tail -->
                    <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                      <div class="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-[#38414A]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Message Bubble -->
            <div
              class="relative max-w-[80%]  bg_secondary_color p-3.5 rounded-[18px] profile_border"
              :class="editingIndex === index ? 'w-full' : ''"
            >
              <!-- Edit Mode -->
              <div v-if="editingIndex === index" class="flex flex-col gap-2">
                <textarea
                  v-model="editingText"
                  @keydown.enter.exact.prevent="saveEdit(index)"
                  @keydown.escape="cancelEdit"
                  @keydown.enter.shift.exact="editingText += '\n'"
                  class="w-full border-none outline-none Body_2_Medium primary_text_color resize-none"
                  rows="3"
                  :ref="el => { if (el && editingIndex === index) editTextareaRef = el }"
                ></textarea>
                <div class="flex gap-2 justify-end">
                  <button
                    @click="cancelEdit"
                    class="px-3 py-1.5 rounded-md label_2_medium bg_primary_color primary_border"
                  >
                    Cancel
                  </button>
                  <button
                    @click="saveEdit(index)"
                    class="px-3 py-1.5 rounded-md label_2_medium primary_add_button"
                  >
                    Sent
                  </button>
                </div>
              </div>
              <!-- Display Mode -->
              <p v-else class="Body_2_regular primary_text_color">
                {{ message.text }}
              </p>
            </div>
          </div>

          <!-- AI Response (Left Aligned) -->
          <div class="flex items-start gap-3">
            <!-- AI Icon with Gradient -->
            <div
              class="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400"
            ></div>
            
            <!-- AI Message -->
            <div class="flex-1">
              <!-- Loading State with Animated Dots -->
              <div v-if="message.isLoading" class="rounded-2xl lg:px-4 py-1">
               <p class="gradient_text_color body_2_medium"> Got it, give me a moment<span class="loading-dots"></span></p>
              </div>
              <!-- AI Response Content -->
              <div v-else-if="message.aiResponse">
                <div class="Body_2_regular primary_text_color lg:px-4 py-1" v-html="message.aiResponse"></div>
                <!-- Action Icons Row -->
                <div class="flex items-center gap-3 px-4 py-2">
                  <!-- Copy Icon -->
                  <button
                    @click="handleCopyAIResponse(message.aiResponse, index)"
                    class="flex items-center justify-center w-4 h-5  cursor-pointer"
                    title="Copy"
                  >
                    <img :src="TextCopyIcon" alt="Copy" />
                  </button>
                  
                  <!-- Like (Thumbs Up) Icon -->
                  <button
                    @click="handleLike(index)"
                    class="flex items-center justify-center w-5 h-5 cursor-pointer"
                    title="Like"
                  >
                    <svg width="60" height="60" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.25 8.25V14.25C5.25 14.4489 5.17098 14.6397 5.03033 14.7803C4.88968 14.921 4.69891 15 4.5 15H3C2.80109 15 2.61032 14.921 2.46967 14.7803C2.32902 14.6397 2.25 14.4489 2.25 14.25V9C2.25 8.80109 2.32902 8.61032 2.46967 8.46967C2.61032 8.32902 2.80109 8.25 3 8.25H5.25ZM5.25 8.25C6.04565 8.25 6.80871 7.93393 7.37132 7.37132C7.93393 6.80871 8.25 6.04565 8.25 5.25V4.5C8.25 4.10218 8.40804 3.72064 8.68934 3.43934C8.97064 3.15804 9.35218 3 9.75 3C10.1478 3 10.5294 3.15804 10.8107 3.43934C11.092 3.72064 11.25 4.10218 11.25 4.5V8.25H13.5C13.8978 8.25 14.2794 8.40804 14.5607 8.68934C14.842 8.97064 15 9.35218 15 9.75L14.25 13.5C14.1421 13.9601 13.9375 14.3552 13.667 14.6257C13.3964 14.8963 13.0746 15.0276 12.75 15H7.5C6.90326 15 6.33097 14.7629 5.90901 14.341C5.48705 13.919 5.25 13.3467 5.25 12.75" :stroke="message.isLiked ? '#7950F2' : '#596773'" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  
                  <!-- Dislike (Thumbs Down) Icon -->
                  <button
                    @click="handleDislike(index)"
                    class="flex items-center justify-center w-5 h-5 transition-colors cursor-pointer"
                    title="Dislike"
                  >
                    <svg width="60" height="60" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M5.25 9.74971V3.74971C5.25 3.55079 5.17098 3.36003 5.03033 3.21938C4.88968 3.07872 4.69891 2.99971 4.5 2.99971H3C2.80109 2.99971 2.61032 3.07872 2.46967 3.21938C2.32902 3.36003 2.25 3.55079 2.25 3.74971V8.99971C2.25 9.19862 2.32902 9.38938 2.46967 9.53004C2.61032 9.67069 2.80109 9.74971 3 9.74971H5.25ZM5.25 9.74971C6.04565 9.74971 6.80871 10.0658 7.37132 10.6284C7.93393 11.191 8.25 11.9541 8.25 12.7497V13.4997C8.25 13.8975 8.40804 14.2791 8.68934 14.5604C8.97064 14.8417 9.35218 14.9997 9.75 14.9997C10.1478 14.9997 10.5294 14.8417 10.8107 14.5604C11.092 14.2791 11.25 13.8975 11.25 13.4997V9.74971H13.5C13.8978 9.74971 14.2794 9.59167 14.5607 9.31036C14.842 9.02906 15 8.64753 15 8.24971L14.25 4.49971C14.1421 4.0396 13.9375 3.64452 13.667 3.37398C13.3964 3.10344 13.0746 2.97209 12.75 2.99971H7.5C6.90326 2.99971 6.33097 3.23676 5.90901 3.65872C5.48705 4.08067 5.25 4.65297 5.25 5.24971" :stroke="message.isDisliked ? '#DC2626' : '#596773'" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                  </button>
                  
                  <!-- Refresh/Redo Icon -->
                  <button
                    @click="handleRefresh(index)"
                    class="flex items-center justify-center w-4 h-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    title="Refresh"
                  >
                    <img :src="RestartIcon" alt="">
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Bottom Anchor for Auto-Scroll (height matches prompt box to ensure full scroll) -->
        <div ref="scrollAnchor" class="h-60 md:h-56"></div>
      </div>
    </div>

    <!-- Prompt Box at Bottom (Fixed) -->
    <div 
      class="fixed bottom-0 left-0 right-0 transition-all duration-300 ease-in-out bg-gradient-to-r from-[#f9f7ff] to-[#fefdff] px-4 md:px-6"
      :class="isSidebarCollapsed ? 'lg:left-16' : 'lg:left-64'"
    >
      <div class="mx-auto max-w-3xl">
        <PromptBox @send-message="handleNewMessage" />
        
        <!-- Disclaimer -->
        <div class="text-center p-6xl">
          <p class="body_4_regular tertiary_text_color">
            Genius AI can make mistakes. Please check for accuracy.
          </p>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from "vue";
import PromptBox from "../PromptBox.vue";
import ImageEditIcon from "../../../assets/images/ImageEditIcon.svg";
import TextCopyIcon from "../../../assets/images/TextCopyIcon.svg";
import RestartIcon from "../../../assets/images/RestartIcon.svg";

const props = defineProps({
  initialMessages: {
    type: Array,
    default: () => []
  },
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
});


const messages = ref([...props.initialMessages]);
const editingIndex = ref(null);
const editingText = ref("");
let editTextareaRef = null;
const scrollAnchor = ref(null);

// Auto-scroll function to bottom anchor
const scrollToBottom = () => {
  nextTick(() => {
    if (scrollAnchor.value) {
      scrollAnchor.value.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  });
};

const handleCopy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    // You could add a toast notification here
    console.log("Copied to clipboard");
  } catch (err) {
    console.error("Failed to copy text: ", err);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};

// Copy AI response (strip HTML tags)
const handleCopyAIResponse = async (htmlContent, index) => {
  // Create a temporary div to extract text content
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  const textContent = tempDiv.textContent || tempDiv.innerText || "";
  
  try {
    await navigator.clipboard.writeText(textContent);
    console.log("AI response copied to clipboard");
    // You could add a toast notification here
  } catch (err) {
    console.error("Failed to copy AI response: ", err);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};

// Handle like action
const handleLike = (index) => {
  if (messages.value[index]) {
    // Toggle like state
    messages.value[index].isLiked = !messages.value[index].isLiked;
    // If liked, remove dislike
    if (messages.value[index].isLiked) {
      messages.value[index].isDisliked = false;
    }
  }
};

// Handle dislike action
const handleDislike = (index) => {
  if (messages.value[index]) {
    // Toggle dislike state
    messages.value[index].isDisliked = !messages.value[index].isDisliked;
    // If disliked, remove like
    if (messages.value[index].isDisliked) {
      messages.value[index].isLiked = false;
    }
  }
};

// Handle refresh/regenerate response
const handleRefresh = (index) => {
  if (messages.value[index]) {
    // Set loading state
    messages.value[index].isLoading = true;
    messages.value[index].aiResponse = null;
    
    // Scroll to bottom
    scrollToBottom();
    
    // Regenerate response after a delay (simulating API call)
    setTimeout(() => {
      if (messages.value[index]) {
        messages.value[index].isLoading = false;
        // Regenerate with same dummy message for now
        messages.value[index].aiResponse = "Great! ✨ Let's set up your brand. You can share your <strong>website</strong>, upload <strong>brand documents</strong>, or simply describe your <strong>products</strong> and style here in the chat. I'll use this info to understand your brand's tone, personality, and style.";
        
        // Reset like/dislike states
        messages.value[index].isLiked = false;
        messages.value[index].isDisliked = false;
        
        // Scroll when AI response updates
        scrollToBottom();
      }
    }, 1000);
  }
};

const handleEdit = (index) => {
  editingIndex.value = index;
  editingText.value = messages.value[index].text;
  nextTick(() => {
    if (editTextareaRef) {
      editTextareaRef.focus();
      // Move cursor to end
      editTextareaRef.setSelectionRange(
        editTextareaRef.value.length,
        editTextareaRef.value.length
      );
    }
  });
};

const saveEdit = (index) => {
  if (editingText.value.trim()) {
    const editedText = editingText.value.trim();
    
    // Update the message text
    messages.value[index].text = editedText;
    
    // Remove all messages after the edited message (like ChatGPT workflow)
    messages.value = messages.value.slice(0, index + 1);
    
    // Clear AI response and set loading state for the edited message
    messages.value[index].aiResponse = null;
    messages.value[index].isLoading = true;
    messages.value[index].isLiked = false;
    messages.value[index].isDisliked = false;
    
    // Exit edit mode
    editingIndex.value = null;
    editingText.value = "";
    
    // Scroll to bottom after edit
    scrollToBottom();
    
    // Trigger new AI response after a delay (simulating API call)
    setTimeout(() => {
      if (messages.value[index]) {
        messages.value[index].isLoading = false;
        // Show first dummy message
        messages.value[index].aiResponse = "Great! ✨ Let's set up your brand. You can share your <strong>website</strong>, upload <strong>brand documents</strong>, or simply describe your <strong>products</strong> and style here in the chat. I'll use this info to understand your brand's tone, personality, and style.";
        
        // Scroll when AI response updates
        scrollToBottom();
        
        // Add second dummy message after a short delay

      }
    }, 3000);
  }
};

const cancelEdit = () => {
  editingIndex.value = null;
  editingText.value = "";
};

const handleNewMessage = (messageData) => {
  // Add user message
  const newMessage = {
    text: messageData.text,
    product: messageData.product,
    model: messageData.model,
    files: messageData.files,
    isLoading: true,
    aiResponse: null, // Will be updated when AI responds
    isLiked: false,
    isDisliked: false
  };
  
  messages.value.push(newMessage);
  
  // Scroll to bottom when new message is added
  scrollToBottom();
  
  // Show loading for 3 seconds, then show dummy messages
  setTimeout(() => {
    const messageIndex = messages.value.length - 1;
    if (messages.value[messageIndex]) {
      messages.value[messageIndex].isLoading = false;
      // Show first dummy message
      messages.value[messageIndex].aiResponse = "Great! ✨ Let's set up your brand. You can share your <strong>website</strong>, upload <strong>brand documents</strong>, or simply describe your <strong>products</strong> and style here in the chat. I'll use this info to understand your brand's tone, personality, and style.";
      
      // Scroll when AI response updates
      scrollToBottom();
      
      // Add second dummy message after a short delay
    }
  }, 1000);
};

// Watch for changes in messages array to auto-scroll
watch(
  () => messages.value.length,
  () => {
    scrollToBottom();
  }
);

// Watch for changes in AI responses to auto-scroll
watch(
  () => messages.value.map(m => m.aiResponse || m.isLoading),
  () => {
    scrollToBottom();
  },
  { deep: true }
);

// Scroll to bottom on initial mount if there are messages
onMounted(() => {
  if (messages.value.length > 0) {
    scrollToBottom();
  }
});

defineExpose({
  messages
});
</script>

<style scoped>
.loading-dots::after {
  content: '...';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%, 20% {
    content: '.';
  }
  40% {
    content: '..';
  }
  60%, 100% {
    content: '...';
  }
}
</style>
