import { Container } from "@mui/material";
import MainContent from "./components/MainContent";

function App() {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100vw",
        }}
      >
        <Container>
          <MainContent />
        </Container>
      </div>
    </>
  );
}

export default App;
