import { ParentComponent } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import Log from "lucide-solid/icons/pencil-line";
import Home from "lucide-solid/icons/home";
import User from "lucide-solid/icons/user";

export const AppLayout: ParentComponent = (props) => {
  const location = useLocation();

  const isLogActive = () => location.pathname.startsWith("/log");

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const linkClasses = (path: string) =>
    `flex flex-row space-x-2 mx-4 hover:text-white active:opacity-80 ${
      isActive(path) ? "text-white" : "text-white"
    }`;

  const iconClasses = (path: string) => `active:opacity-80 ${isActive(path) ? "text-black" : "text-black"}`;

  return (
    <div class="flex h-screen bg-black text-white">
      {/* Sidebar (desktop global nav) */}
      <nav class="hidden sm:flex  flex-col items-start bg-black py-4 space-y-6">
        <A href="/" class={linkClasses("/")}>
          <Home size={24} class={iconClasses("/")} />
          <p class="hidden sm:flex">Home</p>
        </A>
        <A href="/profile" class={linkClasses("/profile")}>
          <User size={24} class={iconClasses("/profile")} />
          <p class="hidden sm:flex">Profile</p>
        </A>
      </nav>

      {/* Main content */}
      <main class="flex-1 flex flex-col overflow-y-auto">{props.children}</main>
    </div>
  );
};

export default AppLayout;
