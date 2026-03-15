
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";


export default function AppRouter() {
  return (
    
      <div className=" bg-linear-to-b  min-h-screen" style={{
    background: "linear-gradient(90deg, #070b34, #2a0e4a, #4d0a4f, #5d031f)"
  }}>
        <Navbar></Navbar>

        <div>
            <Outlet></Outlet>
        </div>
        
      </div>
    
  );
}