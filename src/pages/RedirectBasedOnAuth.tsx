// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Login } from "../screens/Login";

// export function RedirectBasedOnAuth() {
//   const navigate = useNavigate();
//   const { isAuthenticated, isLoading } = useAuth();

//   useEffect(() => {
//     if (!isLoading) {
//       if (isAuthenticated) {
//         navigate("/dashboard");
//       }
//     }
//   }, [isAuthenticated, isLoading, navigate]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return <Login />;
// }


import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Login } from "../screens/Login";

export function RedirectBasedOnAuth() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // While loading (checking localStorage session)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Checking session...</p>
        </div>
      </div>
    );
  }

  // If authenticated, redirect based on user role
  if (isAuthenticated) {
    if (user?.role === "admin") {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/pledge-entry" replace />;
    }
  }

  // If not authenticated → show Login page
  return <Login />;
}
