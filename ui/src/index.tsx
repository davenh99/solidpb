/* @refresh reload */
import { ErrorBoundary, lazy, Show } from "solid-js";
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import { toaster } from "@kobalte/core/toast";

import "./index.css";
import { PBProvider, usePB } from "./config/pocketbase";
import { ThemeProvider } from "./config/theme";
import AppLayout from "./views/app/AppLayout";
import LoadFullScreen from "./views/app/LoadFullScreen";
import SiteLayout from "./views/app/SiteLayout";
import Dashboard from "./routes/Dashboard";
import Unauthorised from "./routes/Unauthorised";
import { Toaster } from "./config/toaster";
import { Toast } from "./config/toaster/";
import ProtectedRoute from "./config/role/ProtectedRoute";

const NotFound = lazy(() => import("./routes/NotFound"));
const Auth = lazy(() => import("./routes/Auth"));

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

window.onerror = (msg) => {
  toaster.show((props) => <Toast {...props} title="JavaScript Error" msg={String(msg)} />);
};

window.onunhandledrejection = (event) => {
  toaster.show((props) => <Toast {...props} title="Unhandled Promise" msg={String(event.reason)} />);
};

render(
  () => (
    <ErrorBoundary
      fallback={(err) => {
        toaster.show((props) => <Toast {...props} title="App Error" msg={String(err.message ?? err)} />);
        return null;
      }}
    >
      <PBProvider>
        <ThemeProvider>
          <Content />
          <Toaster />
        </ThemeProvider>
      </PBProvider>
    </ErrorBoundary>
  ),
  root!
);

function Content() {
  const { store } = usePB();

  return (
    <Show when={!store.loading} fallback={<LoadFullScreen />}>
      <Show when={!store.networkError} fallback={<p>Network Error, could not connect to server.</p>}>
        <Router>
          <Show when={!!store.user} fallback={<Site />}>
            <App />
          </Show>
          <Route path="/*paramName" component={NotFound} />
        </Router>
      </Show>
    </Show>
  );
}

function App() {
  return (
    <Route path="/" component={AppLayout}>
      <Route
        path="/"
        component={() => (
          <ProtectedRoute roles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        )}
      />
      <Route path="/unauthorized" component={Unauthorised} />
    </Route>
  );
}

function Site() {
  return (
    <Route path="/" component={SiteLayout}>
      <Route path="/auth" component={Auth} />
    </Route>
  );
}
