import { Icons, type Icon } from '@/components/ui/icons'

export interface NavItem {
  title: string
  href: string
  icon: Icon
  showInSidebar: boolean
  showInBottomNav: boolean
  isPrivate: boolean
  /** If true, renders as a raised primary button in the BottomNav */
  isPrimaryAction?: boolean
}

/**
 * Configuration centralisée de la navigation.
 * Toutes les routes privées et leur visibilité (Sidebar desktop / BottomNav mobile)
 * sont déclarées ici.
 */
export const navigationConfig: NavItem[] = [
  {
    title: 'Accueil',
    href: '/dashboard',
    icon: Icons.dashboard,
    showInSidebar: true,
    showInBottomNav: true,
    isPrivate: true,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: Icons.transactions,
    showInSidebar: true,
    showInBottomNav: true,
    isPrivate: true,
  },
  {
    title: 'Nouvelle',
    href: '/transactions/new',
    icon: Icons.plus,
    showInSidebar: false,
    showInBottomNav: true,
    isPrivate: true,
    isPrimaryAction: true,
  },
  {
    title: 'Budgets',
    href: '/budgets',
    icon: Icons.budgets,
    showInSidebar: true,
    showInBottomNav: true,
    isPrivate: true,
  },
  {
    title: 'Profil',
    href: '/settings',
    icon: Icons.user,
    showInSidebar: false,
    showInBottomNav: true,
    isPrivate: true,
  },
  // -- Items visible only in Sidebar (desktop) --
  {
    title: 'Catégories',
    href: '/categories',
    icon: Icons.categories,
    showInSidebar: true,
    showInBottomNav: false,
    isPrivate: true,
  },
  {
    title: 'Épargne',
    href: '/saving-goals',
    icon: Icons.goals,
    showInSidebar: true,
    showInBottomNav: false,
    isPrivate: true,
  },
  {
    title: 'Paramètres',
    href: '/settings',
    icon: Icons.settings,
    showInSidebar: true,
    showInBottomNav: false,
    isPrivate: true,
  },
]
