    <template>
    <form @submit.prevent="addIncome">
        <h3>Add Income</h3>
        <input type="number" v-model="amount" placeholder="Amount" required />
        <input type="text" v-model="category" placeholder="Category" required />
        <input type="date" v-model="date" required />
        <input type="text" v-model="note" placeholder="Note (optional)" />
        <button type="submit">Add</button>
        <p v-if="success">{{ success }}</p>
        <p v-if="error" style="color: red;">{{ error }}</p>
    </form>
    </template>

    <script setup>
    import { addDoc, collection } from 'firebase/firestore'
import { ref } from 'vue'
import { auth, db } from '../firebase'

    const amount = ref('')
    const category = ref('')
    const date = ref('')
    const note = ref('')
    const success = ref('')
    const error = ref('')

    const addIncome = async () => {
    error.value = ''
    success.value = ''
    try {
        const userId = auth.currentUser?.uid
        if (!userId) throw new Error('User not logged in.')

        await addDoc(collection(db, `users/${userId}/transactions`), {
        amount: parseFloat(amount.value),
        category: category.value,
        date: date.value,
        note: note.value,
        type: 'income'
        })

        success.value = 'Income added successfully!'
        amount.value = category.value = date.value = note.value = ''
    } catch (err) {
        error.value = err.message
    }
    }
    </script>
