    <template>
    <div class="chart-container">
        <canvas ref="chartCanvas"></canvas>
    </div>
    </template>

    <script setup>
    import { Chart } from 'chart.js/auto'
import { nextTick, onMounted, ref, watch } from 'vue'

    const props = defineProps(['transactions'])

    const chartCanvas = ref(null)
    let chartInstance = null

    const renderChart = async () => {
    const incomeTotal = props.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const expenseTotal = props.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0)

    if (chartInstance) chartInstance.destroy()
    await nextTick()
    if (!chartCanvas.value) return

    chartInstance = new Chart(chartCanvas.value, {
        type: 'pie',
        data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [incomeTotal, expenseTotal],
            backgroundColor: ['#4caf50', '#f44336'],
            borderColor: ['#388e3c', '#d32f2f'],
            borderWidth: 1
        }]
        },
        options: {
        responsive: true,
        plugins: {
            legend: {
            position: 'bottom',
            labels: {
                color: '#333',
                font: { size: 14 }
            }
            }
        }
        }
    })
    }

    onMounted(renderChart)
    watch(() => props.transactions, renderChart, { deep: true })
    </script>

    <style scoped>
    .chart-container {
    max-width: 400px;
    margin: 30px auto;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    canvas {
    width: 100%;
    height: auto;
    }
    </style>
