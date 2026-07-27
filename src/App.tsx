import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Years from "./pages/Years";
import Settings from "./pages/Settings";
import Programmes from "./pages/Programmes";
import Checkpoint from "./pages/Checkpoint";
import Igcse from "./pages/Igcse";
import Quiz from "./pages/Quiz";
import Pathway from "./pages/Pathway";
import Certificates from "./pages/Certificates";
import DailyQuiz from "./pages/DailyQuiz";
import Practice from "./pages/Practice";
import PastPapers from "./pages/PastPapers";
import TeacherDashboard from "./pages/TeacherDashboard";
import Leaderboard from "./pages/Leaderboard";
import Friends from "./pages/Friends";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import { useSeo } from "./lib/useSeo";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  if (loading) {
    return (
      <div className="app-bg" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="spinner" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function StudentRoute({ children }: { children: React.ReactNode }) {
  const { profile, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="app-bg" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="spinner" />
      </div>
    );
  }
  if (isAdmin) return <>{children}</>;
  if (profile?.role === "teacher") return <Navigate to="/teacher" replace />;
  return <>{children}</>;
}

function TeacherRoute({ children }: { children: React.ReactNode }) {
  const { profile, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="app-bg" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="spinner" />
      </div>
    );
  }
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
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/dashboard" element={<ProtectedRoute><StudentRoute><Dashboard /></StudentRoute></ProtectedRoute>} />
          <Route path="/teacher" element={<ProtectedRoute><TeacherRoute><TeacherDashboard /></TeacherRoute></ProtectedRoute>} />
          <Route path="/years" element={<ProtectedRoute><StudentRoute><Years /></StudentRoute></ProtectedRoute>} />
          <Route path="/programmes" element={<ProtectedRoute><StudentRoute><Programmes /></StudentRoute></ProtectedRoute>} />
          <Route path="/primary" element={<ProtectedRoute><StudentRoute><Years /></StudentRoute></ProtectedRoute>} />
          <Route path="/checkpoint" element={<ProtectedRoute><StudentRoute><Checkpoint /></StudentRoute></ProtectedRoute>} />
          <Route path="/igcse" element={<ProtectedRoute><StudentRoute><Igcse /></StudentRoute></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><StudentRoute><Leaderboard /></StudentRoute></ProtectedRoute>} />
          <Route path="/friends" element={<ProtectedRoute><StudentRoute><Friends /></StudentRoute></ProtectedRoute>} />
          <Route path="/pathway" element={<ProtectedRoute><StudentRoute><Pathway /></StudentRoute></ProtectedRoute>} />
          <Route path="/certificates" element={<ProtectedRoute><StudentRoute><Certificates /></StudentRoute></ProtectedRoute>} />
          <Route path="/past-papers" element={<ProtectedRoute><StudentRoute><PastPapers /></StudentRoute></ProtectedRoute>} />
          {/* Quiz routes — programme-aware */}
          <Route path="/quiz/:yearId/:topicId" element={<ProtectedRoute><StudentRoute><Quiz /></StudentRoute></ProtectedRoute>} />
          <Route path="/quiz/checkpoint/:stage/:subject/:topicId" element={<ProtectedRoute><StudentRoute><Quiz /></StudentRoute></ProtectedRoute>} />
          <Route path="/quiz/igcse/:igcseSubject/:topicId" element={<ProtectedRoute><StudentRoute><Quiz /></StudentRoute></ProtectedRoute>} />
          <Route path="/daily" element={<ProtectedRoute><StudentRoute><DailyQuiz /></StudentRoute></ProtectedRoute>} />
          <Route path="/practice" element={<ProtectedRoute><StudentRoute><Practice /></StudentRoute></ProtectedRoute>} />
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
