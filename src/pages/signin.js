import {
  getProviders,
  signIn,
  getSession,
  getCsrfToken,
} from "next-auth/react";
import Head from "next/head";
import styles from "@/styles/Signin.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

function signin({ providers }) {
  return (
    <>
      <Head>
        <title>Sign In Page</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            <h2>Please sign in below:</h2>
            {Object.values(providers).map((provider) => {
              const icon = provider.name === "GitHub" ? faGithub : faGoogle;
              return (
                <div key={provider.name}>
                  <button
                    className={styles.button}
                    onClick={() => signIn(provider.id)}
                  >
                    <FontAwesomeIcon icon={icon} /> Sign in with {provider.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/", //where to redirect?user?
        permanent: false,
      },
    };
  }

  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  return {
    props: {
      providers,
      csrfToken,
    },
  };
}

export default signin;
