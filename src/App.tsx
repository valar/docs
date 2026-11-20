import { Route, Routes } from "react-router";
import { DocPage } from "./components/DocPage";
import { Layout } from "./components/Layout";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="*" element={<DocPage />} />
      </Route>
    </Routes>
  );
}
