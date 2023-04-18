import { Dispatch, SetStateAction, useState, createContext, useContext } from "react"

import UsersOrganizationsSection from "@/components/user-profile/UsersOrganizationsSection"
import UserSocialLinks from "@/components/user-profile/UserSocialLinks"

import { Formik, Form, Field, FieldArray } from "formik"

import axios from "axios"

import { Session } from "next-auth"
import { useSession } from "next-auth/react"

import { ProfileInformation } from "./types"

interface ProfileContextInterface {
  profile: ProfileInformation
  setProfile: Dispatch<SetStateAction<ProfileInformation>>
  setEditing: Dispatch<SetStateAction<boolean>>
  session: Session
}

const ProfileContext = createContext<ProfileContextInterface>({
  profile: null,
  setProfile: () => { },
  setEditing: () => { },
  session: null
});

export default function ProfileContainer({ data }: { data: ProfileInformation }) {
  const [editing, setEditing] = useState<Boolean>(false)
  const [profile, setProfile] = useState<ProfileInformation>({
    ...data,
    socialLinks: [...new Array(4)].map((_, index) => data.socialLinks[index] || "")
  })
  const { data: session } = useSession()

  return (
    <ProfileContext.Provider value={{ profile, setProfile, setEditing, session }}>
      <div className="flex flex-col gap-y-3">
        <div className="flex items-center justify-center">
          <div className="w-72 h-72 mb-4 bg-gray-200 text-gray-600 rounded-full" />
        </div>
        {editing ?
          <ProfileContainerEditor />
          :
          <ProfileContainerViewer />
        }
        <UserSocialLinks links={profile.socialLinks} />
        <hr className="border-gray-300 my-4 mx-auto w-full" />
        <UsersOrganizationsSection organizations={[]} />
      </div>
    </ProfileContext.Provider>
  )
}

function ProfileContainerViewer() {
  const { profile, setEditing, session } = useContext(ProfileContext);
  return (
    <div className="relative">
      <div className="flex flex-col">
        <div className="flex flex-col gap-y-0 text-left">
          <div>
            <p className="text-xl font-bold">{profile.username}</p>
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="text-gray-500 py-2">
              {profile.bio || "This is a random bio, nothing of value here. Move on."}
            </p>

            {session?.user.namespace.name === profile.name &&
              <button className="btn w-full" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileContainerEditor() {
  const { profile, setProfile, setEditing } = useContext(ProfileContext);

  return (
    <div className="relative">
      <div className="flex flex-col">

        <Formik
          initialValues={{
            name: profile.name,
            bio: profile.bio || "",
            socialLinks: profile.socialLinks
          }}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values, { setSubmitting, setFieldError }) => {
            console.log("Submit values:", values)
            axios
              .put("/api/user", {
                name: values.name,
                bio: values.bio,
                socialLinks: values.socialLinks
              })
              .then((response) => {
                console.log("RESPONSE:", response)
                setProfile((prevState) => ({
                  ...prevState,
                  bio: values.bio,
                }))
                // router.push(`/${values.name}`)
                setEditing(false)
              })
              .catch((error) => {
                console.log("ERROR:", error.response.data)
                console.log("ERROR:", error)
              })
              .finally(() => {
                setSubmitting(false)
              })
          }}
        >
          {({ errors, isSubmitting, values, setFieldError, handleChange }) => (
            <Form >
              <div className="flex flex-col gap-y-0 text-left">
                <div className="flex flex-col gap-y-3 pb-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <Field name="name">
                      {({
                        field,
                        meta
                      }) => (
                        <div>
                          <input className="form-input w-full" type="text" placeholder={profile.name} {...field} />
                          {meta.touched && meta.error && (
                            <div className="error">{meta.error}</div>
                          )}
                        </div>
                      )}
                    </Field>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Bio
                    </label>
                    <Field name="bio">
                      {({
                        field,
                        meta
                      }) => (
                        <div>
                          <textarea className="form-textarea w-full" placeholder={"Add a bio"}  {...field} />
                          {meta.touched && meta.error && (
                            <div className="error">{meta.error}</div>
                          )}
                        </div>
                      )}
                    </Field>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Social Accounts
                    </label>
                    <div className="flex flex-col gap-y-2">
                      <FieldArray
                        name="socialLinks"
                        render={arrayHelpers => (
                          <>
                            {values.socialLinks.map((link, index) => {
                              return (
                                <div key={index}>
                                  <Field
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type="text"
                                    name={`socialLinks.${index}`}
                                    placeholder={"Link to social profile"}
                                  />
                                </div>
                              )
                            })}
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-x-1">
                <button className="btn-xs h-8 w-14 bg-emerald-500 hover:bg-emerald-600 text-white" type="submit">Save</button>
                <button className="btn-xs h-8 w-14 bg-gray-500 hover:bg-gray-600 text-white" type="button" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
