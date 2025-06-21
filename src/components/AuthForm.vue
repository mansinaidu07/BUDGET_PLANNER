    <template>
    <div class="auth-wrapper">
        <div class="auth-overlay">
        <div class="auth-container">
            <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>

            <form @submit.prevent="handleSubmit">
            <input type="email" v-model="email" placeholder="Email" required />
            <input type="password" v-model="password" placeholder="Password" required />

            <label class="remember-me">
                <input type="checkbox" v-model="rememberMe" />
                Remember Me
            </label>

            <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
            </form>

            <p class="toggle" @click="toggleMode">
            {{ isLogin ? "Don't have an account? Register" : "Already have an account? Login" }}
            </p>

            <!-- Updated Forgot Password -->
            <p v-if="isLogin" class="forgot-password" @click="handleForgotPassword">
            Forgot Password?
            </p>

            <p class="error" v-if="error">{{ error }}</p>
        </div>
        </div>
    </div>
    </template>

    <script setup>
    import {
    browserLocalPersistence,
    browserSessionPersistence,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail //Import
    ,

    setPersistence,
    signInWithEmailAndPassword
} from 'firebase/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'

    const router = useRouter()

    const email = ref('')
    const password = ref('')
    const isLogin = ref(true)
    const rememberMe = ref(true)
    const error = ref('')

    const toggleMode = () => {
    isLogin.value = !isLogin.value
    error.value = ''
    }

    const handleSubmit = async () => {
    error.value = ''
    try {
        const persistence = rememberMe.value
        ? browserLocalPersistence
        : browserSessionPersistence

        await setPersistence(auth, persistence)

        if (isLogin.value) {
        await signInWithEmailAndPassword(auth, email.value, password.value)
        router.push('/dashboard')
        } else {
        await createUserWithEmailAndPassword(auth, email.value, password.value)
        alert('Registered successfully!')
        isLogin.value = true
        }
    } catch (err) {
        error.value = err.message
    }
    }

    //Forgot password function
    const handleForgotPassword = async () => {
    if (!email.value) {
        error.value = 'Please enter your email to reset password.'
        return
    }
    try {
        await sendPasswordResetEmail(auth, email.value)
        alert('Password reset email sent! Please check your inbox.')
    } catch (err) {
        error.value = err.message
    }
    }
    </script>

    <style scoped>
    .auth-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: url('../assets/login-bg.jpg') no-repeat center center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    }

    .auth-overlay {
    z-index: 1;
    background-color: rgba(9, 8, 8, 0.65);
    padding: 25px 25px;
    border-radius: 12px;
    color: #fff;
    width: 320px;
    }

    .auth-container {
    text-align: center;
    }

    h2 {
    margin-bottom: 20px;
    color: #90caf9;
    }

    input[type='email'],
    input[type='password'] {
    display: block;
    margin: 10px auto;
    padding: 10px;
    width: 100%;
    border-radius: 6px;
    border: none;
    }

    button {
    padding: 10px;
    width: 80%;
    background-color: #90caf9;
    border: none;
    color: #000;
    font-weight: bold;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 10px;
    }

    button:hover {
    background-color: #64b5f6;
    }

    .toggle {
    color: #edf0f2;
    cursor: pointer;
    margin-top: 15px;
    }

    .forgot-password {
    margin-top: 10px;
    color: #ccc;
    font-size: 0.9rem;
    text-decoration: underline;
    cursor: pointer;
    }

    .error {
    color: red;
    margin-top: 10px;
    }

    .remember-me {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-top: 8px;
    gap: 6px;
    color: #ccc;
    }

    @media (min-width: 1200px) {
    .auth-wrapper {
        background-size: 50%;
    }
    }

    input,
    button {
    font-size: 14px;
    }
    </style>
