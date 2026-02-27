import React, { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export function DashboardColumn({ stats, hasHabits }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!stats || !stats.weeklyProgress || !stats.weeklyProgress.length) {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
      return;
    }

    const ctx = canvasRef.current;
    if (!ctx) return;

    const labels = stats.weeklyProgress.map((d) => d.date.slice(5));
    const completed = stats.weeklyProgress.map((d) => d.completed || 0);
    const total = stats.weeklyProgress.map((d) => d.total || 0);

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Completed',
            data: completed,
            backgroundColor: 'rgba(124, 109, 250, 0.85)',
            borderRadius: 7,
            borderSkipped: false,
          },
          {
            label: 'Total habits',
            data: total,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(120, 130, 200, 0.2)',
            borderWidth: 1,
            borderRadius: 7,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { color: 'rgba(120, 130, 200, 0.06)' },
            ticks: { color: 'rgba(138, 144, 184, 0.9)', font: { size: 11, family: 'Inter' } },
          },
          y: {
            beginAtZero: true,
            precision: 0,
            grid: { color: 'rgba(120, 130, 200, 0.06)' },
            ticks: { color: 'rgba(138, 144, 184, 0.9)', font: { size: 11, family: 'Inter' } },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: 'rgba(138, 144, 184, 0.9)',
              font: { size: 11, family: 'Inter' },
              boxWidth: 10,
              borderRadius: 4,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(13, 15, 26, 0.98)',
            borderColor: 'rgba(120, 130, 200, 0.22)',
            borderWidth: 1,
            titleColor: '#eef0ff',
            bodyColor: '#8a90b8',
            titleFont: { family: 'Inter', weight: '600' },
            bodyFont: { family: 'Inter' },
            padding: 12,
            cornerRadius: 10,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [stats]);

  const totalHabits = stats?.totalHabits || 0;
  const completedToday = stats?.completedToday || 0;
  const completionPct = stats?.completionPercentageToday || 0;
  const currentStreak = stats?.currentStreak || 0;
  const longestStreak = stats?.longestStreak || 0;
  const totalCompletions = stats?.totalCompletions || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Metrics grid */}
      <div className="metrics-grid">
        {/* Today's progress */}
        <div className="metric-card">
          <div className="metric-card-glow indigo" />
          <div className="metric-icon">🎯</div>
          <div className="metric-label">Today's Progress</div>
          <div className="metric-value indigo" id="metric-habits">
            {completedToday}
            <span style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-muted)' }}>
              /{totalHabits}
            </span>
          </div>
          <div className="metric-sub" id="metric-habits-sub">{completionPct}% habits done today</div>
          <div className="metric-bar-track">
            <div
              className="metric-bar-fill"
              style={{ width: `${Math.min(completionPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Current streak */}
        <div className="metric-card">
          <div className="metric-card-glow emerald" />
          <div className="metric-icon">🔥</div>
          <div className="metric-label">Current Streak</div>
          <div className="metric-value emerald" id="metric-streak">{currentStreak}d</div>
          <div className="metric-sub" id="metric-streak-sub">
            Longest: <strong>{longestStreak}</strong> days
          </div>
        </div>

        {/* All-time completions */}
        <div className="metric-card">
          <div className="metric-card-glow gold" />
          <div className="metric-icon">⭐</div>
          <div className="metric-label">All-time Completions</div>
          <div className="metric-value gold" id="metric-total">{totalCompletions}</div>
          <div className="metric-sub" id="metric-total-sub">
            {totalCompletions === 0
              ? 'Start completing habits!'
              : 'Consistency compounds daily.'}
          </div>
        </div>
      </div>

      {/* Chart panel */}
      {hasHabits && stats && stats.weeklyProgress && stats.weeklyProgress.length ? (
        <div className="chart-panel">
          <div className="chart-panel-header">
            <div className="chart-panel-title">📅 Weekly Activity</div>
            <span className="badge badge-indigo">Last 7 days</span>
          </div>
          <div className="chart-container" id="chart-wrapper">
            <canvas ref={canvasRef} id="weekly-chart" />
          </div>
        </div>
      ) : (
        <div id="dashboard-empty" className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">No chart data yet</div>
          <p className="empty-state-desc">
            Create your first habit and start completing it daily — your streak
            and weekly chart will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
