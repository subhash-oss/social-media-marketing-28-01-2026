<template>
  <div class=" bg_white rounded-2xl py-7 px-4 brand_section_height">
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Instagram Card -->
      <div 
        @click="handleConnectClick('instagram')"
        class="flex items-center justify-between rounded-lg border border-[#F1F2F4] bg-white p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <img :src="InstagramIcon" alt="Instagram" class="h-10 w-10 flex-shrink-0" />
          <div class="flex flex-col">
            <p class="label_1_semibold primary_text_color">@lumovibe</p>
            <p class="label_2_regular">Instagram</p>
          </div>
        </div>
        <!-- Chain Link Icon (Connected) or Plus Icon -->
        <div v-if="clickedSocials.has('instagram')" class="relative group" @click.stop="handleDisconnectClick('instagram')">
          <svg class="disconnect-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 22V20M9 15L15 9M11 6.00031L11.463 5.46431C12.4008 4.52663 13.6727 3.99991 14.9989 4C16.325 4.00009 17.5968 4.527 18.5345 5.46481C19.4722 6.40261 19.9989 7.6745 19.9988 9.00066C19.9987 10.3268 19.4718 11.5986 18.534 12.5363L18 13.0003M13.0001 18L12.6031 18.534C11.6544 19.4722 10.3739 19.9984 9.03964 19.9984C7.70535 19.9984 6.42489 19.4722 5.47614 18.534C5.0085 18.0716 4.63724 17.521 4.38385 16.9141C4.13047 16.3073 4 15.6561 4 14.9985C4 14.3408 4.13047 13.6897 4.38385 13.0829C4.63724 12.476 5.0085 11.9254 5.47614 11.463L6.00014 11M20 17H22M2 7H4M7 2V4" stroke="#1D2125" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          <span class="tooltip">Disconnect</span>
        </div>
        <svg v-else class="h-5 w-5 text-[#8590A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <!-- Facebook Card -->
      <div 
        @click="handleConnectClick('facebook')"
        class="flex items-center justify-between rounded-lg primary_border_color bg_white p-4  cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <img :src="FacebookIcon" alt="Facebook" class="h-10 w-10" />
          <div>
            <p class="label_1_semibold primary_text_color">Facebook</p>
          </div>
        </div>
        <!-- Chain Link Icon (Connected) or Plus Icon -->
        <div v-if="clickedSocials.has('facebook')" class="relative group" @click.stop="handleDisconnectClick('facebook')">
          <svg class="disconnect-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 22V20M9 15L15 9M11 6.00031L11.463 5.46431C12.4008 4.52663 13.6727 3.99991 14.9989 4C16.325 4.00009 17.5968 4.527 18.5345 5.46481C19.4722 6.40261 19.9989 7.6745 19.9988 9.00066C19.9987 10.3268 19.4718 11.5986 18.534 12.5363L18 13.0003M13.0001 18L12.6031 18.534C11.6544 19.4722 10.3739 19.9984 9.03964 19.9984C7.70535 19.9984 6.42489 19.4722 5.47614 18.534C5.0085 18.0716 4.63724 17.521 4.38385 16.9141C4.13047 16.3073 4 15.6561 4 14.9985C4 14.3408 4.13047 13.6897 4.38385 13.0829C4.63724 12.476 5.0085 11.9254 5.47614 11.463L6.00014 11M20 17H22M2 7H4M7 2V4" stroke="#1D2125" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          <span class="tooltip">Disconnect</span>
        </div>
        <svg v-else class="h-5 w-5 text-[#8590A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <!-- LinkedIn Card -->
      <div 
        @click="handleConnectClick('linkedin')"
        class="flex items-center justify-between rounded-lg primary_border_color bg_white p-4  cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <img :src="LinkedInIcon" alt="LinkedIn" class="h-10 w-10" />
          <div>
            <p class="label_1_semibold primary_text_color">LinkedIn</p>
          </div>
        </div>
        <!-- Chain Link Icon (Connected) or Plus Icon -->
        <div v-if="clickedSocials.has('linkedin')" class="relative group" @click.stop="handleDisconnectClick('linkedin')">
         <svg class="disconnect-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 22V20M9 15L15 9M11 6.00031L11.463 5.46431C12.4008 4.52663 13.6727 3.99991 14.9989 4C16.325 4.00009 17.5968 4.527 18.5345 5.46481C19.4722 6.40261 19.9989 7.6745 19.9988 9.00066C19.9987 10.3268 19.4718 11.5986 18.534 12.5363L18 13.0003M13.0001 18L12.6031 18.534C11.6544 19.4722 10.3739 19.9984 9.03964 19.9984C7.70535 19.9984 6.42489 19.4722 5.47614 18.534C5.0085 18.0716 4.63724 17.521 4.38385 16.9141C4.13047 16.3073 4 15.6561 4 14.9985C4 14.3408 4.13047 13.6897 4.38385 13.0829C4.63724 12.476 5.0085 11.9254 5.47614 11.463L6.00014 11M20 17H22M2 7H4M7 2V4" stroke="#1D2125" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          <span class="tooltip">Disconnect</span>
        </div>
        <svg v-else class="h-5 w-5 text-[#8590A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <!-- Twitter (X) Card -->
      <div 
        @click="handleConnectClick('twitter')"
        class="flex items-center justify-between rounded-lg primary_border_color bg_white p-4  cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <img :src="TwitterIcon" alt="Twitter" class="h-10 w-10" />
          <div>
            <p class="label_1_semibold primary_text_color">Twitter (X)</p>
          </div>
        </div>
        <!-- Chain Link Icon (Connected) or Plus Icon -->
        <div v-if="clickedSocials.has('twitter')" class="relative group" @click.stop="handleDisconnectClick('twitter')">
          <svg class="disconnect-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 22V20M9 15L15 9M11 6.00031L11.463 5.46431C12.4008 4.52663 13.6727 3.99991 14.9989 4C16.325 4.00009 17.5968 4.527 18.5345 5.46481C19.4722 6.40261 19.9989 7.6745 19.9988 9.00066C19.9987 10.3268 19.4718 11.5986 18.534 12.5363L18 13.0003M13.0001 18L12.6031 18.534C11.6544 19.4722 10.3739 19.9984 9.03964 19.9984C7.70535 19.9984 6.42489 19.4722 5.47614 18.534C5.0085 18.0716 4.63724 17.521 4.38385 16.9141C4.13047 16.3073 4 15.6561 4 14.9985C4 14.3408 4.13047 13.6897 4.38385 13.0829C4.63724 12.476 5.0085 11.9254 5.47614 11.463L6.00014 11M20 17H22M2 7H4M7 2V4" stroke="#1D2125" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          <span class="tooltip">Disconnect</span>
        </div>
        <svg v-else class="h-5 w-5 text-[#8590A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <!-- TikTok Card -->
      <div 
        @click="handleConnectClick('tiktok')"
        class="flex items-center justify-between rounded-lg primary_border_color bg_white p-4  cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <img :src="TikTokIcon" alt="TikTok" class="h-10 w-10" />
          <div>
            <p class="label_1_semibold primary_text_color">TikTok</p>
          </div>
        </div>
        <!-- Chain Link Icon (Connected) or Plus Icon -->
        <div v-if="clickedSocials.has('tiktok')" class="relative group" @click.stop="handleDisconnectClick('tiktok')">
          <svg class="disconnect-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 22V20M9 15L15 9M11 6.00031L11.463 5.46431C12.4008 4.52663 13.6727 3.99991 14.9989 4C16.325 4.00009 17.5968 4.527 18.5345 5.46481C19.4722 6.40261 19.9989 7.6745 19.9988 9.00066C19.9987 10.3268 19.4718 11.5986 18.534 12.5363L18 13.0003M13.0001 18L12.6031 18.534C11.6544 19.4722 10.3739 19.9984 9.03964 19.9984C7.70535 19.9984 6.42489 19.4722 5.47614 18.534C5.0085 18.0716 4.63724 17.521 4.38385 16.9141C4.13047 16.3073 4 15.6561 4 14.9985C4 14.3408 4.13047 13.6897 4.38385 13.0829C4.63724 12.476 5.0085 11.9254 5.47614 11.463L6.00014 11M20 17H22M2 7H4M7 2V4" stroke="#1D2125" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          <span class="tooltip">Disconnect</span>
        </div>
        <svg v-else class="h-5 w-5 text-[#8590A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>

      <!-- YouTube Card -->
      <div 
        @click="handleConnectClick('youtube')"
        class="flex items-center justify-between rounded-lg primary_border_color bg_white p-4  cursor-pointer"
      >
        <div class="flex items-center gap-3">
          <img :src="YoutubeIcon" alt="YouTube" class="h-10 w-10" />
          <div>
            <p class="label_1_semibold primary_text_color">YouTube</p>
          </div>
        </div>
        <!-- Chain Link Icon (Connected) or Plus Icon -->
        <div v-if="clickedSocials.has('youtube')" class="relative group" @click.stop="handleDisconnectClick('youtube')">
          <svg class="disconnect-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17 22V20M9 15L15 9M11 6.00031L11.463 5.46431C12.4008 4.52663 13.6727 3.99991 14.9989 4C16.325 4.00009 17.5968 4.527 18.5345 5.46481C19.4722 6.40261 19.9989 7.6745 19.9988 9.00066C19.9987 10.3268 19.4718 11.5986 18.534 12.5363L18 13.0003M13.0001 18L12.6031 18.534C11.6544 19.4722 10.3739 19.9984 9.03964 19.9984C7.70535 19.9984 6.42489 19.4722 5.47614 18.534C5.0085 18.0716 4.63724 17.521 4.38385 16.9141C4.13047 16.3073 4 15.6561 4 14.9985C4 14.3408 4.13047 13.6897 4.38385 13.0829C4.63724 12.476 5.0085 11.9254 5.47614 11.463L6.00014 11M20 17H22M2 7H4M7 2V4" stroke="#1D2125" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          <span class="tooltip">Disconnect</span>
        </div>
        <svg v-else class="h-5 w-5 text-[#8590A2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import InstagramIcon from "../../../assets/images/InstagramIcon.svg";
import FacebookIcon from "../../../assets/images/FacebookIcon.svg";
import LinkedInIcon from "../../../assets/images/LinkedInIcon.svg";
import TwitterIcon from "../../../assets/images/TwitterIcon.svg";
import TikTokIcon from "../../../assets/images/TikTokIcon.svg";
import YoutubeIcon from "../../../assets/images/YoutubeIcon.svg";

const emit = defineEmits(["connect-social"]);

const clickedSocials = ref(new Set());

// Handle click on disconnect icon - only toggles the connection state
const handleDisconnectClick = (platform) => {
  if (clickedSocials.value.has(platform)) {
    clickedSocials.value.delete(platform);
    emit("connect-social", platform);
  }
};

// Handle click on card - only connects (adds) if not already connected
const handleConnectClick = (platform) => {
  if (!clickedSocials.value.has(platform)) {
    clickedSocials.value.add(platform);
    emit("connect-social", platform);
  }
};
</script>

<style scoped>
.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  padding: 6px 12px;
  background-color: #1a1a1a;
  color: white;
  font-size: 12px;
  white-space: nowrap;
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
  z-index: 10;
}

.tooltip::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #1a1a1a;
}

.group:hover .tooltip {
  opacity: 1;
}

.group:hover .disconnect-icon path {
  stroke: #C9372C;
  transition: stroke 0.2s ease-in-out;
}
</style>

