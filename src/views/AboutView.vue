<template>
  <div class="about">
    <h1>{{ displayText }}</h1>
    <t-button @click="redirectHome">
      <template #icon><home-icon /></template>
    </t-button>
    <t-button @click="refreshPage">
      <template #icon><refresh-icon /></template>
    </t-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { HomeIcon, RefreshIcon } from "tdesign-icons-vue-next";
import {
  getLocalStorageWithExpiration,
  getMinutesUntilTomorrowMidnight,
  setLocalStorageWithExpiration,
} from "@/utils/utils";

export default defineComponent({
  name: "AboutPage",
  components: {
    HomeIcon, // Register HomeIcon here
    RefreshIcon,
  },
  setup() {
    const displayText = ref("");
    const route = useRoute();
    const router = useRouter();

    function callApi() {
      const randomNumber = Math.floor(Math.random() * 10) + 1;
      axios
        .get(`https://jsonplaceholder.typicode.com/posts/${route.params.id}`)
        .then((response) => {
          console.log("Fetching API Posts:", response.data);
          displayText.value = JSON.stringify(response.data, null, 2); // Pretty print the JSON
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    function redirectHome() {
      router.push({ name: "home" });
    }

    function refreshPage() {
      const randomNumber = Math.floor(Math.random() * 10) + 1;
      router.push({ name: "about", params: { id: randomNumber } });
    }

    onMounted(() => {
      callApi();
    });

    // Watch for changes in the route parameter 'id'
    watch(
      () => route.params.id,
      () => {
        callApi();
      }
    );

    return {
      displayText,
      redirectHome,
      refreshPage,
    };
  },
});
</script>
