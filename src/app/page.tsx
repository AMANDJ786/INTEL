import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart as BarChartIcon, Book, History, FileText } from "lucide-react";
import { PerformanceChart } from "./_components/performance-chart";

const progressData = [
  { subject: "Mathematics", progress: 75, icon: <BarChartIcon className="h-6 w-6 text-blue-500" /> },
  { subject: "History", progress: 50, icon: <History className="h-6 w-6 text-orange-500" /> },
  { subject: "Science", progress: 90, icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m10.4 16.2.5-1.7.5 1.7c.1.4.4.8.8.8.4 0 .7-.3.8-.8l.5-1.7.5 1.7c.1.4.4.8.8.8.4 0 .7-.3.8-.8l.5-1.7"></path><path d="m11.2 12.5.5-1.7.5 1.7c.1.4.4.8.8.8.4 0 .7-.3.8-.8l.5-1.7.5 1.7c.1.4.4.8.8.8.4 0 .7-.3.8-.8l.5-1.7"></path></svg> },
  { subject: "Literature", progress: 65, icon: <FileText className="h-6 w-6 text-purple-500" /> },
];

export default function DashboardPage() {
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
            {progressData.map((item) => (
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
            ))}
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
