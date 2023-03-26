import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const ProfileContainer = ({ username, bio }) => {
  return (
    <section className="bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-200 text-gray-600 rounded-full">
          <FontAwesomeIcon icon={faUser} className="text-2xl" />
        </div>
        <h2 className="text-xl font-semibold mb-2">{username}</h2>
        <div className="flex space-x-2 mb-2">
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
        </div>
      </div>
      <hr className="border-gray-300 my-4 mx-auto w-4/5" />
      <p className="text-gray-500">{bio || "This is a random bio, nothing of value here. Move on."}</p>
    </section>
  );
};

export default ProfileContainer;
