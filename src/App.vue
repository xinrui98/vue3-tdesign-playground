<template>
  <t-layout>
    <t-aside>
      <t-menu
        theme="light"
        value="dashboard"
        style="margin-right: 50px"
        height="550px"
      >
        <template #logo>
          <div>
            <img
              class="logo"
              src="https://cdn.worldvectorlogo.com/logos/wechat-logo-1.svg"
              alt="wechat-logo"
            />
            <h1 class="logo-text">WeChat IP 门户</h1>
          </div>
        </template>
        <t-menu-item value="home" @click="redirectHome">
          <template #icon>
            <t-icon name="home" />
          </template>
          Home
        </t-menu-item>
        <t-menu-item value="about" @click="redirectAbout">
          <template #icon>
            <t-icon name="personal-information" />
          </template>
          About
        </t-menu-item>
      </t-menu>
    </t-aside>
    <t-layout>
      <t-content style="background-color: white">
        <!--        <nav>-->
        <!--          <router-link :to="{ name: 'home' }">Home</router-link> |-->
        <!--          <router-link :to="{ name: 'about', params: { id: 1 } }"-->
        <!--            >About</router-link-->
        <!--          >-->
        <!--        </nav>-->
        <router-view class="router-view-margin" />
      </t-content>
    </t-layout>
  </t-layout>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.logo {
  margin-right: 10px; /* Reduced space between the logo and the text */
  width: 50px; /* Set width, you can remove the width attribute from the img tag */
  vertical-align: middle; /* Aligns the image vertically with the text */
}

.logo-text {
  display: inline; /* Makes the h1 inline with the image */
  margin-left: 0; /* Removes any default margin to the left of the h1 */
  vertical-align: middle; /* Aligns the text vertically with the image */
}

.router-view-margin {
  margin-top: 18px; /* Adjust the value to the gap you want */
}
</style>
<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const redirectHome = () => {
  router.push({ name: "home" });
};

const redirectAbout = () => {
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  router.push({ name: "about", params: { id: randomNumber } });
};
</script>
