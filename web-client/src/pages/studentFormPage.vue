<script setup lang="ts">
import ContentHeader from "@/components/ContentHeader.vue";
import { computed, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useStudentStore } from "@/store/Student";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const studentStore = useStudentStore();

const loading = ref(false);
const operation: any = ref(route.params.operation);
const studentID: any = ref(route.query.id);

const formTitle = computed(() => {
  return operation.value === "new" ? "Create New Student" : "Edit Student";
});

const showUpdateButton = computed(() => {
  return operation.value === "edit";
});

const showCreateButton = computed(() => {
  return operation.value === "new";
});

const defaultForm = {
  name: "",
  status: "",
  image: null,
};

const form = ref(Object.assign({}, defaultForm));

const fileInput = ref(null);
const onFileChange = (e: any) => {
  form.value.image = e.target.files[0];
};

const getImageURL = (image: any) => {
  if (!image) return "";
  if (typeof image === "string") {
    return `http://127.0.0.1:8000/storage/images/${image}`;
  } else if (image instanceof File) {
    return URL.createObjectURL(image);
  }
};

const getStudent = async () => {
  const response = await studentStore.getStudent(studentID.value);
  if (response.success) {
    const student = response.data;
    form.value = {
      name: student.name,
      status: student.status,
      image: student.image,
    };
  }
};

const onSubmitForm = async () => {
  loading.value = true;
  try {
    const response = await studentStore.create(form.value);
    if (response.success) {
      toast.success("Student Successfully Created.");
      form.value = {
        name: "",
        status: "",
        image: null,
      };
    } else {
      toast.info(response.message);
    }
  } finally {
    loading.value = false;
  }
};

const onUpdateForm = async () => {
  loading.value = true;
  try {
    const payload: any = {
      ...form.value,
      id: studentID.value,
    };

    const response = await studentStore.update(payload);
    if (response.success) {
      toast.success("Student Successfully Updated.");
      await router.push({ name: "student-page" });
    } else {
      toast.info(response.message);
    }
  } finally {
    loading.value = false;
  }
};

if (operation.value === "edit") {
  getStudent();
}
</script>

<template>
  <ContentHeader :title="formTitle" />
  <div class="container-fluid">
    <div class="card card-outline card-dark">
      <div class="card-header">
        <RouterLink :to="{ name: 'student-page' }" class="btn btn-dark">
          Back
        </RouterLink>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label>Full name</label>
          <input v-model="form.name" type="text" class="form-control" />
          <small class="form-text text-muted">Please enter a valid name</small>
        </div>
        <div class="form-group">
          <img
            v-if="form.image"
            :src="getImageURL(form.image)"
            :alt="form.name"
            width="300"
            class="img-thumbnail img-elevation-2"
          />
        </div>
        <label>Avatar</label>
        <div class="input-group mb-3">
          <div class="custom-file">
            <input
              type="file"
              ref="fileInput"
              @change="onFileChange"
              class="custom-file-input"
            />
            <label class="custom-file-label">Choose file</label>
          </div>
        </div>

        <label>Status</label>
        <div class="form-group mb-3">
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              v-model="form.status"
              value="Active"
            />
            <label class="form-check-label">Active</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              v-model="form.status"
              value="Inactive"
            />
            <label class="form-check-label">Inactive</label>
          </div>
        </div>
        <button
          v-if="showCreateButton"
          :disabled="loading"
          @click="onSubmitForm"
          class="btn btn-primary mt-3"
        >
          <template v-if="loading">
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          </template>
          Submit
        </button>
        <button
          v-if="showUpdateButton"
          :disabled="loading"
          @click="onUpdateForm"
          class="btn btn-info mt-3"
        >
          <template v-if="loading">
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          </template>
          Update
        </button>
      </div>
    </div>
  </div>
</template>
