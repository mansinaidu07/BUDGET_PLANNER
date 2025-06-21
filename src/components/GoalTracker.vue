    <template>
    <div class="goal-tracker">
        <h3>Savings Goal Tracker</h3>

        <form @submit.prevent="handleSubmit">
        <input type="text" v-model="goal.title" placeholder="Goal Name" required />
        <input type="number" v-model.number="goal.target" placeholder="Target Amount" required />
        <button type="submit">{{ isEditing ? 'Update' : 'Add Goal' }}</button>
        </form>

        <ul v-if="goals.length" class="goal-list">
        <li v-for="item in goals" :key="item.id">
            <div>
            <strong>{{ item.title }}:</strong>
            ₹{{ getProgress(item.target) }} / ₹{{ item.target }}
            <progress :value="getProgress(item.target)" :max="item.target"></progress>
            </div>
            <div class="btns">
            <button @click="editGoal(item)">✏️</button>
            <button @click="deleteGoal(item.id)">🗑️</button>
            </div>
        </li>
        </ul>

        <p v-else>No goals set yet.</p>
    </div>
    </template>

    <script setup>
    import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc
} from 'firebase/firestore'
import { onMounted, ref, watch } from 'vue'
import { auth, db } from '../firebase'

    const props = defineProps(['transactions'])

    const goal = ref({ title: '', target: 0 })
    const goals = ref([])
    const isEditing = ref(false)
    const editId = ref(null)

    const fetchGoals = async () => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const colRef = collection(db, `users/${userId}/goals`)
    const snapshot = await getDocs(colRef)
    goals.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    }

    const handleSubmit = async () => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const colRef = collection(db, `users/${userId}/goals`)

    if (isEditing.value && editId.value) {
        const docRef = doc(db, `users/${userId}/goals/${editId.value}`)
        await updateDoc(docRef, { ...goal.value })
    } else {
        await addDoc(colRef, { ...goal.value })
    }

    goal.value = { title: '', target: 0 }
    isEditing.value = false
    editId.value = null
    fetchGoals()
    }

    const editGoal = (item) => {
    goal.value = { title: item.title, target: item.target }
    isEditing.value = true
    editId.value = item.id
    }

    const deleteGoal = async (id) => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const docRef = doc(db, `users/${userId}/goals/${id}`)
    await deleteDoc(docRef)
    fetchGoals()
    }

    const getProgress = (target) => {
    const totalSaved = props.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)
    return Math.min(totalSaved, target)
    }

    onMounted(fetchGoals)
    watch(() => props.transactions, fetchGoals, { deep: true })
    </script>

    <style scoped>
    .goal-tracker {
    margin-top: 30px;
    padding: 20px;
    background: #1e1e1e;
    color: #fff;
    border-radius: 10px;
    }

    form {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    }

    input {
    padding: 8px;
    border-radius: 6px;
    border: none;
    width: 150px;
    }

    button {
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    background-color: #4caf50;
    color: white;
    cursor: pointer;
    }

    .goal-list {
    list-style: none;
    padding: 0;
    }

    .goal-list li {
    background: #2c2c2c;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    }

    progress {
    width: 100%;
    height: 14px;
    margin-top: 4px;
    }

    .btns button {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: #eee;
    }
    </style>
