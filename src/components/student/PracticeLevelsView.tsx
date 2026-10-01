import { useMemo, useState } from "react";
import schoolLogo from "../../assets/logo_uit_updated.png";
import { exams, jlptLevels } from "../../data/exams";
import type { JlptLevel } from "../../types";

type PracticeLevelsViewProps = {
  onChooseLevel: (level: JlptLevel) => void;
};

export function PracticeLevelsView({ onChooseLevel }: PracticeLevelsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLevels = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return jlptLevels;
    }

    return jlptLevels.filter((item) => {
      const haystack = `${item.level} ${item.label} ${item.summary}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [searchTerm]);

  return (
    <section className="page-section">
      <div className="section-heading">
        <h1>Chọn cấp độ luyện tập</h1>
        <p>Chọn một cấp độ để bắt đầu luyện tập hoặc tìm kiếm đề thi phù hợp.</p>
      </div>

      <div className="practice-tools" style={{ marginBottom: 22 }}>
        <label className="search-field practice-search">
          <span>Tìm cấp độ</span>
          <input
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Nhập N5, N4, N3... hoặc tên cấp độ"
            type="search"
            value={searchTerm}
          />
        </label>
      </div>

      <div className="level-grid practice-level-grid">
        {filteredLevels.map((item) => {
          const examCount = exams.filter((exam) => exam.level === item.level).length;

          return (
            <button className="level-card" key={item.level} onClick={() => onChooseLevel(item.level)} type="button">
              <span className="level-code">{item.level}</span>
              <span className="level-title">{item.label}</span>
              <span className="level-summary">{item.summary}</span>
              <span className="level-meta">{examCount} đề mẫu</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
