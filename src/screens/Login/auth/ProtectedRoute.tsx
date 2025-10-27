// import { useEffect, useState } from "react";
// import { supabase } from "../../../lib/supabase";
// import { Navigate } from "react-router-dom";

// export function ProtectedRoute({ children }: { children: JSX.Element }) {
//   const [loading, setLoading] = useState(true);
//   const [session, setSession] = useState<any>(null);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => {
//       setSession(data.session);
//       setLoading(false);
//     });

//     const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session);
//     });

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   if (loading) return <p>Loading...</p>;

//   // if (!session) {
//   //   // Redirect to the NotLoggedIn page
//   //   return <Navigate to="/not-logged-in" replace />;
//   // }

//   return children;
// }
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isLoading } = useAuth();

  // While checking session
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 text-lg font-medium">Checking session...</p>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
