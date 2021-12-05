import React, { useContext, useEffect, useRef, useState } from "react";
import { dataURItoBlob } from "../../utils";
import { Context } from '../../App';

function Post(props){
  const { openForm, handleSubmitForm } = props;
  const [useFrontCamera, setUseFrontCamera] = useState(true);
  const [image, setImage] = useState(null);
  const [playStream, setPlayStream] = useState(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showLocationBtn, setShowLocationBtn] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lng: 0});
  const refVideo = useRef(null);
  const refCanvas = useRef(null);
  const refLocationInput = useRef(null);
  const refCaptionInput = useRef(null);
  const refUsernameInput = useRef(null);
  const { installPrompt } = useContext(Context);
  const { deferredPrompt, savePrompt }  = installPrompt;

  useEffect(() => {
    if(openForm){
      initMedia();
      initLocation();
    } else {
      stopVideo();
    }
  }, [openForm, useFrontCamera]);

  const initMedia = () => {
    if(!('mediaDevices' in navigator)){
      navigator.mediaDevices = {};
    }

    if(!('getUserMedia' in navigator.mediaDevices)) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if(!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented'))
        }

        return new Promise(function(res, rej){
          getUserMedia.call(navigator.constraints, res, rej)
        })
      }
    }
    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: (useFrontCamera ? "user" : "environment")
      }
    }).then(function(stream){
      setPlayStream(true);
      refVideo.current.srcObject = stream;
    }).catch(function(err){
      console.log('err :>> ', err);
      setPlayStream(false);
      setShowImagePicker(true);
    })
  }

  const initLocation = () => {
    if(!('geolocation' in navigator)) {
      setShowLocationBtn(false);
    }
  }

  const setCapture = e => {
    setPlayStream(false);
    const context = refCanvas.current.getContext('2d');
    refCanvas.current.width = refVideo.current.videoWidth;
    refCanvas.current.height = refVideo.current.videoHeight;
    context.drawImage(refVideo.current, 0 , 0);
    stopVideo();
    setImage(dataURItoBlob(refCanvas.current.toDataURL()));
  }

  const retakeVideo = e => {
    setPlayStream(true);
    initMedia();
  }

  const stopVideo = () => {
    if(refVideo.current.srcObject){
      refVideo.current.srcObject.getVideoTracks().forEach(function(track){
        track.stop();
      })
    }
  }

  const getLocation = () => {
    if(!('geolocation' in navigator)) {
      return;
    }

    setButtonLoading(true);
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log('position :>> ', position);
      setButtonLoading(false);
      setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      refLocationInput.current.value = 'Jakarta';
      refLocationInput.current.classList.add('focus:border-blue-300');
    }, function(err){
      console.log('err location :>> ', err);
      setButtonLoading(false)
      alert('Couldnt find location, input manually please');
      setLocation({ lat: 0, lng: 0 });
    }, { timeout: 10000 })
  }

  const handleSubmit = e => {
    e.preventDefault();
    const values = {
      username: refUsernameInput.current.value,
      caption: refCaptionInput.current.value,
      location: refLocationInput.current.value,
      picture: image,
      rawLocation: location
    };
    handleSubmitForm(values);
  }

  const installApp = async e => {
    if(!deferredPrompt) {
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response to the install prompt: ${outcome}`);
    savePrompt(null);
  }

  return(
    <form className="text-left" onSubmit={handleSubmit}>
      {
        deferredPrompt && (
          <button type="button" className="btn btn-outline btn-primary mb-10" onClick={installApp}>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            &nbsp; Install the app
          </button>
        )
      }
      <video ref={refVideo} className={`${!playStream && 'hidden'} rounded-md mb-5`} id="player" autoPlay></video>
      <canvas ref={refCanvas} className={`${playStream && 'hidden'} mb-5 w-full rounded-md h-auto`} id="canvas"></canvas>
      <div className="flex mb-5">
        <button type="button" id="btn-capture" className={`${!playStream && 'hidden'} btn btn-sm btn-primary mr-5`} onClick={setCapture}>
          Capture
        </button>
        <button type="button" id="btn-retake" className={`${playStream && 'hidden'} btn btn-sm btn-primary mb-5 mr-5`} onClick={retakeVideo}>
          Retake
        </button>
        <button type="button" id="btn-flip" className={`btn btn-sm btn-accent ${!playStream && 'hidden'}`} onClick={() => setUseFrontCamera(!useFrontCamera)}>
          Flip
        </button>
      </div>
      <div className={!showImagePicker && 'hidden'} id="pick-image">
        <h6>Pick an Image instead</h6>
        <input type="file" accept="image/*" id="image-picker" />
      </div>
      <div className="mb-5">
        <label htmlFor="username" className="text-sm font-medium text-gray-900 block mb-2">Username</label>
        <input type="text" id="username" ref={refUsernameInput} autoComplete={false}
          className="bg-gray-50 border border-gray-300 text-gray-900 mb-3 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required></input>
      </div>
      <div className="mb-5">
        <label htmlFor="caption" className="text-sm font-medium text-gray-900 block mb-2">Caption</label>
        <textarea ref={refCaptionInput} type="text" id="caption"
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required rows="5"></textarea>
      </div>
      <div className="mb-10">
        <label htmlFor="location" className="text-sm font-medium text-gray-900 block mb-2">Location</label>
        <input ref={refLocationInput} type="text" id="location"
          className="bg-gray-50 border border-gray-300 text-gray-900 mb-3 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required></input>
        <button type="button" id="btn-location" className={`btn btn-sm btn-primary ${!showLocationBtn && 'hidden'} ${buttonLoading && 'loading'}`}
          onClick={getLocation}>Get location</button>
      </div>
      <button type="submit" className="btn btn-lg btn-info mx-auto w-full">
        POST
      </button>
    </form>
  )
}

export default Post;