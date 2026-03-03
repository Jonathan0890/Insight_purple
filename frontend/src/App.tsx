import { Outlet } from "react-router-dom";
import "./App.css";
import { MainLayout } from "./components/layout/MainLayout";
import { Suspense } from "react";

function App() {

  return (
    <MainLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </MainLayout>
  );
}

export default App;
