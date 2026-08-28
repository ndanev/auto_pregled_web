<template>
  <header class="sticky top-0 z-10 bg-canvas/90 backdrop-blur border-b border-black/10">
    <div class="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="font-display font-extrabold uppercase text-display-sm text-ink">
        VozIQ
      </NuxtLink>
      <nav class="flex items-center gap-6">
        <NuxtLink to="/automobili" class="font-mono text-eyebrow uppercase text-ink/60 hover:text-amber transition-colors">Automobili</NuxtLink>
        <NuxtLink to="/marke" class="font-mono text-eyebrow uppercase text-ink/60 hover:text-amber transition-colors">Marke</NuxtLink>
        <NuxtLink to="/uporedi" class="font-mono text-eyebrow uppercase text-ink/60 hover:text-amber transition-colors">Uporedi</NuxtLink>
      </nav>
    </div>
  </header>
</template>