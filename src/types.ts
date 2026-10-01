export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";
export type AppView = "dashboard" | "practice" | "results";
export type AccountRole = "student" | "teacher";
export type TeacherView = "dashboard" | "question-bank" | "exam-management" | "results";
export type Answers = Record<string, string>;
export type Flags = Record<string, boolean>;

export type DemoUser = {
  role: AccountRole;
  name: string;
};

export type Choice = {
  id: string;
  text: string;
};

export type BaseQuestion = {
  id: string;
  prompt: string;
  explanation?: string;
};

export type MultipleChoiceQuestion = BaseQuestion & {
  type: "multiple-choice";
  choices: Choice[];
  correctChoiceId: string;
};

export type ListeningQuestion = BaseQuestion & {
  type: "listening";
  audioSrc?: string;
  audioText?: string;
  choices: Choice[];
  correctChoiceId: string;
};

export type OrderingQuestion = BaseQuestion & {
  type: "ordering";
  fragments: Choice[];
  correctOrder: string[];
};

export type FillBlankQuestion = BaseQuestion & {
  type: "fill-blank";
  placeholder?: string;
  correctText: string;
  acceptedAnswers?: string[];
};

export type Question = MultipleChoiceQuestion | ListeningQuestion | OrderingQuestion | FillBlankQuestion;

export type PracticeExam = {
  id: string;
  level: JlptLevel;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: "Dễ" | "Vừa" | "Khó";
  questions: Question[];
};

export type PracticeResultSummary = {
  examId: string;
  score: number;
  totalQuestions: number;
  answeredCount: number;
};
