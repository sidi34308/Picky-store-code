import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* admin sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />
      <div className="flex flex-1 flex-col">
        {/* admin header */}
        <AdminHeader setOpen={setOpenSidebar} />
        <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <Button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-700"
          >
            Sign Out
          </Button>
        </header>
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
