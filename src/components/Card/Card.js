import React from "react";
import PropTypes from 'prop-types';

function Card(props){
  const { location, username, image, caption } = props;
  return (
     <div className="card text-left shadow-2xl mb-8">
      <figure>
        <img alt="user's post" src={image} className="rounded-xl rounded-b-none object-cover h-64" />
      </figure>
      <div className="card-body p-5">
        <div className="flex mb-2">
          <svg className="fill-current text-red-400 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <p className="font-medium">{location}</p>
        </div>
        <p className="font-normal"><span className="text-black font-bold">{username}</span>
          &nbsp; {caption}
        </p>
      </div>
    </div>
  )
}

Card.propTypes = {
  username: PropTypes.string,
  image: PropTypes.string,
  location: PropTypes.string,
  caption: PropTypes.string
}

Card.defaultProps = {
  username: 'johndoe',
  image: 'https://picsum.photos/id/1005/400/250',
  location: 'Jakarta',
  caption: 'Enjoy your life'
}

export default Card;