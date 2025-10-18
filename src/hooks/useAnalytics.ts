import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsData {
  totalVisits: number;
  dailyVisits: number;
  weeklyVisits: number;
  monthlyVisits: number;
  repeatUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  topUsers: Array<{
    name: string;
    visitCount: number;
  }>;
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    dailyVisits: 0,
    weeklyVisits: 0,
    monthlyVisits: 0,
    repeatUsers: { daily: 0, weekly: 0, monthly: 0 },
    topUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();

    // Subscribe to realtime updates - refresh every 30 seconds for live analytics
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 30000);

    // Also subscribe to realtime database changes
    const channel = supabase
      .channel('site_visits_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_visits'
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Total visits
      const { count: totalVisits } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true });

      // Daily visits
      const { count: dailyVisits } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .gte('visited_at', oneDayAgo.toISOString());

      // Weekly visits
      const { count: weeklyVisits } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .gte('visited_at', oneWeekAgo.toISOString());

      // Monthly visits
      const { count: monthlyVisits } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact', head: true })
        .gte('visited_at', oneMonthAgo.toISOString());

      // Repeat users (users with more than 1 visit)
      const { data: dailyRepeaters } = await supabase
        .from('site_visits')
        .select('user_id')
        .gte('visited_at', oneDayAgo.toISOString());

      const { data: weeklyRepeaters } = await supabase
        .from('site_visits')
        .select('user_id')
        .gte('visited_at', oneWeekAgo.toISOString());

      const { data: monthlyRepeaters } = await supabase
        .from('site_visits')
        .select('user_id')
        .gte('visited_at', oneMonthAgo.toISOString());

      const countRepeaters = (visits: any[]) => {
        const userCounts = visits.reduce((acc, v) => {
          if (v.user_id) {
            acc[v.user_id] = (acc[v.user_id] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);
        return Object.values(userCounts).filter((count: number) => count > 1).length;
      };

      // Top users
      const { data: allVisits } = await supabase
        .from('site_visits')
        .select('user_id, profiles(name)')
        .not('user_id', 'is', null);

      const userVisitCounts = (allVisits || []).reduce((acc, visit) => {
        if (visit.user_id && visit.profiles) {
          const name = (visit.profiles as any).name;
          if (!acc[visit.user_id]) {
            acc[visit.user_id] = { name, count: 0 };
          }
          acc[visit.user_id].count++;
        }
        return acc;
      }, {} as Record<string, { name: string; count: number }>);

      const topUsers = Object.values(userVisitCounts)
        .sort((a, b) => (b.count as number) - (a.count as number))
        .slice(0, 10)
        .map(u => ({ name: u.name, visitCount: u.count }));

      setAnalytics({
        totalVisits: totalVisits || 0,
        dailyVisits: dailyVisits || 0,
        weeklyVisits: weeklyVisits || 0,
        monthlyVisits: monthlyVisits || 0,
        repeatUsers: {
          daily: countRepeaters(dailyRepeaters || []),
          weekly: countRepeaters(weeklyRepeaters || []),
          monthly: countRepeaters(monthlyRepeaters || [])
        },
        topUsers
      });
    } catch (error) {
      console.error('Analytics fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { analytics, loading, refresh: fetchAnalytics };
}
