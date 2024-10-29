import { createStore } from 'vuex';

export default createStore({
    state: {
        isAuthenticated: false,
        token: null
    },
    mutations: {
        setAuthenticated(state, status) {
            state.isAuthenticated = status;
        },
        setToken(state, token) {
            state.token = token;
        },
        clearAuthentication(state) {
            state.isAuthenticated = false;
            state.token = null;
        }
    },
    actions: {
        login({ commit }, token) {
            console.log('Login: Setting token:', token); // Log untuk proses login
            localStorage.setItem('token', token); // Simpan token di localStorage
            commit('setToken', token);
            commit('setAuthenticated', true);
        },
        logout({ commit }) {
            return new Promise((resolve) => {
                console.log('Logout: Removing token from localStorage'); // Log sebelum menghapus token
                localStorage.removeItem('authToken'); // Hapus token dari localStorage
                commit('clearAuthentication');
                console.log('Logout: Token has been removed, and user is unauthenticated'); // Log setelah token dihapus
                resolve(); // Selesaikan Promise
            });
        }
    },
    getters: {
        isAuthenticated(state) {
            return state.isAuthenticated;
        }
    }
});
