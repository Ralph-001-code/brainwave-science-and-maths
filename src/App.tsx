import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useSeo } from "./lib/useSeo";

const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Years = lazy(() => import("./pages/Years"));
const Settings = lazy(() => import("./pages/Settings"));
const AvatarStudio = lazy(() => import("./pages/AvatarStudio"));
const Programmes = lazy(() => import("./pages/Programmes"));
const Checkpoint = lazy(() => import("./pages/Checkpoint"));
const Igcse = lazy(() => import("./pages/Igcse"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Pathway = lazy(() => import("./pages/Pathway"));
const Certificates = lazy(() => import("./pages/Certificates"));
const DailyQuiz = lazy(() => import("./pages/DailyQuiz"));
const Practice = lazy(() => import("./pages/Practice"));
const PastPapers = lazy(() => import("./pages/PastPapers"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Friends = lazy(() => import("./pages/Friends"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));

function PageLoader() {
  return <div className="app-bg" style={{ minHeight: "40vh" }} />;
}

function RouteSpinner() {
  return (
    <div className="app-bg" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
      <div className="spinner" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <RouteSpinner />;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function StudentRoute({ children }: { children: React.ReactNode }) {
  const { profile, isAdmin } = useAuth();
  if (isAdmin) return <>{children}</>;
  if (profile?.role === "teacher") return <Navigate to="/teacher" replace />;
  return <>{children}</>;
}

function TeacherRoute({ children }: { children: React.ReactNode }) {
  const { profile, isAdmin } = useAuth();
  if (isAdmin) return <>{children}</>;
  if (profile && profile.role !== "teacher" && profile.role !== "guardian") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  useSeo({
    title: "Brainwave Science & Maths | Learn, Practice & Master Maths",
    description: "Free maths and science learning platform for Year 1 to IGCSE. Take daily quizzes, practice Cambridge-style past paper questions, earn XP, and track your progress.",
  });

  return (
    <div className="app-bg" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, paddingTop: 68 }}>
        <Routes>
          <Route path="/" element={<Suspense fallback={<PageLoader />}><Landing /></Suspense>} />
          <Route path="/auth" element={<Suspense fallback={<PageLoader />}><Auth /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
          <Route path="/privacy" element={<Suspense fallback={<PageLoader />}><Privacy /></Suspense>} />
          <Route path="/dashboard" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><Dashboard /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="/teacher" element={<ProtectedRoute><TeacherRoute><Suspense fallback={<PageLoader />}><TeacherDashboard /></Suspense></TeacherRoute></ProtectedRoute>} />
          <Route path="/years" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><Years /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="/programmes" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><Programmes /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="/primary" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><Years /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="/checkpoint" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><Checkpoint /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="/igcse" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><Igcse /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><Settings /></Suspense></ProtectedRoute>} />
          <Route path="/avatar" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AvatarStudio /></Suspense></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><Leaderboard /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><Friends /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="/pathway" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><Pathway /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="/certificates" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><Certificates /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="/past-papers" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><PastPapers /></Suspense></StudentRoute></ProtectedRoute>} />
          {/* Quiz routes — programme-aware */}
          <Route path="/quiz/:yearId/:topicId" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><Quiz /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="/quiz/checkpoint/:stage/:subject/:topicId" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><Quiz /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="/quiz/igcse/:igcseSubject/:topicId" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><Quiz /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="/daily" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><DailyQuiz /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="/practice" element={<ProtectedRoute><StudentRoute><Suspense fallback={<PageLoader />}><Practice /></Suspense></StudentRoute></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
