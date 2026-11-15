import { BookOpen, FlaskConical, Globe, IndianRupee, Landmark, Leaf, Newspaper, Palette, ScrollText } from 'lucide-react'
import type { SubjectIcon as IconName } from '../content/schema'

const ICONS = {
  landmark: Landmark,
  scroll: ScrollText,
  globe: Globe,
  rupee: IndianRupee,
  flask: FlaskConical,
  leaf: Leaf,
  palette: Palette,
  newspaper: Newspaper,
  book: BookOpen,
} satisfies Record<IconName, unknown>

export function SubjectIcon({ name, size = 20 }: { name?: IconName; size?: number }) {
  const Icon = ICONS[name ?? 'book']
  return <Icon size={size} aria-hidden />
}
