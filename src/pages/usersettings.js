import { useState } from "react";
import Head from "next/head";
import Header from "@/components/Header";

export default function UserSettings() {
  const [bio, setBio] = useState("This is a random bio, nothing of value here. Move on.");
  const [socialLinks, setSocialLinks] = useState({
    linkedIn: "https://www.linkedin.com/in/jpared3s/",
    twitter: "https://twitter.com",
    github: "https://github.com/jpared3s",
    email: "https://gmail.com",
  });

  const handleChange = (e, platform) => {
    setSocialLinks({ ...socialLinks, [platform]: e.target.value });
  };

  const handleSave = () => {
    // Save the updated bio and social links
    console.log("Bio:", bio);
    console.log("Social Links:", socialLinks);
  };

  const handleCancel = () => {
    // Cancel any changes made to the bio and social links
    console.log("Changes canceled");
  };

  return (
    <>
      <Head>
        <title>User Settings</title>
        <meta name="description" content="User Settings Page" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main className="h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl text-gray-800 font-bold mb-6">
            User Settings
          </h1>
          <div className="bg-white shadow-lg rounded-sm p-6">
            <div className="mb-4">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio:
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              ></textarea>
            </div>
            {["linkedIn", "twitter", "github", "email"].map((platform) => (
              <div className="mb-4" key={platform}>
                <label
                  htmlFor={platform}
                  className="block text-sm font-medium text-gray-700"
                >
                  {`${platform.charAt(0).toUpperCase()}${platform.slice(1)}:`}
                </label>
                <input
                  type={platform === "email" ? "email" : "text"}
                  id={platform}
                  value={socialLinks[platform]}
                  onChange={(e) => handleChange(e, platform)}
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            ))}
            <div>
              <button
                onClick={handleSave}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="ml-2 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-green-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

