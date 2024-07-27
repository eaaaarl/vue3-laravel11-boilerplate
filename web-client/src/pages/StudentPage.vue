<script setup lang="ts">
import ContentHeader from "@/components/ContentHeader.vue";
import { RouterLink } from "vue-router";
import { useStudentStore } from "@/store/Student";
import { nextTick, ref, watch } from "vue";
import { formatDate } from "@/libs/dateHelpers";
import { useMisc } from "@/composables/misc";
import { useToast } from "vue-toastification";
import StudentPrint from "./Print/StudentPrint.vue";

const studentStore = useStudentStore();
const toast = useToast();
const { debounce } = useMisc();
const currentPage = ref(1);
const itemsPerPage = ref(5);
const totalItems = ref(0);
const searchQuery = ref("");
const isLoading = ref(false);

const paginateList = async (page: number) => {
  isLoading.value = true;
  const payload = {
    search: searchQuery.value,
    page,
    per_page: itemsPerPage.value,
  };
  try {
    const response = await studentStore.list(payload);
    if (response.data.data.length === 0) {
      toast.info("No data found for the given search criteria.");
    }
    totalItems.value = studentStore.totalItems;
    return response.data.data;
  } finally {
    isLoading.value = false;
  }
};

const onItemsPerPageChange = async () => {
  currentPage.value = 1;
  await paginateList(currentPage.value);
};

watch(
  () => currentPage.value,
  (newPage) => {
    paginateList(newPage);
  }
);

watch(
  () => searchQuery.value,
  debounce({
    fn: () => {
      currentPage.value = 1;
      paginateList(currentPage.value);
    },
    delay: 300,
  })
);

const deleteButton = async (id: number) => {
  isLoading.value = true;
  try {
    const response = await studentStore.delete(id);
    if (response.success) {
      toast.success("Student Successfully Deleted.");
      const updatedList = await paginateList(currentPage.value);
      if (updatedList.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1;
        await paginateList(currentPage.value);
      }
    }
  } finally {
    isLoading.value = false;
  }
};

const printButton = async () => {
  await nextTick();
  window.print();
};

paginateList(currentPage.value);
</script>
<template>
  <ContentHeader title="Student" />
  <div class="container-fluid">
    <div class="card card-outline card-dark">
      <div class="card-header d-flex justify-content-between">
        <RouterLink
          :to="{
            name: 'student-form-page',
            params: {
              operation: 'new',
            },
          }"
          class="btn btn-dark"
        >
          Create Student
        </RouterLink>
        <button
          :disabled="isLoading"
          @click="printButton"
          class="btn btn-success ml-auto"
        >
          Print
        </button>
      </div>
      <div class="card-body">
        <template v-if="isLoading">
          <!--  <img src="@/assets/nyan-cat.gif" width="350" alt="nyan-cat" /> -->
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </template>
        <template v-else>
          <div class="d-flex justify-content-between mb-3">
            <div class="form-group" style="max-width: 60px">
              <select
                v-model="itemsPerPage"
                @change="onItemsPerPageChange"
                class="form-control"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
            <div class="form-inline">
              <div class="form-group">
                <label class="text-muted">Search:</label>
                <input
                  type="text"
                  v-model="searchQuery"
                  class="form-control"
                  style="width: 200px"
                />
              </div>
            </div>
          </div>

          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Created_At</th>
                  <th>Updated_At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(students, index) in studentStore.student"
                  :key="index"
                >
                  <td>{{ students.id }}</td>
                  <td>{{ students.name }}</td>
                  <td>
                    <span
                      :class="{
                        'badge badge-success': students.status === 'Active',
                        'badge badge-danger': students.status === 'Inactive',
                      }"
                      >{{ students.status }}</span
                    >
                  </td>
                  <td>
                    {{ formatDate(students.created_at) }}
                  </td>
                  <td>
                    {{ formatDate(students.updated_at) }}
                  </td>
                  <td>
                    <RouterLink
                      :to="{
                        name: 'student-form-page',
                        params: { operation: 'edit' },
                        query: { id: students.id },
                      }"
                      class="btn btn-primary"
                    >
                      Edit
                    </RouterLink>
                    <button
                      @click="deleteButton(students.id)"
                      class="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="pagination">
            <vue-awesome-paginate
              :total-items="totalItems"
              :items-per-page="itemsPerPage"
              :max-pages-shown="5"
              v-model="currentPage"
            />
          </div>
        </template>
      </div>
    </div>
  </div>

  <StudentPrint
    :currentPage="currentPage"
    :itemsPerPage="itemsPerPage"
    :searchQuery="searchQuery"
    :students="studentStore.student"
  />
</template>

<style>
.pagination .pagination-container {
  column-gap: 10px;
}
.pagination .paginate-buttons {
  height: 40px;
  width: 40px;
  border-radius: 20px;
  cursor: pointer;
  background-color: rgb(242, 242, 242);
  border: 1px solid rgb(217, 217, 217);
  color: black;
}
.pagination .paginate-buttons:hover {
  background-color: #d8d8d8;
}
.pagination .active-page {
  background-color: #3498db;
  border: 1px solid #3498db;
  color: white;
}
.pagination .active-page:hover {
  background-color: #2988c8;
}
.pagination .back-button:active,
.pagination .next-button:active {
  background-color: #c4c4c4;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media print {
  .card,
  footer {
    display: none;
  }
}
</style>
