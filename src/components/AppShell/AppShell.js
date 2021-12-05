import React from "react";
import Drawer from "../Drawer/Drawer";

function AppShell(props){
  const { children } = props;
  return (
    <div className="h-full">
      <div className="rounded-lg shadow bg-base-200 drawer min-h-screen">
        <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
        <main className="flex-grow block overflow-x-hidden bg-base-100
          text-base-content drawer-content">
          <div className="w-full navbar bg-white sticky top-0 z-10">
            <div className="flex-none lg:hidden">
              <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            <div className="flex items-center flex-none">
              <img className="w-40" src={process.env.PUBLIC_URL + '/icon-extend.png'} alt="icon" />
            </div>
            <div className="flex-none hidden lg:block">
              <ul className="menu horizontal">
                <Drawer />
              </ul>
            </div>
          </div>
          <div className="p-4 lg:p-10 block md:container md:mx-auto">
            {children}
          </div>
        </main>
        <div className="drawer-side">
          <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
          <ul className="p-4 overflow-y-auto menu w-80 bg-base-100">
            <img className="w-40" src={process.env.PUBLIC_URL + '/icon-extend.png'} alt="icon" />
            <Drawer />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AppShell;