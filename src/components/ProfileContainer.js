import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const ProfileContainer = ({ username, bio }) => {
  return (
    <section className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-200 text-gray-600 rounded-full">
        <FontAwesomeIcon icon={faUser} className="text-2xl" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{username}</h2>
      <p className="text-gray-500">{bio}</p>
    </section>
  );
};

export default ProfileContainer;