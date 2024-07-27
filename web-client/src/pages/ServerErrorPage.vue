<template>
  <div class="server-error">
    <h1>500 - Server Error</h1>
    <p>Oops! Something went wrong on our end.</p>
    <p>{{ errorMessage }}</p>
    <button @click="goHome">Go to Home Page</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ServerError",
  props: {
    errorMessage: {
      type: String,
      default: "We're working on fixing the problem. Please try again later.",
    },
  },
  setup() {
    const router = useRouter();

    const goHome = () => {
      router.push("/");
    };

    return { goHome };
  },
});
</script>

<style scoped>
.server-error {
  text-align: center;
  padding: 50px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
