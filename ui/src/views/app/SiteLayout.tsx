import { ParentComponent } from "solid-js";

import Container from "./Container";
import Header from "./Header";
import User from "lucide-solid/icons/user";
import { A } from "@solidjs/router";
import Footer from "./Footer";

export const SiteLayout: ParentComponent = (props) => {
  return (
    <div class="flex flex-col h-screen bg-black text-white">
      <Header>
        <nav class="flex justify-between items-center">
          <A href="/">
            <p class="text-xl">App</p>
          </A>

          <A href="/auth" class="flex flex-col items-center">
            <User size={28} />
          </A>
        </nav>
      </Header>

      <main class="flex-1 flex flex-col overflow-y-auto">
        <Container class="flex flex-col items-center">{props.children}</Container>
      </main>

      <Footer class="text-xs">
        <p>sample text</p>
      </Footer>
    </div>
  );
};

export default SiteLayout;
