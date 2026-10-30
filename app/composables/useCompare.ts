interface CompareItem {
  slug: string
  label: string
}

/**
 * Automobili izabrani za poređenje (najviše 2). Deljeno stanje kroz ceo sajt preko useState,
 * pa CarCard, CompareToggleButton i CompareBar uvek vide isti izbor.
 */
export function useCompare() {
  const selected = useState<CompareItem[]>('compare-selected', () => [])

  function toggle(item: CompareItem) {
    const exists = selected.value.some((s) => s.slug === item.slug)
    if (exists) {
      selected.value = selected.value.filter((s) => s.slug !== item.slug)
    } else if (selected.value.length >= 2) {
      // Već su izabrana dva: najstariji izbor ispada, novi ulazi
      selected.value = [...selected.value.slice(1), item]
    } else {
      selected.value = [...selected.value, item]
    }
  }

  function isSelected(slug: string): boolean {
    return selected.value.some((s) => s.slug === slug)
  }

  function clear() {
    selected.value = []
  }

  return { selected, toggle, isSelected, clear }
}