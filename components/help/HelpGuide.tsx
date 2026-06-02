'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TeacherGuideSection } from '@/components/help/TeacherGuideSection';
import {
  guideNav,
  learningHierarchy,
  proficiencyLevels,
  unitKinds,
  lessonKinds,
  blockKinds,
  questionKinds,
  learnerExperience,
  adminWorkflow,
  rolesGuide,
  faqItems,
} from '@/lib/content/help-guide';
import { useAuthStore } from '@/lib/store/auth';
import {
  BookOpen,
  Layers,
  GraduationCap,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Users,
  ListChecks,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function ExampleBox({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3 rounded-lg border border-primary/15 bg-primary/[0.04] p-4">
      {title && (
        <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2">
          {title}
        </p>
      )}
      <div className="text-[13px] text-text-secondary leading-relaxed space-y-1">
        {children}
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  summary,
  children,
}: {
  id: string;
  title: string;
  summary?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-[22px] font-bold text-text-primary mb-2">{title}</h2>
      {summary && (
        <p className="text-[15px] text-text-secondary leading-relaxed mb-6 max-w-3xl">
          {summary}
        </p>
      )}
      {children}
    </section>
  );
}

export function HelpGuide() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const [activeId, setActiveId] = useState(guideNav[0]?.id ?? 'overview');

  useEffect(() => {
    const ids = guideNav.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0));
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7FC]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href={isHydrated && isAuthenticated ? '/dashboard' : '/login'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-[16px] text-text-primary">Fluentian</span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Help & Learning Guide
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {isHydrated && isAuthenticated ? (
              <Button asChild size="sm" variant="default">
                <Link href="/dashboard">Back to dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="default">
                <Link href="/login">Sign in to Admin</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#1A0A2E] text-white">
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-16">
          <div className="flex items-center gap-2 text-primary-light/80 text-[12px] font-semibold uppercase tracking-wider mb-4">
            <HelpCircle size={14} />
            Documentation for everyone
          </div>
          <h1 className="text-[32px] md:text-[40px] font-bold leading-tight max-w-2xl text-white mb-4">
            Understanding lessons, quizzes, and how Fluentian teaches
          </h1>
          <p className="text-[16px] text-white/70 max-w-2xl leading-relaxed">
            A clear guide to how courses are built — from the learning path down to each
            quiz question. Written for teachers, moderators, and anyone who works with
            content, with real examples from our French beginner curriculum.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-10">
        {/* Side nav — desktop */}
        <aside className="hidden lg:block w-[220px] shrink-0">
          <nav className="sticky top-20 space-y-0.5">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-3 mb-3">
              On this page
            </p>
            {guideNav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  'block px-3 py-2 rounded-md text-[13px] transition-colors',
                  activeId === item.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                )}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-16 pb-20">
          <TeacherGuideSection />

          <Section
            id="overview"
            title="How learning is organized"
            summary="Fluentian structures language learning like a book with chapters, pages, and exercises. Here is how the pieces fit together."
          >
            <div className="grid gap-3">
              {learningHierarchy.steps.map((step, i) => (
                <Card key={step.label} className="border-border shadow-sm overflow-hidden">
                  <CardContent className="p-0 flex">
                    <div className="w-12 shrink-0 bg-primary/10 flex items-center justify-center text-primary font-bold text-[15px]">
                      {i + 1}
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-semibold text-[15px] text-text-primary mb-1">
                        {step.label}
                      </h3>
                      <p className="text-[14px] text-text-secondary leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ExampleBox title="Real-world picture">
              <p>
                <strong>Course:</strong> French Beginner (A1–A2) →{' '}
                <strong>Unit:</strong> Introduction & Greetings →{' '}
                <strong>Lesson:</strong> Bonjour! — Basic Greetings (dialogue) →{' '}
                <strong>Blocks:</strong> explanation + vocabulary for Bonjour, Salut →{' '}
                <strong>Quiz:</strong> &quot;Which word means Hello?&quot; (multiple choice)
              </p>
            </ExampleBox>
          </Section>

          <Section
            id="levels"
            title="Proficiency levels (A0–C2)"
            summary="Courses are tagged with a minimum and maximum level so learners and teachers know who the material is for. These follow the Common European Framework (CEFR)."
          >
            <div className="grid sm:grid-cols-2 gap-3">
              {proficiencyLevels.map((l) => (
                <Card key={l.level} className="border-border shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-[15px] flex items-center gap-2">
                      <span className="inline-flex w-9 h-9 rounded-lg bg-primary/10 text-primary items-center justify-center text-[13px] font-bold">
                        {l.level}
                      </span>
                      {l.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <p className="text-[13px] text-text-secondary leading-relaxed">
                      {l.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>

          <Section
            id="units"
            title="Unit types on the learning path"
            summary="Each unit is a chapter. The unit type tells learners and authors what role that chapter plays — teaching, practicing, storytelling, or checking progress."
          >
            <div className="grid gap-4">
              {unitKinds.map((u) => (
                <Card key={u.kind} className="border-border shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <Layers className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-[15px] mb-1">{u.title}</h3>
                        <p className="text-[14px] text-text-secondary leading-relaxed mb-3">
                          {u.description}
                        </p>
                        <ExampleBox title="Example">
                          <p>{u.example}</p>
                        </ExampleBox>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>

          <Section
            id="lessons"
            title="Lesson types"
            summary="When you create a lesson, you choose a type that sets expectations for content and quizzes. Pick the type that matches what the learner will actually do."
          >
            <Accordion type="multiple" className="space-y-2">
              {lessonKinds.map((lesson) => (
                <AccordionItem
                  key={lesson.kind}
                  value={lesson.kind}
                  className="border border-border rounded-lg px-4 bg-white shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left">
                      <BookOpen className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-semibold text-[15px]">{lesson.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-[14px] text-text-secondary leading-relaxed mb-3">
                      {lesson.description}
                    </p>
                    <ExampleBox title="Example lesson">
                      <p>{lesson.example}</p>
                    </ExampleBox>
                    {lesson.tips && (
                      <p className="mt-3 text-[13px] text-text-muted flex items-start gap-2">
                        <Sparkles className="w-4 h-4 shrink-0 text-accent" />
                        <span>
                          <strong className="text-text-secondary">Tip:</strong> {lesson.tips}
                        </span>
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Section>

          <Section
            id="blocks"
            title="Content inside a lesson"
            summary="Blocks are the teaching pages inside a lesson — what learners read, hear, or reveal before the quiz. In Admin, you add and reorder them in the lesson editor."
          >
            <div className="grid sm:grid-cols-2 gap-3">
              {blockKinds.map((b) => (
                <Card key={b.kind} className="border-border shadow-sm">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-[14px] mb-1">{b.title}</h3>
                    <p className="text-[13px] text-text-secondary mb-2">{b.description}</p>
                    <p className="text-[12px] text-text-muted italic">&ldquo;{b.example}&rdquo;</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>

          <Section
            id="quizzes"
            title="Quiz & question types"
            summary="Questions are the exercises at the end of (or within) a lesson. Each question has a type that controls how the learner answers and how answers are graded."
          >
            <Accordion type="multiple" className="space-y-2">
              {questionKinds.map((q) => (
                <AccordionItem
                  key={q.kind}
                  value={q.kind}
                  className="border border-border rounded-lg px-4 bg-white shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left">
                      <MessageSquare className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-semibold text-[15px]">{q.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-[14px] text-text-secondary leading-relaxed mb-3">
                      {q.description}
                    </p>
                    <ExampleBox title="Example">
                      {'prompt' in q.example && (
                        <p>
                          <strong>Question:</strong> {q.example.prompt}
                        </p>
                      )}
                      {'options' in q.example && Array.isArray(q.example.options) && (
                        <ul className="list-disc pl-5 mt-1">
                          {q.example.options.map((opt: string) => (
                            <li key={opt}>{opt}</li>
                          ))}
                        </ul>
                      )}
                      {'pairs' in q.example && Array.isArray(q.example.pairs) && (
                        <ul className="list-disc pl-5 mt-1">
                          {q.example.pairs.map((pair: string) => (
                            <li key={pair}>{pair}</li>
                          ))}
                        </ul>
                      )}
                      {'answer' in q.example && (
                        <p className="mt-2">
                          <strong>Correct:</strong> {String(q.example.answer)}
                        </p>
                      )}
                      {'note' in q.example && q.example.note && (
                        <p className="mt-2 text-text-muted">{q.example.note}</p>
                      )}
                    </ExampleBox>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Section>

          <Section
            id="learner-experience"
            title="What learners see"
            summary="Authors work in Admin; learners study in the Fluentian mobile app. This section connects your content choices to their experience."
          >
            <div className="space-y-3">
              {learnerExperience.map((item) => (
                <Card key={item.title} className="border-border shadow-sm">
                  <CardContent className="p-5 flex gap-3">
                    <GraduationCap className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <h3 className="font-semibold text-[15px] mb-1">{item.title}</h3>
                      <p className="text-[14px] text-text-secondary leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>

          <Section
            id="creating-content"
            title="Building courses in Admin"
            summary="A practical workflow for teachers and content leads using this dashboard."
          >
            <ol className="space-y-4">
              {adminWorkflow.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-[13px] font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-[15px] mb-1">{step.title}</h3>
                    <p className="text-[14px] text-text-secondary leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6">
              <Button asChild variant="outline" className="gap-2">
                <Link href="/courses/import">
                  Curriculum import
                  <ChevronRight size={16} />
                </Link>
              </Button>
              <p className="text-[12px] text-text-muted mt-2">
                Requires teacher or admin access after sign-in.
              </p>
            </div>
          </Section>

          <Section
            id="roles"
            title="Who can do what"
            summary="Admin accounts have different permissions. Students learn on mobile and cannot access this site."
          >
            <div className="space-y-2">
              {rolesGuide.map((r) => (
                <Card key={r.role} className="border-border shadow-sm">
                  <CardContent className="p-4 flex gap-3 items-start">
                    <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-[14px]">{r.role}</h3>
                      <p className="text-[13px] text-text-secondary mt-0.5">{r.can}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>

          <Section id="faq" title="Frequently asked questions">
            <Accordion type="single" collapsible className="space-y-2">
              {faqItems.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`faq-${i}`}
                  className="border border-border rounded-lg px-4 bg-white shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline py-4 text-left">
                    <span className="font-medium text-[14px] pr-4">{item.q}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-[14px] text-text-secondary leading-relaxed">
                      {item.a}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Section>

          {/* Footer CTA */}
          <Card className="border-primary/20 bg-primary/[0.06] shadow-none">
            <CardContent className="p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex gap-3">
                <ListChecks className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold text-[17px] mb-1">Ready to build or edit content?</h3>
                  <p className="text-[14px] text-text-secondary">
                    Sign in to open Courses and Lessons, or return to your dashboard.
                  </p>
                </div>
              </div>
              <Button asChild className="gap-2 shrink-0">
                <Link href={isHydrated && isAuthenticated ? '/courses' : '/login'}>
                  {isHydrated && isAuthenticated ? 'Go to courses' : 'Sign in'}
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
