import React from 'react';
import SearchBar from './IssueSearchBar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router"


// const IssueButtons = ({onSearch, path}) => {
//   const router = useRouter()
//   return (
//     <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2 my-4"> {/* Updated className */}
//       <SearchBar onSearch={onSearch} />
//       <button className="btn bg-green-600 hover:bg-green-500 text-white" onClick={() => router.push(`${path}/labels`)}>
//         <FontAwesomeIcon icon={faTag} />
//         <span> Label</span>
//       </button>
//       <button className="btn bg-green-600 hover:bg-green-500 text-white" onClick={() => router.push(`${path}/new`)}>
//         <FontAwesomeIcon icon={faPlus} />
//         <span > Create Issue</span>
//       </button>
//     </div>
//   );
// };
const IssueButtons = ({onSearch, path}) => {
  const router = useRouter()
  return (
    <div className="grid grid-flow-col sm:auto-cols-max justify-center sm:justify-end gap-2 my-4"> {/* Updated className */}
      <SearchBar onSearch={onSearch} />
      <button className="btn bg-green-600 hover:bg-green-500 text-white" onClick={() => router.push(`${path}/labels`)}>
        <FontAwesomeIcon icon={faTag} />
        <span> Label</span>
      </button>
      <button className="btn bg-green-600 hover:bg-green-500 text-white" onClick={() => router.push(`${path}/new`)}>
        <FontAwesomeIcon icon={faPlus} />
        <span > Create Issue</span>
      </button>
    </div>
  );
};

export default IssueButtons;


