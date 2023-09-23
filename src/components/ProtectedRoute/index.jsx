import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotPermitted from "./NotPermitted";

function RoleBaseRoute(props) {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const user = useSelector(state => state.account.user);
    const userRole = user.role;

    return (
        <>
            {isAdminRoute && userRole === 'ADMIN'
                ? <>{props.children}</>
                : <NotPermitted />
            }
        </>
    );
}

function ProtectedRoute(props) {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);

    return (
        <>
            {isAuthenticated
                ? <RoleBaseRoute>{props.children}</RoleBaseRoute>
                : <Navigate to={'/login'} replace />
            }
        </>
    );
}

export default ProtectedRoute;