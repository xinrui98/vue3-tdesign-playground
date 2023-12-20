<template>
  <div class="about">
    <h1>{{ displayText }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import axios from "axios";

export default defineComponent({
  name: "AboutPage",
  setup() {
    const displayText = ref("");

    const callApi = () => {
      const randomNumber = Math.floor(Math.random() * 10) + 1;

      axios
        .get(`https://jsonplaceholder.typicode.com/posts/${randomNumber}`)
        .then((response) => {
          console.log("Fetching API Posts:", response.data);
          displayText.value = JSON.stringify(response.data, null, 2); // Pretty print the JSON
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    onMounted(() => {
      callApi();
    });

    return {
      displayText, // Make sure to return it here
    };
  },
});
</script>
