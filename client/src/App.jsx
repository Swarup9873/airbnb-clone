import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import IndexPage from "./pages/indexpage/IndexPage";
import LoginPage from './pages/loginpage/LoginPage'
import RegisterPage from "./pages/registerpage/RegisterPage"
import Layout from "./Layout";
import axios from "axios";
import { UserContextProvider } from "./contexts/UserContext";
import AccountPage from "./pages/accountpage/AccountPage";
import ProfilePage from "./pages/profilepage/ProfilePage";
import RoomsPage from "./pages/roomspage/RoomsPage";

// axios.defaults.baseURL= "https://airbnb-clone-backend-2.onrender.com"
axios.defaults.baseURL= "http://localhost:3000"

axios.defaults.withCredentials= true;

function App() {
  return (
    <BrowserRouter>    
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route path="/" element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage/>}/>
            <Route path='/account/profile' element={<ProfilePage/>}/>
            <Route path="/account/:subpage?" element={<AccountPage/>}/>
            <Route path="/account/:subpage/:action" element={<AccountPage/>}/>
            <Route path="/rooms/:id" element={<RoomsPage/>}/>
          </Route>
        </Routes>    
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
