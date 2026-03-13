import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import PrivateRoute from "./components/common/PrivateRoute";

import Main from "./pages/Main";
import Tools from "./pages/Tools";
import Workflow from "./pages/Workflow";
import Community from "./pages/Community";
import CommunityDetail from "./pages/CommunityDetail";
import CommunityWrite from "./pages/CommunityWrite";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
    <div className="app-wrapper">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/write" element={
            <PrivateRoute><CommunityWrite /></PrivateRoute>
          } />
          <Route path="/community/:id" element={<CommunityDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;