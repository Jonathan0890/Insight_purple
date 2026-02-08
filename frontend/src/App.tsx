import { Outlet } from "react-router-dom";
import "./App.css";
import { MainLayout } from "./components/layout/MainLayout";

function App() {

  return (
    <MainLayout>
      <Outlet/>
    </MainLayout>
  );
}

export default App;
