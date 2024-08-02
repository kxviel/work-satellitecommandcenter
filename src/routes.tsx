import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import SetPassword from "./Components/Auth/SetPassword";
import SignIn from "./Components/Auth/SignIn";
import AppLayout from "./Components/Layout/AppLayout";
import {
  UnAuthenticatedRoute,
  AuthenticatedRoute,
  StudyAuthenticatedRoute,
} from "./utils/Route";

import StudySettings from "./Components/StudySettings/StudySettings";
import AuditTrail from "./Components/AuditTrail/AuditTrail";
import Studies from "./Components/Studies/Studies";
import StudyDesigner from "./Components/StudyDesigner/StudyDesigner";
import StudyLayout from "./Components/Layout/StudyLayout";
import QuestionBuilder from "./Components/QuestionBuilder/QuestionBuilder";
import Responses from "./Components/Responses/Responses";
import Users from "./Components/AdminManagement/Users";
import RolesList from "./Components/AdminManagement/Roles/Roleslist";
import Records from "./Components/ParticipantRecords/Records";
import Queries from "./Components/QueryManagement/Queries";
// import Survey from "./Components/Survey/Survey";
import Export from "./Components/Export/Export";
import { permissions } from "./utils/roles";
import ChangePassword from "./Components/Auth/ChangePassword";
import Dashboard from "./Components/Dashboard/Dashboard";
import Error404 from "./Components/Layout/404";
import FormPermissions from "./Components/AdminManagement/FormPermissions";
import QuestionPreview from "./Components/QuestionBuilder/QuestionPreview/QuestionPreview";
import ThemePanel from "./Components/StudySettings/ThemeSettings/ThemePanel";
import UserDetail from "./Components/AdminManagement/UserDetail";
import ParticipantDetails from "./Components/ParticipantRecords/ParticipantDetails";
import CustomSignIn from "./Components/Auth/CustomSignIn";
// import WelcomePage from "./Components/Survey/WelcomePage";
// import ThankYouPage from "./Components/Survey/ThankYouPage";
import SurveyWrapper from "./Components/Survey/SurveyWrapper";
import ThankYouWrapper from "./Components/Survey/ThankYouWrapper";
import QuestionPrintPhase from "./Components/QuestionBuilder/QuestionPrint/QuestionPrintPhase";
import QuestionPrintForm from "./Components/QuestionBuilder/QuestionPrint/QuestionPrintForm";

const routes = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <UnAuthenticatedRoute>
        <Outlet />
      </UnAuthenticatedRoute>
    ),
    children: [
      {
        path: "login",
        element: <SignIn />,
      },
      {
        path: "login/:slug",
        element: <CustomSignIn />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "signup",
        element: <SetPassword />,
      },
    ],
  },
  {
    path: "/profile/change-password",
    element: <ChangePassword />,
  },
  {
    path: "/app",
    element: (
      <AuthenticatedRoute>
        <AppLayout />
      </AuthenticatedRoute>
    ),
    children: [
      {
        path: "studies",
        element: <Studies />,
      },
    ],
  },
  {
    path: "surveys/:surveySlug",
    element: <SurveyWrapper />,
  },
  {
    path: "surveys/:surveySlug/thank-you",
    element: <ThankYouWrapper />,
  },
  {
    path: "404",
    element: <Error404 />,
  },
  {
    path: "print/study/:id/phase/:type",
    element: (
      <AuthenticatedRoute>
        <QuestionPrintPhase />
      </AuthenticatedRoute>
    ),
  },
  {
    path: "print/study/:id/form/:formId",
    element: (
      <AuthenticatedRoute>
        <QuestionPrintForm />
      </AuthenticatedRoute>
    ),
  },
  {
    path: "/studies/:id",
    element: (
      <AuthenticatedRoute>
        <StudyLayout />
      </AuthenticatedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "study-designer",
        element: <StudyDesigner />,
      },
      {
        path: "records",
        element: <Records />,
      },
      {
        path: "responses/:participantId",
        children: [
          {
            index: true,
            element: <Responses />,
          },
          {
            path: "details",
            element: <ParticipantDetails />,
          },
        ],
      },

      {
        path: "form/:formId/edit",
        element: <QuestionBuilder />,
      },
      {
        path: "form/:formId/preview",
        element: <QuestionPreview />,
      },
      {
        path: "audit-trail",
        element: (
          <StudyAuthenticatedRoute action={permissions.auditLogs}>
            <AuditTrail />
          </StudyAuthenticatedRoute>
        ),
      },
      {
        path: "export",
        element: (
          <StudyAuthenticatedRoute action={permissions.export}>
            <Export />
          </StudyAuthenticatedRoute>
        ),
      },
      {
        path: "study-settings",
        element: (
          <StudyAuthenticatedRoute action={permissions.studySettings}>
            <StudySettings />
          </StudyAuthenticatedRoute>
        ),
      },
      {
        path: "study-theme",
        element: (
          <StudyAuthenticatedRoute action={permissions.studySettings}>
            <ThemePanel />
          </StudyAuthenticatedRoute>
        ),
      },
      {
        path: "user-management/users",
        children: [
          {
            index: true,
            element: (
              <StudyAuthenticatedRoute action={permissions.userManagement}>
                <Users />
              </StudyAuthenticatedRoute>
            ),
          },
          {
            path: ":userId",
            element: (
              <StudyAuthenticatedRoute action={permissions.userManagement}>
                <UserDetail />
              </StudyAuthenticatedRoute>
            ),
          },
        ],
      },

      {
        path: "user-management/forms",
        element: (
          <StudyAuthenticatedRoute action={permissions.userManagement}>
            <FormPermissions />
          </StudyAuthenticatedRoute>
        ),
      },
      {
        path: "user-management/roles-and-permissions/:type",
        element: (
          <StudyAuthenticatedRoute action={permissions.userManagement}>
            <RolesList />
          </StudyAuthenticatedRoute>
        ),
      },
      {
        path: "queries",
        element: <Queries />,
      },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/app/studies" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/app/studies" replace />,
  },
]);

export default routes;
