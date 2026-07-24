import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar, BottomNav } from '@/components/dashboard/Nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('name, slug')
    .eq('user_id', user.id)
    .single()

  const slug = restaurant?.slug ?? ''
  const restaurantName = restaurant?.name ?? ''

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar slug={slug} restaurantName={restaurantName} />
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 pb-20 md:pb-0">
          <div className="max-w-2xl mx-auto px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </main>
        <BottomNav slug={slug} />
      </div>
    </div>
  )
}

