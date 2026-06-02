import type { Metadata } from 'next';
import { HelpGuide } from '@/components/help/HelpGuide';

export const metadata: Metadata = {
  title: 'Help & Learning Guide | Fluentian Admin',
  description:
    'Understand Fluentian courses, units, lesson types, quiz questions, and how learners progress — explained in plain language with examples.',
};

export default function HelpPage() {
  return <HelpGuide />;
}
