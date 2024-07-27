<script setup lang="ts">
import { useAuthStore } from "@/store/Auth";
import { ref } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const defaultForm = {
  email: null,
  password: null,
};
const toast = useToast();
const authStore = useAuthStore();
const loading = ref(false);
const router = useRouter();

const form = ref(Object.assign({}, defaultForm));

const onFormSubmit = async () => {
  loading.value = true;
  const result = await authStore.login(form.value);
  if (result.success) {
    toast.success("Login Successfully.");
    await router.push({ name: "dashboard-page" });
  } else {
    toast.error(result.message);
  }
  loading.value = false;
};
</script>

<template>
  <div class="login-box">
    <div class="card card-outline card-dark">
      <div class="card-header text-center">
        <a href="../../index2.html" class="h1"><b>Admin</b>LTE</a>
      </div>
      <div class="card-body">
        <p class="login-box-msg">Sign in to start your session</p>

        <div class="input-group mb-3">
          <input
            type="email"
            v-model="form.email"
            class="form-control"
            placeholder="Email"
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-envelope"></span>
            </div>
          </div>
        </div>
        <div class="input-group mb-3">
          <input
            type="password"
            v-model="form.password"
            class="form-control"
            placeholder="Password"
          />
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-lock"></span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <button
              type="submit"
              @click="onFormSubmit"
              class="btn btn-dark btn-block"
            >
              <template v-if="loading">
                <span
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </template>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
