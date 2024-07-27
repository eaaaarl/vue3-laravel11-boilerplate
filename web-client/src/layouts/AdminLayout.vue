<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "@/layouts/include/Navbar.vue";
import Sidebar from "@/layouts/include/Sidebar.vue";
import Footer from "@/layouts/include/Footer.vue";
</script>
<template>
  <div class="wrapper">

    <Navbar />

    <Sidebar />

    <div class="content-wrapper">
      <div class="content">
        <RouterView></RouterView>
      </div>
    </div>

    <Footer />
  </div>
</template>
