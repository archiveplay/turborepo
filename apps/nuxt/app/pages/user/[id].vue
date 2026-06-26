<script setup lang="ts">
import { useUser } from "~/entities/user/api/use-user";

const route = useRoute();

const id = computed(() => Number(route.params.id));

const { data, isPending, error } = useUser(id.value);
</script>

<template>
  <h1>User</h1>

  <div v-if="isPending">Loading...</div>

  <div v-else-if="error">Error: {{ error }}</div>

  <pre v-else>
    {{ data }}
  </pre>
</template>
