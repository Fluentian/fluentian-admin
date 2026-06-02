'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  teacherGuideIntro,
  educationalVsQuizLesson,
  setupWorkflow,
  blockEditorGuide,
  lessonPlaybooks,
  questionPlaybooks,
  publishingChecklist,
  teacherFaq,
} from '@/lib/content/teacher-guide';
import {
  BookOpen,
  ClipboardList,
  Layers,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function StepCard({
  step,
  title,
  where,
  actions,
  tip,
}: {
  step: number;
  title: string;
  where: string;
  actions: string[];
  tip: string;
}) {
  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardContent className="p-0 flex">
        <div className="w-12 shrink-0 bg-primary flex items-center justify-center text-white font-bold text-[15px]">
          {step}
        </div>
        <div className="p-5 flex-1 space-y-3">
          <h3 className="font-semibold text-[16px] text-text-primary">{title}</h3>
          <p className="text-[13px] text-primary font-medium">
            <span className="text-text-muted font-normal">Where: </span>
            {where}
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-[14px] text-text-secondary">
            {actions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
          <p className="text-[13px] text-text-muted border-l-2 border-accent pl-3">
            <strong className="text-text-secondary">Tip:</strong> {tip}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function TeacherGuideSection() {
  return (
    <section id="teacher-guide" className="scroll-mt-24 space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-[12px] font-bold uppercase tracking-wider mb-4">
          <GraduationCap size={14} />
          For teachers
        </div>
        <h2 className="text-[22px] font-bold text-text-primary mb-2">
          {teacherGuideIntro.title}
        </h2>
        <p className="text-[15px] text-text-secondary leading-relaxed max-w-3xl mb-6">
          {teacherGuideIntro.summary}
        </p>
        <Card className="border-primary/20 bg-white shadow-sm">
          <CardContent className="p-5">
            <p className="text-[13px] font-bold text-text-primary mb-3 flex items-center gap-2">
              <ClipboardList size={16} className="text-primary" />
              Before you start
            </p>
            <ul className="space-y-2">
              {teacherGuideIntro.beforeYouStart.map((item) => (
                <li
                  key={item}
                  className="text-[14px] text-text-secondary flex gap-2 leading-relaxed"
                >
                  <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="default">
                <Link href="/courses">Open Courses</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/courses/import">CSV import</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Educational vs quiz */}
      <div>
        <h3 className="text-[18px] font-bold text-text-primary mb-2">
          {educationalVsQuizLesson.title}
        </h3>
        <p className="text-[14px] text-text-secondary mb-4">{educationalVsQuizLesson.body}</p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {educationalVsQuizLesson.parts.map((part) => (
            <Card key={part.label} className="border-border shadow-sm">
              <CardContent className="p-5">
                <p className="font-semibold text-[15px] mb-2">{part.label}</p>
                <p className="text-[13px] text-text-secondary mb-3 leading-relaxed">
                  {part.description}
                </p>
                <p className="text-[12px] text-primary font-medium bg-primary/5 rounded-md px-3 py-2">
                  {part.where}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-[14px] text-text-secondary border-l-4 border-primary pl-4 italic">
          {educationalVsQuizLesson.ruleOfThumb}
        </p>
      </div>

      {/* 6-step workflow */}
      <div>
        <h3 className="text-[18px] font-bold text-text-primary mb-4 flex items-center gap-2">
          <Layers size={20} className="text-primary" />
          Step-by-step: course → unit → lesson → blocks → quiz
        </h3>
        <div className="space-y-4">
          {setupWorkflow.map((w) => (
            <StepCard key={w.step} {...w} />
          ))}
        </div>
      </div>

      {/* Block editor */}
      <div>
        <h3 className="text-[18px] font-bold text-text-primary mb-2 flex items-center gap-2">
          <FileText size={20} className="text-primary" />
          How to add each content block type
        </h3>
        <p className="text-[14px] text-text-secondary mb-4">
          In the lesson editor, open <strong>Content Blocks</strong> → <strong>Add Block</strong>.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {blockEditorGuide.map((b) => (
            <Card key={b.kind} className="border-border shadow-sm">
              <CardContent className="p-4">
                <h4 className="font-semibold text-[14px] mb-1">{b.title}</h4>
                <p className="text-[12px] text-text-muted mb-2">{b.fields}</p>
                <p className="text-[13px] text-text-secondary mb-3">{b.useFor}</p>
                <ol className="list-decimal pl-4 space-y-1 text-[12px] text-text-secondary">
                  {b.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Lesson playbooks */}
      <div>
        <h3 className="text-[18px] font-bold text-text-primary mb-2 flex items-center gap-2">
          <BookOpen size={20} className="text-primary" />
          If you want this kind of lesson, do this…
        </h3>
        <p className="text-[14px] text-text-secondary mb-4">
          Choose the lesson type in the left sidebar when creating or editing a lesson. Then follow
          the playbook for blocks (teaching) and questions (quiz).
        </p>
        <Accordion type="multiple" className="space-y-2">
          {lessonPlaybooks.map((pb) => (
            <AccordionItem
              key={pb.kind}
              value={pb.kind}
              className="border border-border rounded-lg px-4 bg-white shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex flex-col items-start text-left gap-1 pr-4">
                  <span className="font-semibold text-[15px]">{pb.title}</span>
                  <span className="text-[13px] text-text-muted font-normal">{pb.goal}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-[11px] font-bold uppercase text-text-muted mb-2">
                      Content blocks — add these
                    </p>
                    <ul className="space-y-1.5">
                      {pb.blocks.map((b) => (
                        <li
                          key={b}
                          className="text-[13px] text-text-secondary flex gap-2 leading-relaxed"
                        >
                          <span className="text-primary">•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-primary/[0.04] border border-primary/10 p-4">
                    <p className="text-[11px] font-bold uppercase text-primary mb-2">
                      Quiz questions — add these
                    </p>
                    <ul className="space-y-1.5">
                      {pb.questions.map((q) => (
                        <li
                          key={q}
                          className="text-[13px] text-text-secondary flex gap-2 leading-relaxed"
                        >
                          <span className="text-primary">•</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="text-[13px] text-text-muted">
                  <strong className="text-text-secondary">Suggested:</strong> {pb.suggestedTypes}{' '}
                  · <strong className="text-text-secondary">Time / XP:</strong> {pb.minutesXp}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Question playbooks */}
      <div>
        <h3 className="text-[18px] font-bold text-text-primary mb-2 flex items-center gap-2">
          <MessageSquare size={20} className="text-primary" />
          If you want this kind of quiz question, do this…
        </h3>
        <p className="text-[14px] text-text-secondary mb-4">
          Open <strong>Quiz Questions</strong> → <strong>Add Question</strong>. Types marked{' '}
          <Badge variant="secondary" className="text-[10px] mx-1">
            In Admin
          </Badge>{' '}
          are available in the form today; others use CSV import.
        </p>
        <Accordion type="multiple" className="space-y-2">
          {questionPlaybooks.map((pb) => (
            <AccordionItem
              key={pb.kind}
              value={pb.kind}
              className="border border-border rounded-lg px-4 bg-white shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left flex-wrap">
                  <span className="font-semibold text-[15px]">{pb.title}</span>
                  <Badge
                    className={cn(
                      'text-[10px]',
                      pb.inAdminNow
                        ? 'bg-success/15 text-success border-success/30'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    )}
                    variant="outline"
                  >
                    {pb.inAdminNow ? 'In Admin form' : 'Import / API'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pb-4">
                <p className="text-[14px] text-text-secondary">
                  <strong>When to use:</strong> {pb.whenToUse}
                </p>
                <p className="text-[13px] text-text-muted">
                  <strong>Fields:</strong> {pb.fields}
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-[13px] text-text-secondary">
                  {pb.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <div className="rounded-lg border border-primary/15 bg-primary/[0.04] p-4 text-[13px] space-y-1">
                  <p>
                    <strong>Example prompt:</strong> {pb.example.prompt}
                  </p>
                  <p>
                    <strong>Setup:</strong> {pb.example.setup}
                  </p>
                  <p>
                    <strong>Answer:</strong> {pb.example.answer}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Publishing checklist */}
      <div>
        <h3 className="text-[18px] font-bold text-text-primary mb-4">
          Publishing checklist (before learners see the lesson)
        </h3>
        <Card className="border-success/30 bg-success/[0.04] shadow-sm">
          <CardContent className="p-5">
            <ul className="space-y-2">
              {publishingChecklist.map((item) => (
                <li
                  key={item}
                  className="text-[14px] text-text-secondary flex gap-2 leading-relaxed"
                >
                  <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Teacher FAQ */}
      <div>
        <h3 className="text-[18px] font-bold text-text-primary mb-4">Teacher FAQ</h3>
        <Accordion type="single" collapsible className="space-y-2">
          {teacherFaq.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`tfaq-${i}`}
              className="border border-border rounded-lg px-4 bg-white shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline py-4 text-left">
                <span className="font-medium text-[14px] pr-4">{item.q}</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-[14px] text-text-secondary leading-relaxed pb-4">
                  {item.a}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Card className="border-primary/20 bg-[#1A0A2E] text-white shadow-lg">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-bold text-[16px] mb-1">Ready to build?</p>
            <p className="text-[14px] text-white/70">
              Start with Courses, add a unit, then add your first lesson and open the editor.
            </p>
          </div>
          <Button asChild className="bg-white text-[#1A0A2E] hover:bg-white/90 shrink-0 gap-2">
            <Link href="/courses">
              Go to Courses
              <ArrowRight size={16} />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
