    <template>
    <div class="dashboard">
        <div class="header">
        <h2>My Budget Dashboard</h2>
        <button class="logout-btn" @click="logout">Logout</button>
        </div>

        <!-- Filters -->
        <div class="filters">
        <select v-model="selectedCategory">
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <select v-model="selectedMonth">
            <option value="">All Months</option>
            <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
        </div>

        <!-- Summary Section -->
        <div class="summary">
        <div class="summary-card income">
            <h3>Total Income</h3>
            <p>₹ {{ totalIncome }}</p>
        </div>
        <div class="summary-card expense">
            <h3>Total Expenses</h3>
            <p>₹ {{ totalExpenses }}</p>
        </div>
        <div class="summary-card net">
            <h3>Net Balance</h3>
            <p>₹ {{ netBalance }}</p>
        </div>
        </div>

        <!-- Forms -->
        <IncomeForm />
        <ExpenseForm />

        <!-- Charts -->
        <ChartDisplay :transactions="filteredTransactions" />
        <BarChart :transactions="filteredTransactions" />

        <!-- Transaction List with Actions -->
        <div class="transaction-list">
        <h3>Transactions</h3>
        <ul>
            <li v-for="(txn, index) in filteredTransactions" :key="index">
            <span>{{ txn.date }} - {{ txn.category }} - ₹{{ txn.amount }}</span>
            <button class="edit-btn" @click="editTransaction(txn)">Edit</button>
            <button class="delete-btn" @click="deleteTransaction(txn)">Delete</button>
            </li>
        </ul>
        </div>

        <!-- Savings Goal Tracker -->
        <GoalTracker :transactions="filteredTransactions" />
    </div>
    </template>

    <script setup>
    import { signOut } from 'firebase/auth'
    import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
    import { computed, onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { auth, db } from '../firebase'

    import BarChart from './BarChart.vue'
    import ChartDisplay from './ChartDisplay.vue'
    import ExpenseForm from './ExpenseForm.vue'
    import GoalTracker from './GoalTracker.vue'
    import IncomeForm from './IncomeForm.vue'

    const transactions = ref([])
    const selectedCategory = ref('')
    const selectedMonth = ref('')
    const categories = ['Food', 'Rent', 'Travel', 'Salary', 'Shopping', 'Misc']
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

    const router = useRouter()
    const logout = async () => {
    await signOut(auth)
    router.push('/login')
    }

    const fetchTransactions = () => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const colRef = collection(db, `users/${userId}/transactions`)
    onSnapshot(colRef, snapshot => {
        transactions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    })
    }

    onMounted(() => {
    fetchTransactions()
    })

    const filteredTransactions = computed(() => {
    return transactions.value.filter(txn => {
        const categoryMatch = selectedCategory.value ? txn.category === selectedCategory.value : true
        const monthMatch = selectedMonth.value ? txn.date?.slice(5, 7) === selectedMonth.value : true
        return categoryMatch && monthMatch
    })
    })

    const totalIncome = computed(() =>
    filteredTransactions.value.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    )

    const totalExpenses = computed(() =>
    filteredTransactions.value.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    )

    const netBalance = computed(() => totalIncome.value - totalExpenses.value)

    const deleteTransaction = async (txn) => {
    const userId = auth.currentUser?.uid
    if (!userId || !txn.id) return
    await deleteDoc(doc(db, `users/${userId}/transactions/${txn.id}`))
    }

    const editTransaction = (txn) => {
    alert(`Edit feature for '${txn.category}' not implemented yet.`)
    }
    </script>

    <style scoped>
    .dashboard {
    max-width: 1100px;
    margin: 40px auto;
    padding: 40px;
    background-color: #615f5f;
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(7, 7, 7, 0.4);
    color: #f0f0f0;
    font-family: 'Segoe UI', sans-serif;
    }

    .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    }

    h2 {
    font-size: 2.5rem;
    color: #90caf9;
    letter-spacing: 1.2px;
    }

    .logout-btn {
    background-color: #e53935;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
    transition: background 0.3s ease;
    }

    .logout-btn:hover {
    background-color: #0e0c0c;
    }

    .filters {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 40px;
    }

    .filters select {
    padding: 12px 18px;
    border-radius: 10px;
    border: none;
    background-color: #444;
    color: #fff;
    font-size: 16px;
    outline: none;
    min-width: 200px;
    }

    .summary {
    display: flex;
    justify-content: space-around;
    margin-bottom: 30px;
    gap: 20px;
    }

    .summary-card {
    flex: 1;
    text-align: center;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .summary-card h3 {
    margin-bottom: 10px;
    }

    .summary-card.income {
    background-color: #c8e6c9;
    color: #2e7d32;
    }

    .summary-card.expense {
    background-color: #ffcdd2;
    color: #c62828;
    }

    .summary-card.net {
    background-color: #e3f2fd;
    color: #1565c0;
    }

    .transaction-list {
    margin-top: 30px;
    background: #383838;
    padding: 20px;
    border-radius: 10px;
    }

    .transaction-list ul {
    list-style: none;
    padding: 0;
    }

    .transaction-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #555;
    }

    .edit-btn, .delete-btn {
    margin-left: 10px;
    background: #90caf9;
    color: #000;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    }

    .delete-btn {
    background: #f44336;
    color: white;
    }
    </style>
