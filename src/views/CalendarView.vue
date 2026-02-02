<template>
  <main class="flex-1 bg_primary_color  px-4 py-12 md:px-10 lg:py-7">
    <div class="space-y-6">
      <!-- Header -->
      <div class="rounded-xl bg_white common_inner_gap primary_border_color">
        <h2 class="primary_text_color heading_h6_bold">Calendar</h2>
        <p class="label_1_regular regular_gap">
          Manage your brands, connect their channels, and keep assets in one place.
        </p>
      </div>

      <!-- Controls -->
      <div
        class="flex items-center justify-between rounded-xl bg_white primary_border_color p-3  flex-col-reverse gap-4 md:gap-0 md:flex-row">
        <!-- View Switch -->
        <div class="flex rounded-full bg_secondary_color primary_border_color p-1">
          <button v-for="view in views" :key="view" @click="activeView = view"
            class="rounded-full primary_border_color px-4 py-1 label_2_semibold primary_text_color" :class="
            activeView === view
              ? 'bg_white '
              : ''
          ">
            {{ view }}
          </button>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-3">
          <img :src="ProductIcon" alt="" class="mr-[-40px] md:mr-[-44px] z-10">
          <div class="relative">
            <select v-model="selectedProduct"
              class="flex items-center gap-2 rounded-md primary_border_color pl-8 pr-10 md:pl-10 md:pr-14 py-2 label_2_medium bg_white appearance-none">
              <option value="single">Single</option>
              <option value="multi">Multi</option>
              <option value="all">All products</option>
            </select>
            <img :src="DownArrow" alt=""
              class="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          </div>
          <button class="rounded-md px-4 py-2 primary_add_button flex items-center">
            <img :src="WhitePlusIcon" alt="" class="mr-2"> Create new post
          </button>
        </div>
      </div>

      <!-- MONTH VIEW with Modal -->
      <div v-if="activeView === 'Month'" class="flex gap-6 items-start lg:items-stretch">
        <!-- Calendar -->
        <div class="rounded-xl bg_white primary_border_color flex-1 relative"
          :class="selectedDate ? 'md:w-[65%] lg:w-[60%] 2xl:w-[70%]' : 'w-full'">
          <!-- Month Header -->
          <div class="flex items-center justify-between border-b p-4 relative z-0">
            <button @click="prevMonth"><img :src="CircleLeftArrow" alt=""></button>
            <p class="heading_h6_semibold primary_text_color">{{ monthYear }}</p>
            <button @click="nextMonth"><img :src="CircleRightArrow" alt=""></button>
          </div>

          <!-- Week Days -->
          <div class="grid grid-cols-7 border-b text-center bg_primary_color relative z-0">
            <div v-for="day in weekDays" :key="day" class="py-2 paragraph_p7_medium">
              {{ day }}
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 relative z-0"
            :class="selectedDate ? 'pointer-events-none lg:pointer-events-auto' : ''">
            <div v-for="date in calendarDays" :key="date.key" @click="openDateModal(date.fullDate)"
              class="h-14 md:h-[4.8em]  secondary_button_border p-2 relative cursor-pointer" :class="[
            date.isToday ? 'secondary_bg_color selected_calendar_border' : '',
            !date.isCurrentMonth ? 'bg_white' : '',
            isDateSelected(date.fullDate) ? 'secondary_bg_color selected_calendar_border' : ''
          ]">
              <p class="text-right paragraph_p5_medium mb-1"
                :class="date.isCurrentMonth ? 'primary_text_color' : 'disable_text_color'">
                {{ date.day }}
              </p>

              <!-- Post Images for Month View (Today and Future) -->
              <div v-if="isDateTodayOrFuture(date.fullDate) && getPostsForDate(date.fullDate).length > 0"
                class="flex flex-wrap gap-1 mt-1">
                <img v-for="(post, idx) in getPostsForDate(date.fullDate).slice(0, 2)" :key="post.id"
                  :src="post.postImage" :alt="`Post ${idx + 1}`" class="w-4 h-4 md:w-8 md:h-8 rounded object-cover" />
                <span v-if="getPostsForDate(date.fullDate).length > 2" class="label_3_medium sub_text_color">
                  +{{ getPostsForDate(date.fullDate).length - 2 }}
                </span>
              </div>

              <!-- Post Count Text for Past Dates -->
              <div v-else-if="!isDateTodayOrFuture(date.fullDate) && getPostsForDate(date.fullDate).length > 0"
                class="absolute bottom-0 border_none">
                <p class=" md:disable_text_color md:paragraph_p7_medium paragraph_sm disable_text_color">
                  {{ getPostsForDate(date.fullDate).length }} {{ getPostsForDate(date.fullDate).length === 1 ? 'Post' :
                  'Posts' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Black Overlay when date is selected -->
          <div v-if="selectedDate"
            class="block lg:hidden absolute inset-0 bg-black/40 backdrop-blur-xm rounded-xl z-10 pointer-events-auto"
            @click="closeDateModal"></div>
        </div>

        <!-- Right Side Modal Panel -->
        <div v-if="selectedDate"
          class="hidden lg:block w-[30%] h-[35em] lg:w-[40%] 2xl:w-[30%] rounded-xl bg_white primary_border_color shadow-lg flex-shrink-0 relative z-20 common_inner_gap">
          <!-- Post Detail View -->
          <div v-if="selectedPost" class="h-full flex flex-col">
            <!-- Modal Header with Back Button -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-6">
                <button @click="closePostDetail" class="rounded-full transition-colors" aria-label="Back">
                  <img :src="BackButtonArrow" alt="Back">
                </button>
                <h2 class="paragraph_p2_medium primary_text_color">Post details</h2>
              </div>
            </div>

            <div class="block h-[1px] w-full bg_primary_color common_gap"></div>

            <!-- Post Detail Content with Auto Scroll -->
            <div
              class="flex-1 overflow-y-auto common_gap primary_border_color medium_inner_gap rounded-lg custom-scrollbar-calendar">
              <!-- Status Badge -->
              <div :class="[
                'inline-flex items-center gap-2 secondary_button_thin rounded-md label_3_semibold w-full',
                selectedPost.status === 'approved' ? 'approve_text_style' : 'pending_text_style'
              ]">
                <img v-if="selectedPost.status === 'approved'" :src="ApproveIcon" alt="Approved" class="w-4 h-4">
                <img v-else :src="PendingIcon" alt="Pending" class="w-4 h-4">
                <span>{{ selectedPost.status }}</span>
              </div>

              <!-- Post Type Dropdown -->
              <div class="relative medium_gap">
                <img :src="PostFilter" class="absolute left-2 top-[10px]" alt="">
                <select v-model="selectedPost.postType"
                  class="w-full rounded-lg primary_border_color secondary_button_thin label_2_regular primary_text_color bg_white appearance-none pl-9">


                  <option value="Instagram post (4:5)">Instagram post (4:5)</option>
                  <option value="Instagram post (1:1)">Instagram post (1:1)</option>
                  <option value="Instagram post (9:16)">Instagram post (9:16)</option>
                  <option value="Facebook post (4:5)">Facebook post (4:5)</option>
                  <option value="LinkedIn post (4:5)">LinkedIn post (4:5)</option>
                  <option value="Twitter post (16:9)">Twitter post (16:9)</option>
                </select>
                <img :src="DownArrow" alt="" class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              </div>

              <!-- Image Preview -->
              <div class="rounded-lg overflow-hidden bg_primary_color flex justify-center items-center medium_gap h-72">
                <img :src="selectedPost.postImage" :alt="selectedPost.title" class="w-full max-w-md object-contain" />
              </div>

              <!-- Caption -->
              <p class="label_2_medium medium_gap"> Caption</p>
              <div class="relative medium_gap">
                <textarea v-model="selectedPost.caption"
                  class="w-full rounded-lg primary_border_color medium_inner_gap label_2_semibold bg_white min-h-[140px] resize-none "
                  placeholder="Write your caption here..."></textarea>
                <!-- AI Sparkle Icon -->
                <button class="absolute bottom-3 right-3 secondary_button_thin">
                  <img :src="AiIcon" alt="">
                </button>
              </div>

              <!-- Platforms -->
              <p class="label_2_medium medium_gap"> Platforms</p>
              <div class="flex items-center gap-2 medium_gap overflow-auto hide-scrollbar">
                <img v-for="platform in selectedPost.platforms" :key="platform" :src="getPlatformIcon(platform)"
                  :alt="platform" class="w-10 h-10" />
                <img @click="openPlatformModal" :src="ImageEditIcon" alt=""
                  class=" primary_border_color rounded-lg secondary_button_thin cursor-pointer w-10 h-10">
              </div>

              <!-- Scheduled For -->
              <div class="common_gap medium_inner_gap primary_border_color rounded-lg">
                <p class="flex justify-between" v-html="formatScheduledTime(selectedPost, true)"
                  @click="handleTimeClick">
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-3  common_gap relative">
                <div class="relative">
                  <button @click.stop="togglePostMenu" class="relative" ref="dotsButtonRef">
                    <img :src="DotsIcon" alt="">
                  </button>

                  <!-- Post Actions Dropdown Menu -->
                  <TogglePostModal ref="togglePostModalRef" :open="showPostMenu" @close="showPostMenu = false"
                    @share="handleShareNow" @regenerate="handleRegeneratePost" @delete="handleDeletePost" />
                </div>

                <button @click="savePostChanges" :disabled="!hasUnsavedChanges"
                  class="rounded-lg secondary_button_thin label_2_semibold flex justify-center gap-2 w-full transition-opacity"
                  :class="hasUnsavedChanges ? 'primary_add_button' : 'primary_add_button opacity-50 cursor-not-allowed'">
                  <img :src="SaveIcon" alt="">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <!-- Posts List View -->
          <div v-else>
            <!-- Modal Header -->
            <div class="flex items-center justify-between">
              <h2 class="heading_h6_semibold primary_text_color">
                {{ formatSelectedDate(selectedDate) }}
              </h2>

              <button @click="closeDateModal" class="p-2  rounded-full transition-colors" aria-label="Close">
                <img :src="closeIcon" alt="">
              </button>
            </div>

            <div class="block h-[1px] w-full bg_primary_color common_gap"></div>

            <!-- Posts List -->
            <div class="max-h-[calc(100vh-200px)] overflow-y-auto common_gap">
              <div v-if="getPostsForDate(selectedDate).length === 0" class="text-center py-8">
                <p class="label_3_medium ">No posts scheduled for this date</p>
              </div>

              <div v-else class="space-y-4">
                <div v-for="post in getPostsForDate(selectedDate)" :key="post.id" @click="openPostDetail(post)"
                  class="flex gap-4 medium_inner_gap rounded-lg primary_border_color cursor-pointer hover:bg-gray-50 transition-colors">
                  <!-- Post Image -->
                  <img :src="post.postImage" :alt="post.title"
                    class="w-20 h-20 md:w-20 md:h-20 rounded-lg object-cover flex-shrink-0" />

                  <!-- Post Details -->
                  <div class="flex-1 min-w-0">
                    <!-- Title -->
                    <h3 class="label_2_semibold primary_text_color">
                      {{ post.title || 'Scheduled Post' }}
                    </h3>

                    <!-- Platforms -->
                    <div class="flex items-center gap-2  flex-wrap normal_gap">
                      <img v-for="platform in post.platforms.slice(0, 4)" :key="platform"
                        :src="getPlatformIcon(platform)" :alt="platform" class="w-5 h-5" />
                      <span v-if="post.platforms.length > 4" class="text-xs label_2_medium">
                        +{{ post.platforms.length - 4 }}
                      </span>
                    </div>

                    <!-- Status and Time -->
                    <div class="flex items-center gap-4 flex-wrap medium_gap">
                      <!-- Status -->
                      <div :class="[
                        'flex items-center gap-2 label_3_semibold',
                        post.status === 'approved' ? 'approve_text_color' : 'pending_text_color'
                      ]">

                        <img v-if="post.status === 'approved'" :src="ApproveIcon" alt="Approved">
                        <img v-else :src="PendingIcon" alt="Pending">
                        <span>{{ post.status }}</span>
                      </div>

                      <!-- Time -->
                      <div class="flex items-center gap-2 label_3_semibold sub_text_color">
                        <img :src="TimeIcon" alt="">
                        <span>{{ formatTime(post.postTime) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Modal Overlay -->
      <div v-if="selectedDate && activeView === 'Month'" class="lg:hidden fixed inset-0 z-50 " @click="closeDateModal">
        <div
          class="fixed right-0 top-[46%] bottom-0 w-full bg_white shadow-2xl overflow-hidden transform transition-transform duration-300 ease-in-out overflow-y-auto common_inner_gap rounded-lg"
          @click.stop>
          <!-- Post Detail View -->
          <div v-if="selectedPost" class="h-full flex flex-col">
            <!-- Modal Header with Back Button -->
            <div>
              <div class="flex items-center justify-between gap-6">
                <h2 class="paragraph_p2_medium primary_text_color">Post details</h2>
                <button @click="closePostDetail" class="transition-colors" aria-label="Back">
                  <img :src="closeIcon" alt="Back">
                </button>

              </div>
            </div>

            <div class="block h-[2px] w-full bg_primary_color common_gap"></div>

            <!-- Post Detail Content with Auto Scroll -->
            <div class="flex-1 overflow-y-auto custom-scrollbar">

              <div
                class="flex-1 overflow-y-auto common_gap primary_border_color medium_inner_gap rounded-lg custom-scrollbar-calendar">
                <div class="md:grid md:grid-cols-2 md:gap-4">
                  <!-- Image Preview -->
                  <div class="rounded-lg overflow-hidden  bg_primary_color flex justify-center items-center h-[16.8em]">
                    <img :src="selectedPost.postImage" :alt="selectedPost.title"
                      class="w-full max-w-md object-contain" />
                  </div>
                  <div>
                    <!-- Status Badge -->
                    <div :class="[
                'inline-flex items-center gap-2 secondary_button_thin rounded-md label_3_semibold w-full medium_gap md:mt-0',
                selectedPost.status === 'approved' ? 'approve_text_style' : 'pending_text_style'
              ]">
                      <img v-if="selectedPost.status === 'approved'" :src="ApproveIcon" alt="Approved" class="w-4 h-4">
                      <img v-else :src="PendingIcon" alt="Pending" class="w-4 h-4">
                      <span>{{ selectedPost.status }}</span>
                    </div>

                    <!-- Post Type Dropdown -->
                    <div class="relative medium_gap">
                      <img :src="PostFilter" class="absolute left-2 top-[10px]" alt="">
                      <select v-model="selectedPost.postType"
                        class="w-full rounded-lg primary_border_color secondary_button_thin label_2_regular primary_text_color bg_white appearance-none pl-9">


                        <option value="Instagram post (4:5)">Instagram post (4:5)</option>
                        <option value="Instagram post (1:1)">Instagram post (1:1)</option>
                        <option value="Instagram post (9:16)">Instagram post (9:16)</option>
                        <option value="Facebook post (4:5)">Facebook post (4:5)</option>
                        <option value="LinkedIn post (4:5)">LinkedIn post (4:5)</option>
                        <option value="Twitter post (16:9)">Twitter post (16:9)</option>
                      </select>
                      <img :src="DownArrow" alt=""
                        class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    </div>


                    <!-- Caption -->
                    <p class="label_2_medium medium_gap"> Caption</p>
                    <div class="relative medium_gap">
                      <textarea v-model="selectedPost.caption"
                        class="w-full rounded-lg primary_border_color medium_inner_gap label_2_semibold bg_white min-h-[140px] resize-none "
                        placeholder="Write your caption here..."></textarea>
                      <!-- AI Sparkle Icon -->
                      <button class="absolute bottom-3 right-3 secondary_button_thin">
                        <img :src="AiIcon" alt="">
                      </button>
                    </div>
                  </div>
                </div>
                <!-- Platforms -->
                <div class="md:flex md:items-end md:justify-center">
                  <p class="label_2_medium medium_gap md:absolute left-8"> Platforms</p>
                  <div class="flex items-center gap-2 medium_gap overflow-auto hide-scrollbar">
                    <img v-for="platform in selectedPost.platforms" :key="platform" :src="getPlatformIcon(platform)"
                      :alt="platform" class="w-10 h-10" />
                    <img @click="openPlatformModal" :src="ImageEditIcon" alt=""
                      class=" primary_border_color rounded-lg secondary_button_thin cursor-pointer w-10 h-10">
                  </div>
                </div>
                <!-- Scheduled For -->
                <div class="common_gap medium_inner_gap primary_border_color rounded-lg">
                  <p class="flex justify-between" v-html="formatScheduledTime(selectedPost, true)"
                    @click="handleTimeClick">
                  </p>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-3  common_gap relative">
                  <div class="relative">
                    <button @click.stop="togglePostMenu" class="relative" ref="dotsButtonRefMobile">
                      <img :src="DotsIcon" alt="">
                    </button>

                    <!-- Post Actions Dropdown Menu -->
                    <TogglePostModal ref="togglePostModalRefMobile" :open="showPostMenu" @close="showPostMenu = false"
                      @share="handleShareNow" @regenerate="handleRegeneratePost" @delete="handleDeletePost" />
                  </div>

                  <button @click="savePostChanges" :disabled="!hasUnsavedChanges"
                    class="rounded-lg secondary_button_thin label_2_semibold flex justify-center gap-2 w-full transition-opacity"
                    :class="hasUnsavedChanges ? 'primary_add_button' : 'primary_add_button opacity-50 cursor-not-allowed'">
                    <img :src="SaveIcon" alt="">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Posts List View -->
          <div v-else>
            <!-- Modal Header -->
            <div class="flex items-center justify-between">
              <h2 class="heading_h6_semibold primary_text_color">
                {{ formatSelectedDate(selectedDate) }}
              </h2>
              <button @click="closeDateModal" class=" rounded-full transition-colors" aria-label="Close">
                <img :src="closeIcon" alt="">
              </button>
            </div>
            <div class="block h-[2px] w-full bg_primary_color common_gap"></div>
            <!-- Posts List -->
            <div class="h-auto overflow-y-auto common_gap">
              <div v-if="getPostsForDate(selectedDate).length === 0" class="text-center py-8">
                <p class="label_3_medium">No posts scheduled for this date</p>
              </div>

              <div v-else class="space-y-4">
                <div v-for="post in getPostsForDate(selectedDate)" :key="post.id" @click="openPostDetail(post)"
                  class="flex gap-4 rounded-lg medium_inner_gap primary_border_color cursor-pointer hover:bg-gray-50 transition-colors">
                  <!-- Post Image -->
                  <img :src="post.postImage" :alt="post.title"
                    class="w-20 h-20 md:w-20 md:h-20 rounded-lg object-cover flex-shrink-0" />

                  <!-- Post Details -->
                  <div class="flex-1 min-w-0">
                    <!-- Title -->
                    <h3 class="label_2_semibold primary_text_color">
                      {{ post.title || 'Scheduled Post' }}
                    </h3>

                    <!-- Platforms -->
                    <div class="flex items-center gap-2 flex-wrap normal_gap">
                      <img v-for="platform in post.platforms.slice(0, 4)" :key="platform"
                        :src="getPlatformIcon(platform)" :alt="platform" class="w-5 h-5" />
                      <span v-if="post.platforms.length > 4" class="text-xs label_2_medium">
                        +{{ post.platforms.length - 4 }}
                      </span>
                    </div>

                    <!-- Status and Time -->
                    <div class="flex items-center gap-4 flex-wrap medium_gap">
                      <!-- Status -->
                      <div :class="[
                        'flex items-center gap-2 label_3_semibold',
                        post.status === 'approved' ? 'approve_text_color' : 'pending_text_color'
                      ]">
                        <img v-if="post.status === 'approved'" :src="ApproveIcon" alt="Approved">
                        <img v-else :src="PendingIcon" alt="Pending">
                        <span>{{ post.status }}</span>
                      </div>

                      <!-- Time -->
                      <div class="flex items-center gap-2 label_3_semibold sub_text_color">
                        <img :src="TimeIcon" alt="">
                        <span>{{ formatTime(post.postTime) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- WEEK VIEW -->
      <div v-if="activeView === 'Week'" class="rounded-xl bg_white  shadow">
        <div class="flex items-center justify-between border-b p-4">
          <button @click="prevWeek"><img :src="CircleLeftArrow" alt=""></button>
          <p class="heading_h6_semibold primary_text_color">{{ monthYear }}</p>
          <button @click="nextWeek"> <img :src="CircleRightArrow" alt=""></button>
        </div>

        <!-- Mobile Week View -->
        <div class="md:hidden">
          <!-- Week Header - Mobile -->
          <div class="flex items-center justify-between border-b bg_primary_color secondary_button_thin gap-3">
            <div v-for="day in weekDaysOnly" :key="day.day" @click="selectedWeekDay = day.dateString"
              class="flex-1 text-center cursor-pointer" :class="[
              selectedWeekDay === day.dateString || (selectedWeekDay === null && day.isToday) 
                ? 'secondary_bg_color rounded-lg py-2' 
                : ''
            ]">
              <p class="sub_button_semibold" :class="selectedWeekDay === day.dateString || (selectedWeekDay === null && day.isToday) 
                ? 'secondary_text_color' 
                : 'primary_text_color'">
                {{ day.dateNumber }} {{ day.dayLabel }}
              </p>
            </div>
          </div>

          <!-- Time Slots - Mobile -->
          <div ref="mobileWeekScrollContainer" class="overflow-auto h-[64vh] hide-scrollbar">
            <div v-for="hour in 24" :key="hour" class="border-b relative min-h-[60px]">
              <div class="flex">
                <!-- Time Label -->
                <div class="w-20 flex-shrink-0 pt-2 px-2 label_2_regular">
                  {{ formatHour(hour === 24 ? 0 : hour - 1) }}
                </div>

                <!-- Posts Column -->
                <div class="flex-1 relative">
                  <!-- Posts for selected day and hour -->
                  <div v-for="post in getPostsForWeekDayAndHourMobile(hour)" :key="post.id" :data-post-id="post.id"
                    :data-post-hour="hour"
                    class="absolute left-1 right-1 rounded-md bg_white shadow-sm primary_border_color secondary_button_thin z-10 max-w-72"
                    :style="{
                    top: `${getPostTopPosition(post.postTime)}px`,
                    height: 'auto',
                    minHeight: '60px',
                    maxHeight: '90px'
                  }">
                    <div class="flex gap-2">
                      <!-- Post Image -->
                      <img :src="post.postImage" :alt="`Post ${post.id}`"
                        class="w-12 h-12 rounded object-cover flex-shrink-0" />

                      <!-- Post Details -->
                      <div class="flex-1 min-w-0">
                        <p class="label_2_semibold primary_text_color">
                          {{ post.title || 'Scheduled Post' }}
                        </p>

                        <!-- Platforms -->
                        <div class="flex items-center gap-2  flex-wrap normal_gap">
                          <img v-for="platform in post.platforms.slice(0, 4)" :key="platform"
                            :src="getPlatformIcon(platform)" :alt="platform" class="w-4 h-4" />
                          <span v-if="post.platforms.length > 4" class="text-xs label_2_medium">
                            +{{ post.platforms.length - 4 }}
                          </span>
                        </div>

                        <!-- Status and Time -->
                        <!-- Status and Time -->
                        <div class="flex items-center gap-4 flex-wrap medium_gap">
                          <!-- Status -->
                          <div :class="[
                      'flex items-center gap-2 label_3_semibold',
                      post.status === 'approved' ? 'approve_text_color' : 'pending_text_color'
                    ]">
                            <img v-if="post.status === 'approved'" :src="ApproveIcon" alt="Approved">
                            <img v-else :src="PendingIcon" alt="Pending">
                            <span>{{ post.status }}</span>
                          </div>

                          <!-- Time -->
                          <div class="flex items-center gap-2 label_3_semibold sub_text_color">
                            <img :src="TimeIcon" alt="">
                            <span>{{ formatTime(post.postTime) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Week View -->
        <div class="hidden md:block">
          <!-- Week Header -->
          <div class="grid border-b bg_primary_color" :class="windowWidth >= 768 ? '' : 'grid-cols-8'"
            :style="windowWidth >= 768 ? { gridTemplateColumns: weekGridTemplate } : {}">
            <div class="border-r"></div>
            <div v-for="day in weekDaysOnly" :key="day.day"
              class="p-3 md:common_inner_gap text-center border-r last:border-r-0"
              :class="day.isToday ? 'secondary_bg_color ' : ''">
              <p class="heading_h5_semibold" :class="day.isToday ? 'secondary_text_color' : ''">
                {{ day.dateNumber }}
              </p>

              <p class="label_3_medium">
                {{ day.dayLabel }}
              </p>
            </div>
          </div>

          <!-- Week Grid with Time Slots and Posts -->
          <div ref="desktopWeekScrollContainer" class="grid overflow-auto h-[47vh] hide-scrollbar"
            :class="windowWidth >= 768 ? '' : 'grid-cols-8'"
            :style="windowWidth >= 768 ? { gridTemplateColumns: weekGridTemplate } : {}">
            <!-- Time Column -->
            <div class="border-r">
              <div v-for="hour in 24" :key="hour" class="h-24 border-b flex items-center pt-2 px-2 label_2_regular">
                {{ formatHour(hour === 24 ? 0 : hour - 1) }}
              </div>
            </div>

            <!-- Day Columns -->
            <div v-for="day in weekDaysOnly" :key="day.day" class="border-r last:border-r-0 relative">
              <div v-for="hour in 24" :key="hour" class="h-24 border-b relative">
                <!-- Posts for this day and hour -->
                <div v-for="post in getPostsForWeekDayAndHour(day.dateString, hour)" :key="post.id"
                  :data-post-id="post.id"
                  class="absolute left-1 right-1 rounded-md bg_white shadow-sm primary_border_color secondary_button_thin z-10"
                  :style="{
                  top: `${getPostTopPosition(post.postTime)}px`,
                  height: 'auto',
                  minHeight: '60px',
                  maxHeight: '90px'
                }">
                  <div class="flex gap-2">
                    <!-- Post Image -->
                    <img :src="post.postImage" :alt="`Post ${post.id}`"
                      class="w-12 h-12 rounded object-cover flex-shrink-0" />

                    <!-- Post Details -->
                    <div class="flex-1 min-w-0">
                      <p class="label_2_semibold primary_text_color">
                        {{ post.title || 'Scheduled Post' }}
                      </p>

                      <!-- Platforms -->
                      <div class="flex items-center gap-2  flex-wrap normal_gap">
                        <img v-for="platform in post.platforms.slice(0, 4)" :key="platform"
                          :src="getPlatformIcon(platform)" :alt="platform" class="w-4 h-4" />
                        <span v-if="post.platforms.length > 4" class="text-xs label_2_medium">
                          +{{ post.platforms.length - 4 }}
                        </span>
                      </div>

                      <!-- Status and Time -->
                      <div class="flex items-center gap-2 label_3_semibold normal_gap">
                        <span :class="[
                          'flex items-center gap-1 ',
                          post.status === 'approved' ? 'approve_text_color' : 'pending_text_color'
                        ]">
                          <img v-if="post.status === 'approved'" :src="ApproveIcon" alt="Approved">
                          <img v-else :src="PendingIcon" alt="Pending">
                          {{ post.status === 'approved' ? 'Approved' : 'Pending' }}
                        </span>
                        <!-- Time -->
                        <span class="flex items-center gap-2 sub_text_color">
                          <img :src="TimeIcon" alt="">
                          {{ formatTime(post.postTime) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- DAY VIEW -->
      <div v-if="activeView === 'Day'" class="rounded-xl bg_white primary_border_color shadow">

        <!-- Day Header -->
        <div class="flex items-center justify-between border-b common_inner_gap">
          <button @click="prevDay"><img :src="CircleLeftArrow" alt=""></button>

          <p class="heading_h6_semibold primary_text_color">
            {{ fullDate }}
          </p>

          <button @click="nextDay"><img :src="CircleRightArrow" alt=""></button>
        </div>



        <div class="mb-6 flex flex-col items-start justify-center border-b secondary_button_thin bg_primary_color">
          <p class="heading_h5_semibold ml-1">
            {{ dayNumber }}
          </p>
          <p class="label_3_medium ml-1">
            {{ dayShort }}
          </p>
        </div>

        <!-- Day Grid with Time Slots and Posts -->
        <div ref="dayViewScrollContainer"
          class="grid grid-cols-[30%_70%] md:grid-cols-[20%_80%] overflow-auto h-[60vh] md:h-[44vh] hide-scrollbar">
          <!-- Time Column -->
          <div>
            <div v-for="hour in 24" :key="hour" class="h-24 border-b flex items-end pt-2 px-2 label_2_regular">
              {{ formatHour(hour === 24 ? 0 : hour - 1) }}
            </div>
          </div>

          <!-- Posts Column -->
          <div class="relative">
            <div v-for="hour in 24" :key="hour" class="h-24 border-b relative">
              <!-- Posts for this day and hour -->
              <div v-for="post in getPostsForDayAndHour(hour)" :key="post.id" :data-post-id="post.id"
                class="absolute left-1 right-1 rounded-md bg_white shadow-sm primary_border_color secondary_button_thin z-10"
                :style="{
            top: `${getPostTopPosition(post.postTime)}px`,
            height: 'auto',
            minHeight: '60px',
            maxHeight: '90px'
          }">
                <div class="flex gap-2">
                  <!-- Post Image -->
                  <img :src="post.postImage" :alt="`Post ${post.id}`"
                    class="w-12 h-12 rounded object-cover flex-shrink-0" />

                  <!-- Post Details -->
                  <div class="flex-1 min-w-0">
                    <p class="label_2_semibold primary_text_color">
                      {{ post.title || 'Scheduled Post' }}
                    </p>

                    <!-- Platforms -->
                    <div class="flex items-center gap-1 flex-wrap normal_gap">
                      <img v-for="platform in post.platforms.slice(0, 4)" :key="platform"
                        :src="getPlatformIcon(platform)" :alt="platform" class="w-4 h-4" />
                      <span v-if="post.platforms.length > 4" class="text-xs label_2_medium">
                        +{{ post.platforms.length - 4 }}
                      </span>
                    </div>

                    <!-- Status and Time -->
                    <div class="flex items-center gap-2 label_3_semibold normal_gap">
                      <span :class="[
                    'flex items-center gap-1',
                    post.status === 'approved' ? 'approve_text_color' : 'pending_text_color'
                  ]">
                        <img v-if="post.status === 'approved'" :src="ApproveIcon" alt="Approved">
                        <img v-else :src="PendingIcon" alt="Pending">
                        {{ post.status === 'approved' ? 'Approved' : 'Pending' }}
                      </span>
                      <span class="flex items-center gap-2 sub_text_color">
                        <img :src="TimeIcon" alt="">
                        {{ formatTime(post.postTime) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Social Media Platform Modal -->
    <SocialMediaModal :open="showPlatformModal" :selected-platforms="selectedPost ? selectedPost.platforms : []"
      @close="closePlatformModal" @update:selected-platforms="updatePlatforms" />

    <!-- Scheduler Calendar Modal -->
    <SchedulerCalendarModal :open="showSchedulerModal" :initial-date="schedulerInitialDate"
      :initial-time="schedulerInitialTime" @close="closeSchedulerModal" @schedule="handleSchedule" />

    <!-- Delete Post Confirmation Modal -->
    <DeletePostModal :open="showDeleteModal" @close="closeDeleteModal" @confirm="confirmDeletePost" />

  </main>
</template>

<script setup>
  import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
  import ProductIcon from "../assets/images/ProductIcon.svg"
  import AiIcon from "../assets/images/AiIcon.svg"
  import WhitePlusIcon from "../assets/images/WhitePlusIcon.svg"
  import CircleLeftArrow from "../assets/images/CircleLeftArrow.svg"
  import CircleRightArrow from "../assets/images/CircleRightArrow.svg"
  import DownArrow from "../assets/images/DownArrow.svg"
  import InstagramIcon from "../assets/images/InstagramIcon.svg"
  import FacebookIcon from "../assets/images/FacebookIcon.svg"
  import LinkedInIcon from "../assets/images/LinkedInIcon.svg"
  import TwitterIcon from "../assets/images/TwitterIcon.svg"
  import closeIcon from "../assets/images/closeIcon.svg"
  import PendingIcon from "../assets/images/PendingIcon.svg"
  import ApproveIcon from "../assets/images/ApproveIcon.svg"
  import TimeIcon from "../assets/images/TimeIcon.svg"
  import BackButtonArrow from "../assets/images/BackButtonArrow.svg"
  import PostFilter from "../assets/images/PostFilter.svg"
  import ImageEditIcon from "../assets/images/ImageEditIcon.svg"
  import DotsIcon from "../assets/images/DotsIcon.svg"
  import SaveIcon from "../assets/images/SaveIcon.svg"
  import SocialMediaModal from "../components/Calendar/SocialMediaModal.vue"
  import SchedulerCalendarModal from "../components/Calendar/SchedulerCalendarModal.vue"
  import TogglePostModal from "../components/Calendar/TogglePostModal.vue"
  import DeletePostModal from "../components/Calendar/DeletePostModal.vue"
  import TikTokIcon from "../assets/images/TikTokIcon.svg"
  import YoutubeIcon from "../assets/images/YoutubeIcon.svg"

  const selectedTime = ref(null);
  const selectedDate = ref(null);
  const selectedPost = ref(null); // Selected post for detail view
  const selectedWeekDay = ref(null); // For mobile week view
  const mobileWeekScrollContainer = ref(null); // Ref for mobile week scroll container
  const desktopWeekScrollContainer = ref(null); // Ref for desktop week scroll container
  const dayViewScrollContainer = ref(null); // Ref for day view scroll container
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const showPlatformModal = ref(false); // State for platform modal
  const showSchedulerModal = ref(false); // State for scheduler modal
  const schedulerInitialDate = ref(null); // Initial date for scheduler
  const schedulerInitialTime = ref(null); // Initial time for scheduler
  const originalPost = ref(null); // Store original post data to track changes
  const hasUnsavedChanges = ref(false); // Track if there are unsaved changes
  const showPostMenu = ref(false); // State for post actions dropdown menu
  const dotsButtonRef = ref(null); // Ref for dots button (desktop)
  const dotsButtonRefMobile = ref(null); // Ref for dots button (mobile)
  const togglePostModalRef = ref(null); // Ref for dropdown modal (desktop)
  const togglePostModalRefMobile = ref(null); // Ref for dropdown modal (mobile)
  const showDeleteModal = ref(false); // State for delete confirmation modal

  // Update window width on resize
  const handleResize = () => {
    windowWidth.value = window.innerWidth;
  };

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      // Use document for better mobile support
      document.addEventListener('click', handleClickOutside, true);
      document.addEventListener('touchend', handleClickOutside, true);
      windowWidth.value = window.innerWidth;
    }
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('touchend', handleClickOutside, true);
    }
  });

  /* Views */
  const views = ["Day", "Week", "Month"];
  const activeView = ref("Month");

  /* Scheduled Posts Data Structure */
  const scheduledPosts = ref([
    {
      id: 1,
      postDate: "2026-01-01",
      postTime: "09:00",
      platforms: ["instagram", "facebook"],
      postImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
      status: "approved",
      title: "New Year Post",
      caption: "New Year Post! Don't miss your chance to grab your favorites at exclusive prices. #NewYear #LimitedOffer #ShopSmart",
      postType: "Instagram post (4:5)"
    },
    {
      id: 2,
      postDate: "2026-01-30",
      postTime: "10:30",
      platforms: ["instagram", "linkedin", "facebook"],
      postImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop",
      status: "pending",
      title: "Product Launch",
      caption: "Product Launch! Don't miss your chance to grab your favorites at exclusive prices. #ProductLaunch #LimitedOffer #ShopSmart",
      postType: "Instagram post (4:5)"
    },
    {
      id: 3,
      postDate: "2026-01-16",
      postTime: "10:00",
      platforms: ["instagram", "facebook", "twitter", "linkedin"],
      postImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
      status: "approved",
      title: "Big sale this weekend",
      caption: "Big Sale this weekend! Don't miss your chance to grab your favorites at exclusive prices. #WeekendSale #LimitedOffer #ShopSmart",
      postType: "Instagram post (4:5)"
    },
    {
      id: 4,
      postDate: "2026-02-16",
      postTime: "14:00",
      platforms: ["instagram", "twitter"],
      postImage: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=200&h=200&fit=crop",
      status: "approved",
      title: "Weekend Special",
      caption: "Weekend Special! Don't miss your chance to grab your favorites at exclusive prices. #WeekendSale #LimitedOffer #ShopSmart",
      postType: "Instagram post (4:5)"
    }
  ]);



  /* Selected Product */
  const selectedProduct = ref("all");

  /* Date State */
  const currentDate = ref(new Date()); // Current date

  /* Helpers */
  const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  /* Month Label */
  const monthYear = computed(() =>
    currentDate.value.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  );

  /* Month Navigation */
  const prevMonth = () => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1
    );
  };

  const nextMonth = () => {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1
    );
  };





  // week navigation
  const prevWeek = () => {
    const d = new Date(currentDate.value);
    d.setDate(d.getDate() - 7);
    currentDate.value = d;
    selectedWeekDay.value = null; // Reset to show today's posts
  };

  const nextWeek = () => {
    const d = new Date(currentDate.value);
    d.setDate(d.getDate() + 7);
    currentDate.value = d;
    selectedWeekDay.value = null; // Reset to show today's posts
  };


  const weekDaysOnly = computed(() => {
    const start = new Date(currentDate.value);
    start.setDate(start.getDate() - start.getDay()); // start from Sunday

    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      const today = new Date();
      const dateString = formatDateToString(date);

      return {
        day: date.toDateString(), // unique key
        dateNumber: date.getDate(), // 16
        dayLabel: date.toLocaleDateString("en-US", { weekday: "short" }), // Thu
        dateLabel: date.getDate(), // if you want only number
        fullDate: new Date(date), // Full date object for matching
        dateString: dateString, // YYYY-MM-DD format
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
        hasPosts: dayHasPosts(dateString), // Check if day has posts
      };
    });
  });

  // Computed grid template for week view (wider columns for days with posts on md/lg)
  const weekGridTemplate = computed(() => {
    // Base column widths: time column + 7 day columns
    // On md/lg: make columns with posts wider (2x), others normal (1x)
    const timeCol = '80px'; // Fixed width for time column
    const normalCol = 'minmax(0, 1fr)';
    const wideCol = 'minmax(0, 2.2fr)'; // Wider for columns with posts

    const dayCols = weekDaysOnly.value.map(day =>
      day.hasPosts ? wideCol : normalCol
    ).join(' ');

    return `${timeCol} ${dayCols}`;
  });



  // day nagigation

  /* Previous Day */
  const prevDay = () => {
    const date = new Date(currentDate.value);
    date.setDate(date.getDate() - 1);
    currentDate.value = date;
  };

  /* Next Day */
  const nextDay = () => {
    const date = new Date(currentDate.value);
    date.setDate(date.getDate() + 1);
    currentDate.value = date;
  };

  /* Full Date Label */
  const fullDate = computed(() =>
    currentDate.value.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  );

  const dayNumber = computed(() =>
    currentDate.value.getDate()
  );

  const dayShort = computed(() =>
    currentDate.value.toLocaleDateString("en-US", {
      weekday: "short",
    })
  );


  /* Calendar Grid */
  const calendarDays = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();

    const firstDay = new Date(year, month, 1);
    const dayOfWeek = firstDay.getDay();
    const diff = (dayOfWeek + 6) % 7; // days to go back to Monday
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - diff);

    const days = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      const isToday =
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();

      const isCurrentMonth = d.getMonth() === month;

      days.push({
        key: i,
        day: d.getDate(),
        isToday,
        isCurrentMonth,
        fullDate: new Date(d),
      });
    }

    return days;
  });

  /* Week View */
  const currentWeek = computed(() => {
    const start = new Date(currentDate.value);
    const day = start.getDay();
    const diff = start.getDate() - (day === 0 ? 6 : day - 1);
    start.setDate(diff);

    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      return {
        label: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
        date: date.toLocaleDateString(),
      };
    });
  });



  /* Format Hour */
  const formatHour = (hour) => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h}:00 ${ampm}`;
  };


  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
  ];



  const clearPopup = () => {
    selectedDate.value = null;
    selectedTime.value = null;
  };

  /* Helper Functions for Posts */

  // Format date to YYYY-MM-DD
  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if a date is today or in the future
  const isDateTodayOrFuture = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate >= today;
  };

  // Get posts for a specific date (all posts, used for counting)
  const getPostsForDate = (date) => {
    const dateString = formatDateToString(date);
    return scheduledPosts.value.filter(post => post.postDate === dateString);
  };

  // Check if a day has posts (for week view column width)
  const dayHasPosts = (dateString) => {
    return scheduledPosts.value.some(post => {
      if (post.postDate !== dateString) return false;
      return isDateTodayOrFuture(new Date(post.postDate));
    });
  };

  // Get posts for a specific date (only today and future posts)
  const getActivePostsForDate = (date) => {
    const dateString = formatDateToString(date);
    return scheduledPosts.value.filter(post => {
      if (post.postDate !== dateString) return false;
      return isDateTodayOrFuture(new Date(post.postDate));
    });
  };

  // Get posts for a specific week day and hour slot (only today and future posts)
  const getPostsForWeekDayAndHour = (dayDateString, hour) => {
    const dateString = dayDateString; // Already in YYYY-MM-DD format

    // hour from loop is 1-24, where 1 = 0:00 (midnight), 2 = 1:00, ..., 24 = 23:00
    // Convert to 0-23 for matching with post times
    const hour24 = hour === 24 ? 23 : hour - 1;

    return scheduledPosts.value.filter(post => {
      if (post.postDate !== dateString) return false;
      if (!isDateTodayOrFuture(new Date(post.postDate))) return false;

      const [postHour] = post.postTime.split(':').map(Number);
      // Show post in the hour slot that matches its hour (e.g., 10:00 and 10:30 both in 10 AM slot)
      return postHour === hour24;
    });
  };

  // Get posts for mobile week view - uses selected day or today
  const getPostsForWeekDayAndHourMobile = (hour) => {
    // Use selected day, or find today's date string if none selected
    let dateString;
    if (selectedWeekDay.value) {
      dateString = selectedWeekDay.value;
    } else {
      const today = new Date();
      dateString = formatDateToString(today);
    }

    // hour from loop is 1-24, where 1 = 0:00 (midnight), 2 = 1:00, ..., 24 = 23:00
    // Convert to 0-23 for matching with post times
    const hour24 = hour === 24 ? 23 : hour - 1;

    return scheduledPosts.value.filter(post => {
      if (post.postDate !== dateString) return false;
      if (!isDateTodayOrFuture(new Date(post.postDate))) return false;

      const [postHour] = post.postTime.split(':').map(Number);
      // Show post in the hour slot that matches its hour (e.g., 10:00 and 10:30 both in 10 AM slot)
      return postHour === hour24;
    });
  };

  // Helper function to scroll to first post in a container
  const scrollToFirstPost = async (container, dateString) => {
    await nextTick();

    if (!container) return;

    const dayPosts = scheduledPosts.value.filter(post => {
      if (post.postDate !== dateString) return false;
      return isDateTodayOrFuture(new Date(post.postDate));
    });

    if (dayPosts.length === 0) return;

    // Sort by time and get the first post
    dayPosts.sort((a, b) => {
      const [aHour, aMin] = a.postTime.split(':').map(Number);
      const [bHour, bMin] = b.postTime.split(':').map(Number);
      return aHour * 60 + aMin - (bHour * 60 + bMin);
    });

    const firstPostId = dayPosts[0].id;

    // Find the first post element by ID
    const firstPostElement = container.querySelector(`[data-post-id="${firstPostId}"]`);

    if (firstPostElement) {
      // Scroll to the first post with smooth behavior
      firstPostElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  // Watch for selectedWeekDay changes and scroll to first post (Mobile Week View)
  watch(selectedWeekDay, async () => {
    if (activeView.value !== 'Week') return;

    let dateString;
    if (selectedWeekDay.value) {
      dateString = selectedWeekDay.value;
    } else {
      const today = new Date();
      dateString = formatDateToString(today);
    }

    await scrollToFirstPost(mobileWeekScrollContainer.value, dateString);
  });

  // Helper function to scroll to first post in desktop week view (across all days in week)
  const scrollToFirstPostInWeek = async (container) => {
    await nextTick();

    if (!container) return;

    // Get all dates in the current week
    const weekDates = weekDaysOnly.value.map(day => day.dateString);

    // Get all posts for the week
    const weekPosts = scheduledPosts.value.filter(post => {
      if (!weekDates.includes(post.postDate)) return false;
      return isDateTodayOrFuture(new Date(post.postDate));
    });

    if (weekPosts.length === 0) return;

    // Sort by date and time to get the first post
    weekPosts.sort((a, b) => {
      const [aHour, aMin] = a.postTime.split(':').map(Number);
      const [bHour, bMin] = b.postTime.split(':').map(Number);
      const aTime = aHour * 60 + aMin;
      const bTime = bHour * 60 + bMin;

      // First compare by date, then by time
      if (a.postDate !== b.postDate) {
        return a.postDate.localeCompare(b.postDate);
      }
      return aTime - bTime;
    });

    const firstPostId = weekPosts[0].id;

    // Find the first post element by ID
    const firstPostElement = container.querySelector(`[data-post-id="${firstPostId}"]`);

    if (firstPostElement) {
      // Scroll to the first post with smooth behavior
      firstPostElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  // Watch for currentDate changes in Week view and scroll to first post (Desktop Week View)
  watch([currentDate, activeView], async ([newDate, view]) => {
    if (view !== 'Week') return;
    if (!desktopWeekScrollContainer.value) return;

    await scrollToFirstPostInWeek(desktopWeekScrollContainer.value);
  }, { immediate: true });

  // Watch for currentDate changes in Day view and scroll to first post
  watch([currentDate, activeView], async ([newDate, view]) => {
    if (view !== 'Day') return;
    if (!dayViewScrollContainer.value) return;

    const dateString = formatDateToString(newDate);

    await scrollToFirstPost(dayViewScrollContainer.value, dateString);
  }, { immediate: true });

  // Watch for activeView changes to scroll when initially switching to Week or Day tab
  watch(activeView, async (newView) => {
    // Wait for DOM to be ready
    await nextTick();

    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(async () => {
      await nextTick();

      if (newView === 'Week') {
        // Desktop Week View
        if (desktopWeekScrollContainer.value) {
          await scrollToFirstPostInWeek(desktopWeekScrollContainer.value);
        }
        // Mobile Week View - scroll to today's first post
        if (mobileWeekScrollContainer.value) {
          const today = new Date();
          const dateString = formatDateToString(today);
          await scrollToFirstPost(mobileWeekScrollContainer.value, dateString);
        }
      } else if (newView === 'Day') {
        if (dayViewScrollContainer.value) {
          const dateString = formatDateToString(currentDate.value);
          await scrollToFirstPost(dayViewScrollContainer.value, dateString);
        }
      }
    });
  });

  // Get posts for the current day and hour slot (Day view) - only today and future posts
  const getPostsForDayAndHour = (hour) => {
    const dateString = formatDateToString(currentDate.value);

    // hour from loop is 1-24, where 1 = 0:00 (midnight), 2 = 1:00, ..., 24 = 23:00
    // Convert to 0-23 for matching with post times
    const hour24 = hour === 24 ? 23 : hour - 1;

    return scheduledPosts.value.filter(post => {
      if (post.postDate !== dateString) return false;
      if (!isDateTodayOrFuture(new Date(post.postDate))) return false;

      const [postHour] = post.postTime.split(':').map(Number);
      // Show post in the hour slot that matches its hour (e.g., 10:00 and 10:30 both in 10 AM slot)
      return postHour === hour24;
    });
  };

  // Get top position for post in hour slot based on minutes
  const getPostTopPosition = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const hourStartMinutes = Math.floor(totalMinutes / 60) * 60;
    const minutesOffset = totalMinutes - hourStartMinutes;

    // Each hour slot is 96px (h-24 = 6rem = 96px)
    // Calculate position based on minutes
    return (minutesOffset / 60) * 96;
  };

  // Format time from HH:mm to readable format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const h = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    const m = minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : '';
    return `${h}${m} ${ampm}`;
  };

  // Format selected date for modal header
  const formatSelectedDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get platform icon
  const getPlatformIcon = (platform) => {
    const platformMap = {
      instagram: InstagramIcon,
      facebook: FacebookIcon,
      linkedin: LinkedInIcon,
      twitter: TwitterIcon,
      tiktok: TikTokIcon,
      youtube: YoutubeIcon,
    };
    return platformMap[platform.toLowerCase()] || InstagramIcon;
  };

  // Check if date is selected
  const isDateSelected = (date) => {
    if (!selectedDate.value) return false;
    return formatDateToString(date) === formatDateToString(selectedDate.value);
  };

  // Open date modal
  const openDateModal = (date) => {
    selectedPost.value = null;
    selectedDate.value = date;
  };

  // Close date modal
  const closeDateModal = () => {
    selectedDate.value = null;
    selectedPost.value = null;
  };

  // Open post detail view
  const openPostDetail = (post) => {
    selectedPost.value = { ...post }; // Create a copy to avoid direct mutation
    originalPost.value = { ...post }; // Store original for comparison
    hasUnsavedChanges.value = false; // Reset changes flag
  };

  // Close post detail view
  const closePostDetail = () => {
    selectedPost.value = null;
    originalPost.value = null;
    hasUnsavedChanges.value = false;
  };

  // Format scheduled time for detail view
  const formatScheduledTime = (post, clickable = false) => {
    if (!post) return '';
    const date = new Date(post.postDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    let dateLabel = '';
    if (isToday) {
      dateLabel = 'Today';
    } else if (isTomorrow) {
      dateLabel = 'Tomorrow';
    } else {
      dateLabel = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    const timeDisplay = formatTime(post.postTime);

    return `<span class="label_2_medium sub_text_color">Scheduled for </span><span class="body_3_medium primary_text_color cursor-pointer"  data-time-clickable="true"> ${dateLabel} <span class="inline-block w-[1px] h-4 mx-1 xl:mx-2 bg-gray-400 align-middle"></span>${timeDisplay}</span>`;
  };

  // Platform modal handlers
  const openPlatformModal = () => {
    if (selectedPost.value) {
      showPlatformModal.value = true;
    }
  };

  const closePlatformModal = () => {
    showPlatformModal.value = false;
  };

  const updatePlatforms = (platforms) => {
    if (selectedPost.value) {
      // Only update the local copy, not the main calendar
      selectedPost.value.platforms = platforms;
      // Check if platforms have changed
      checkForChanges();
    }
  };

  // Scheduler modal handlers
  const openSchedulerModal = (post) => {
    if (post) {
      const date = new Date(post.postDate);
      schedulerInitialDate.value = date;
      schedulerInitialTime.value = post.postTime;
      showSchedulerModal.value = true;
    }
  };

  const closeSchedulerModal = () => {
    showSchedulerModal.value = false;
  };

  const handleSchedule = (scheduleData) => {
    if (selectedPost.value) {
      // Only update the local copy, not the main calendar
      const newDate = scheduleData.date;
      const newTime = scheduleData.time;

      selectedPost.value.postDate = formatDateToString(newDate);
      selectedPost.value.postTime = newTime;

      // Check if schedule has changed
      checkForChanges();
    }
  };

  // Handle click on time in scheduled time display
  const handleTimeClick = (event) => {
    if (event.target.dataset.timeClickable === 'true' && selectedPost.value) {
      openSchedulerModal(selectedPost.value);
    }
  };

  // Toggle post actions menu
  const togglePostMenu = () => {
    showPostMenu.value = !showPostMenu.value;
  };

  // Close post menu when clicking outside
  const handleClickOutside = (event) => {
    if (!showPostMenu.value) return;

    const target = event.target;

    // Check if click is inside the dots button
    const isClickOnDotsButton =
      (dotsButtonRef.value && dotsButtonRef.value.contains(target)) ||
      (dotsButtonRefMobile.value && dotsButtonRefMobile.value.contains(target));

    if (isClickOnDotsButton) {
      return; // Don't close if clicking the button
    }

    // Check if click is inside the dropdown menu using refs
    let isClickInDropdown = false;

    // Check desktop dropdown
    if (togglePostModalRef.value && togglePostModalRef.value.dropdownRef) {
      try {
        isClickInDropdown = togglePostModalRef.value.dropdownRef.contains(target);
      } catch (e) {
        // Ref might not be ready yet
      }
    }

    // Check mobile dropdown
    if (!isClickInDropdown && togglePostModalRefMobile.value && togglePostModalRefMobile.value.dropdownRef) {
      try {
        isClickInDropdown = togglePostModalRefMobile.value.dropdownRef.contains(target);
      } catch (e) {
        // Ref might not be ready yet
      }
    }

    // Fallback: check by class name or data attribute
    if (!isClickInDropdown) {
      const dropdownElement = target.closest('.post-dropdown-menu') ||
        target.closest('[class*="bottom-full"]') ||
        target.closest('.bg_white.rounded-xl.shadow-2xl');
      isClickInDropdown = dropdownElement !== null;
    }

    // Close if click is outside both button and dropdown
    if (!isClickInDropdown) {
      showPostMenu.value = false;
    }
  };

  // Handle Share Now action
  const handleShareNow = () => {
    if (selectedPost.value) {
      console.log('Share Now:', selectedPost.value);
      // TODO: Implement share functionality
      showPostMenu.value = false;
    }
  };

  // Handle Regenerate Post action
  const handleRegeneratePost = () => {
    if (selectedPost.value) {
      console.log('Regenerate Post:', selectedPost.value);
      // TODO: Implement regenerate functionality
      showPostMenu.value = false;
    }
  };

  // Handle Delete Post action
  const handleDeletePost = () => {
    if (selectedPost.value) {
      showDeleteModal.value = true;
      showPostMenu.value = false;
    }
  };

  // Confirm delete action
  const confirmDeletePost = () => {
    if (selectedPost.value) {
      const postIndex = scheduledPosts.value.findIndex(p => p.id === selectedPost.value.id);
      if (postIndex !== -1) {
        scheduledPosts.value.splice(postIndex, 1);
      }
      selectedPost.value = null;
      showDeleteModal.value = false;
    }
  };

  // Close delete modal
  const closeDeleteModal = () => {
    showDeleteModal.value = false;
  };

  // Check if there are unsaved changes
  const checkForChanges = () => {
    if (!selectedPost.value || !originalPost.value) {
      hasUnsavedChanges.value = false;
      return;
    }

    // Check if platforms changed
    const platformsChanged = JSON.stringify(selectedPost.value.platforms.sort()) !==
      JSON.stringify(originalPost.value.platforms.sort());

    // Check if date changed
    const dateChanged = selectedPost.value.postDate !== originalPost.value.postDate;

    // Check if time changed
    const timeChanged = selectedPost.value.postTime !== originalPost.value.postTime;

    // Check if other fields changed (caption, postType, etc.)
    const otherFieldsChanged =
      selectedPost.value.caption !== originalPost.value.caption ||
      selectedPost.value.postType !== originalPost.value.postType;

    hasUnsavedChanges.value = platformsChanged || dateChanged || timeChanged || otherFieldsChanged;
  };

  // Save post changes to main calendar
  const savePostChanges = () => {
    if (!selectedPost.value || !hasUnsavedChanges.value) return;

    // Find and update the original post in scheduledPosts
    const postIndex = scheduledPosts.value.findIndex(p => p.id === selectedPost.value.id);
    if (postIndex !== -1) {
      // Update all fields
      scheduledPosts.value[postIndex] = {
        ...scheduledPosts.value[postIndex],
        platforms: [...selectedPost.value.platforms],
        postDate: selectedPost.value.postDate,
        postTime: selectedPost.value.postTime,
        caption: selectedPost.value.caption,
        postType: selectedPost.value.postType,
      };
    }

    // Update originalPost to match current state
    originalPost.value = { ...selectedPost.value };
    hasUnsavedChanges.value = false;
  };

  // Watch for changes in selectedPost fields
  watch(() => selectedPost.value?.caption, () => {
    if (selectedPost.value) {
      checkForChanges();
    }
  });

  watch(() => selectedPost.value?.postType, () => {
    if (selectedPost.value) {
      checkForChanges();
    }
  });



</script>