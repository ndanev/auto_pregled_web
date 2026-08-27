<template>
  <div class="min-h-screen flex flex-col bg-canvas text-ink font-sans">
    <TheHeader />
    <main class="flex-1 pb-20">
      <slot />
    </main>
    <TheFooter />
    <CompareBar />
  </div>
</template>