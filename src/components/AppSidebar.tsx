import { UserCircle } from "lucide-react";
import schoolLogo from "../assets/logo_uit_updated.png";
import type { AppView, DemoUser, TeacherView } from "../types";

type AppSidebarProps = {
  authView: "signin" | "signup" | null;
  demoUser: DemoUser | null;
  onOpenAuth: (view: "signin" | "signup") => void;
  onOpenPractice: () => void;
  onOpenResults: () => void;
  onResetToLevels: () => void;
  onSignOut: () => void;
  onTeacherView: (view: TeacherView) => void;
  studentView: AppView;
  teacherView: TeacherView;
};

export function AppSidebar({
  authView,
  demoUser,
  onOpenAuth,
  onOpenPractice,
  onOpenResults,
  onResetToLevels,
  onSignOut,
  onTeacherView,
  studentView,
  teacherView,
}: AppSidebarProps) {
  const isTeacher = demoUser?.role === "teacher";

  return (
    <aside className="side-nav">
      <div className="side-brand">
        <button className="brand-button" onClick={onResetToLevels} type="button">
          <img className="school-logo" src={schoolLogo} alt="Logo UIT" />
          <strong>Januit</strong>
        </button>
        <p>{isTeacher ? "Instructor Access" : "JLPT Practice"}</p>
      </div>

      {isTeacher ? (
        <nav className="side-nav-list" aria-label="Điều hướng giáo viên">
          <button
            className={teacherView === "dashboard" ? "side-nav-item active" : "side-nav-item"}
            onClick={() => onTeacherView("dashboard")}
            type="button"
          >
            Dashboard
          </button>
          <button
            className={teacherView === "question-bank" ? "side-nav-item active" : "side-nav-item"}
            onClick={() => onTeacherView("question-bank")}
            type="button"
          >
            Question Bank
          </button>
          <button
            className={teacherView === "exam-management" ? "side-nav-item active" : "side-nav-item"}
            onClick={() => onTeacherView("exam-management")}
            type="button"
          >
            Exam Management
          </button>
          <button
            className={teacherView === "results" ? "side-nav-item active" : "side-nav-item"}
            onClick={() => onTeacherView("results")}
            type="button"
          >
            Result
          </button>
        </nav>
      ) : (
        <nav className="side-nav-list" aria-label="Điều hướng học sinh">
          <button
            className={studentView === "dashboard" && !authView ? "side-nav-item active" : "side-nav-item"}
            onClick={onResetToLevels}
            type="button"
          >
            Dashboard
          </button>
          <button
            className={studentView === "practice" ? "side-nav-item active muted" : "side-nav-item muted"}
            onClick={() => {
              if (!authView) {
                onOpenPractice();
              }
            }}
            type="button"
          >
            Practice
          </button>
          <button
            className={studentView === "results" ? "side-nav-item active muted" : "side-nav-item muted"}
            onClick={() => {
              if (!authView) {
                onOpenResults();
              }
            }}
            type="button"
          >
            Results
          </button>
        </nav>
      )}

      <div className="side-auth">
        {demoUser ? (
          <>
            <div className="side-user">
              <span className="avatar-pill" aria-hidden="true">
                <UserCircle size={24} />
              </span>
              <div>
                <strong>{demoUser.name}</strong>
                <span>{demoUser.role === "teacher" ? "Giáo viên" : "Học sinh"}</span>
              </div>
            </div>
            <button className="signin-button side-auth-button" onClick={onSignOut} type="button">
              Log Out
            </button>
          </>
        ) : (
          <>
            <button className="signin-button side-auth-button" onClick={() => onOpenAuth("signin")} type="button">
              Sign In
            </button>
            <button className="signup-button side-auth-button" onClick={() => onOpenAuth("signup")} type="button">
              Sign Up
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
