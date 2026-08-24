<template>
  <div class="min-h-screen flex flex-col bg-canvas text-ink font-sans">
    <TheHeader />
    <main class="flex-1">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>