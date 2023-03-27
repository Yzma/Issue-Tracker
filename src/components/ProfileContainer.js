import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import { faEnvelope, faCog } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

// username={props.data.username} bio={""}
const ProfileContainer = ({ data }) => {
  
  return (
    <section className="bg-white shadow-md rounded-lg p-6 relative">
      <Link href="/usersettings">
        <FontAwesomeIcon
          icon={faCog}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
        />
      </Link>
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-200 text-gray-600 rounded-full">
          <FontAwesomeIcon icon={faUser} className="text-2xl" />
        </div>
        <h2 className="text-xl font-semibold mb-2">{data.username}</h2>
        <div className="flex space-x-2 mb-2">
          {data.github && (
            <Link
              className="text-gray-500 hover:text-gray-700"
              href={data.github}
            >
              <FontAwesomeIcon icon={faGithub} />
            </Link>
          )}

          {data.linkedIn && (
            <Link
              className="text-gray-500 hover:text-gray-700"
              href={data.linkedIn}
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </Link>
          )}

          {data.twitter && (
            <Link
              className="text-gray-500 hover:text-gray-700"
              href={data.twitter}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </Link>
          )}

          {data.publicEmail && (
            <Link
              className="text-gray-500 hover:text-gray-700"
              href={`mailto:${data.publicEmail}`}
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </Link>
          )}
        
        </div>
      </div>
      <hr className="border-gray-300 my-4 mx-auto w-4/5" />
      <p className="text-gray-500">
        {data.bio || "This is a random bio, nothing of value here. Move on."}
      </p>
    </section>
  )
};

export default ProfileContainer;

// import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faGithub,
//   faLinkedin,
//   faTwitter,
// } from "@fortawesome/free-brands-svg-icons";
// import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

// const ProfileContainer = ({ username, bio }) => {
//   return (
//     <section className="bg-white shadow-md rounded-lg p-6">
//       <div className="flex flex-col items-center">
//         <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-200 text-gray-600 rounded-full">
//           <FontAwesomeIcon icon={faUser} className="text-2xl" />
//         </div>
//         <h2 className="text-xl font-semibold mb-2">{username}</h2>
//         <div className="flex space-x-2 mb-2">
//           <a href="#" className="text-gray-500 hover:text-gray-700">
//             <FontAwesomeIcon icon={faGithub} />
//           </a>
//           <a href="#" className="text-gray-500 hover:text-gray-700">
//             <FontAwesomeIcon icon={faLinkedin} />
//           </a>
//           <a href="#" className="text-gray-500 hover:text-gray-700">
//             <FontAwesomeIcon icon={faTwitter} />
//           </a>
//           <a href="#" className="text-gray-500 hover:text-gray-700">
//             <FontAwesomeIcon icon={faEnvelope} />
//           </a>
//         </div>
//       </div>
//       <hr className="border-gray-300 my-4 mx-auto w-4/5" />
//       <p className="text-gray-500">{bio || "This is a random bio, nothing of value here. Move on."}</p>
//     </section>
//   );
// };

// export default ProfileContainer;
