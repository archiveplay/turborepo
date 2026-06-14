<script setup lang="ts">
import { userControllerFindUnique } from '@pkg/api/client/vue'

const { data } = await userControllerFindUnique({ where: { id: 1 } })
console.log(data)
</script>

<template>
  <h1>You did it!</h1>
  <pre>
    {{ data }}
  </pre>
</template>

<style scoped></style>
