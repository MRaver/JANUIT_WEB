import { useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { AccountRole } from "../types";

type AuthPageProps = {
  mode: "signin" | "signup";
  onBack: () => void;
  onComplete: (role: AccountRole, name: string) => void;
  onSwitchMode: (mode: "signin" | "signup") => void;
};

export function AuthPage({ mode, onBack, onComplete, onSwitchMode }: AuthPageProps) {
  const [role, setRole] = useState<AccountRole>("student");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isSignin = mode === "signin";
  const roleLabel = role === "teacher" ? "Giáo viên" : "Học sinh";

  function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onComplete(role, name.trim() || (role === "teacher" ? "Sensei Demo" : "Học sinh Demo"));
  }

  return (
    <section className="auth-page">
      <div className="auth-copy">
        <p className="eyebrow">Demo tài khoản</p>
        <h1>{isSignin ? "Đăng nhập vào Januit" : "Tạo tài khoản Januit"}</h1>
        <p>
          Chọn vai trò học sinh hoặc giáo viên để demo luồng sử dụng. Bản MVP chưa lưu dữ liệu thật,
          nhưng giao diện đã sẵn sàng để nối backend sau này.
        </p>
        <div className="demo-account-list">
          <div>
            <strong>Tài khoản học sinh demo</strong>
            <span>Email: student@januit.demo</span>
            <span>Mật khẩu: demo1234</span>
          </div>
          <div>
            <strong>Tài khoản giáo viên demo</strong>
            <span>Email: teacher@januit.demo</span>
            <span>Mật khẩu: demo1234</span>
          </div>
        </div>
      </div>

      <form className="auth-card" onSubmit={submitAuth}>
        <button className="ghost-button auth-back" onClick={onBack} type="button">
          ← Quay lại
        </button>

        <div className="auth-mode-switch">
          <button className={isSignin ? "active" : ""} onClick={() => onSwitchMode("signin")} type="button">
            Sign In
          </button>
          <button className={!isSignin ? "active" : ""} onClick={() => onSwitchMode("signup")} type="button">
            Sign Up
          </button>
        </div>

        <div className="role-selector" aria-label="Chọn loại tài khoản">
          <button className={role === "student" ? "role-card active" : "role-card"} onClick={() => setRole("student")} type="button">
            <strong>Học sinh</strong>
            <small>Luyện đề và xem kết quả</small>
          </button>
          <button className={role === "teacher" ? "role-card active" : "role-card"} onClick={() => setRole("teacher")} type="button">
            <strong>Giáo viên</strong>
            <small>Đăng đề và quản lý lớp</small>
          </button>
        </div>

        {!isSignin ? (
          <label className="auth-field">
            <span>Họ tên</span>
            <input
              onChange={(event) => setName(event.target.value)}
              placeholder={role === "teacher" ? "Sensei Demo" : "Học sinh Demo"}
              type="text"
              value={name}
            />
          </label>
        ) : null}

        <label className="auth-field">
          <span>Email</span>
          <input
            defaultValue={role === "teacher" ? "teacher@januit.demo" : "student@januit.demo"}
            placeholder="name@company.com"
            type="email"
          />
        </label>

        <label className="auth-field">
          <span>Mật khẩu</span>
          <div className="password-field">
            <input defaultValue="demo1234" type={showPassword ? "text" : "password"} />
            <button
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <button className="primary-button auth-submit" type="submit">
          {isSignin ? `Đăng nhập với vai trò ${roleLabel}` : `Tạo tài khoản ${roleLabel}`}
        </button>
      </form>
    </section>
  );
}
