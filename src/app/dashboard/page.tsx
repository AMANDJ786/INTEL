'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Book, FileText, History } from "lucide-react";
import { PerformanceChart } from "../_components/performance-chart";
import { useEffect, useState } from "react";
import { subjects } from "@/lib/data";
import { getProgress } from "@/lib/progress";

type ProgressItem = {
  subject: string;
  progress: number;
  icon: JSX.Element;
};

export default function DashboardPage() {
    const [progressData, setProgressData] = useState<ProgressItem[]>([]);

    useEffect(() => {
        const overallProgress = getProgress();
        const subjectsWithProgress = subjects.map(subject => {
            const SubIcon = subject.icon;
            let totalChapters = subject.chapters.length;
            let completedChapters = 0;

            if (overallProgress[subject.name]) {
                completedChapters = Object.keys(overallProgress[subject.name].chapters).length;
            }
            
            const progress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
            
            return {
                subject: subject.name,
                progress: progress,
                icon: <SubIcon className="h-6 w-6 text-primary" />
            };
        }).slice(0, 4); // Show first 4 subjects for a clean UI

        setProgressData(subjectsWithProgress);
    }, []);


  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome to AICademy!</h2>
      </div>
       <Card className="bg-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>Explore the AI tools to supercharge your learning.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Navigate using the sidebar to ask questions, summarize content, or generate quizzes.</p>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subject Progress</CardTitle>
            <CardDescription>Your current progress in different subjects.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {progressData.length > 0 ? progressData.map((item) => (
              <div key={item.subject}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.subject}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.progress}%</span>
                </div>
                <Progress value={item.progress} aria-label={`${item.subject} progress`} />
              </div>
            )) : <p className="text-sm text-muted-foreground">Complete some quizzes or exams to see your progress here!</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quiz Performance</CardTitle>
            <CardDescription>Your average quiz scores over the last few months.</CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
