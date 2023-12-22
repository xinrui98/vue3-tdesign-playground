<template>
  <div>
    <div class="search-container" ref="searchContainer">
      <t-icon name="search" size="35" color="black" />
      <input
        type="text"
        v-model="searchQuery"
        @input="showSearchHistoryMatchingInput"
        @keyup.enter="handleEnter"
        @focus="isDropdownVisible = true"
        class="search-input"
      />
      <ul v-if="isDropdownVisible && searchHistory.length" class="dropdown">
        <li
          class="dropdown-item"
          @click="clearSearch"
          style="background-color: rgb(192, 192, 192)"
        >
          Clear History
        </li>
        <li
          v-for="result in searchHistory"
          :key="result"
          class="dropdown-item"
          @click="selectItem(result)"
        >
          {{ result }}
        </li>
      </ul>
      <t-space>
        <t-dropdown
          :options="options"
          :max-column-width="'100%'"
          trigger="click"
          @click="selectItem"
        >
          <t-space>
            <t-button variant="text">
              Most Frequently Searched IP Addresses
              <template #suffix>
                <t-icon name="chevron-down" size="16" />
              </template>
            </t-button>
          </t-space>
        </t-dropdown>
      </t-space>
      <t-button @click="callApi">调包</t-button>
      <t-button @click="redirectAbout">关于</t-button>
    </div>
    <TableSort :initial-data="tableData" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { LRUCache } from "typescript-lru-cache";
import axios from "axios";
import {
  setLocalStorageWithExpiration,
  getLocalStorageWithExpiration,
  getMinutesUntilTomorrowMidnight,
} from "@/utils/utils";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PersonalInformationIcon } from "tdesign-icons-vue-next";
import TableSort from "@/components/TableSort.vue";

export const cache = ref<LRUCache<string, string>>(
  new LRUCache<string, string>()
);

export default defineComponent({
  name: "HomeView",
  components: { TableSort },
  props: {
    msg: String,
  },
  setup() {
    const searchQuery = ref("");
    const searchHistory = ref<string[]>([]);
    const isDropdownVisible = ref(false);
    const searchContainer = ref<HTMLElement | null>(null);
    const router = useRouter();
    const tableData = new Array(15).fill(null).map((_, i) => ({
      index: i + 1,
      applicant: ["贾明", "xinruixgao", "王芳"][i % 3],
      channel: ["电子签署", "纸质签署", "纸质签署"][i % 3],
      detail: {
        email: [
          "w.cezkdudy@lhll.au",
          "r.nmgw@peurezgn.sl",
          "p.cumx@rampblpa.ru",
        ][i % 3],
      },
      matters: [
        "宣传物料制作费用",
        "algolia 服务报销",
        "相关周边制作费",
        "激励奖品快递费",
      ][i % 4],
      time: [2, 3, 1, 4][i % 4],
      createTime: [
        "2022-01-01",
        "2022-02-01",
        "2022-03-01",
        "2022-04-01",
        "2022-05-01",
      ][i % 4],
    }));

    function redirectAbout() {
      const randomNumber = Math.floor(Math.random() * 10) + 1;
      router.push({ name: "about", params: { id: randomNumber } });
    }
    function callApi() {
      console.log("call API method");
      const posts = getLocalStorageWithExpiration("posts");
      console.log("Cached posts", posts);
      if (posts == null) {
        axios
          .get("https://jsonplaceholder.typicode.com/posts")
          .then((response) => {
            console.log("Fetching API Posts:", response.data);
            setLocalStorageWithExpiration(
              "posts",
              response.data,
              getMinutesUntilTomorrowMidnight()
            );
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }

    const options = [
      {
        content: "hello world 123 ip 127.0.0.1",
        value: 1,
      },
      { content: "操作二", value: 2 },
      { content: "操作三", value: 3 },
      { content: "操作四", value: 4 },
    ];

    function saveCacheToLocalStorage() {
      if (cache.value) {
        const serializedCache: [string, string][] = [];
        // Convert cache entries to an array and store them in serializedCache
        cache.value.forEach((value: string, key: string) => {
          serializedCache.push([key, value]);
        });
        // Serialize the cache data to a JSON string
        const serializedCacheString = JSON.stringify(serializedCache);
        // Store the serialized cache in local storage
        localStorage.setItem("searchHistory", serializedCacheString);
      }
    }

    const loadCacheFromLocalStorage = () => {
      // Try to load the LRU cache from localStorage
      const localStorageCachedData = localStorage.getItem("searchHistory");
      if (localStorageCachedData) {
        // Parse the stored data as an array of key-value pairs
        const cachedEntries: [string, string][] = JSON.parse(
          localStorageCachedData
        );
        // Create a new LRUCache instance
        const tempCache = new LRUCache<string, string>();
        // Populate the new LRUCache with the cached entries
        cachedEntries.forEach(([key, value]) => {
          tempCache.set(key, value);
        });
        // Update the cache ref with the new cache
        cache.value = tempCache;
      }
    };

    function populateSearchHistory() {
      const tempSearchHistory: string[] = [];
      cache.value.forEach((value, key) => {
        tempSearchHistory.unshift(key);
      });
      searchHistory.value = tempSearchHistory;
    }

    const showSearchHistoryMatchingInput = () => {
      const query = searchQuery.value.toLowerCase(); // Convert the input to lowercase for case-insensitive matching
      searchHistory.value = Array.from(cache.value.keys()).filter((key) =>
        key.toLowerCase().includes(query)
      );
    };

    const clearSearch = () => {
      searchQuery.value = "";
      searchHistory.value = [];
      cache.value.clear();
      saveCacheToLocalStorage();
    };

    const selectItem = (result: any) => {
      if (result.content) {
        searchQuery.value = result.content;
      } else {
        searchQuery.value = result;
      }
      isDropdownVisible.value = false;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainer.value) {
        console.log("searchContainer exists");
        if (!searchContainer.value.contains(event.target as Node)) {
          console.log("Click outside searchContainer detected");
          isDropdownVisible.value = false;
        }
      }
    };

    const handleEnter = () => {
      console.log("handleEnter");
      isDropdownVisible.value = false;
      if (searchQuery.value) {
        cache.value.set(searchQuery.value, searchQuery.value);
        saveCacheToLocalStorage();
      }
    };

    onMounted(() => {
      loadCacheFromLocalStorage();
      populateSearchHistory();
      document.addEventListener("click", handleClickOutside);
    });
    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      searchQuery,
      searchHistory,
      isDropdownVisible,
      searchContainer,
      tableData,
      showSearchHistoryMatchingInput,
      clearSearch,
      selectItem,
      handleEnter,
      options,
      callApi,
      redirectAbout,
    };
  },
});
</script>

<style>
.search-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  //max-width: 600px; width: 100%;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

.search-icon {
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.dropdown {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #ddd;
  position: absolute;
  top: 100%; /* Position the dropdown right below the search bar */
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  z-index: 1000;
}

.dropdown-item {
  padding: 10px;
  border-bottom: 1px solid #ddd; /* Border between items */
  cursor: pointer;
  text-align: left;
}

.dropdown-item:last-child {
  border-bottom: none; /* Remove border for the last item */
}

.dropdown-item:hover {
  background-color: #f5f5f5; /* Hover effect */
}
</style>
