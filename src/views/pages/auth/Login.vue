<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'; // Import Vuex store

export default {
    setup() {
        const apiUrl = import.meta.env.VITE_API_URL; // Ambil variabel dari .env
        const username = ref('');
        const password = ref('');
        const checked = ref(false);
        const error = ref('');
        const router = useRouter();
        const store = useStore(); // Get access to Vuex store

        // Method to handle login
        const handleLogin = async () => {
            error.value = ''; // Clear any previous error
            console.log('Starting login process');
            console.log(apiUrl); // Perbaiki dari 'api_url' menjadi 'apiUrl'

            try {
                console.log('Sending credentials:', { username: username.value, password: password.value });

                // Gunakan interpolasi string yang benar untuk URL API
                const response = await axios.post(`${apiUrl}/auth/login`, {
                    username: username.value,
                    password: password.value
                });

                console.log('API Response:', response);

                if (response.data.message === 'Login successful') {
                    console.log('Login successful');

                    // Save token to localStorage for session management
                    localStorage.setItem('authToken', response.data.token);
                    localStorage.setItem('userId', response.data.userId);
                    localStorage.setItem('branch', response.data.branch);

                    // Save authentication status in Vuex
                    store.commit('setAuthenticated', true);

                    // Redirect to dashboard
                    router.push('/dashboard');
                } else {
                    error.value = 'Invalid credentials, please try again.';
                    console.log('Login failed: Invalid credentials');
                }
            } catch (err) {
                error.value = 'Error logging in, please check your credentials or try again later.';
                console.error('Error during login:', err);
            }
        };

        const logout = () => {
            store.dispatch('logout');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('branch');
            router.push({ name: 'login' });
        };

        return {
            username,
            password,
            checked,
            error,
            handleLogin
        };
    }
};
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="/demo/images/logo_circle.png" alt="Logo" class="mx-auto mb-4" style="max-width: 100px" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">CSA HR Expense!</div>
                        <span class="text-muted-color font-medium">Sign in to continue</span>
                    </div>

                    <!-- Error Message -->
                    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

                    <div>
                        <label for="username1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                        <InputText id="username1" type="text" placeholder="Username" class="w-full md:w-[30rem] mb-8" v-model="username" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                        </div>
                        <!-- Button to trigger the login method -->
                        <Button label="Sign In" class="w-full" @click="handleLogin"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
