import { useEffect, useMemo, useState } from "react";
import schoolLogo from "./assets/logo_uit_updated.png";
import { AppSidebar } from "./components/AppSidebar";
import { AuthPage } from "./components/AuthPage";
import { DashboardView } from "./components/student/DashboardView";
import { PracticeLevelsView } from "./components/student/PracticeLevelsView";
import { ExamSelection, PracticeView } from "./components/student/PracticeView";
import { ResultsView } from "./components/student/ResultView";
import { TeacherWorkspace } from "./components/TeacherWorkspace";
import { exams } from "./data/exams";
import type { AccountRole, Answers, AppView, DemoUser, Flags, JlptLevel, PracticeExam, PracticeResultSummary, TeacherView } from "./types";
import { isQuestionAnswered, isQuestionCorrect } from "./utils/practice";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function App() {
  const [view, setView] = useState<AppView>("dashboard");
  const [selectedLevel, setSelectedLevel] = useState<JlptLevel>("N5");
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [flags, setFlags] = useState<Flags>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [authView, setAuthView] = useState<"signin" | "signup" | null>(null);
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const [teacherView, setTeacherView] = useState<TeacherView>("dashboard");
  const [completedExamIds, setCompletedExamIds] = useState<string[]>([]);
  const [examResults, setExamResults] = useState<Record<string, PracticeResultSummary>>({});
  const [practiceStage, setPracticeStage] = useState<"levels" | "exams">("levels");
  const [isPracticeSubmitted, setIsPracticeSubmitted] = useState(false);

  const selectedExam = useMemo(
    () => exams.find((exam) => exam.id === selectedExamId) ?? null,
    [selectedExamId],
  );

  const levelExams = exams.filter((exam) => exam.level === selectedLevel);
  const totalQuestions = selectedExam?.questions.length ?? 0;
  const answeredCount = selectedExam
    ? selectedExam.questions.filter((question) => isQuestionAnswered(question, answers[question.id])).length
    : 0;
  const score = selectedExam
    ? selectedExam.questions.filter((question) => isQuestionCorrect(question, answers[question.id])).length
    : 0;
  const isExamFocus = view === "practice" && selectedExam;

  useEffect(() => {
    if (view !== "practice" || remainingSeconds <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [remainingSeconds, view]);

  useEffect(() => {
    if (view === "practice" && remainingSeconds === 0 && selectedExam) {
      setIsPracticeSubmitted(true);
      setRemainingSeconds(0);
    }
  }, [remainingSeconds, selectedExam, view]);

  function chooseLevel(level: JlptLevel) {
    setSelectedLevel(level);
    setSelectedExamId(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlags({});
    setRemainingSeconds(0);
    setIsPracticeSubmitted(false);
    setPracticeStage("exams");
    setView("practice");
  }

  function openPractice() {
    setSelectedExamId(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlags({});
    setRemainingSeconds(0);
    setIsPracticeSubmitted(false);
    setPracticeStage("levels");
    setView("practice");
  }

  function backToPracticeLevels() {
    setSelectedExamId(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlags({});
    setRemainingSeconds(0);
    setIsPracticeSubmitted(false);
    setPracticeStage("levels");
  }

  function openDashboard() {
    setSelectedExamId(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlags({});
    setRemainingSeconds(0);
    setIsPracticeSubmitted(false);
    setView("dashboard");
  }

  function openResults() {
    setView("results");
  }

  function startExam(exam: PracticeExam) {
    setSelectedExamId(exam.id);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlags({});
    setRemainingSeconds(exam.durationMinutes * 60);
    setIsPracticeSubmitted(false);
    setView("practice");
  }

  function submitExam() {
    if (selectedExam) {
      const nextScore = selectedExam.questions.filter((question) => isQuestionCorrect(question, answers[question.id])).length;
      const nextAnsweredCount = selectedExam.questions.filter((question) => isQuestionAnswered(question, answers[question.id])).length;

      setCompletedExamIds((current) => (current.includes(selectedExam.id) ? current : [...current, selectedExam.id]));
      setExamResults((current) => ({
        ...current,
        [selectedExam.id]: {
          examId: selectedExam.id,
          score: nextScore,
          totalQuestions: selectedExam.questions.length,
          answeredCount: nextAnsweredCount,
        },
      }));
    }
    setRemainingSeconds(0);
    setIsPracticeSubmitted(true);
  }

  function updateAnswer(questionId: string, answer: string) {
    setAnswers((current) => ({
      ...current,
      [questionId]: answer,
    }));
  }

  function toggleFlag(questionId: string) {
    setFlags((current) => ({
      ...current,
      [questionId]: !current[questionId],
    }));
  }

  function backToExams() {
    setSelectedExamId(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlags({});
    setRemainingSeconds(0);
    setIsPracticeSubmitted(false);
    setPracticeStage("exams");
    setView("practice");
  }

  function resetToLevels() {
    setSelectedExamId(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlags({});
    setRemainingSeconds(0);
    setIsPracticeSubmitted(false);
    setAuthView(null);
    setPracticeStage("levels");
    setView("dashboard");
  }

  function openAuth(nextAuthView: "signin" | "signup") {
    setSelectedExamId(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setFlags({});
    setRemainingSeconds(0);
    setIsPracticeSubmitted(false);
    setAuthView(nextAuthView);
    setView("dashboard");
  }

  function completeAuth(role: AccountRole, name: string) {
    setDemoUser({ role, name });
    setTeacherView("dashboard");
    resetToLevels();
  }

  function goTeacherView(nextView: TeacherView) {
    setTeacherView(nextView);
    setAuthView(null);
    setView("dashboard");
  }

  const mainContent = (
    <>
      {authView ? (
        <AuthPage mode={authView} onBack={resetToLevels} onComplete={completeAuth} onSwitchMode={setAuthView} />
      ) : null}

      {!authView && demoUser?.role === "teacher" ? (
        <TeacherWorkspace activeView={teacherView} />
      ) : null}

      {!authView && demoUser?.role !== "teacher" && view === "dashboard" && <DashboardView />}

      {!authView && demoUser?.role !== "teacher" && view === "practice" && practiceStage === "levels" && (
        <PracticeLevelsView onChooseLevel={chooseLevel} />
      )}

      {!authView && demoUser?.role !== "teacher" && view === "practice" && practiceStage === "exams" && !selectedExam && (
        <ExamSelection
          completedExamIds={completedExamIds}
          exams={levelExams}
          level={selectedLevel}
          onBack={backToPracticeLevels}
          backLabel="Practice"
          onSelectLevel={chooseLevel}
          onStartExam={startExam}
        />
      )}

      {!authView && demoUser?.role !== "teacher" && view === "practice" && selectedExam && (
        <PracticeView
          answers={answers}
          answeredCount={answeredCount}
          currentQuestionIndex={currentQuestionIndex}
          exam={selectedExam}
          flags={flags}
          isSubmitted={isPracticeSubmitted}
          onBackToExams={backToExams}
          onChangeQuestion={setCurrentQuestionIndex}
          onExit={backToExams}
          onRetry={() => startExam(selectedExam)}
          onSubmit={submitExam}
          onToggleFlag={toggleFlag}
          onUpdateAnswer={updateAnswer}
          examResults={examResults}
          score={score}
          totalQuestions={totalQuestions}
        />
      )}

      {!authView && demoUser?.role !== "teacher" && view === "results" && (
        <ResultsView
          answers={answers}
          exam={selectedExam}
          examResults={examResults}
          onBackToDashboard={openDashboard}
          onRetry={() => {
            if (selectedExam) {
              startExam(selectedExam);
            } else {
              openPractice();
            }
          }}
          score={score}
          totalQuestions={totalQuestions}
        />
      )}
    </>
  );

  return (
    <div className="app-shell">
      {isExamFocus ? (
        <>
          <header className="site-header exam-site-header">
          <>
            <div className="exam-header-left">
              <button className="brand-button" onClick={openDashboard} type="button">
                <img className="school-logo" src={schoolLogo} alt="Logo UIT" />
                <strong>Januit</strong>
              </button>
              <span className="header-divider" />
              <span className="exam-title">{selectedExam.title}</span>
            </div>

            <div className="exam-header-actions">
              <span className="exam-progress-pill">
                Thời gian làm bài: {formatTime(remainingSeconds)}
              </span>
            </div>
          </>
          </header>
          <main>{mainContent}</main>
        </>
      ) : (
        <div className="app-layout">
          <AppSidebar
            authView={authView}
            demoUser={demoUser}
            onOpenAuth={openAuth}
            onOpenPractice={openPractice}
            onOpenResults={openResults}
            onResetToLevels={openDashboard}
            onSignOut={() => setDemoUser(null)}
            onTeacherView={goTeacherView}
            studentView={view}
            teacherView={teacherView}
          />
          <main className="app-content">{mainContent}</main>
        </div>
      )}
    </div>
  );
}

export default App;
