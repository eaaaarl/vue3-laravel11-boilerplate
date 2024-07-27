import apiClient from "@/libs/api-client";
import { defineStore } from "pinia";

interface ListStudentPayload {
    page?: number;
    search: string | null;
    per_page?: number;
}

interface CreateStudentPayload {
    name: string;
    status: string;
    image?: File | null;
}

export interface UpdateStudentPayload {
    id?: number | null;
    name: string;
    status: string;
    image?: File | null;
    _method?: string | null;
}

interface Student {
    id: number;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export const useStudentStore = defineStore('Student', {
    state: () => ({
        student: [] as Student[],
        currentPage: 1,
        perPage: 5,
        totalPages: 0,
        totalItems: 0
    }),
    actions: {
        async list(payload: ListStudentPayload) {
            try {
                const parameters = apiClient.toURLSearchParams(payload);

                const response = await apiClient.get({
                    route: `students?${parameters}`
                }) as { data: any };

                const { data, current_page, per_page, total, to } = response.data;

                this.student = data;
                this.currentPage = current_page;
                this.totalPages = to;
                this.totalItems = total;
                this.perPage = per_page;
                return await apiClient.toReadableResponse('complete', response);
            } catch (error) {
                return await apiClient.toReadableResponse('error', error);
            }
        },
        async getStudent(id: number) {
            try {
                const response = await apiClient.get({
                    route: `students/${id}`
                });
                return await apiClient.toReadableResponse('complete', response);
            } catch (e) {
                return await apiClient.toReadableResponse('error', e);
            }
        },
        async create(payload: CreateStudentPayload) {
            try {
                const response = await apiClient.post({
                    route: `students`,
                    body: payload,
                    transform: 'form-data'
                });
                return await apiClient.toReadableResponse('complete', response);
            } catch (e) {
                return await apiClient.toReadableResponse('error', e);
            }
        },
        async update(payload: UpdateStudentPayload) {
            try {
                payload['_method'] = 'PUT';
                const response = await apiClient.post({
                    route: `students/${payload.id}`,
                    body: payload,
                    transform: 'form-data'
                });
                return await apiClient.toReadableResponse('complete', response);
            } catch (e) {
                return await apiClient.toReadableResponse('error', e);
            }
        },
        async delete(id: number) {
            try {
                const response = await apiClient.delete({
                    route: `students/${id}`
                });
                return await apiClient.toReadableResponse('complete', response);
            } catch (e) {
                return await apiClient.toReadableResponse('error', e);
            }
        }
    }
});