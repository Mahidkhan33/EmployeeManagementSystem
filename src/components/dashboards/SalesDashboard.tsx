'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Employee } from '@/types';
import styles from './Dashboard.module.css';

export default function SalesDashboard() {
  const { user, loading, getAuthHeader } = useAuth({ requiredDept: 'Sales' });
  const [team, setTeam] = useState<Employee[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch('/api/employees?department=Sales', { headers: getAuthHeader() })
      .then(r => r.json())
      .then(data => { setTeam(data.data || []); setFetching(false); })
      .catch(() => setFetching(false));
  }, [user]);

  if (loading || fetching) return <div className={styles.loading}>Loading Sales Dashboard...</div>;

  const pipeline = [
    { stage: 'Prospecting', deals: 24, value: 142000, color: '#6366f1' },
    { stage: 'Qualification', deals: 18, value: 98000, color: '#f59e0b' },
    { stage: 'Proposal', deals: 11, value: 67000, color: '#3b82f6' },
    { stage: 'Closing', deals: 7, value: 54000, color: '#10b981' },
    { stage: 'Won', deals: 4, value: 39000, color: '#22c55e' },
  ];

  const activeReps = team.filter(e => e.status === 'Active').length;
  const cards = [
    { label: 'Team Size', value: team.length, icon: Users, color: '#4f46e5', sub: `${activeReps} active` },
    { label: 'Total Revenue', value: '$331k', icon: DollarSign, color: '#10b981', sub: 'This quarter' },
    { label: 'Monthly Target', value: '$75k', icon: Target, color: '#f59e0b', sub: '81% achieved' },
    { label: 'Growth', value: '+18%', icon: TrendingUp, color: '#8b5cf6', sub: 'vs last month' },
  ];

  return (
    <div className="fade-in">
      <header className={styles.header}>
        <div>
          <div className={styles.roleBadge} style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
            <TrendingUp size={14} /> Sales Department
          </div>
          <h1 className={styles.title}>Sales Dashboard</h1>
          <p className={styles.subtitle}>Pipeline overview, team performance, and revenue tracking.</p>
        </div>
      </header>

      <div className={styles.statsGrid}>
        {cards.map((card, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{card.label}</span>
              <h2 className={styles.statValue}>{card.value}</h2>
              {card.sub && <div className={styles.statTrend}><span className={styles.trendLabel}>{card.sub}</span></div>}
            </div>
            <div className={styles.statIcon} style={{ backgroundColor: `${card.color}18`, color: card.color }}>
              <card.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.mainCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Sales Pipeline</h3>
            <span className={styles.badge}>{pipeline.reduce((a, p) => a + p.deals, 0)} deals</span>
          </div>
          <div className={styles.pipelineList}>
            {pipeline.map((stage, i) => (
              <div key={i} className={styles.pipelineItem}>
                <div className={styles.pipelineHeader}>
                  <div className={styles.pipelineStage}>
                    <div className={styles.pipelineDot} style={{ backgroundColor: stage.color }} />
                    <span>{stage.stage}</span>
                  </div>
                  <div className={styles.pipelineStats}>
                    <span className={styles.pipelineDeals}>{stage.deals} deals</span>
                    <span className={styles.pipelineValue} style={{ color: stage.color }}>${stage.value.toLocaleString()}</span>
                  </div>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${(stage.value / 142000) * 100}%`, backgroundColor: stage.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sideCard}>
          <h3 className={styles.cardTitle}>Sales Team</h3>
          <div className={styles.teamList}>
            {team.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No sales staff found.</p>
            ) : team.map(m => (
              <div key={m._id} className={styles.teamMember}>
                <div className={styles.userAvatar}>{m.firstName[0]}{m.lastName[0]}</div>
                <div className={styles.teamMemberInfo}>
                  <span className={styles.memberName}>{m.firstName} {m.lastName}</span>
                  <span className={styles.memberRole}>{m.position}</span>
                </div>
                <span className={`${styles.status} ${styles[m.status.toLowerCase().replace(' ', '')]}`}>{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
