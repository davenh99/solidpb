import { Component } from "solid-js";
import { A } from "@solidjs/router";

import Container from "../views/app/Container";
import { Button } from "../components";

const NotFound: Component = () => {
  return (
    <Container>
      <h2>You appear to be lost</h2>
      <A href="/">take me back home</A>
      <Button></Button>
    </Container>
  );
};

export default NotFound;
