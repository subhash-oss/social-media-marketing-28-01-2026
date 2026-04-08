<template>
  <div class="flex h-full min-h-0 w-full flex-col bg_primary_color">
    <!-- Reserve right space on lg+ when post panel is open so chat does not sit under the fixed sheet -->
    <div
      class="flex min-h-0 min-w-0 flex-1 flex-col transition-[padding] duration-300 ease-in-out"
      :class="
        showPostShareModal && isLgUp ? 'lg:pr-[30vw]' : ''
      "
    >
    <!-- Chat Messages Container -->
    <div class="flex-1 overflow-y-auto px-3xl md:px-6xl pt-12xl pb-6xl  custom_scrollbar">
      <div class="mx-auto max-w-3xl space-y-7">
        <!-- Message Pair -->
        <div
          v-for="(message, index) in messages"
          :key="index"
        >
          <!-- User Message Bubble (Right Aligned) - Only show if there's user text -->
          <div v-if="message.text" class="flex flex-row justify-end gap-xl items-center group">
            <!-- Copy and Edit Buttons (Show on Hover, Hide when editing) -->
            <div v-if="editingIndex !== index" class="flex gap-xl  opacity-0 group-hover:opacity-100 transition-opacity border_transparent">
              <!-- Copy Button with Tooltip -->
              <div class="relative group/button">
                <button
                  @click="handleCopy(message.text)"
                  class="flex items-center gap-sm rounded-lg bg_secondary_color p-md "
                >
                  <img :src="TextCopyIcon" alt="Copy" />
                </button>
                <!-- Speech Bubble Tooltip -->
                <div class=" absolute bottom-full left-1/2 -translate-x-1/2 mb-md invisible group-hover/button:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-[1000] ">
                  <div class="relative bg-black-400 primary_2_text_color label_3_semibold rounded-lg px-md py-xl  outline-none ring-0">
                    Copy
                    <!-- Speech Bubble Tail -->
                    <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                      <div class="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-black-400"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Edit Button with Tooltip -->
              <!-- <div class="relative group/button">
                <button
                  @click="handleEdit(index)"
                  class="flex items-center gap-sm rounded-lg bg_secondary_color p-md "
                >
                  <img :src="ImageEditIcon" alt="Edit"  />
                </button> -->
                <!-- Speech Bubble Tooltip -->
                <!-- <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-md invisible group-hover/button:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-[1000]">
                  <div class="relative bg-black-400 primary_2_text_color label_3_semibold rounded-lg px-md py-xl outline-none ring-0">
                    Edit -->
                    <!-- Speech Bubble Tail -->
                    <!-- <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                      <div class="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-black-400"></div>
                    </div>
                  </div>
                </div>
              </div> -->
            </div>
            
            <!-- Message Bubble -->
            <div
              class="relative max-w-[80%]  bg_secondary_color p-3xl rounded-2xl border primary_border_color"
              :class="editingIndex === index ? 'w-full' : ''"
            >
              <!-- Edit Mode -->
              <!-- <div v-if="editingIndex === index" class="flex flex-col gap-md">
                <textarea
                  v-model="editingText"
                  @keydown.enter.exact.prevent="saveEdit(index)"
                  @keydown.escape="cancelEdit"
                  @keydown.enter.shift.exact="editingText += '\n'"
                  class="w-full border-none outline-none Body_2_regular primary_text_color resize-none"
                  rows="3"
                  :ref="el => { if (el && editingIndex === index) editTextareaRef = el }"
                ></textarea>
                <div class="flex gap-md justify-end">
                  <button
                    @click="cancelEdit"
                    class="px-md py-sm rounded-md label_2_medium bg_primary_color"
                  >
                    Cancel
                  </button>
                  <button
                    @click="saveEdit(index)"
                    class="px-md py-sm rounded-md label_2_medium primary_add_button"
                  >
                    Sent
                  </button>
                </div>
              </div> -->
              <!-- Display Mode -->
              <p class="Body_2_regular primary_text_color">
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
              <div v-if="message.isLoading" class="rounded-2xl lg:px-3xl py-xs">
               <p class="primary_text_color body_3_regular"> Got it, give me a moment<span class="loading-dots"></span></p>
              </div>
              <!-- AI Response: post generated (image + caption + pills) -->
              <div v-else-if="message.aiResponse && message.responseType === 'post_generated'" class="lg:px-3xl pt-3xl pb-md">
                <p class="Body_2_regular primary_text_color pb-4">
                  {{ message.aiResponse }}
                </p>

                <!-- Generated image gallery -->
                <div
                  v-if="postGeneratedImageUrls(message).length > 0"
                  class="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 custom_scrollbar"
                >
                  <img
                    v-for="(imgUrl, imgIdx) in postGeneratedImageUrls(message)"
                    :key="imgIdx"
                    :src="imgUrl"
                    alt="Generated post"
                    :data-post-id="postIdFromAiResponse(message)"
                    :class="[
                      'h-52 w-52 shrink-0 rounded-2xl object-cover border primary_border_color bg_secondary_color',
                      postIdFromAiResponse(message) ? 'cursor-pointer' : ''
                    ]"
                    @click="onPostGeneratedImageClick(message)"
                  />
                </div>

                <!-- Post body: `content` from AI typeData (shown under image) -->
                <p
                  v-if="postGeneratedTypeContent(message)"
                  class="Body_2_regular primary_text_color pb-4 whitespace-pre-wrap"
                >
                  {{ postGeneratedTypeContent(message) }}
                </p>

                <!-- Post caption: when API sends marketing copy distinct from the intro message -->
                <p
                  v-if="showPostMarketingCaption(message)"
                  class="Body_2_regular primary_text_color pb-4 whitespace-pre-wrap"
                >
                  {{ message.typeData.marketingCopy }}
                </p>

                <!-- Suggested responses: light blue pills -->
                <div
                  v-if="message.suggestedResponses && message.suggestedResponses.length > 0"
                  class="flex flex-wrap gap-2"
                >
                  <template
                    v-for="(suggestion, sIndex) in message.suggestedResponses"
                    :key="sIndex"
                  >
                    <router-link
                      v-if="suggestion.url && isInternalPath(suggestion.url)"
                      :to="suggestion.url"
                      class="inline-flex items-center px-4 py-2 rounded-full bg-[#EFF6FF] text-[#2563EB] label_2_medium hover:bg-[#DBEAFE] transition-colors no-underline"
                    >
                      {{ suggestion.text || suggestion }}
                    </router-link>
                    <a
                      v-else-if="suggestion.url"
                      :href="suggestion.url"
                      class="inline-flex items-center px-4 py-2 rounded-full bg-[#EFF6FF] text-[#2563EB] label_2_medium hover:bg-[#DBEAFE] transition-colors no-underline"
                    >
                      {{ suggestion.text || suggestion }}
                    </a>
                    <button
                      v-else
                      type="button"
                      @click="handleSuggestedResponse(suggestion, index)"
                      class="inline-flex items-center px-4 py-2 rounded-full bg-[#EFF6FF] text-[#2563EB] label_2_medium hover:bg-[#DBEAFE] transition-colors"
                      :disabled="isAiGenerating"
                    >
                      {{ suggestion.text || suggestion }}
                    </button>
                  </template>
                </div>

                <!-- Action icons -->
                <div class="flex items-center gap-sm mt-4xl">
                  <button
                    type="button"
                    @click="handleCopyPostGenerated(message)"
                    class="flex items-center justify-center w-4xl h-4xl cursor-pointer"
                    title="Copy"
                  >
                    <img :src="TextCopyIcon" alt="Copy" />
                  </button>
                  <button
                    type="button"
                    @click="handleLike(index)"
                    class="flex items-center justify-center w-4xl h-4xl cursor-pointer"
                    title="Like"
                  >
                    <svg class="w-4xl h-4xl" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.25 8.25V14.25C5.25 14.4489 5.17098 14.6397 5.03033 14.7803C4.88968 14.921 4.69891 15 4.5 15H3C2.80109 15 2.61032 14.921 2.46967 14.7803C2.32902 14.6397 2.25 14.4489 2.25 14.25V9C2.25 8.80109 2.32902 8.61032 2.46967 8.46967C2.61032 8.32902 2.80109 8.25 3 8.25H5.25ZM5.25 8.25C6.04565 8.25 6.80871 7.93393 7.37132 7.37132C7.93393 6.80871 8.25 6.04565 8.25 5.25V4.5C8.25 4.10218 8.40804 3.72064 8.68934 3.43934C8.97064 3.15804 9.35218 3 9.75 3C10.1478 3 10.5294 3.15804 10.8107 3.43934C11.092 3.72064 11.25 4.10218 11.25 4.5V8.25H13.5C13.8978 8.25 14.2794 8.40804 14.5607 8.68934C14.842 8.97064 15 9.35218 15 9.75L14.25 13.5C14.1421 13.9601 13.9375 14.3552 13.667 14.6257C13.3964 14.8963 13.0746 15.0276 12.75 15H7.5C6.90326 15 6.33097 14.7629 5.90901 14.341C5.48705 13.919 5.25 13.3467 5.25 12.75" :stroke="message.isLiked ? '#7950F2' : '#596773'" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="handleDislike(index)"
                    class="flex items-center justify-center w-4xl h-4xl cursor-pointer"
                    title="Dislike"
                  >
                    <svg class="w-4xl h-4xl" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.25 9.74971V3.74971C5.25 3.55079 5.17098 3.36003 5.03033 3.21938C4.88968 3.07872 4.69891 2.99971 4.5 2.99971H3C2.80109 2.99971 2.61032 3.07872 2.46967 3.21938C2.32902 3.36003 2.25 3.55079 2.25 3.74971V8.99971C2.25 9.19862 2.32902 9.38938 2.46967 9.53004C2.61032 9.67069 2.80109 9.74971 3 9.74971H5.25ZM5.25 9.74971C6.04565 9.74971 6.80871 10.0658 7.37132 10.6284C7.93393 11.191 8.25 11.9541 8.25 12.7497V13.4997C8.25 13.8975 8.40804 14.2791 8.68934 14.5604C8.97064 14.8417 9.35218 14.9997 9.75 14.9997C10.1478 14.9997 10.5294 14.8417 10.8107 14.5604C11.092 14.2791 11.25 13.8975 11.25 13.4997V9.74971H13.5C13.8978 9.74971 14.2794 9.59167 14.5607 9.31036C14.842 9.02906 15 8.64753 15 8.24971L14.25 4.49971C14.1421 4.0396 13.9375 3.64452 13.667 3.37398C13.3964 3.10344 13.0746 2.97209 12.75 2.99971H7.5C6.90326 2.99971 6.33097 3.23676 5.90901 3.65872C5.48705 4.08067 5.25 4.65297 5.25 5.24971" :stroke="message.isDisliked ? '#DC2626' : '#596773'" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="flex items-center justify-center w-4xl h-4xl cursor-pointer opacity-70 hover:opacity-100"
                    title="Regenerate"
                  >
                    <img :src="RestartIcon" alt="" class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- AI Response: connect social platforms (grid + suggested pills + actions) -->
              <div
                v-else-if="message.aiResponse && message.responseType === 'social_platforms'"
                class="lg:px-3xl pt-3xl pb-md"
              >
                <p
                  class="Body_2_regular primary_text_color pb-4 [&_strong]:font-semibold"
                  v-html="message.aiResponse"
                />

                <div
                  v-if="message.typeData?.platforms?.length"
                  class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 pb-4"
                >
                  <button
                    v-for="(platform, pIdx) in message.typeData.platforms"
                    :key="platform.name || pIdx"
                    type="button"
                    class="flex w-full min-w-0 items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors"
                    :class="
                      platform.connected
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer hover:bg-[#F9FAFB]'
                    "
                    :disabled="Boolean(platform.connected)"
                    :aria-label="
                      platform.connected
                        ? `${platform.label} — connected`
                        : `Connect ${platform.label}`
                    "
                    @click="goToSocialPlatformAuth(platform.authUrl, platform.name)"
                  >
                    <img
                      :src="platform.icon"
                      :alt="platform.label || platform.name || 'Platform'"
                      class="h-8 w-8 shrink-0 object-contain"
                    />
                    <span class="min-w-0 flex-1 truncate label_2_medium primary_text_color">
                      {{ platform.label }}
                    </span>
                    <span
                      v-if="!platform.connected"
                      class="flex h-8 w-8 shrink-0 items-center justify-center text-[#596773]"
                      aria-hidden="true"
                    >
                      <svg
                        class="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          stroke-width="1.5"
                          stroke-linecap="round"
                        />
                      </svg>
                    </span>
                    <span
                      v-else
                      class="flex h-8 w-8 shrink-0 items-center justify-center text-emerald-600"
                      aria-hidden="true"
                    >
                      <svg
                        class="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </div>

                <div
                  v-if="message.suggestedResponses && message.suggestedResponses.length > 0"
                  class="flex flex-wrap gap-2"
                >
                  <template
                    v-for="(suggestion, sIndex) in message.suggestedResponses"
                    :key="sIndex"
                  >
                    <router-link
                      v-if="suggestion.url && isInternalPath(suggestion.url)"
                      :to="suggestion.url"
                      class="inline-flex items-center px-4 py-2 rounded-full bg-[#EFF6FF] text-[#2563EB] label_2_medium hover:bg-[#DBEAFE] transition-colors no-underline"
                    >
                      {{ suggestion.text || suggestion }}
                    </router-link>
                    <a
                      v-else-if="suggestion.url"
                      :href="suggestion.url"
                      class="inline-flex items-center px-4 py-2 rounded-full bg-[#EFF6FF] text-[#2563EB] label_2_medium hover:bg-[#DBEAFE] transition-colors no-underline"
                    >
                      {{ suggestion.text || suggestion }}
                    </a>
                    <button
                      v-else
                      type="button"
                      @click="handleSuggestedResponse(suggestion, index)"
                      class="inline-flex items-center px-4 py-2 rounded-full bg-[#EFF6FF] text-[#2563EB] label_2_medium hover:bg-[#DBEAFE] transition-colors"
                      :disabled="isAiGenerating"
                    >
                      {{ suggestion.text || suggestion }}
                    </button>
                  </template>
                </div>

                <div class="flex items-center gap-sm mt-4xl">
                  <button
                    type="button"
                    @click="handleCopyAIResponse(message.aiResponse, index)"
                    class="flex items-center justify-center w-4xl h-4xl cursor-pointer"
                    title="Copy"
                  >
                    <img :src="TextCopyIcon" alt="Copy" />
                  </button>
                  <button
                    type="button"
                    @click="handleLike(index)"
                    class="flex items-center justify-center w-4xl h-4xl cursor-pointer"
                    title="Like"
                  >
                    <svg class="w-4xl h-4xl" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.25 8.25V14.25C5.25 14.4489 5.17098 14.6397 5.03033 14.7803C4.88968 14.921 4.69891 15 4.5 15H3C2.80109 15 2.61032 14.921 2.46967 14.7803C2.32902 14.6397 2.25 14.4489 2.25 14.25V9C2.25 8.80109 2.32902 8.61032 2.46967 8.46967C2.61032 8.32902 2.80109 8.25 3 8.25H5.25ZM5.25 8.25C6.04565 8.25 6.80871 7.93393 7.37132 7.37132C7.93393 6.80871 8.25 6.04565 8.25 5.25V4.5C8.25 4.10218 8.40804 3.72064 8.68934 3.43934C8.97064 3.15804 9.35218 3 9.75 3C10.1478 3 10.5294 3.15804 10.8107 3.43934C11.092 3.72064 11.25 4.10218 11.25 4.5V8.25H13.5C13.8978 8.25 14.2794 8.40804 14.5607 8.68934C14.842 8.97064 15 9.35218 15 9.75L14.25 13.5C14.1421 13.9601 13.9375 14.3552 13.667 14.6257C13.3964 14.8963 13.0746 15.0276 12.75 15H7.5C6.90326 15 6.33097 14.7629 5.90901 14.341C5.48705 13.919 5.25 13.3467 5.25 12.75" :stroke="message.isLiked ? '#7950F2' : '#596773'" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    @click="handleDislike(index)"
                    class="flex items-center justify-center w-4xl h-4xl cursor-pointer"
                    title="Dislike"
                  >
                    <svg class="w-4xl h-4xl" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.25 9.74971V3.74971C5.25 3.55079 5.17098 3.36003 5.03033 3.21938C4.88968 3.07872 4.69891 2.99971 4.5 2.99971H3C2.80109 2.99971 2.61032 3.07872 2.46967 3.21938C2.32902 3.36003 2.25 3.55079 2.25 3.74971V8.99971C2.25 9.19862 2.32902 9.38938 2.46967 9.53004C2.61032 9.67069 2.80109 9.74971 3 9.74971H5.25ZM5.25 9.74971C6.04565 9.74971 6.80871 10.0658 7.37132 10.6284C7.93393 11.191 8.25 11.9541 8.25 12.7497V13.4997C8.25 13.8975 8.40804 14.2791 8.68934 14.5604C8.97064 14.8417 9.35218 14.9997 9.75 14.9997C10.1478 14.9997 10.5294 14.8417 10.8107 14.5604C11.092 14.2791 11.25 13.8975 11.25 13.4997V9.74971H13.5C13.8978 9.74971 14.2794 9.59167 14.5607 9.31036C14.842 9.02906 15 8.64753 15 8.24971L14.25 4.49971C14.1421 4.0396 13.9375 3.64452 13.667 3.37398C13.3964 3.10344 13.0746 2.97209 12.75 2.99971H7.5C6.90326 2.99971 6.33097 3.23676 5.90901 3.65872C5.48705 4.08067 5.25 4.65297 5.25 5.24971" :stroke="message.isDisliked ? '#DC2626' : '#596773'" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- AI Response: product created (card + CTAs from GET /api/products/:id) -->
              <div
                v-else-if="message.aiResponse && message.responseType === 'product_created'"
                class="lg:px-3xl pt-3xl pb-md"
              >
                <div
                  class="Body_2_regular primary_text_color pb-4 [&_a]:text-[#2563EB] [&_a]:underline"
                  v-html="message.aiResponse"
                />

                <div
                  class="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)] md:p-5 w-[52%]"
                >
                  <!-- Loading -->
                  <div
                    v-if="message.typeData?.productId && productCreatedLoading[message.typeData.productId]"
                    class="body_3_regular tertiary_text_color py-6 text-center"
                  >
                    Loading product…
                  </div>

                  <!-- Deleted or no longer on server (GET 404 / after DELETE) -->
                  <div
                    v-else-if="message.typeData?.productId && productCreatedGone[message.typeData.productId]"
                    class="body_3_regular tertiary_text_color py-6 text-center"
                  >
                    Product deleted
                  </div>

                  <!-- Error -->
                  <div
                    v-else-if="message.typeData?.productId && productCreatedError[message.typeData.productId]"
                    class="body_3_regular text-red-600 py-4"
                  >
                    {{ productCreatedError[message.typeData.productId] }}
                  </div>

                  <!-- Card body -->
                  <template
                    v-else-if="message.typeData?.productId && productCreatedCache[message.typeData.productId]"
                  >
                    <div class="flex items-start justify-between gap-3 border-b border-[#E5E7EB] pb-4">
                      <div class="flex min-w-0 flex-1 items-center gap-3">
                        <img
                          v-if="productCreatedCache[message.typeData.productId].brandLogoUrl"
                          :src="productCreatedCache[message.typeData.productId].brandLogoUrl"
                          :alt="productCreatedCache[message.typeData.productId].name || 'Brand'"
                          class="h-10 w-10 shrink-0 rounded-lg object-contain bg-[#F9FAFB]"
                        />
                        <span class="truncate label_1_semibold primary_text_color">
                          {{ productCreatedCache[message.typeData.productId].name }}
                        </span>
                      </div>
                      <div class="relative shrink-0" data-chat-product-card-menu>
                        <button
                          type="button"
                          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#596773] transition-colors hover:bg-[#F9FAFB]"
                          :aria-expanded="productCreatedOpenMenuId === message.typeData.productId"
                          aria-label="Product options"
                          @click.stop="toggleProductCreatedCardMenu(message.typeData.productId)"
                        >
                          <img :src="DotsIcon" alt="" class="h-4 w-4 opacity-80" />
                        </button>
                        <div
                          v-if="productCreatedOpenMenuId === message.typeData.productId"
                          class="absolute right-0 z-[20] mt-2 w-[min(calc(100vw-2rem),260px)] min-w-[220px] overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-lg"
                          @click.stop
                        >
                          <div class="flex items-center justify-between gap-3 px-4 py-3.5">
                            <span class="label_2_medium primary_text_color">Active / Inactive</span>
                            <button
                              type="button"
                              role="switch"
                              :aria-checked="
                                isChatProductCardActive(
                                  productCreatedCache[message.typeData.productId]
                                )
                              "
                              class="inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full px-[3px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                              :class="
                                isChatProductCardActive(
                                  productCreatedCache[message.typeData.productId]
                                )
                                  ? 'justify-end bg-emerald-500'
                                  : 'justify-start bg-gray-200'
                              "
                              @click.stop="
                                toggleChatProductCardActive(
                                  productCreatedCache[message.typeData.productId]
                                )
                              "
                            >
                              <span
                                class="pointer-events-none h-5 w-5 rounded-full bg-white shadow-sm ring-1 ring-black/5"
                              />
                            </button>
                          </div>
                          <div class="h-px w-full bg-[#E5E7EB]" aria-hidden="true" />
                          <button
                            type="button"
                            class="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left label_2_medium primary_text_color transition-colors hover:bg-[#F9FAFB]"
                            @click="handleProductCreatedEdit"
                          >
                            <span>Edit</span>
                            <img :src="ImageEditIcon" alt="" class="h-4 w-4 shrink-0 opacity-80" />
                          </button>
                          <div class="h-px w-full bg-[#E5E7EB]" aria-hidden="true" />
                          <button
                            type="button"
                            class="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left label_2_medium primary_text_color transition-colors hover:bg-[#F9FAFB]"
                            @click.stop="handleProductCreatedDelete(message.typeData.productId)"
                          >
                            <span>Delete</span>
                            <img :src="TrashIcon" alt="" class="h-4 w-4 shrink-0 opacity-80" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="flex gap-0 pt-4">
                      <div class="min-w-0 flex-1 pr-3 md:pr-4">
                        <p class="body_4_regular tertiary_text_color mb-2">Brand colors</p>
                        <div class="flex flex-wrap gap-2">
                          <span
                            v-for="(hex, cIdx) in productCreatedCache[message.typeData.productId].brandColors || []"
                            :key="cIdx"
                            class="inline-block h-7 w-7 shrink-0 rounded-md border border-[#E5E7EB] shadow-sm"
                            :style="{ backgroundColor: hex }"
                            :title="hex"
                          />
                        </div>
                      </div>
                      <div class="w-px shrink-0 self-stretch bg-[#E5E7EB]" aria-hidden="true" />
                      <div class="min-w-0 flex-1 pl-3 md:pl-4">
                        <p class="body_4_regular tertiary_text_color mb-2">Typography</p>
                        <p
                          class="label_1_semibold primary_text_color break-words"
                          :style="{
                            fontFamily: formatProductTypographyCss(
                              productCreatedCache[message.typeData.productId].typography
                            ),
                          }"
                        >
                          {{ formatProductTypographyLabel(productCreatedCache[message.typeData.productId].typography) }}
                        </p>
                      </div>
                    </div>
                  </template>

                  <div v-else class="body_3_regular tertiary_text_color py-4">
                    No product details available.
                  </div>
                </div>

                <!-- Suggested CTAs from AI `suggestedResponses` -->
                <div
                  v-if="message.suggestedResponses && message.suggestedResponses.length > 0"
                  class="mt-4 flex flex-wrap gap-2"
                >
                  <template
                    v-for="(suggestion, sIndex) in message.suggestedResponses"
                    :key="sIndex"
                  >
                    <router-link
                      v-if="suggestion.url && isInternalPath(suggestion.url)"
                      :to="suggestion.url"
                      class="inline-flex items-center rounded-full bg-[#EFF6FF] px-4 py-2 text-[#2563EB] label_2_medium transition-colors no-underline hover:bg-[#DBEAFE]"
                    >
                      {{ suggestion.text || suggestion }}
                    </router-link>
                    <a
                      v-else-if="suggestion.url"
                      :href="suggestion.url"
                      class="inline-flex items-center rounded-full bg-[#EFF6FF] px-4 py-2 text-[#2563EB] label_2_medium transition-colors no-underline hover:bg-[#DBEAFE]"
                    >
                      {{ suggestion.text || suggestion }}
                    </a>
                    <button
                      v-else
                      type="button"
                      class="inline-flex items-center rounded-full bg-[#EFF6FF] px-4 py-2 text-[#2563EB] label_2_medium transition-colors hover:bg-[#DBEAFE]"
                      :disabled="isAiGenerating"
                      @click="handleSuggestedResponse(suggestion, index)"
                    >
                      {{ suggestion.text || suggestion }}
                    </button>
                  </template>
                </div>
              </div>

              <!-- AI Response: analytics report (narrative + HTML table from typeData.analyticsHtml) -->
              <div
                v-else-if="message.aiResponse && message.responseType === 'analytics_report'"
                class="lg:px-3xl pt-3xl pb-md"
              >
                <div
                  class="Body_2_regular primary_text_color pb-4 [&_a]:text-[#2563EB] [&_a]:underline [&_strong]:font-semibold"
                  v-html="formatAnalyticsReportNarrative(message.aiResponse)"
                />
                <div
                  v-if="message.typeData?.analyticsHtml"
                  class="analytics-report-panel mb-4 max-w-full overflow-x-auto rounded-xl border border-slate-700/40 bg-[#0f172a] p-3 shadow-inner"
                >
                  <div
                    class="analytics-report-html text-left [&_table]:max-w-none"
                    v-html="message.typeData.analyticsHtml"
                  />
                </div>

                <div
                  v-if="message.suggestedResponses && message.suggestedResponses.length > 0"
                  class="mt-1 flex flex-wrap gap-2"
                >
                  <template
                    v-for="(suggestion, sIndex) in message.suggestedResponses"
                    :key="sIndex"
                  >
                    <a
                      v-if="suggestion.url"
                      :href="suggestion.url"
                      class="rounded-full border border-[#3B82F6] px-4 py-2 text-[#3B82F6] label_2_medium transition-colors no-underline hover:bg-blue-50"
                    >
                      {{ suggestion.text || suggestion }}
                    </a>
                    <button
                      v-else
                      type="button"
                      class="rounded-full border border-[#3B82F6] px-4 py-2 text-[#3B82F6] label_2_medium transition-colors hover:bg-blue-50"
                      :disabled="isAiGenerating"
                      @click="handleSuggestedResponse(suggestion, index)"
                    >
                      {{ suggestion.text || suggestion }}
                    </button>
                  </template>
                </div>

                <div class="mt-4xl flex items-center gap-sm">
                  <button
                    type="button"
                    class="flex h-4xl w-4xl cursor-pointer items-center justify-center"
                    title="Copy"
                    @click="handleCopyAIResponse(message.aiResponse, index)"
                  >
                    <img :src="TextCopyIcon" alt="Copy" />
                  </button>
                  <button
                    type="button"
                    class="flex h-4xl w-4xl cursor-pointer items-center justify-center"
                    title="Like"
                    @click="handleLike(index)"
                  >
                    <svg width="60" height="60" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.25 8.25V14.25C5.25 14.4489 5.17098 14.6397 5.03033 14.7803C4.88968 14.921 4.69891 15 4.5 15H3C2.80109 15 2.61032 14.921 2.46967 14.7803C2.32902 14.6397 2.25 14.4489 2.25 14.25V9C2.25 8.80109 2.32902 8.61032 2.46967 8.46967C2.61032 8.32902 2.80109 8.25 3 8.25H5.25ZM5.25 8.25C6.04565 8.25 6.80871 7.93393 7.37132 7.37132C7.93393 6.80871 8.25 6.04565 8.25 5.25V4.5C8.25 4.10218 8.40804 3.72064 8.68934 3.43934C8.97064 3.15804 9.35218 3 9.75 3C10.1478 3 10.5294 3.15804 10.8107 3.43934C11.092 3.72064 11.25 4.10218 11.25 4.5V8.25H13.5C13.8978 8.25 14.2794 8.40804 14.5607 8.68934C14.842 8.97064 15 9.35218 15 9.75L14.25 13.5C14.1421 13.9601 13.9375 14.3552 13.667 14.6257C13.3964 14.8963 13.0746 15.0276 12.75 15H7.5C6.90326 15 6.33097 14.7629 5.90901 14.341C5.48705 13.919 5.25 13.3467 5.25 12.75" :stroke="message.isLiked ? '#7950F2' : '#596773'" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="flex h-4xl w-4xl cursor-pointer items-center justify-center transition-colors"
                    title="Dislike"
                    @click="handleDislike(index)"
                  >
                    <svg width="60" height="60" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.25 9.74971V3.74971C5.25 3.55079 5.17098 3.36003 5.03033 3.21938C4.88968 3.07872 4.69891 2.99971 4.5 2.99971H3C2.80109 2.99971 2.61032 3.07872 2.46967 3.21938C2.32902 3.36003 2.25 3.55079 2.25 3.74971V8.99971C2.25 9.19862 2.32902 9.38938 2.46967 9.53004C2.61032 9.67069 2.80109 9.74971 3 9.74971H5.25ZM5.25 9.74971C6.04565 9.74971 6.80871 10.0658 7.37132 10.6284C7.93393 11.191 8.25 11.9541 8.25 12.7497V13.4997C8.25 13.8975 8.40804 14.2791 8.68934 14.5604C8.97064 14.8417 9.35218 14.9997 9.75 14.9997C10.1478 14.9997 10.5294 14.8417 10.8107 14.5604C11.092 14.2791 11.25 13.8975 11.25 13.4997V9.74971H13.5C13.8978 9.74971 14.2794 9.59167 14.5607 9.31036C14.842 9.02906 15 8.64753 15 8.24971L14.25 4.49971C14.1421 4.0396 13.9375 3.64452 13.667 3.37398C13.3964 3.10344 13.0746 2.97209 12.75 2.99971H7.5C6.90326 2.99971 6.33097 3.23676 5.90901 3.65872C5.48705 4.08067 5.25 4.65297 5.25 5.24971" :stroke="message.isDisliked ? '#DC2626' : '#596773'" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- AI Response Content (default / conversation) -->
              <div v-else-if="message.aiResponse">
                <div class="Body_2_regular primary_text_color lg:px-3xl pb-md pt-3xl" v-html="message.aiResponse"></div>
                
                <!-- Suggested Responses (for conversation type) -->
                <div 
                  v-if="message.responseType === 'conversation' && message.suggestedResponses && message.suggestedResponses.length > 0"
                  class="flex flex-wrap gap-2 px-3xl mt-3"
                >
                  <template
                    v-for="(suggestion, sIndex) in message.suggestedResponses"
                    :key="sIndex"
                  >
                    <!-- Render as link if URL exists -->
                    <a
                      v-if="suggestion.url"
                      :href="suggestion.url"
                      class="px-4 py-2 rounded-full border border-[#3B82F6] text-[#3B82F6] label_2_medium hover:bg-blue-50 transition-colors no-underline"
                    >
                      {{ suggestion.text || suggestion }}
                    </a>
                    <!-- Render as button otherwise -->
                    <button
                      v-else
                      @click="handleSuggestedResponse(suggestion, index)"
                      class="px-4 py-2 rounded-full border border-[#3B82F6] text-[#3B82F6] label_2_medium hover:bg-blue-50 transition-colors"
                      :disabled="isAiGenerating"
                    >
                      {{ suggestion.text || suggestion }}
                    </button>
                  </template>
                </div>
                
                <!-- Action Icons Row -->
                <div class="flex items-center gap-sm px-3xl mt-4xl">
                  <!-- Copy Icon -->
                  <button
                    @click="handleCopyAIResponse(message.aiResponse, index)"
                    class="flex items-center justify-center w-4xl h-4xl  cursor-pointer"
                    title="Copy"
                  >
                    <img :src="TextCopyIcon" alt="Copy" />
                  </button>
                  
                  <!-- Like (Thumbs Up) Icon -->
                  <button
                    @click="handleLike(index)"
                    class="flex items-center justify-center w-4xl h-4xl  cursor-pointer"
                    title="Like"
                  >
                    <svg width="60" height="60" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.25 8.25V14.25C5.25 14.4489 5.17098 14.6397 5.03033 14.7803C4.88968 14.921 4.69891 15 4.5 15H3C2.80109 15 2.61032 14.921 2.46967 14.7803C2.32902 14.6397 2.25 14.4489 2.25 14.25V9C2.25 8.80109 2.32902 8.61032 2.46967 8.46967C2.61032 8.32902 2.80109 8.25 3 8.25H5.25ZM5.25 8.25C6.04565 8.25 6.80871 7.93393 7.37132 7.37132C7.93393 6.80871 8.25 6.04565 8.25 5.25V4.5C8.25 4.10218 8.40804 3.72064 8.68934 3.43934C8.97064 3.15804 9.35218 3 9.75 3C10.1478 3 10.5294 3.15804 10.8107 3.43934C11.092 3.72064 11.25 4.10218 11.25 4.5V8.25H13.5C13.8978 8.25 14.2794 8.40804 14.5607 8.68934C14.842 8.97064 15 9.35218 15 9.75L14.25 13.5C14.1421 13.9601 13.9375 14.3552 13.667 14.6257C13.3964 14.8963 13.0746 15.0276 12.75 15H7.5C6.90326 15 6.33097 14.7629 5.90901 14.341C5.48705 13.919 5.25 13.3467 5.25 12.75" :stroke="message.isLiked ? '#7950F2' : '#596773'" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  
                  <!-- Dislike (Thumbs Down) Icon -->
                  <button
                    @click="handleDislike(index)"
                    class="flex items-center justify-center w-4xl h-4xl  transition-colors cursor-pointer"
                    title="Dislike"
                  >
                    <svg width="60" height="60" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M5.25 9.74971V3.74971C5.25 3.55079 5.17098 3.36003 5.03033 3.21938C4.88968 3.07872 4.69891 2.99971 4.5 2.99971H3C2.80109 2.99971 2.61032 3.07872 2.46967 3.21938C2.32902 3.36003 2.25 3.55079 2.25 3.74971V8.99971C2.25 9.19862 2.32902 9.38938 2.46967 9.53004C2.61032 9.67069 2.80109 9.74971 3 9.74971H5.25ZM5.25 9.74971C6.04565 9.74971 6.80871 10.0658 7.37132 10.6284C7.93393 11.191 8.25 11.9541 8.25 12.7497V13.4997C8.25 13.8975 8.40804 14.2791 8.68934 14.5604C8.97064 14.8417 9.35218 14.9997 9.75 14.9997C10.1478 14.9997 10.5294 14.8417 10.8107 14.5604C11.092 14.2791 11.25 13.8975 11.25 13.4997V9.74971H13.5C13.8978 9.74971 14.2794 9.59167 14.5607 9.31036C14.842 9.02906 15 8.64753 15 8.24971L14.25 4.49971C14.1421 4.0396 13.9375 3.64452 13.667 3.37398C13.3964 3.10344 13.0746 2.97209 12.75 2.99971H7.5C6.90326 2.99971 6.33097 3.23676 5.90901 3.65872C5.48705 4.08067 5.25 4.65297 5.25 5.24971" :stroke="message.isDisliked ? '#DC2626' : '#596773'" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                  </button>
                  
                  <!-- Refresh/Redo Icon -->
                  <!-- <button
                    @click="handleRefresh(index)"
                    class="flex items-center justify-center w-4xl h-4xl  text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    title="Refresh"
                  >
                    <img :src="RestartIcon" alt="">
                  </button> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Bottom Anchor for Auto-Scroll (height matches prompt box to ensure full scroll) -->
        <div ref="scrollAnchor" class="h-64 md:h-56"></div>
      </div>
    </div>

    <!-- Prompt Box at Bottom (Fixed; narrows on desktop when post panel is open) -->
    <div 
      class="fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out bg_primary_color z-[9] px-4 md:px-6"
      :class="[
        isSidebarCollapsed ? 'lg:left-16' : 'lg:left-64',
        showPostShareModal ? 'lg:right-[30%]' : '',
      ]"
    >
      <div class="mx-auto max-w-3xl">
        <PromptBox @send-message="handleNewMessage" :is-ai-generating="isAiGenerating" />
        
        <!-- Disclaimer -->
        <div class="text-center p-xl">
          <p class="body_4_regular tertiary_text_color">
            Genius AI can make mistakes. Please check for accuracy.
          </p>
        </div>
      </div>
    </div>
    </div>

    <!-- Post panel: always fixed; teleported to body (desktop = right sheet, mobile = overlay + sheet) -->
    <Teleport to="body">
      <aside
        v-if="showPostShareModal"
        class="flex flex-col overflow-hidden primary_border_color bg_secondary_color"
        :class="
          isLgUp
            ? 'fixed inset-y-0 right-0 z-50 h-full min-h-0 w-[30%] flex-shrink-0 rounded-xl border px-xxl py-6xl shadow-lg'
            : 'fixed inset-0 z-50 flex w-full justify-end border-0'
        "
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-post-modal-title"
      >
        <div
          v-if="!isLgUp"
          class="absolute inset-0 bg_overlay lg:hidden"
          aria-hidden="true"
          @click="closePostShareModal"
        />
        <div
          class="relative flex min-h-0 flex-1 flex-col overflow-hidden border-l primary_border_color bg_secondary_color max-lg:ml-auto max-lg:h-full max-lg:max-h-[min(100dvh,100%)] max-lg:w-full max-lg:max-w-md max-lg:shadow-[-8px_0_32px_rgba(15,23,42,0.12)]"
          :class="isLgUp ? 'h-full w-full rounded-xl border-0 shadow-none' : ''"
          @click.stop
        >
          <div
            class="flex shrink-0 items-center justify-between gap-md border-b primary_border_color px-5xl py-xl"
          >
            <div class="min-w-0 flex-1 pr-md">
              <h2 id="chat-post-modal-title" class="sr-only">Post details</h2>
              <div v-if="selectedPostForModal" class="relative">
                <img :src="PostFilter" class="absolute left-2 top-[10px]" alt="" />
                <select
                  v-model="selectedPostForModal.postType"
                  class="w-full appearance-none rounded-lg bg_secondary_color p-md pl-9xl label_2_medium primary_text_color regular_border_color"
                >
                  <option value="Instagram post (4:5)">Instagram post (4:5)</option>
                  <option value="Instagram post (1:1)">Instagram post (1:1)</option>
                  <option value="Instagram post (9:16)">Instagram post (9:16)</option>
                  <option value="Facebook post (4:5)">Facebook post (4:5)</option>
                  <option value="LinkedIn post (4:5)">LinkedIn post (4:5)</option>
                  <option value="Twitter post (16:9)">Twitter post (16:9)</option>
                </select>
                <img
                  :src="DownArrow"
                  alt=""
                  class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                />
              </div>
              <div
                v-else-if="postModalLoading"
                class="h-10 w-full animate-pulse rounded-lg bg-gray-25"
                aria-hidden="true"
              />
              <p v-else class="label_1_semibold primary_text_color">Post details</p>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-lg border primary_border_color p-xs transition-colors hover:bg-black-25"
              aria-label="Close"
              @click="closePostShareModal"
            >
              <img :src="closeIcon" alt="" class="h-4 w-4" />
            </button>
          </div>

          <div class="custom-scrollbar-calendar min-h-0 flex-1 overflow-y-auto p-5xl">
            <div v-if="postModalLoading" class="py-10xl text-center label_1_regular secondary_text_color">
              Loading post…
            </div>
            <div v-else-if="postModalError" class="py-10xl text-center label_1_regular text-red-600">
              {{ postModalError }}
            </div>
            <template v-else-if="selectedPostForModal">
              <div
                :class="[
                  'inline-flex w-full items-center gap-md rounded-md p-xl label_1_semibold',
                  selectedPostForModal.status === 'approved'
                    ? 'bg-success-50 text-success-800'
                    : 'pending_text_style'
                ]"
              >
                <img
                  v-if="selectedPostForModal.status === 'approved'"
                  :src="ApproveIcon"
                  alt=""
                  class="h-4 w-4"
                />
                <img v-else :src="PendingIcon" alt="" class="h-4 w-4" />
                <span>{{ selectedPostForModal.status }}</span>
              </div>

              <div
                class="mt-xl flex h-72 items-center justify-center overflow-hidden rounded-lg bg_primary_color"
              >
                <img
                  :src="selectedPostForModal.postImage"
                  :alt="selectedPostForModal.title"
                  class="max-h-full w-full max-w-md object-contain"
                />
              </div>

              <p class="label_2_medium primary_text_color mt-6xl">Caption</p>
              <div class="relative mt-md">
                <textarea
                  v-model="selectedPostForModal.caption"
                  class="min-h-[140px] w-full resize-none rounded-lg bg_secondary_color p-xl label_1_regular primary_text_color primary_border_color"
                  placeholder="Write your caption here..."
                />
                <button type="button" class="absolute bottom-3 right-3 p-md" aria-label="AI assist">
                  <img :src="AiIcon" alt="" />
                </button>
              </div>

              <p class="label_2_medium primary_text_color mt-6xl">Platforms</p>
              <div class="mt-md flex items-center gap-xl overflow-auto hide-scrollbar">
                <img
                  v-for="platform in selectedPostForModal.platforms"
                  :key="platform"
                  :src="getPlatformIcon(platform)"
                  :alt="platform"
                  class="h-10 w-10"
                />
                <img
                  :src="ImageEditIcon"
                  alt="Edit platforms"
                  class="w-10 cursor-pointer rounded-lg p-md primary_border_color"
                  @click="openPlatformModalChat"
                />
              </div>

              <div class="mt-6xl rounded-lg p-3xl primary_border_color">
                <p
                  class="flex justify-between"
                  v-html="formatScheduledTimeForModal(selectedPostForModal, true)"
                  @click="handlePostModalTimeClick"
                />
              </div>

              <div class="relative mt-6xl flex items-center gap-6xl">
                <div
                  class="relative rounded-lg bg-gray-25 px-4xl py-md hover:bg-black-25"
                  data-chat-dots-menu
                >
                  <button
                    ref="dotsButtonRefChat"
                    type="button"
                    aria-label="More actions"
                    @click.stop="togglePostMenuChat"
                  >
                    <img :src="DotsIcon" alt="" class="mb-xs" />
                  </button>
                  <TogglePostModal
                    ref="togglePostModalRefChat"
                    :open="showPostMenuChat"
                    @close="showPostMenuChat = false"
                    @share="handlePostModalShare"
                    @regenerate="handlePostModalRegenerate"
                    @delete="handlePostModalDelete"
                  />
                </div>
                <button
                  type="button"
                  class="primary_add_button label_1_semibold flex flex-1 items-center justify-center gap-md rounded-lg p-md primary_2_text_color transition-opacity"
                  @click="openSchedulerFromPostModal"
                >
                  <img :src="CalendarIcon" alt="" class="h-4 w-4" />
                  Schedule post
                </button>
              </div>
            </template>
          </div>
        </div>
      </aside>
    </Teleport>

    <SocialMediaModal
      :open="showPlatformModalChat"
      :selected-platforms="selectedPostForModal ? selectedPostForModal.platforms : []"
      @close="closePlatformModalChat"
      @update:selected-platforms="updatePlatformsChat"
    />
    <SchedulerCalendarModal
      :open="showSchedulerModalChat"
      :initial-date="schedulerInitialDateChat"
      :initial-time="schedulerInitialTimeChat"
      @close="closeSchedulerModalChat"
      @schedule="handleScheduleChat"
    />
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, watch, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import PromptBox from "../PromptBox.vue";
import ImageEditIcon from "../../../assets/images/ImageEditIcon.svg";
import TrashIcon from "../../../assets/images/TrashIcon.svg";
import TextCopyIcon from "../../../assets/images/TextCopyIcon.svg";
import RestartIcon from "../../../assets/images/RestartIcon.svg";
import closeIcon from "../../../assets/images/closeIcon.svg";
import PostFilter from "../../../assets/images/PostFilter.svg";
import DownArrow from "../../../assets/images/DownArrow.svg";
import AiIcon from "../../../assets/images/AiIcon.svg";
import ApproveIcon from "../../../assets/images/ApproveIcon.svg";
import PendingIcon from "../../../assets/images/PendingIcon.svg";
import DotsIcon from "../../../assets/images/DotsIcon.svg";
import CalendarIcon from "../../../assets/images/CalendarIcon.svg";
import InstagramIcon from "../../../assets/images/InstagramIcon.svg";
import FacebookIcon from "../../../assets/images/FacebookIcon.svg";
import LinkedInIcon from "../../../assets/images/LinkedInIcon.svg";
import TwitterIcon from "../../../assets/images/TwitterIcon.svg";
import TikTokIcon from "../../../assets/images/TikTokIcon.svg";
import YoutubeIcon from "../../../assets/images/YoutubeIcon.svg";
import SocialMediaModal from "../../Calendar/SocialMediaModal.vue";
import SchedulerCalendarModal from "../../Calendar/SchedulerCalendarModal.vue";
import TogglePostModal from "../../Calendar/TogglePostModal.vue";
import api, { TOKEN_KEY } from "../../../services/api.js";

const props = defineProps({
  initialMessages: {
    type: Array,
    default: () => []
  },
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  },
  sessionId: {
    type: String,
    default: null
  },
  externalSessionId: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['update:sessionId', 'sessionLoaded', 'socialAuthLinked']);

const router = useRouter();

const messages = ref([...props.initialMessages]);
const editingIndex = ref(null);
const editingText = ref("");
let editTextareaRef = null;
const scrollAnchor = ref(null);

/** lg+ = post panel is in-flow (Teleport disabled); mobile = teleported with backdrop */
const isLgUp = ref(
  typeof window !== "undefined" ? window.matchMedia("(min-width: 1024px)").matches : false
);
const updateIsLgUp = () => {
  if (typeof window === "undefined") return;
  isLgUp.value = window.matchMedia("(min-width: 1024px)").matches;
};

/* —— Post share modal (GET /post/:id) —— */
const showPostShareModal = ref(false);
const postModalLoading = ref(false);
const postModalError = ref(null);
const selectedPostForModal = ref(null);
const showPlatformModalChat = ref(false);
const showSchedulerModalChat = ref(false);
const schedulerInitialDateChat = ref(null);
const schedulerInitialTimeChat = ref(null);
const showPostMenuChat = ref(false);
const dotsButtonRefChat = ref(null);
const togglePostModalRefChat = ref(null);
let removePostMenuDocClick = null;
let removeProductCreatedMenuDocClick = null;
let mediaQueryLg;
/** Interval for OAuth popup completion polling */
let socialAuthPollIntervalId = null;

const formatDateToString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const mapApiPostToSelectedPost = (apiPost) => {
  const scheduledAt = apiPost.scheduledAt ? new Date(apiPost.scheduledAt) : null;
  const fallbackSource = apiPost.updatedAt || apiPost.createdAt;
  const fallback = fallbackSource ? new Date(fallbackSource) : new Date();
  const when =
    scheduledAt && !Number.isNaN(scheduledAt.getTime()) ? scheduledAt : fallback;

  const hours = when.getHours();
  const minutes = when.getMinutes();
  const postTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  const postDate = formatDateToString(when);

  let platforms = [];
  if (Array.isArray(apiPost.platforms)) {
    platforms = apiPost.platforms.map((p) =>
      typeof p === "string" ? p.toLowerCase() : String(p).toLowerCase()
    );
  }

  return {
    id: apiPost.id,
    caption: apiPost.content ?? "",
    postImage: apiPost.imageUrl ?? "",
    platforms,
    postDate,
    postTime,
    status: apiPost.status ?? "draft",
    postType: "Instagram post (4:5)",
    title: "Post",
  };
};

const getPlatformIcon = (platform) => {
  const platformMap = {
    instagram: InstagramIcon,
    facebook: FacebookIcon,
    linkedin: LinkedInIcon,
    twitter: TwitterIcon,
    tiktok: TikTokIcon,
    youtube: YoutubeIcon,
  };
  return platformMap[String(platform).toLowerCase()] || InstagramIcon;
};

const formatTimeForModal = (timeString) => {
  if (!timeString || typeof timeString !== "string") return "";
  const [hours, minutes] = timeString.split(":").map(Number);
  const h = hours % 12 || 12;
  const ampm = hours < 12 ? "AM" : "PM";
  const m = minutes > 0 ? `:${String(minutes).padStart(2, "0")}` : "";
  return `${h}${m} ${ampm}`;
};

const formatScheduledTimeForModal = (post, clickable = false) => {
  if (!post?.postDate) return "";
  const date = new Date(post.postDate);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  let dateLabel = "";
  if (isToday) {
    dateLabel = "Today";
  } else if (isTomorrow) {
    dateLabel = "Tomorrow";
  } else {
    dateLabel = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const timeDisplay = formatTimeForModal(post.postTime);
  const cursor = clickable ? "cursor-pointer" : "";
  return `<span class="label_2_medium secondary_text_color">Scheduled for </span><span class="body_3_medium primary_text_color ${cursor}" data-time-clickable="true"> ${dateLabel} <span class="mx-1 inline-block h-4 w-[1px] bg-gray-400 align-middle xl:mx-2"></span>${timeDisplay}</span>`;
};

const onPostGeneratedImageClick = (message) => {
  const id = postIdFromAiResponse(message);
  if (!id) return;
  openPostShareModal(id);
};

const openPostShareModal = async (postId) => {
  showPostShareModal.value = true;
  postModalLoading.value = true;
  postModalError.value = null;
  selectedPostForModal.value = null;
  showPostMenuChat.value = false;
  try {
    const { data } = await api.get(`/post/${postId}`);
    const raw = data?.post ?? data;
    if (!raw || typeof raw !== "object") {
      throw new Error("Invalid post response");
    }
    selectedPostForModal.value = mapApiPostToSelectedPost(raw);
  } catch (e) {
    console.error("Failed to load post:", e);
    postModalError.value =
      e?.response?.data?.message || e?.message || "Failed to load post";
  } finally {
    postModalLoading.value = false;
  }
};

const closePostShareModal = () => {
  showPostShareModal.value = false;
  postModalError.value = null;
  selectedPostForModal.value = null;
  showPostMenuChat.value = false;
};

const openPlatformModalChat = () => {
  if (selectedPostForModal.value) {
    showPlatformModalChat.value = true;
  }
};

const closePlatformModalChat = () => {
  showPlatformModalChat.value = false;
};

const updatePlatformsChat = (platforms) => {
  if (selectedPostForModal.value) {
    selectedPostForModal.value.platforms = platforms;
  }
};

const openSchedulerFromPostModal = () => {
  if (!selectedPostForModal.value) return;
  const d = new Date(selectedPostForModal.value.postDate);
  schedulerInitialDateChat.value = d;
  schedulerInitialTimeChat.value = selectedPostForModal.value.postTime;
  showSchedulerModalChat.value = true;
};

const closeSchedulerModalChat = () => {
  showSchedulerModalChat.value = false;
};

const handleScheduleChat = (scheduleData) => {
  if (!selectedPostForModal.value) return;
  const newDate = scheduleData.date;
  const newTime = scheduleData.time;
  selectedPostForModal.value.postDate = formatDateToString(newDate);
  selectedPostForModal.value.postTime = newTime;
};

const handlePostModalTimeClick = (event) => {
  const el = event.target?.closest?.("[data-time-clickable='true']");
  if (el && selectedPostForModal.value) {
    openSchedulerFromPostModal();
  }
};

const togglePostMenuChat = () => {
  showPostMenuChat.value = !showPostMenuChat.value;
};

const handlePostModalShare = () => {
  console.log("Share now", selectedPostForModal.value);
};

const handlePostModalRegenerate = () => {
  console.log("Regenerate post", selectedPostForModal.value);
};

const handlePostModalDelete = () => {
  console.log("Delete post", selectedPostForModal.value);
};

watch(showPostMenuChat, (open) => {
  if (removePostMenuDocClick) {
    document.removeEventListener("click", removePostMenuDocClick, true);
    removePostMenuDocClick = null;
  }
  if (!open) return;
  nextTick(() => {
    removePostMenuDocClick = (e) => {
      if (dotsButtonRefChat.value?.contains(e.target)) return;
      if (togglePostModalRefChat.value?.dropdownRef?.contains(e.target)) return;
      showPostMenuChat.value = false;
    };
    document.addEventListener("click", removePostMenuDocClick, true);
  });
});

// Computed property to check if AI is generating
const isAiGenerating = computed(() => {
  return messages.value.some(message => message.isLoading === true);
});

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

const plainTextFromAi = (value) => {
  if (!value) return "";
  const temp = document.createElement("div");
  temp.innerHTML = String(value);
  return (temp.textContent || temp.innerText || "").trim();
};

const escapeHtmlForNarrative = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Analytics report API `message` text: **bold**, `* ` bullets, paragraphs — safe HTML for v-html. */
const formatAnalyticsReportNarrative = (raw) => {
  if (raw == null || raw === "") return "";
  let text = escapeHtmlForNarrative(String(raw));
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  const blocks = text.split(/\n\n+/);
  return blocks
    .map((block) => {
      const lines = block.split(/\n/);
      const trimmed = lines.map((l) => l.trim());
      const nonEmpty = trimmed.filter((l) => l.length > 0);
      if (nonEmpty.length > 0 && nonEmpty.every((l) => l.startsWith("* "))) {
        const items = nonEmpty.map((l) => `<li>${l.slice(2)}</li>`).join("");
        return `<ul class="list-disc pl-5 my-2 space-y-1">${items}</ul>`;
      }
      const inner = lines.map((l) => (l.trim() === "" ? "<br />" : l)).join("<br />");
      return `<p class="my-2">${inner}</p>`;
    })
    .join("");
};

const postGeneratedImageUrls = (message) => {
  const raw = message?.typeData?.generatedImage;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  return [raw];
};

/** `postId` from the AI post_generated payload (`typeData` mirrors API `typeData`). */
const postIdFromAiResponse = (message) => message?.typeData?.postId ?? undefined;

/** Non-empty `typeData.content` for post_generated (caption/body under the image). */
const postGeneratedTypeContent = (message) => {
  const raw = message?.typeData?.content;
  if (raw == null) return "";
  const s = String(raw).trim();
  return s;
};

/** True when there is a separate post caption (not the same string as the main assistant message). */
const showPostMarketingCaption = (message) => {
  const cap = message?.typeData?.marketingCopy?.trim();
  if (!cap) return false;
  return cap !== plainTextFromAi(message?.aiResponse);
};

const isInternalPath = (url) => typeof url === "string" && url.startsWith("/") && !url.startsWith("//");

/**
 * Opens OAuth in a popup; appends `token` from localStorage (TOKEN_KEY).
 * Relative `authUrl` is resolved with axios `baseURL` from `src/services/api.js`.
 * Polls until the popup closes or the callback URL indicates success (e.g. `linked=` in query).
 */
const goToSocialPlatformAuth = (authUrl, platformName = "") => {
  if (!authUrl || typeof authUrl !== "string") return;

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    console.warn("Social connect: no access token; sign in required.");
    return;
  }

  const apiBase = api.defaults.baseURL;
  if (!apiBase || typeof apiBase !== "string") {
    console.error("Social connect: backend base URL is not set in api.js.");
    return;
  }

  let fullUrl;
  try {
    if (/^https?:\/\//i.test(authUrl)) {
      fullUrl = new URL(authUrl);
    } else {
      const path = authUrl.startsWith("/") ? authUrl : `/${authUrl}`;
      fullUrl = new URL(path, apiBase);
    }
    fullUrl.searchParams.set("token", token);
  } catch (e) {
    console.error("Social connect: invalid auth URL", e);
    return;
  }

  const slug = String(platformName || "oauth").replace(/\W+/g, "_");
  const windowName = `SocialAuth_${slug}`;
  const popup = window.open(
    fullUrl.toString(),
    windowName,
    "width=600,height=700,scrollbars=yes,resizable=yes"
  );

  if (!popup) {
    console.warn("Social connect: popup was blocked.");
    return;
  }

  if (socialAuthPollIntervalId) {
    clearInterval(socialAuthPollIntervalId);
    socialAuthPollIntervalId = null;
  }

  socialAuthPollIntervalId = setInterval(() => {
    try {
      if (popup.closed) {
        if (socialAuthPollIntervalId) {
          clearInterval(socialAuthPollIntervalId);
          socialAuthPollIntervalId = null;
        }
        return;
      }
      const href = popup.location.href;
      const done =
        href.includes("linked=") ||
        /[?&]linked(?:&|$)/.test(href) ||
        href.includes("auth/success");
      if (done) {
        if (socialAuthPollIntervalId) {
          clearInterval(socialAuthPollIntervalId);
          socialAuthPollIntervalId = null;
        }
        try {
          popup.close();
        } catch {
          /* ignore */
        }
        emit("socialAuthLinked", { platform: platformName, href });
      }
    } catch {
      /* cross-origin while on provider — expected */
    }
  }, 500);
};

/** Cached GET /api/products/:id for product_created chat messages */
const productCreatedCache = reactive({});
const productCreatedLoading = reactive({});
const productCreatedError = reactive({});
/** True after successful DELETE or GET /api/products/:id returns 404 (refresh / history). */
const productCreatedGone = reactive({});
const productCreatedOpenMenuId = ref(null);
/** Local Active/Inactive state keyed by product id (aligned with Products list cards). */
const productCreatedActiveOverrides = ref({});

const formatProductTypographyLabel = (raw) => {
  if (raw == null || raw === "") return "—";
  const t = String(raw).trim();
  try {
    const j = JSON.parse(t);
    if (Array.isArray(j) && j.length) return String(j[0]);
    if (typeof j === "string") return j;
  } catch {
    /* not JSON */
  }
  const quoted = t.match(/"([^"]+)"/);
  if (quoted) return quoted[1];
  const stripped = t.replace(/^\{/, "").replace(/\}$/, "").split(",")[0];
  if (stripped) return stripped.replace(/^["']|["']$/g, "").trim();
  return t;
};

/** Safe stack for previewing the primary font in the card */
const formatProductTypographyCss = (raw) => {
  const label = formatProductTypographyLabel(raw);
  if (!label || label === "—") return "inherit";
  return `"${label.replace(/"/g, '\\"')}", ui-sans-serif, system-ui, sans-serif`;
};

const fetchProductCreatedDetails = async (productId) => {
  if (!productId || productCreatedLoading[productId]) return;
  if (productCreatedCache[productId]) return;
  if (productCreatedGone[productId]) return;
  productCreatedLoading[productId] = true;
  productCreatedError[productId] = null;
  try {
    const { data } = await api.get(`/api/products/${encodeURIComponent(productId)}`);
    if (data && typeof data === "object") {
      productCreatedCache[productId] = data;
      delete productCreatedGone[productId];
    } else {
      productCreatedError[productId] = "Invalid product response";
    }
  } catch (e) {
    const status = e?.response?.status;
    if (status === 404) {
      productCreatedGone[productId] = true;
      delete productCreatedError[productId];
    } else {
      console.error("Failed to load product for chat card:", e);
      const msg =
        e?.response?.data?.message ||
        (typeof e?.message === "string" && !e.message.includes("status code")
          ? e.message
          : null);
      productCreatedError[productId] =
        msg || "Could not load product. Please try again.";
    }
  } finally {
    productCreatedLoading[productId] = false;
  }
};

watch(
  () =>
    messages.value.map((m) => ({
      rt: m.responseType,
      pid: m.typeData?.productId,
    })),
  () => {
    messages.value.forEach((m) => {
      if (m.responseType === "product_created" && m.typeData?.productId) {
        fetchProductCreatedDetails(m.typeData.productId);
      }
    });
  },
  { deep: true, immediate: true }
);

const isChatProductCardActive = (product) => {
  if (!product?.id) return true;
  const id = product.id;
  if (productCreatedActiveOverrides.value[id] !== undefined) {
    return productCreatedActiveOverrides.value[id];
  }
  if (product.isActive !== undefined && product.isActive !== null) {
    return Boolean(product.isActive);
  }
  return true;
};

const toggleChatProductCardActive = (product) => {
  if (!product?.id) return;
  const id = product.id;
  const next = !isChatProductCardActive(product);
  productCreatedActiveOverrides.value = { ...productCreatedActiveOverrides.value, [id]: next };
};

const toggleProductCreatedCardMenu = (productId) => {
  productCreatedOpenMenuId.value =
    productCreatedOpenMenuId.value === productId ? null : productId;
};

const handleProductCreatedEdit = () => {
  productCreatedOpenMenuId.value = null;
  router.push("/products");
};

/** DELETE /api/products/:id — removes product; `id` is PRODUCT_UUID */
const handleProductCreatedDelete = async (productId) => {
  if (!productId) return;
  productCreatedOpenMenuId.value = null;
  try {
    await api.delete(`/api/products/${encodeURIComponent(productId)}`);
    delete productCreatedCache[productId];
    delete productCreatedError[productId];
    productCreatedGone[productId] = true;
  } catch (e) {
    console.error("Delete product failed:", e);
    productCreatedError[productId] =
      e?.response?.data?.message || e?.message || "Could not delete product";
  }
};

watch(productCreatedOpenMenuId, (id) => {
  if (removeProductCreatedMenuDocClick) {
    document.removeEventListener("click", removeProductCreatedMenuDocClick, true);
    removeProductCreatedMenuDocClick = null;
  }
  if (!id) return;
  nextTick(() => {
    removeProductCreatedMenuDocClick = (e) => {
      if (e.target.closest("[data-chat-product-card-menu]")) return;
      productCreatedOpenMenuId.value = null;
    };
    document.addEventListener("click", removeProductCreatedMenuDocClick, true);
  });
});

const handleCopyPostGenerated = async (message) => {
  const main = plainTextFromAi(message?.aiResponse);
  const cap = message?.typeData?.marketingCopy?.trim() || "";
  const parts = [];
  if (main) parts.push(main);
  if (cap && cap !== main) parts.push(cap);
  else if (!main && cap) parts.push(cap);
  const urls = postGeneratedImageUrls(message);
  if (urls.length) parts.push(urls.join("\n"));
  await handleCopy(parts.join("\n\n"));
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
// const handleRefresh = (index) => {
//   if (messages.value[index]) {
//     // Set loading state
//     messages.value[index].isLoading = true;
//     messages.value[index].aiResponse = null;
//     messages.value[index].responseType = null;
//     messages.value[index].suggestedResponses = [];
    
//     // Scroll to bottom
//     scrollToBottom();
    
//     // Regenerate response after a delay (simulating API call)
//     setTimeout(() => {
//       if (messages.value[index]) {
//         messages.value[index].isLoading = false;
//         // Regenerate with same dummy message for now
//         messages.value[index].aiResponse = "Great! ✨ Let's set up your brand. You can share your <strong>website</strong>, upload <strong>brand documents</strong>, or simply describe your <strong>products</strong> and style here in the chat. I'll use this info to understand your brand's tone, personality, and style.";
        
//         // Reset like/dislike states
//         messages.value[index].isLiked = false;
//         messages.value[index].isDisliked = false;
        
//         // Scroll when AI response updates
//         scrollToBottom();
//       }
//     }, 5000);
//   }
// };

// const handleEdit = (index) => {
//   editingIndex.value = index;
//   editingText.value = messages.value[index].text;
//   nextTick(() => {
//     if (editTextareaRef) {
//       editTextareaRef.focus();
//       // Move cursor to end
//       editTextareaRef.setSelectionRange(
//         editTextareaRef.value.length,
//         editTextareaRef.value.length
//       );
//     }
//   });
// };

// const saveEdit = (index) => {
//   if (editingText.value.trim()) {
//     const editedText = editingText.value.trim();
    
//     // Update the message text
//     messages.value[index].text = editedText;
    
//     // Remove all messages after the edited message (like ChatGPT workflow)
//     messages.value = messages.value.slice(0, index + 1);
    
//     // Clear AI response and set loading state for the edited message
//     messages.value[index].aiResponse = null;
//     messages.value[index].isLoading = true;
//     messages.value[index].isLiked = false;
//     messages.value[index].isDisliked = false;
//     messages.value[index].responseType = null;
//     messages.value[index].suggestedResponses = [];
    
//     // Exit edit mode
//     editingIndex.value = null;
//     editingText.value = "";
    
//     // Scroll to bottom after edit
//     scrollToBottom();
    
//     // Trigger new AI response after a delay (simulating API call)
//     setTimeout(() => {
//       if (messages.value[index]) {
//         messages.value[index].isLoading = false;
//         // Show first dummy message
//         messages.value[index].aiResponse = "Great! ✨ Let's set up your brand. You can share your <strong>website</strong>, upload <strong>brand documents</strong>, or simply describe your <strong>products</strong> and style here in the chat. I'll use this info to understand your brand's tone, personality, and style.";
        
//         // Scroll when AI response updates
//         scrollToBottom();
        
//         // Add second dummy message after a short delay

//       }
//     }, 5000);
//   }
// };

// const cancelEdit = () => {
//   editingIndex.value = null;
//   editingText.value = "";
// };

// Handle suggested response button click
const handleSuggestedResponse = (suggestion, currentMessageIndex) => {
  // Prevent clicking if AI is already generating
  if (isAiGenerating.value) return;
  
  // Extract text from suggestion object or use as-is if string
  const suggestionText = typeof suggestion === 'object' && suggestion !== null 
    ? suggestion.text 
    : suggestion;
  
  // Send the suggestion as a new message
  handleNewMessage({
    text: suggestionText,
    product: messages.value[currentMessageIndex]?.product || 'All products',
    model: messages.value[currentMessageIndex]?.model || 'Gemini 2.5 pro',
    files: []
  });
};

const handleNewMessage = async (messageData) => {
  // Add user message
  const newMessage = {
    text: messageData.text,
    product: messageData.product,
    model: messageData.model,
    files: messageData.files,
    isLoading: true,
    aiResponse: null, // Will be updated when AI responds
    isLiked: false,
    isDisliked: false,
    typeData: null
  };
  
  messages.value.push(newMessage);
  

  console.log("message data", messages)
  // Scroll to bottom when new message is added
  scrollToBottom();
  
  try {
    // Build FormData for API request
    const formData = new FormData();
    formData.append('message', messageData.text);
    formData.append('isHidden', 'false');
    
    // Add sessionId if available (for continuing conversation)
    if (props.sessionId) {
      formData.append('sessionId', props.sessionId);
    }
    
    // Add optional fields if provided
    if (messageData.product && messageData.product !== 'All products') {
      formData.append('productId', messageData.product);
    }
    if (messageData.model) {
      formData.append('model', messageData.model);
    }
    
    // Add files if any
    if (messageData.files && messageData.files.length > 0) {
      messageData.files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    // Make API call with 60-second timeout
    const response = await api.post('/api/ai/chat', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 60000
    });
    
    // Console log the API response
    console.log('API Response:', response.data);
    
    const messageIndex = messages.value.length - 1;
    
    // Extract sessionId from response and update parent if needed
    if (response.data && response.data.sessionId) {
      // Only emit if sessionId is different (shouldn't happen in normal flow)
      if (response.data.sessionId !== props.sessionId) {
        emit('update:sessionId', response.data.sessionId);
      }
    }
    
    // Update the message with AI response
    if (messages.value[messageIndex]) {
      messages.value[messageIndex].isLoading = false;
      messages.value[messageIndex].aiResponse = response.data?.message || response.data?.response || "No response received";
      messages.value[messageIndex].responseType = response.data?.type || null;
      messages.value[messageIndex].suggestedResponses = response.data?.suggestedResponses || [];
      messages.value[messageIndex].typeData = response.data?.typeData ?? null;
    }
    
    // Scroll when AI response updates
    scrollToBottom();
    
  } catch (error) {
    console.error("Error sending message:", error);
    
    const messageIndex = messages.value.length - 1;
    
    // Show error message
    if (messages.value[messageIndex]) {
      messages.value[messageIndex].isLoading = false;
      messages.value[messageIndex].aiResponse = "Sorry, I encountered an error. Please try again.";
    }
    
    // Scroll to show error
    scrollToBottom();
  }
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

// Fetch chat history for a session
const fetchChatHistory = async (sessionId) => {
  if (!sessionId) return;
  
  try {
    console.log('Fetching chat history for session:', sessionId);
    
    const response = await api.get('/api/ai/history', {
      params: { sessionId }
    });
    
    console.log('Chat History API Response:', response.data);
    console.log('Response type:', typeof response.data);
    console.log('Is Array:', Array.isArray(response.data));
    console.log('Response.data keys:', Object.keys(response.data));
    console.log('Response.data.success:', response.data.success);
    console.log('Response.data.history:', response.data.history);
    console.log('Is history array:', Array.isArray(response.data.history));
    
    let historyMessages = [];
    
    // Handle different response structures
    if (response.data?.messages && Array.isArray(response.data.messages)) {
      console.log('Found messages array in response.data.messages');
      historyMessages = response.data.messages;
    } else if (Array.isArray(response.data)) {
      console.log('Found direct array in response.data');
      historyMessages = response.data;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      console.log('Found messages in response.data.data');
      historyMessages = response.data.data;
    } else if (response.data?.history && Array.isArray(response.data.history)) {
      console.log('Found messages in response.data.history');
      historyMessages = response.data.history;
    } else if (response.data?.chats && Array.isArray(response.data.chats)) {
      console.log('Found messages in response.data.chats');
      historyMessages = response.data.chats;
    } else {
      console.log('No recognized message array found in response');
      // Try to find any array in the response
      for (const key in response.data) {
        console.log(`Checking key: ${key}, value:`, response.data[key], 'isArray:', Array.isArray(response.data[key]));
        if (Array.isArray(response.data[key])) {
          console.log(`Found array in response.data.${key}`);
          historyMessages = response.data[key];
          break;
        }
      }
    }
    
    console.log('History messages count:', historyMessages.length);
    
    // Clear existing messages first
    messages.value = [];
    
    if (historyMessages.length > 0) {
      // Group messages by user/AI pairs
      const groupedMessages = [];
      let currentUserMessage = null;
      
      historyMessages.forEach((msg, index) => {
        console.log(`Processing message ${index}:`, msg);
        
        if (msg.role === 'user') {
          // Save previous user message if exists
          if (currentUserMessage) {
            groupedMessages.push(currentUserMessage);
          }
          // Start new user message
          currentUserMessage = {
            text: msg.content || '',
            aiResponse: null,
            isLoading: false,
            isLiked: msg.isLiked || false,
            isDisliked: msg.isDisliked || false,
            responseType: msg.responseType || msg.type || null,
            suggestedResponses: msg.suggestedResponses || [],
            typeData: msg.typeData || null,
            product: msg.product || 'All products',
            model: msg.model || ''
          };
        } else if (msg.role === 'ai' || msg.role === 'assistant') {
          // Attach AI response to current user message
          if (currentUserMessage) {
            currentUserMessage.aiResponse = msg.content || null;
            currentUserMessage.typeData = msg.typeData ?? currentUserMessage.typeData ?? null;
            currentUserMessage.responseType = msg.responseType || msg.type || currentUserMessage.responseType;
            currentUserMessage.suggestedResponses = msg.suggestedResponses?.length
              ? msg.suggestedResponses
              : (currentUserMessage.suggestedResponses || []);
            groupedMessages.push(currentUserMessage);
            currentUserMessage = null;
          } else {
            // AI message without preceding user message (edge case)
            groupedMessages.push({
              text: '',
              aiResponse: msg.content || null,
              isLoading: false,
              isLiked: msg.isLiked || false,
              isDisliked: msg.isDisliked || false,
              responseType: msg.responseType || msg.type || null,
              suggestedResponses: msg.suggestedResponses || [],
              typeData: msg.typeData || null,
              product: msg.product || 'All products',
              model: msg.model || ''
            });
          }
        }
      });
      
      // Add any remaining user message
      if (currentUserMessage) {
        groupedMessages.push(currentUserMessage);
      }
      
      messages.value = groupedMessages;
      
      console.log('Mapped messages:', messages.value);
      
      // Update sessionId
      emit('update:sessionId', sessionId);
      emit('sessionLoaded', sessionId);
      
      // Scroll to bottom after loading history
      nextTick(() => {
        scrollToBottom();
      });
    } else {
      console.log('No messages to display');
    }
  } catch (error) {
    console.error('Error fetching chat history:', error);
  }
};

// Watch for external session ID changes (when clicked from sidebar)
watch(() => props.externalSessionId, (newSessionId) => {
  if (newSessionId) {
    fetchChatHistory(newSessionId);
  }
});

// Scroll to bottom on initial mount if there are messages; media query for post panel layout
onMounted(() => {
  updateIsLgUp();
  mediaQueryLg = window.matchMedia("(min-width: 1024px)");
  mediaQueryLg.addEventListener("change", updateIsLgUp);

  if (messages.value.length > 0) {
    scrollToBottom();
  }

  if (props.externalSessionId) {
    fetchChatHistory(props.externalSessionId);
  }
});

onUnmounted(() => {
  if (removePostMenuDocClick) {
    document.removeEventListener("click", removePostMenuDocClick, true);
  }
  if (removeProductCreatedMenuDocClick) {
    document.removeEventListener("click", removeProductCreatedMenuDocClick, true);
  }
  if (socialAuthPollIntervalId) {
    clearInterval(socialAuthPollIntervalId);
    socialAuthPollIntervalId = null;
  }
  mediaQueryLg?.removeEventListener("change", updateIsLgUp);
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
