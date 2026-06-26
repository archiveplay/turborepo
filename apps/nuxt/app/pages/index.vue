<template>
  <UContainer class="py-12">
    <UCard class="max-w-xl mx-auto text-center">
      <template #header>
        <h1 class="text-2xl font-semibold">Nuxt Starter Template</h1>
      </template>

      <p class="text-gray-600 dark:text-gray-300 mb-6">
        This is a minimal Nuxt 3 template using @nuxt/ui. It provides a clean
        starting point with preconfigured UI components, layout structure, and
        routing examples.
      </p>

      <UButton to="/user/1" color="primary" size="lg" variant="solid">
        Go to User Page
      </UButton>

      <template #footer>
        <p class="text-xs text-gray-400">
          Example dynamic route: <code>/user/[id]</code>
        </p>
      </template>
    </UCard>
  </UContainer>
</template>
