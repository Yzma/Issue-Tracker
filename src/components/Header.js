import React from "react";
import styles from '../styles/Header.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSession, signIn, signOut } from "next-auth/react";

const Header = () => {
  const { data: session } = useSession();

  console.log(session)
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <FontAwesomeIcon icon={faBug} size="2x" />
        <p>Bug-Zapper</p>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <a href="/issues">Issues</a>
          </li>
          <li>
            <a href="/orgs">Organizations</a>
          </li>
          <li>
            <a href={`/${session?.namespace}`}>{session?.namespace}</a>
          </li>
          <li>
            {session ? (
              <>
                <button className={styles.signInOutButton} onClick={() => signOut()}>Sign Out</button>
              </>
            ) : (
              <>
                <button className={styles.signInOutButton} onClick={() => signIn()}>Sign In</button>
              </>
            )}
          </li>
          {/* <li>
            <FontAwesomeIcon icon={faPlus} />
          </li> */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;

// import React from "react";
// import styles from '../styles/Header.module.css';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBug } from "@fortawesome/free-solid-svg-icons";
// import { faPlus } from "@fortawesome/free-solid-svg-icons";
// import { useSession, signIn, signOut } from "next-auth/react";

// const Header = () => {
//   const { data: session } = useSession();

//   return (
//     <header className={styles.header}>
//       <div className={styles.logoContainer}>
//         <FontAwesomeIcon icon={faBug} size="2x" />
//         <p>Bug-Zapper</p>
//       </div>
//       <nav className={styles.nav}>
//         <ul>
//           <li>
//             <a href="/issues">Issues</a>
//           </li>
//           <li>
//             <a href="/orgs">Organizations</a>
//           </li>
//           <li>
//             {session ? (
//               <>
//                 <button onClick={() => signOut()}>Sign Out</button>
//               </>
//             ) : (
//               <>
//                 <button onClick={() => signIn()}>Sign In</button>
//               </>
//             )}
//           </li>
//           {/* <li>
//             <FontAwesomeIcon icon={faPlus} />
//           </li> */}
//         </ul>
//       </nav>
//     </header>
//   );
// };

// export default Header;
