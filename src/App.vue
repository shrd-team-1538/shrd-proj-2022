<template>
<h1>Hello world</h1>
<!-- <BarChart :options="options" :data="data"></BarChart> -->
<button @click="incr()">Incr</button>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { ref, reactive } from 'vue';
onMounted(async () => {
  const res = await fetch('/api/auth/users/1');
  alert(res.status);
});
let options = {
  responsive: true
}
let data = reactive({
  labels: [
    'A',
    'B',
    'C'
  ],
  datasets: [
    {
      data: [
        30, 76, 45
      ]
    },
    {
      data: [
        56, 78, 73
      ]
    }
  ]
});
const incr = () => {
  console.log(data.datasets[0].data[1]);
  data.datasets[0].data[1]+= 1;
}
</script>