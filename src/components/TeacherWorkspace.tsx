import { useState } from "react";
import { exams } from "../data/exams";
import type { JlptLevel } from "../types";
import { getQuestionTypeLabel } from "../utils/practice";

type TeacherWorkspaceProps = {
  activeView: "dashboard" | "question-bank" | "exam-management" | "results";
};

export function TeacherWorkspace({ activeView }: TeacherWorkspaceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | JlptLevel>("all");

  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.title.toLocaleLowerCase("vi-VN").includes(searchTerm.toLocaleLowerCase("vi-VN"));
    const matchesLevel = levelFilter === "all" || exam.level === levelFilter;
    return matchesSearch && matchesLevel;
  });
  const currentExam = filteredExams[0] ?? exams[0];

  if (activeView === "question-bank") {
    const totalQuestions = exams.reduce((total, exam) => total + exam.questions.length, 0);

    return (
      <section className="teacher-page">
        <div className="teacher-heading">
          <p className="eyebrow">Question Bank</p>
          <h1>Ngân hàng câu hỏi</h1>
          <p>Quản lý sơ bộ các câu hỏi theo cấp độ và dạng bài. Bản chi tiết có thể tách thành trang riêng sau.</p>
        </div>
        <div className="teacher-grid">
          <article className="teacher-card metric-card">
            <strong>{totalQuestions}</strong>
            <span>Tổng số câu hỏi mẫu</span>
          </article>
          <article className="teacher-card metric-card">
            <strong>4</strong>
            <span>Dạng bài: trắc nghiệm, sắp xếp, điền, nghe</span>
          </article>
          <article className="teacher-card metric-card">
            <strong>{exams.length}</strong>
            <span>Đề đang có trong demo</span>
          </article>
        </div>
      </section>
    );
  }

  if (activeView === "exam-management") {
    return (
      <section className="teacher-page">
        <div className="teacher-heading">
          <p className="eyebrow">Exam Management</p>
          <h1>Quản lý một đề thi</h1>
          <p>Chỉnh metadata của đề, import câu hỏi, thêm câu hỏi nhanh và xem danh sách câu hỏi thuộc đề đang chọn.</p>
        </div>

        <div className="exam-editor-header">
          <label className="exam-title-field">
            <span>Tên đề thi</span>
            <textarea defaultValue={currentExam.title} rows={2} />
          </label>
          <div className="exam-meta-grid">
            <label className="filter-field">
              <span>Cấp độ đề</span>
              <select defaultValue={currentExam.level}>
                <option value="N5">N5</option>
                <option value="N4">N4</option>
                <option value="N3">N3</option>
                <option value="N2">N2</option>
                <option value="N1">N1</option>
              </select>
            </label>
            <label className="filter-field">
              <span>Mức độ</span>
              <select defaultValue={currentExam.difficulty}>
                <option value="Dễ">Dễ</option>
                <option value="Vừa">Vừa</option>
                <option value="Khó">Khó</option>
              </select>
            </label>
            <label className="filter-field">
              <span>Thời gian</span>
              <div className="duration-input">
                <input defaultValue={currentExam.durationMinutes} type="number" />
                <span>phút</span>
              </div>
            </label>
          </div>
        </div>

        <div className="teacher-tools">
          <label className="search-field">
            <span>Tìm kiếm đề thi</span>
            <input
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Nhập tên đề để chuyển đề đang chỉnh"
              type="search"
              value={searchTerm}
            />
          </label>
          <label className="filter-field">
            <span>Lọc cấp độ</span>
            <select onChange={(event) => setLevelFilter(event.target.value as "all" | JlptLevel)} value={levelFilter}>
              <option value="all">Tất cả</option>
              <option value="N5">N5</option>
              <option value="N4">N4</option>
              <option value="N3">N3</option>
              <option value="N2">N2</option>
              <option value="N1">N1</option>
            </select>
          </label>
        </div>

        <section className="exam-builder-grid">
          <div className="import-panel">
            <div>
              <h2>Import đề</h2>
              <p>Kéo thả file Excel/JSON hoặc chọn file từ máy tính. Bản demo chưa parse file thật.</p>
            </div>
            <div className="drop-zone">
              <strong>Drop Excel hoặc JSON tại đây</strong>
              <span>Dung lượng tối đa: 10MB</span>
              <button className="primary-button" type="button">
                Tải file lên
              </button>
            </div>
            <div className="import-help">
              <div className="import-format-list">
                <span>Excel: .xlsx</span>
                <span>JSON: .json</span>
                <span>Audio: .mp3/.wav/.m4a</span>
              </div>
              <button className="secondary-button" type="button">
                Tải file mẫu
              </button>
              <div className="audio-import-note">
                <strong>Audio cho câu nghe</strong>
                <p>
                  Khi import câu nghe, giáo viên upload file audio cùng gói đề. Trường
                  <code>audioFile</code> trong JSON cần trùng tên file, ví dụ
                  <code>listening-n3-01.mp3</code>.
                </p>
              </div>
              <pre>{`{
  "title": "Đề luyện N3 tổng hợp",
  "level": "N3",
  "durationMinutes": 30,
  "questions": [
    {
      "type": "multiple-choice",
      "prompt": "忙しい（　）、勉強しています。",
      "choices": ["ながら", "ために", "けれども", "ばかり"],
      "correctAnswer": "けれども"
    },
    {
      "type": "ordering",
      "prompt": "Sắp xếp thành câu đúng",
      "fragments": ["もう一度", "ノートを", "読んで", "おきます"],
      "correctOrder": [0, 1, 2, 3]
    },
    {
      "type": "fill-blank",
      "prompt": "Điền nghĩa tiếng Việt của 「予約」",
      "correctText": "đặt trước",
      "acceptedAnswers": ["đặt chỗ", "dat truoc"]
    },
    {
      "type": "listening",
      "prompt": "Nghe và chọn ý đúng",
      "audioFile": "listening-n3-01.mp3",
      "choices": ["Đọc lại vở ghi", "Đi bộ đến ga", "Đặt chỗ", "Gọi điện"],
      "correctAnswer": "Đọc lại vở ghi"
    }
  ]
}`}</pre>
            </div>
          </div>

          <form className="quick-question-card">
            <h2>Thêm câu hỏi nhanh</h2>
            <label className="auth-field">
              <span>Nội dung câu hỏi</span>
              <textarea placeholder="Nhập câu hỏi tiếng Nhật hoặc tiếng Việt..." rows={4} />
            </label>
            <div className="quick-question-grid">
              <label className="auth-field">
                <span>Đáp án đúng</span>
                <input placeholder="Ví dụ: a hoặc げつようび" type="text" />
              </label>
              <label className="auth-field">
                <span>Dạng bài</span>
                <select defaultValue="multiple-choice">
                  <option value="multiple-choice">Trắc nghiệm</option>
                  <option value="ordering">Sắp xếp từ</option>
                  <option value="fill-blank">Điền ô trống</option>
                  <option value="listening">Nghe hiểu</option>
                </select>
              </label>
            </div>
            <button className="primary-button" type="button">
              Lưu câu hỏi
            </button>
          </form>
        </section>

        <section className="questions-list-panel">
          <div className="questions-list-header">
            <div>
              <h2>Danh sách câu hỏi</h2>
              <p>{currentExam.questions.length} câu trong đề: {currentExam.title}</p>
            </div>
            <button className="secondary-button" type="button">
              Xuất file
            </button>
          </div>
          <div className="question-admin-list">
            {currentExam.questions.map((question, index) => (
              <article className="question-admin-row" key={question.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{question.prompt}</strong>
                  <small>{getQuestionTypeLabel(question)}</small>
                </div>
                <button className="secondary-button" type="button">
                  Sửa
                </button>
                <button className="danger-button compact-danger" type="button">
                  Xóa
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>
    );
  }

  if (activeView === "results") {
    return (
      <section className="teacher-page">
        <div className="teacher-heading">
          <p className="eyebrow">Result</p>
          <h1>Kết quả học sinh tổng quan</h1>
          <p>Dashboard sơ bộ để xem overall performance. Phần chi tiết từng học sinh/lớp sẽ phát triển sau.</p>
        </div>
        <div className="teacher-grid">
          <article className="teacher-card metric-card">
            <strong>82%</strong>
            <span>Điểm trung bình demo</span>
          </article>
          <article className="teacher-card metric-card">
            <strong>124</strong>
            <span>Lượt làm bài tháng này</span>
          </article>
          <article className="teacher-card metric-card">
            <strong>N3</strong>
            <span>Cấp độ được luyện nhiều nhất</span>
          </article>
        </div>
      </section>
    );
  }

  return (
    <section className="teacher-page">
      <div className="teacher-heading">
        <p className="eyebrow">Teacher Dashboard</p>
        <h1>Không gian giáo viên Januit</h1>
        <p>Quản lý đề thi, ngân hàng câu hỏi và xem nhanh kết quả học sinh từ một giao diện riêng cho giáo viên.</p>
      </div>
      <div className="teacher-grid">
        <article className="teacher-card">
          <h2>Question Bank</h2>
          <p>Tổng hợp câu hỏi theo JLPT level và dạng bài.</p>
        </article>
        <article className="teacher-card">
          <h2>Exam Management</h2>
          <p>Tìm kiếm, lọc, import và chuẩn bị xuất bản đề thi.</p>
        </article>
        <article className="teacher-card">
          <h2>Result</h2>
          <p>Xem overall kết quả học sinh để nắm tình hình lớp.</p>
        </article>
      </div>
    </section>
  );
}
