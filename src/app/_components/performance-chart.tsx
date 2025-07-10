'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar as RechartsBar } from 'recharts';

const chartData = [
  { month: 'January', score: 65 },
  { month: 'February', score: 72 },
  { month: 'March', score: 80 },
  { month: 'April', score: 78 },
  { month: 'May', score: 85 },
  { month: 'June', score: 92 },
];

const chartConfig = {
  score: {
    label: "Quiz Score",
    color: "hsl(var(--primary))",
  },
};

export function PerformanceChart() {
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
            <YAxis domain={[50, 100]}/>
            <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
            />
            <RechartsBar dataKey="score" fill="var(--color-score)" radius={8} />
            </BarChart>
        </ChartContainer>
    )
}
