import React, { useEffect, useState } from "react";
import AppShell from "../../components/AppShell/AppShell";
import FloatingButton from "../../components/FloatingButton/FloatingButton";
import PostList from "../../components/PostList/PostList";
import SlideOver from "../../components/SlideOver/SlideOver";
import Toast from "../../components/Toast/Toast";
import { convertObjectArray, readAllData, writeData } from "../../utils";

function Home(props){
  const [showSlideover, setShowSlideover] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [networkReceived, setNetworkReceived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const url = process.env.REACT_APP_FIREBASE_DATABASE_URL + '/posts.json';

  useEffect(() => {
    fetch(url).then(res => {
      return res.json()
    }).then(function(resData){
      setNetworkReceived(true);
      console.log('from web', resData);
      setIsLoading(false);
      setData(convertObjectArray(resData));
    })

  if ('indexedDB' in window) {
    readAllData('posts')
      .then(function(resData) {
        if (!networkReceived) {
          console.log('From cache', resData);
          setIsLoading(false);
          setData(resData)
        }
      });
  }
  }, [networkReceived, url]);

  const handlePost = values => {
    const { caption, username, location, rawLocation, picture } = values;
    if('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready
        .then(function(sw){
          var post = {
            id: new Date().toISOString(),
            username,
            caption,
            location,
            picture,
            rawLocation
          };
          console.log('post updated :>> ', post);
          writeData('sync-posts', post)
            .then(function(){
              console.log('syncing');
              sw.sync.register('snapgram-sync-posts');
            })
            .then(function(){
              setShowSlideover(false);
              setToast({ show: true, message: 'Your Post was saved for syncing'});
              setTimeout(function(){
                setToast({ show: false, message: ''})
              }, 3000);
            })
            .catch(function(err){
              console.log(err);
            })
        })
    } else {
      sendData(values);
    }
  }

  const sendData = values => {
    const { caption, username, location, rawLocation, image } = values;
    var id = new Date().toISOString();
    var postData = new FormData();
    postData.append('id', id);
    postData.append('caption', caption);
    postData.append('username', username);
    postData.append('location', location);
    postData.append('rawLocationLat', rawLocation.lat);
    postData.append('rawLocationLng', rawLocation.lng);
    postData.append('file', image, id + '.png');
    console.log('postData :>> ', postData);
    fetch(process.env.REACT_APP_FIREBASE_DATABASE_URL + '/posts.json', {
      method: 'POST',
      body: postData
    }).then(function(res){
      console.log('Send data...', res);
    })
  }

  return (
    <AppShell>
      <div id="feed-post-wrapper" className="md:grid md:grid-cols-3 md:items-center md:gap-x-5">
        <PostList isLoading={isLoading} posts={data} />
      </div>
      <SlideOver show={showSlideover} handleClose={() => setShowSlideover(false)} handlePost={handlePost} />
      <FloatingButton handleClick={() => setShowSlideover(true)} />
      <Toast show={toast.show} message={toast.message} />
    </AppShell>
  )
}

export default Home;