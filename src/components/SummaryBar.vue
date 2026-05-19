<script setup>
import { ref } from 'vue'

defineProps({
  totalPnl: { type: Number, default: 0 },
  totalPnlAfterTax: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
})

const showAfterTax = ref(false)

function fmt(n) {
  return n.toLocaleString('ja-JP')
}
</script>

<template>
  <div class="summary">
    <div class="summary-item">
      <span class="label">取引数</span>
      <span class="value">{{ count }}</span>
    </div>
    <div class="summary-item">
      <span class="label">勝率</span>
      <span class="value">{{ winRate }}%</span>
    </div>
    <div
      class="summary-item tappable"
      @click="showAfterTax = !showAfterTax"
    >
      <span class="label">{{ showAfterTax ? '合計損益(税抜)' : '合計損益' }}</span>
      <span
        class="value"
        :class="(showAfterTax ? totalPnlAfterTax : totalPnl) >= 0 ? 'positive' : 'negative'"
      >
        {{ (showAfterTax ? totalPnlAfterTax : totalPnl) >= 0 ? '+' : '' }}{{ fmt(showAfterTax ? totalPnlAfterTax : totalPnl) }}円
      </span>
    </div>
  </div>
</template>

<style scoped>
.summary {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}
.summary-item {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.tappable {
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.tappable:active {
  opacity: 0.7;
}
.label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 4px;
}
.value {
  font-size: 1.1rem;
  font-weight: 700;
}
.positive { color: var(--green); }
.negative { color: var(--red); }
</style>
