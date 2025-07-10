import Link from 'next/link';
import { subjects } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ArrowRight, HelpCircle, Video, Radio } from 'lucide-react';

export default function SubjectsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Subjects & Chapters</h2>
        <p className="text-muted-foreground max-w-2xl">
          Explore different subjects, dive into specific chapters, and test your knowledge with a quiz for each topic.
        </p>
      </div>
      <div className="grid gap-6 pt-4 md:grid-cols-1 lg:grid-cols-2">
        {subjects.map((subject, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center gap-4">
              <subject.icon className="h-10 w-10 text-primary" />
              <div>
                <CardTitle>{subject.name}</CardTitle>
                <CardDescription>
                  {subject.chapters.length} chapters available
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>View Chapters</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-4 pt-2">
                      {subject.chapters.map((chapter) => (
                        <li
                          key={chapter.name}
                          className="flex flex-col items-start gap-4 rounded-md border p-4"
                        >
                          <span className="font-semibold text-lg">{chapter.name}</span>
                          <div className="flex flex-wrap gap-2">
                             <Button asChild variant="outline" size="sm">
                              <Link href={`/ask?topic=${encodeURIComponent(chapter.name)}`}>
                                <HelpCircle className="mr-2 h-4 w-4" />
                                Explain with AI
                              </Link>
                            </Button>
                             <Button asChild variant="outline" size="sm">
                              <Link href="#">
                                <Video className="mr-2 h-4 w-4" />
                                Video Lecture
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link href="#">
                                <Radio className="mr-2 h-4 w-4" />
                                Live Session
                              </Link>
                            </Button>
                             <Button asChild variant="default" size="sm">
                              <Link href={`/quiz?topic=${encodeURIComponent(chapter.name)}`}>
                                Start Quiz
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
