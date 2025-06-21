    <template>
    <div class="bar-chart-container">
        <canvas id="barChart"></canvas>
    </div>
    </template>

    <script setup>
    import { Chart } from 'chart.js/auto'
import { nextTick, onMounted, watch } from 'vue'

    const props = defineProps(['transactions'])
    let barChartInstance = null

    const renderBarChart = async () => {
    const categoryTotals = {}

    props.transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
        const cat = t.category || 'Uncategorized'
        categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(t.amount)
        })

    const labels = Object.keys(categoryTotals)
    const data = Object.values(categoryTotals)

    const colors = [
        '#f87171', '#60a5fa', '#34d399', '#fbbf24',
        '#c084fc', '#38bdf8', '#f472b6', '#facc15'
    ]

    if (barChartInstance) barChartInstance.destroy()
    await nextTick()

    const ctx = document.getElementById('barChart')
    if (!(ctx instanceof HTMLCanvasElement)) return

    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
        labels,
        datasets: [{
            label: 'Expenses by Category',
            data,
            backgroundColor: labels.map((_, i) => colors[i % colors.length]),
            borderRadius: 8
        }]
        },
        options: {
        responsive: true,
        plugins: {
            legend: {
            labels: { color: '#333' }
            }
        },
        scales: {
            y: {
            beginAtZero: true,
            ticks: { color: '#333' }
            },
            x: {
            ticks: { color: '#333' }
            }
        }
        }
    })
    }

    onMounted(renderBarChart)
    watch(() => props.transactions, renderBarChart, { deep: true })
    </script>

    <style scoped>
    .bar-chart-container {
    max-width: 700px;
    margin: 40px auto;
    padding: 24px;
    background: #fafafa;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    canvas {
    width: 100%;
    }
    </style>
