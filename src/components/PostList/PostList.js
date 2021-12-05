import React from "react";
import Card from "../Card/Card";
import Skeleton from "../Skeleton/Skeleton";
import PropTypes from 'prop-types';

function PostList(props){
  const { isLoading, posts } = props;
  if (isLoading) return (<Skeleton />);
  if(posts.length < 1) {
    return (
      <div id="empty-post-wrapper">
        <h2 className="text-center text-black text-2xl mb-5">There's nothing to see here</h2>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    )
  }
  return(
    <>
      {posts.map(post => {
        const { username, image, caption, location, id } = post;
        return <Card key={id} username={username} image={image} location={location} caption={caption} />
      })}
    </>
  )
}

PostList.propTypes = {
  isLoading: PropTypes.bool,
  posts: PropTypes.array
}

PostList.defaultProps = {
  isLoading: false,
  posts: []
}

export default PostList;