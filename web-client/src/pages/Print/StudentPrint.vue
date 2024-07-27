<script setup lang="ts">
import { useStudentStore } from "@/store/Student";
import { ref, watch } from "vue";
import { formatDate } from "@/libs/dateHelpers";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: true,
  },
  searchQuery: {
    type: String,
    required: true,
  },
  students: {
    type: Array,
    required: true,
  },
});

const studentStore = useStudentStore();
const students: any = ref([]);

const PrintData = async () => {
  const payload = {
    page: props.currentPage,
    per_page: props.itemsPerPage,
    search: props.searchQuery,
  };
  const response = await studentStore.list(payload);
  students.value = response.data.data;
};

watch(
  () => [props.currentPage, props.itemsPerPage, props.searchQuery],
  (newValues, oldValues, search) => {
    console.log("Changed values:", newValues, oldValues, search);
    PrintData();
  }
);

PrintData();
</script>
<template>
  <div class="printView">
    <div class="d-flex justify-content-between">
      <div></div>
      <div class="text-center">
        <p>Republic of the Philippines</p>
        <h4>North Eastern Mindanao State University</h4>
        <p>LIANGA CAMPUS</p>
        <p>Lianga, Surigao del Sur, 8307</p>
        <p>Website: www.sdssu.edu.gov.ph</p>
      </div>
      <div></div>
    </div>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Name</th>
          <th>Status</th>
          <th>Created_At</th>
          <th>Updated_At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(students, index) in students" :key="index">
          <td>{{ students.id }}</td>
          <td>{{ students.name }}</td>
          <td>{{ students.status }}</td>
          <td>
            {{ formatDate(students.created_at) }}
          </td>
          <td>
            {{ formatDate(students.updated_at) }}
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      Page: {{ currentPage }} | Items per page: {{ itemsPerPage }} | Search:
      {{ searchQuery }}
    </div>
  </div>
</template>

<style>
@media screen {
  .printView {
    display: none;
  }
}
</style>
