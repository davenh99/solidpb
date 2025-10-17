import Container from "../views/app/Container";

export const Unauthorised = () => {
  return (
    <Container>
      <h1>Access Denied</h1>
      <p>You don't have permission to view this page.</p>
    </Container>
  );
};

export default Unauthorised;
