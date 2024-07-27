import { defineStore } from "pinia";
import apiClient from "@/libs/api-client";

export interface loginAuthPayload {
    email?: string | null;
    password?: string | null;
}

interface User {
    email: string;
    name: string;
}

export interface Response {
    data?: any | null;
}

export const useAuthStore = defineStore('Auth', {
    state: () => ({
        isAuthenticated: false,
        accessToken: null,
        user: null as User | null
    }),

    actions: {
        async istablishAuth({ user, accessToken }: any) {
            this.user = Object.assign({}, user);
            this.accessToken = accessToken;
            this.isAuthenticated = true;
            window.localStorage.setItem('access_token', accessToken);
            window.localStorage.setItem('user', JSON.stringify(user));
        },
        disabledAuth() {
            this.isAuthenticated = false;
        },
        removeAuth() {
            window.localStorage.removeItem('access_token');
            window.localStorage.removeItem('user');
            this.accessToken = null;
            this.user = null;
        },
        async login(payload: loginAuthPayload) {
            try {
                const response = await apiClient.post({
                    route: 'auth/login',
                    body: payload,
                }) as Response;
                const authData = response.data;
                this.istablishAuth({
                    user: authData.user,
                    accessToken: authData.access_token
                });
                return await apiClient.toReadableResponse('complete', response);
            } catch (e) {
                return await apiClient.toReadableResponse('error', e);
            }
        },
        async refresh() {
            try {
                const response = await apiClient.get({
                    route: 'auth/refresh'
                }) as Response;
                const authData = response.data;
                this.istablishAuth({
                    user: authData.user,
                    accessToken: authData.access_token
                });
                return await apiClient.toReadableResponse('complete', response);
            } catch (e) {
                this.removeAuth();
                this.disabledAuth();
                return await apiClient.toReadableResponse('error', e);
            }
        },
        async logout() {
            try {
                const response = await apiClient.get({
                    route: `auth/logout`,
                });
                return await apiClient.toReadableResponse('complete', response);
            } catch (e) {
                return await apiClient.toReadableResponse('error', e);
            }
        },
    }
});