import { useEffect, useState } from "react";
import { Flag } from "lucide-react";
import type { Answers, Flags, JlptLevel, PracticeExam, PracticeResultSummary } from "../../types";
import { getAnswerLabel, getQuestionTypeLabel, isQuestionAnswered, normalizeText, playListeningQuestion } from "../../utils/practice";
import { QuestionAnswer, OrderingAnswer, FillBlankAnswer } from "./QuestionHelpers";

type PracticeViewProps = {
  answers: Answers;
  answeredCount: number;
  currentQuestionIndex: number;
  exam: PracticeExam;
  flags: Flags;
  isSubmitted: boolean;
  onBackToExams: () => void;
  onChangeQuestion: (index: number) => void;
  onExit: () => void;
  onRetry: () => void;
  onSubmit: () => void;
  onToggleFlag: (questionId: string) => void;
  onUpdateAnswer: (questionId: string, answer: string) => void;
  examResults: Record<string, PracticeResultSummary>;
  score: number;
  totalQuestions: number;
};

type ExamSelectionProps = {
  completedExamIds: string[];
  exams: PracticeExam[];
  level: JlptLevel;
  onBack: () => void;
  backLabel?: string;
  onSelectLevel: (level: JlptLevel) => void;
  onStartExam: (exam: PracticeExam) => void;
};

export function ExamSelection({
  completedExamIds,
  exams,
  level,
  onBack,
  backLabel,
  onSelectLevel,
  onStartExam,
}: ExamSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearch = normalizeText(searchTerm);
  const visibleExams = exams.filter((exam) => {
    if (!normalizedSearch) {
      return true;
    }

    const targetText = `${exam.title} ${exam.description}`.toLocaleLowerCase("vi-VN");
    return targetText.includes(normalizedSearch);
  });
  const totalQuestions = exams.reduce((sum, exam) => sum + exam.questions.length, 0);

  return (
    <section className="page-section">
      <div className="toolbar">
        <button className="ghost-button" onClick={onBack} type="button">
          ← {backLabel ?? "Dashboard"}
        </button>
        <div className="practice-heading-row">
          <div>
            <p className="eyebrow">Danh sách đề</p>
            <h1>{level} - chọn đề luyện tập</h1>
          </div>
          <label className="level-chip-picker">
            <span>Cấp độ</span>
            <select onChange={(event) => onSelectLevel(event.target.value as JlptLevel)} value={level}>
              <option value="N5">N5</option>
              <option value="N4">N4</option>
              <option value="N3">N3</option>
              <option value="N2">N2</option>
              <option value="N1">N1</option>
            </select>
          </label>
        </div>
      </div>

      <div className="practice-shell">
        <div className="practice-summary-card">
          <div>
            <p className="eyebrow">Gợi ý luyện tập</p>
            <h2>Chọn đề phù hợp với mục tiêu của bạn</h2>
            <p>Tìm đề theo tên, xem số câu và thời gian làm bài trước khi bắt đầu.</p>
          </div>
          <div className="practice-summary-stats" aria-label="Thông tin tổng quan">
            <div>
              <strong>{exams.length}</strong>
              <span>đề mẫu</span>
            </div>
            <div>
              <strong>{totalQuestions}</strong>
              <span>câu hỏi</span>
            </div>
            <div>
              <strong>{completedExamIds.length}</strong>
              <span>đề đã làm</span>
            </div>
          </div>
        </div>

        <div className="practice-tools">
          <label className="search-field practice-search">
            <span>Tìm đề theo tên</span>
            <input
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Nhập tên đề như N5 Mock Test"
              type="search"
              value={searchTerm}
            />
          </label>
          <label className="filter-field">
            <span>Chọn cấp độ</span>
            <select onChange={(event) => onSelectLevel(event.target.value as JlptLevel)} value={level}>
              <option value="N5">N5</option>
              <option value="N4">N4</option>
              <option value="N3">N3</option>
              <option value="N2">N2</option>
              <option value="N1">N1</option>
            </select>
          </label>
        </div>

        {visibleExams.length > 0 ? (
          <div className="exam-list">
            {visibleExams.map((exam) => (
              <article className="exam-card" key={exam.id}>
                <div>
                  <div className="card-topline">
                    <span className="badge">{exam.level}</span>
                    <span>{exam.difficulty}</span>
                  </div>
                  {completedExamIds.includes(exam.id) ? <span className="badge completed-badge">Đã làm</span> : null}
                  <h2>{exam.title}</h2>
                  <p>{exam.description}</p>
                </div>
                <div className="exam-stats" aria-label="Thông tin đề">
                  <span>Số câu: {exam.questions.length}</span>
                  <span>Thời gian làm bài: {exam.durationMinutes} phút</span>
                </div>
                <button className="primary-button" onClick={() => onStartExam(exam)} type="button">
                  Bắt đầu làm bài
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Không tìm thấy đề phù hợp</h3>
            <p>Hãy thử từ khóa khác hoặc xóa bộ lọc để xem toàn bộ đề.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export function PracticeView({
  answers,
  currentQuestionIndex,
  exam,
  flags,
  isSubmitted,
  onBackToExams,
  onChangeQuestion,
  onExit,
  onRetry,
  onSubmit,
  onToggleFlag,
  onUpdateAnswer,
}: PracticeViewProps) {
  const currentQuestion = exam.questions[currentQuestionIndex];
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [exitCountdown, setExitCountdown] = useState(5);

  function confirmSubmit() {
    const confirmed = window.confirm("Bạn chắc chắn muốn nộp bài? Kết quả sẽ hiện ngay trong màn này.");
    if (confirmed) {
      onSubmit();
    }
  }

  function openExitDialog() {
    setExitCountdown(5);
    setShowExitDialog(true);
  }

  useEffect(() => {
    if (!showExitDialog || exitCountdown <= 0) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setExitCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [exitCountdown, showExitDialog]);

  return (
    <section className="practice-layout">
      {isSubmitted ? (
        <div className="result-placeholder-card" style={{ marginBottom: "1rem" }}>
          <p className="eyebrow">Đã nộp bài</p>
          <h3>Bài làm của bạn đã được lưu vào bảng tổng hợp kết quả.</h3>
          <p>Hãy mở trang Results ở thanh điều hướng để xem điểm tổng hợp và các bài đã hoàn thành.</p>
        </div>
      ) : null}

      <article className="question-card">
        <div className="question-header">
          <span className="badge">Câu {currentQuestionIndex + 1}</span>
          <span className="type-label">{getQuestionTypeLabel(currentQuestion)}</span>
          <span>
            {currentQuestionIndex + 1}/{exam.questions.length}
          </span>
        </div>

        {currentQuestion.type === "listening" ? (
          <div className="audio-player">
            {currentQuestion.audioSrc ? (
              <audio controls preload="metadata" src={currentQuestion.audioSrc}>
                Trình duyệt của bạn không hỗ trợ phát audio.
              </audio>
            ) : (
              <button className="audio-fallback-button" onClick={() => playListeningQuestion(currentQuestion)} type="button">
                Play file nghe
              </button>
            )}
          </div>
        ) : null}

        <h2>{currentQuestion.prompt}</h2>

        <QuestionAnswer
          answer={answers[currentQuestion.id] ?? ""}
          question={currentQuestion}
          onUpdateAnswer={(answer) => onUpdateAnswer(currentQuestion.id, answer)}
        />

        <div className="question-actions">
          <button
            className="secondary-button"
            disabled={currentQuestionIndex === 0}
            onClick={() => onChangeQuestion(currentQuestionIndex - 1)}
            type="button"
          >
            Câu trước
          </button>
          <button
            className={flags[currentQuestion.id] ? "review-button marked" : "review-button"}
            onClick={() => onToggleFlag(currentQuestion.id)}
            type="button"
          >
            <Flag aria-hidden="true" size={18} />
            {flags[currentQuestion.id] ? "Bỏ đánh dấu" : "Mark for review"}
          </button>
          <button
            className="secondary-button"
            disabled={currentQuestionIndex === exam.questions.length - 1}
            onClick={() => onChangeQuestion(currentQuestionIndex + 1)}
            type="button"
          >
            Câu tiếp
          </button>
        </div>
      </article>

      <aside className="navigation-map">
        <div className="map-header">
          <h2>Navigation Map</h2>
          <span>{exam.level}</span>
        </div>

        <div className="map-legend">
          <span>
            <i className="legend-dot answered-dot" />
            Đã làm
          </span>
          <span>
            <i className="legend-dot current-dot" />
            Hiện tại
          </span>
          <span>
            <i className="legend-dot empty-dot" />
            Chưa làm
          </span>
          <span>
            <i className="legend-dot flagged-dot" />
            Cần xem lại
          </span>
        </div>

        <div className="question-jump map-grid">
          {exam.questions.map((question, index) => {
            const isAnswered = isQuestionAnswered(question, answers[question.id]);
            const isFlagged = flags[question.id];

            return (
              <button
                className={[
                  "jump-button",
                  index === currentQuestionIndex ? "active" : "",
                  isAnswered ? "answered" : "",
                  isFlagged ? "flagged" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={question.id}
                onClick={() => onChangeQuestion(index)}
                type="button"
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <button className="primary-button submit-button" onClick={confirmSubmit} type="button">
          Nộp bài
        </button>
        <button className="danger-button" onClick={openExitDialog} type="button">
          Thoát bài làm
        </button>
      </aside>

      {showExitDialog ? (
        <div className="modal-backdrop" role="presentation">
          <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="exit-title">
            <p className="eyebrow">Hành động nguy hiểm</p>
            <h2 id="exit-title">Thoát khỏi bài làm?</h2>
            <p>
              Toàn bộ đáp án và đánh dấu hiện tại sẽ không được lưu. Bạn cần chờ 5 giây trước khi xác nhận
              để tránh bấm nhầm.
            </p>
            <div className="dialog-actions">
              <button className="secondary-button" onClick={() => setShowExitDialog(false)} type="button">
                Tiếp tục làm bài
              </button>
              <button className="danger-button" disabled={exitCountdown > 0} onClick={onExit} type="button">
                {exitCountdown > 0 ? `Xác nhận sau ${exitCountdown}s` : "Xác nhận thoát"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
