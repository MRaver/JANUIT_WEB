import { useMemo } from "react";
import type { Answers, PracticeExam, PracticeResultSummary } from "../../types";
import { getAnswerLabel, getCorrectAnswerLabel, getQuestionTypeLabel, isQuestionCorrect } from "../../utils/practice";
import { exams } from "../../data/exams";

type ResultsViewProps = {
  answers: Answers;
  exam: PracticeExam | null;
  examResults: Record<string, PracticeResultSummary>;
  onBackToDashboard: () => void;
  onRetry: () => void;
  score: number;
  totalQuestions: number;
};

export function ResultsView({ answers, exam, examResults, onBackToDashboard, onRetry, score, totalQuestions }: ResultsViewProps) {
  const percent = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const completedResults = Object.values(examResults)
    .filter((result) => result.totalQuestions > 0)
    .sort((left, right) => right.score / right.totalQuestions - left.score / left.totalQuestions);
  const totalScore = completedResults.reduce((sum, result) => sum + result.score, 0);
  const totalQuestionsCount = completedResults.reduce((sum, result) => sum + result.totalQuestions, 0);
  const overallPercent = totalQuestionsCount > 0 ? Math.round((totalScore / totalQuestionsCount) * 100) : 0;

  const skillBreakdown = useMemo(() => {
    if (!exam) {
      return [];
    }

    const buckets = new Map<string, { correct: number; total: number }>([
      ["Ngữ pháp", { correct: 0, total: 0 }],
      ["Từ vựng", { correct: 0, total: 0 }],
      ["Nghe", { correct: 0, total: 0 }],
    ]);

    exam.questions.forEach((question) => {
      const answer = answers[question.id];
      const isCorrect = isQuestionCorrect(question, answer);
      let bucket = "Ngữ pháp";

      if (question.type === "listening") {
        bucket = "Nghe";
      } else if (question.type === "multiple-choice") {
        const prompt = question.prompt.toLowerCase();
        if (prompt.includes("nghĩa") || prompt.includes("từ") || prompt.includes("từ vựng") || prompt.includes("vocabulary")) {
          bucket = "Từ vựng";
        }
      } else if (question.type === "fill-blank") {
        const prompt = question.prompt.toLowerCase();
        if (prompt.includes("nghĩa") || prompt.includes("từ") || prompt.includes("từ vựng")) {
          bucket = "Từ vựng";
        }
      }

      const current = buckets.get(bucket) ?? { correct: 0, total: 0 };
      current.total += 1;
      if (isCorrect) {
        current.correct += 1;
      }
      buckets.set(bucket, current);
    });

    return Array.from(buckets.entries()).map(([name, values]) => ({
      name,
      total: values.total,
      correct: values.correct,
      percent: values.total > 0 ? Math.round((values.correct / values.total) * 100) : 0,
    }));
  }, [answers, exam]);

  const levelPerformance = useMemo(() => {
    const levels: Array<"N5" | "N4" | "N3" | "N2" | "N1"> = ["N5", "N4", "N3", "N2", "N1"];

    return levels.map((level) => {
      const matchingResults = completedResults.filter((result) => {
        const resultExam = exams.find((item) => item.id === result.examId);
        return resultExam?.level === level;
      });

      const total = matchingResults.reduce((sum, result) => sum + result.totalQuestions, 0);
      const score = matchingResults.reduce((sum, result) => sum + result.score, 0);
      return {
        level,
        percent: total > 0 ? Math.round((score / total) * 100) : 0,
        completed: matchingResults.length,
      };
    });
  }, [completedResults]);

  const weakestSkill = skillBreakdown.reduce((weakest, current) => {
    if (!weakest || current.percent < weakest.percent) {
      return current;
    }
    return weakest;
  }, null as { name: string; percent: number } | null);

  return (
    <section className="page-section">
      <div className="result-hero">
        <div>
          <p className="eyebrow">Kết quả tổng hợp</p>
          <h1>
            Bạn đã đạt {totalScore}/{totalQuestionsCount} câu đúng trên {completedResults.length} bài đã làm
          </h1>
          <p>
            Đây là bảng tổng hợp phong độ của bạn: điểm số theo từng kỹ năng, xu hướng theo cấp độ JLPT và các lĩnh vực cần cải thiện.
          </p>
          <div className="result-actions">
            <button className="primary-button" onClick={onRetry} type="button">
              Làm đề mới
            </button>
            <button className="secondary-button" onClick={onBackToDashboard} type="button">
              Về Dashboard
            </button>
          </div>
        </div>
        <div className="score-ring" aria-label={`Điểm ${overallPercent}%`} style={{ "--score": `${overallPercent}%` } as React.CSSProperties}>
          {overallPercent}%
        </div>
      </div>

      <div className="result-dashboard-grid">
        <article className="result-card">
          <p className="eyebrow">Phân tích kỹ năng</p>
          <h3>Đang thiếu ở đâu?</h3>
          <div className="skill-list">
            {skillBreakdown.map((skill) => (
              <div className="skill-row" key={skill.name}>
                <div className="skill-row-top">
                  <span>{skill.name}</span>
                  <strong>{skill.percent}%</strong>
                </div>
                <div className="skill-bar-track" aria-label={`${skill.name} ${skill.percent}%`}>
                  <div className="skill-bar-fill" style={{ width: `${skill.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="result-card">
          <p className="eyebrow">Xu hướng theo cấp độ</p>
          <h3>Điểm theo N5 → N1</h3>
          <div className="level-chart">
            {levelPerformance.map((item) => (
              <div className="level-bar-row" key={item.level}>
                <span>{item.level}</span>
                <div className="level-bar-track">
                  <div className="level-bar-fill" style={{ height: `${Math.max(item.percent, 8)}%` }} />
                </div>
                <strong>{item.percent}%</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="result-card">
          <p className="eyebrow">Nhận định</p>
          <h3>{weakestSkill ? `Bạn cần cải thiện ${weakestSkill.name.toLowerCase()}` : "Đang ổn định"}</h3>
          <p>
            {overallPercent >= 70
              ? "Bạn đang có tiến trình rất tốt. Hãy duy trì nhịp độ và mở rộng kỹ năng ở mức độ khó hơn."
              : "Bạn đã có nền tảng ổn. Hãy ôn lại phần còn yếu để tăng tỷ lệ đúng và tự tin hơn ở các đề tiếp theo."}
          </p>
        </article>
      </div>

      <div className="result-placeholder-grid">
        <article className="result-placeholder-card">
          <p className="eyebrow">Bài vừa làm</p>
          <h3>{exam?.title ?? "Chưa có đề nào được làm"}</h3>
          <p>
            {exam
              ? `Bạn đúng ${score}/${totalQuestions} câu, đạt ${percent}%.`
              : "Bạn có thể bắt đầu làm một đề luyện tập từ trang Practice."}
          </p>
        </article>
        <article className="result-placeholder-card">
          <p className="eyebrow">Danh sách bài đã làm</p>
          <ul>
            {completedResults.map((result) => {
              const resultExam = exams.find((item) => item.id === result.examId);
              const resultPercent = Math.round((result.score / result.totalQuestions) * 100);

              return (
                <li key={result.examId}>
                  <strong>{resultExam?.title ?? "Đề luyện tập"}</strong> · {result.score}/{result.totalQuestions} ({resultPercent}%)
                </li>
              );
            })}
          </ul>
        </article>
        <article className="result-placeholder-card">
          <p className="eyebrow">Lộ trình tiếp theo</p>
          <ul>
            <li>Ôn lại phần Ngữ pháp còn yếu</li>
            <li>Luyện thêm từ vựng theo chủ đề</li>
            <li>Nghe nhiều câu mẫu ở cấp độ tương đương</li>
          </ul>
        </article>
      </div>

      {exam ? (
        <div className="review-list">
          {exam.questions.map((question, index) => {
            const answer = answers[question.id];
            const isCorrect = isQuestionCorrect(question, answer);

            return (
              <article className="review-card" key={question.id}>
                <div className="review-header">
                  <span className={isCorrect ? "status correct" : "status wrong"}>
                    {isCorrect ? "Đúng" : "Cần xem lại"}
                  </span>
                  <span>
                    Câu {index + 1} · {getQuestionTypeLabel(question)}
                  </span>
                </div>
                <h2>{question.prompt}</h2>
                <p>
                  Bạn nhập/chọn: <strong>{getAnswerLabel(question, answer)}</strong>
                </p>
                <p>
                  Đáp án đúng: <strong>{getCorrectAnswerLabel(question)}</strong>
                </p>
                {question.explanation ? <p className="explanation">{question.explanation}</p> : null}
              </article>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
