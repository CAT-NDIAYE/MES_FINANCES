import { DashboardLayout } from '@/components/layout'

export default function AppDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayout>{children}</DashboardLayout>
}
