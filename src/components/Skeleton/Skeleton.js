import React from "react";

function Skeleton(){
  return (
    <div id="loading-wrapper" className="loading-wrapper-group border border-purple-200 shadow card p-4 max-w-sm w-full mx-auto mb-5">
      <div className="animate-pulse">
        <div className="w-full bg-purple-100 h-40 mb-5"></div>
        <div>
          <div className="h-4 bg-purple-100 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-purple-100 rounded mb-2"></div>
          <div className="h-4 bg-purple-100 rounded mb-2"></div>
        </div>
      </div>
    </div>
  )
}

export default Skeleton;