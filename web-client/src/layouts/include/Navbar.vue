<script setup lang="ts">
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = async () => {
  authStore.disabledAuth();
  authStore.removeAuth();
  router.push({ name: "login-page" });
  authStore.logout();
};
</script>

<template>
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"
          ><i class="fas fa-bars"></i
        ></a>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto">
      <div class="btn-group">
        <button
          type="button"
          class="btn btn-secondary dropdown-toggle"
          data-toggle="dropdown"
          aria-expanded="false"
        >
          {{ authStore.user?.name }}
        </button>
        <div class="dropdown-menu dropdown-menu-right">
          <button class="dropdown-item" type="button">
            {{ authStore.user?.email }}
          </button>
          <button class="dropdown-item" type="button">Profile</button>
          <button class="dropdown-item" type="button" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </ul>
  </nav>
</template>
