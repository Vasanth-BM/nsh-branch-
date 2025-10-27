import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context & Auth
import { AuthProvider } from "./src/context/AuthContext";
import { ProtectedRoute } from "./src/screens/Login/auth/ProtectedRoute";
import { RedirectBasedOnAuth } from "./src/pages/RedirectBasedOnAuth";

// Layouts & Pages
import { Layout } from "./src/components/layout/Layout";
import { Login } from "./src/screens/Login";
import { NotLoggedIn } from "./src/screens/Login/NotLoggedIn/NotLoggedIn";
import GoldLoan404 from "./src/screens/404Page/404page";

// Main Pages
import { Dashboard } from "./src/pages/Dashboard";
import { PledgeEntry } from "./src/pages/PledgeEntry";
import { Reports } from "./src/pages/Reports";
import { Customers } from "./src/pages/Customers";
import { Settings } from "./src/pages/Settings";
import { MetalRatesSettings } from "./src/pages/MetalRatesSettings";

// Pledges
import { ViewPledge } from "./src/screens/Pledges/ViewPledge/ViewPledge";
import { CreatePledge } from "./src/screens/Pledges/CreatePledge/CreatePledge";
import { EditPledge } from "./src/screens/Pledges/EditPledge/EditPledge";
import { ClosePledge } from "./src/screens/Pledges/ClosePledge/ClosePledge";
import NoticePrint from "./src/notice/noticeform/NoticePrint";

// Re-pledges
import { RePledge } from "./src/screens/RePledges/CreateRePledge/RePledge";
import { BankManagement } from "./src/screens/RePledges/CreateRePledge/BankManagement";
import { RepledgeDetails } from "./src/screens/RePledges/RepledgeDetails/RepledgeDetails";
import { ViewRepledge } from "./src/screens/RePledges/ViewRepledge";
import { EditRepledge } from "./src/screens/RePledges/EditRepledge";
import { CloseRepledge } from "./src/screens/RePledges/CloseRepledge/CloseRepledge";

// Components
import CashBook from "./src/components/cashbook/CashBook";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="bottom-center" />

        <Routes>
          {/* Root route decides where to go (dashboard or login) */}
          <Route path="/" element={<RedirectBasedOnAuth />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/not-logged-in" element={<NotLoggedIn />} />
          <Route path="*" element={<GoldLoan404 />} />

          {/* Standalone Protected Routes (outside layout) */}
          <Route
            path="/create-pledge"
            element={
              <ProtectedRoute>
                <CreatePledge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-pledge/:loanId"
            element={
              <ProtectedRoute>
                <ViewPledge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-pledge/:loanId"
            element={
              <ProtectedRoute>
                <EditPledge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/close-pledge/:loanId"
            element={
              <ProtectedRoute>
                <ClosePledge />
              </ProtectedRoute>
            }
          />
          <Route
            path="/print-notice/:loanId"
            element={
              <ProtectedRoute>
                <NoticePrint />
              </ProtectedRoute>
            }
          />

          {/* Main layout routes (protected) */}
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/re-pledge-entry/add"
              element={
                <ProtectedRoute>
                  <RePledge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/re-pledge-entry/add-bank"
              element={
                <ProtectedRoute>
                  <BankManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/re-pledge-entry/details"
              element={
                <ProtectedRoute>
                  <RepledgeDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-repledge/:loanId"
              element={
                <ProtectedRoute>
                  <ViewRepledge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-repledge/:loanId"
              element={
                <ProtectedRoute>
                  <EditRepledge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/close-repledge/:loanId"
              element={
                <ProtectedRoute>
                  <CloseRepledge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pledge-entry"
              element={
                <ProtectedRoute>
                  <PledgeEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cashbook"
              element={
                <ProtectedRoute>
                  <CashBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/metal-rates"
              element={
                <ProtectedRoute>
                  <MetalRatesSettings />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
  