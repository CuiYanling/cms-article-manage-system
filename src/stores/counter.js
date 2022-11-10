import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  //state
  const count = ref(0)
  //getters
  const doubleCount = computed(() => count.value * 2)
  //action
  function increment() {
    count.value++
  }
  //返回一个对象
  return { count, doubleCount, increment }
})
