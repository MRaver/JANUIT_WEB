import schoolLogo from "../../assets/logo_uit_updated.png";
import { exams, jlptLevels } from "../../data/exams";

export function DashboardView() {
  return (
    <section className="page-section">
      <div className="intro-hero">
        <div className="hero-badge">
          <img src={schoolLogo} alt="Logo UIT" />
          <span>CNNB Exclusive</span>
        </div>
        <h1>Ôn thi JLPT dễ dàng hơn cùng Januit</h1>
        <p>
          Januit giúp bạn luyện đề JLPT theo từng cấp độ, đánh giá kết quả ngay lập tức và theo dõi tiến trình học.
          Truy cập Practice từ thanh điều hướng để chọn cấp độ và bắt đầu luyện tập.
        </p>
      </div>

      <div className="feature-grid">
        <article className="feature-card">
          <h2>Đề thi mô phỏng</h2>
          <p>Luyện làm đề theo chuẩn JLPT với phần nghe, ngữ pháp và từ vựng.</p>
        </article>
        <article className="feature-card">
          <h2>Phân tích kết quả</h2>
          <p>Xem ngay điểm số, kỹ năng yếu và xu hướng tiến bộ theo cấp độ.</p>
        </article>
        <article className="feature-card">
          <h2>Giao diện rõ ràng</h2>
          <p>Thiết kế đơn giản, dễ dùng và phù hợp với học viên mới bắt đầu.</p>
        </article>
      </div>

    </section>
  );
}
