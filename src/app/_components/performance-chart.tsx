'use client';

import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { getProgressHistory } from '@/lib/progress';

const chartConfig = {
  score: {
    label: 'Quiz Score',
    color: 'hsl(var(--primary))',
  },
};

export function PerformanceChart() {
  const [chartData, setChartData] = useState<{ month: string; score: number }[]>([]);

  useEffect(() => {
    const history = getProgressHistory();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const monthlyScores: { [key: string]: { totalScore: number, count: number } } = {};

    history.forEach(item => {
      const date = new Date(item.date);
      const month = monthNames[date.getMonth()];
      if (!monthlyScores[month]) {
        monthlyScores[month] = { totalScore: 0, count: 0 };
      }
      monthlyScores[month].totalScore += item.score;
      monthlyScores[month].count += 1;
    });

    const aggregatedData = Object.entries(monthlyScores).map(([month, data]) => ({
      month,
      score: Math.round(data.totalScore / data.count),
    }));

    // Ensure we have some default data if history is empty
    if (aggregatedData.length === 0) {
        setChartData([
            { month: 'January', score: 65 },
            { month: 'February', score: 72 },
            { month: 'March', score: 80 },
        ]);
    } else {
        setChartData(aggregatedData);
    }
  }, []);

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={chartData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis domain={[0, 100]} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="score" fill="var(--color-score)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
