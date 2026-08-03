import {
  AlertCircle,
  Archive,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Banknote,
  Bell,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  FolderOpen,
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  MoreVertical,
  PieChart,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Tag,
  Target,
  Trash2,
  TrendingUp,
  User,
  Wallet,
  WifiOff,
  X,
  XCircle,
  type LucideIcon,
} from 'lucide-react'

export type Icon = LucideIcon

export const Icons = {
  // Navigation
  dashboard: LayoutDashboard,
  transactions: Banknote,
  budgets: PieChart,
  goals: Target,
  settings: Settings,
  home: Home,
  categories: Tag,
  wallet: Wallet,

  // Actions
  plus: Plus,
  close: X,
  menu: Menu,
  moreHorizontal: MoreHorizontal,
  moreVertical: MoreVertical,
  search: Search,
  logout: LogOut,
  delete: Trash2,
  archive: Archive,
  download: Download,

  // Directions
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  arrowRight: ArrowRight,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,

  // Feedback & Status
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
  check: Check,
  bell: Bell,
  wifiOff: WifiOff,

  // Form & Inputs
  eye: Eye,
  eyeOff: EyeOff,
  calendar: Calendar,

  // Entities
  user: User,
  creditCard: CreditCard,
  trendingUp: TrendingUp,
  folderOpen: FolderOpen,

  // Categories (Exemples)
  briefcase: Briefcase,
  shoppingCart: ShoppingCart,

  // Logo / branding
  logo: Wallet,
}
