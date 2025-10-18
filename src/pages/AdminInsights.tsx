import { Card } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/useAnalytics';
import { TrendingUp, Users, Eye, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminInsights() {
  const { analytics, loading } = useAnalytics();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <TrendingUp className="h-6 w-6" />
        Website Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Eye className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Visits</p>
              <p className="text-2xl font-bold">{analytics.totalVisits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold">{analytics.dailyVisits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold">{analytics.weeklyVisits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold">{analytics.monthlyVisits}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Repeat Users
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Today</span>
              <span className="font-bold text-lg">{analytics.repeatUsers.daily}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">This Week</span>
              <span className="font-bold text-lg">{analytics.repeatUsers.weekly}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">This Month</span>
              <span className="font-bold text-lg">{analytics.repeatUsers.monthly}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Users
          </h3>
          <div className="space-y-3">
            {analytics.topUsers.length === 0 ? (
              <p className="text-muted-foreground text-sm">No user data yet</p>
            ) : (
              analytics.topUsers.map((user, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm">{user.name}</span>
                  <span className="font-semibold">{user.visitCount} visits</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
