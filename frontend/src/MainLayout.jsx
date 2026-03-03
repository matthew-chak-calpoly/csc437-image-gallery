import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header.jsx";

export function MainLayout() {
    return (
        <div>
            <Header />
            <div style={{ padding: "0 2em" }}>
                <Outlet />
            </div>
        </div>
    );
}