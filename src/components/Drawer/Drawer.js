import React, { useState } from "react";
import { Link } from "react-router-dom";
import { configurePushSub } from "./registerPush";

function Drawer(){
  const [showNotificationBtn, setShowNotificationBtn] = useState(true);

  const askForNotificationPermission = () => {
    Notification.requestPermission(function(result){
      console.log('User choice', result);
      if(result !== 'granted'){
        console.log('No notification permission granted');
      } else {
        setShowNotificationBtn(false);
        configurePushSub();
      }
    });
  }


  return (
    <>
      <li>
        <Link to="/" className="rounded-btn">Home</Link>
      </li>
      <li>
        <Link to="/about" className="rounded-btn">About</Link>
      </li>
      <li>
        <button className={`btn btn-secondary enable-notification-buttons ${!showNotificationBtn && 'hidden'}`}
         onClick={askForNotificationPermission}>Enable Notification</button>
      </li>
    </>
  )
}

export default Drawer;