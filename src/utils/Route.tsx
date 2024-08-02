import { Navigate } from "react-router-dom";
import { useAppSelector } from "../Redux/hooks";

type Props = {
  children?: JSX.Element | JSX.Element[];
  //Pass any array of roles that have access to the route
  disallowedRoles?: string[];
  allowedRoles?: string[];
};
type StudyProps = {
  children?: JSX.Element | JSX.Element[];
  //Pass any array of roles that have access to the route
  action: string;
};

export const AuthenticatedRoute: React.FC<Props> = ({
  children,
  allowedRoles,
  disallowedRoles,
}) => {
  const { isUserAuthenticated, role } = useAppSelector((state) => state.user);

  if (!isUserAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (disallowedRoles && disallowedRoles.includes(role)) {
    return <Navigate to="/app/studies" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/app/studies" />;
  }

  return <>{children}</>;
};

export const UnAuthenticatedRoute: React.FC<any> = ({ children }) => {
  const isUserAuthenticated = useAppSelector(
    (state) => state.user.isUserAuthenticated
  );

  return isUserAuthenticated ? <Navigate to="/app/studies" /> : <>{children}</>;
};

export const StudyAuthenticatedRoute: React.FC<StudyProps> = ({
  children,
  action,
}) => {
  const { isUserAuthenticated, studyPermissions } = useAppSelector(
    (state) => state.user
  );
  if (!isUserAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (action && !studyPermissions.includes(action)) {
    return <Navigate to="/app/studies" />;
  }

  return <>{children}</>;
};
