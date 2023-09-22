import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute(props) {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);

    return (
        <>
            {isAuthenticated
                ? <>{props.children}</>
                : <Navigate to={'/login'} replace />
            }
        </>
    );
}

export default ProtectedRoute;