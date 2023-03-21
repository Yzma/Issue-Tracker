import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import layoutStyles from "@/styles/usersLayout.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LabelList from "@/components/LabelList";
import LabelSearchBar from "@/components/LabelSearchBar";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function LabelPage() {
  // fake data for now
  const labels = [
    { name: "bug", description: "Something is not working" },
    {
      name: "documentation",
      description: "Improvements or additions to documentation",
    },
  ];

  const handleSearch = (searchTerm) => {
    console.log("Searching:", searchTerm);
    // Implement search logic here
  };

  return (
    <>
      <Head>
        <title>Label Page</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${layoutStyles.main} ${layoutStyles.mainContent}`}>
        <Header />
        <div className={layoutStyles.labelsContainer}>
          <LabelSearchBar onSearch={handleSearch} />
          <LabelList labels={labels} />
        </div>
        <Footer />
      </main>
    </>
  );
}

// import Head from "next/head";
// import Image from "next/image";
// import { Inter } from "next/font/google";
// import layoutStyles from "@/styles/usersLayout.module.css";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import LabelList from "@/components/LabelList";
// import { useRouter } from "next/router";

// const inter = Inter({ subsets: ["latin"] });

// export default function LabelPage() {
//   // harcoded data for now
//   const labels = [
//     { name: "bug", description: "Something is not working" },
//     { name: "documentation", description: "Improvements or additions to documentation" },
//   ];

//   return (
//     <>
//       <Head>
//         <title>Label Page</title>
//         <meta name="description" content="Generated by create next app" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <main className={`${layoutStyles.main} ${layoutStyles.mainContent}`}>
//         <Header />
//         <div className={layoutStyles.labelSearchContainer}>
//           <input
//             type="text"
//             className={layoutStyles.labelSearchInput}
//             placeholder="Search labels..."
//           />
//         </div>
//         <LabelList labels={labels} />
//         <Footer />
//       </main>
//     </>
//   );
// }

// import Head from "next/head";
// import Image from "next/image";
// import { Inter } from "next/font/google";
// // import styles from "@/styles/Home.module.css";
// import layoutStyles from "@/styles/usersLayout.module.css";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { useRouter } from "next/router";

// const inter = Inter({ subsets: ["latin"] });

// export default function UserProfile() {

//   return (
//     <>
//       <Head>
//         <title>Label Page</title>
//         <meta name="description" content="Generated by create next app" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <main className={`${layoutStyles.main} ${layoutStyles.mainContent}`}>
//         <Header />
//         <Footer />
//       </main>
//     </>
//   );
// }
