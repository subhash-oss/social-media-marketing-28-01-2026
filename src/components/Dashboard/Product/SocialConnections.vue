<template>
  <div class="mb-8">
    <!-- Section Header -->
    <div class="mb-6">
      <h2 class="heading_h5_bold primary_text_color mb-2">
        Connect your social media accounts
      </h2>
      <p class="label_1_regular">
        Link your brand's social profiles to create and publish posts directly from one place.
      </p>
    </div>

    <!-- Social Media Cards Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <!-- Instagram Card (Connected) -->
      <div 
        @click="$emit('connect-social', 'instagram')"
        class="flex items-center justify-between rounded-lg border border-[#F1F2F4] bg-white p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <img :src="InstagramIcon" alt="Instagram" class="h-10 w-10 flex-shrink-0" />
          <div class="flex flex-col">
            <p class="label_1_semibold primary_text_color">@lumovibe</p>
            <p class="label_2_regular">Instagram</p>
          </div>
        </div>
        <!-- Chain Link Icon (Connected) -->
        <svg class="h-5 w-5 text-[#7950F2] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </div>

      <!-- Facebook Card -->
      <div 
        @click="$emit('connect-social', 'facebook')"
        class="flex items-center justify-between rounded-lg border border-[#F1F2F4] bg-white p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <img :src="FacebookIcon" alt="Facebook" class="h-10 w-10" />
          <div>
            <p class="label_1_semibold primary_text_color">Facebook</p>
          </div>
        </div>
        <!-- Plus Icon -->
        <svg class="h-5 w-5 text-[#8590A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <!-- LinkedIn Card -->
      <div 
        @click="$emit('connect-social', 'linkedin')"
        class="flex items-center justify-between rounded-lg border border-[#F1F2F4] bg-white p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <img :src="LinkedInIcon" alt="LinkedIn" class="h-10 w-10" />
          <div>
            <p class="label_1_semibold primary_text_color">LinkedIn</p>
          </div>
        </div>
        <!-- Plus Icon -->
        <svg class="h-5 w-5 text-[#8590A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <!-- Twitter (X) Card -->
      <div 
        @click="$emit('connect-social', 'twitter')"
        class="flex items-center justify-between rounded-lg border border-[#F1F2F4] bg-white p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <img :src="TwitterIcon" alt="Twitter" class="h-10 w-10" />
          <div>
            <p class="label_1_semibold primary_text_color">Twitter (X)</p>
          </div>
        </div>
        <!-- Plus Icon -->
        <svg class="h-5 w-5 text-[#8590A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <!-- TikTok Card -->
      <div 
        @click="$emit('connect-social', 'tiktok')"
        class="flex items-center justify-between rounded-lg border border-[#F1F2F4] bg-white p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <img :src="TikTokIcon" alt="TikTok" class="h-10 w-10" />
          <div>
            <p class="label_1_semibold primary_text_color">TikTok</p>
          </div>
        </div>
        <!-- Plus Icon -->
        <svg class="h-5 w-5 text-[#8590A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <!-- YouTube Card -->
      <div 
        @click="$emit('connect-social', 'youtube')"
        class="flex items-center justify-between rounded-lg border border-[#F1F2F4] bg-white p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <img :src="YoutubeIcon" alt="YouTube" class="h-10 w-10" />
          <div>
            <p class="label_1_semibold primary_text_color">YouTube</p>
          </div>
        </div>
        <!-- Plus Icon -->
        <svg class="h-5 w-5 text-[#8590A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import InstagramIcon from "../../../assets/images/InstagramIcon.svg";
import FacebookIcon from "../../../assets/images/FacebookIcon.svg";
import LinkedInIcon from "../../../assets/images/LinkedInIcon.svg";
import TwitterIcon from "../../../assets/images/TwitterIcon.svg";
import TikTokIcon from "../../../assets/images/TikTokIcon.svg";
import YoutubeIcon from "../../../assets/images/YoutubeIcon.svg";

defineEmits(["connect-social"]);
</script>

