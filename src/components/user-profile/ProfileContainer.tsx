import { Dispatch, SetStateAction, useState, createContext, useContext } from "react"

import UsersOrganizationsSection from "@/components/user-profile/UsersOrganizationsSection"
import UserSocialLinks from "@/components/user-profile/UserSocialLinks"

import { Formik, Form, Field, FieldArray } from "formik"

import { Session } from "next-auth"
import { useSession } from "next-auth/react"

import { ProfileInformation } from "./types"

interface ProfileContextInterface {
  profile: ProfileInformation
  setProfile: Dispatch<SetStateAction<ProfileInformation>>
  setEditing: Dispatch<SetStateAction<boolean>>
  session: Session
}

let ProfileContext = createContext<ProfileContextInterface>({
  profile: null,
  setProfile: () => { },
  setEditing: () => { },
  session: null
});

export default function ProfileContainer({ data }: { data: ProfileInformation }) {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(data)
  const { data: session } = useSession()

  return (
    <ProfileContext.Provider value={{ profile, setProfile, setEditing, session }}>
      <>
        <div className="flex items-center justify-center">
          <div className="w-72 h-72 mb-4 bg-gray-200 text-gray-600 rounded-full" />
        </div>
        {editing ?
          <ProfileContainerEditor />
          :
          <ProfileContainerViewer />
        }
        <UserSocialLinks links={[]} />
        <hr className="border-gray-300 my-4 mx-auto w-full" />
        <UsersOrganizationsSection organizations={[]} />
      </>
    </ProfileContext.Provider>
  )
}

function ProfileContainerViewer() {
  const { profile, setEditing } = useContext(ProfileContext);
  return (
    <div className="relative">
      <div className="flex flex-col">
        <div className="flex flex-col gap-y-0 items-start justify-start left-0 text-left">
          <div>
            <p className="text-xl font-bold">{profile.username}</p>
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="text-gray-500 py-2">
              {profile.bio || "This is a random bio, nothing of value here. Move on."}
            </p>
            <button className="btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileContainerEditor() {
  const { profile, setEditing } = useContext(ProfileContext);

  console.log(profile.socialLinks)
  const links = [...new Array(4)].map((_, index) => profile.socialLinks[index] || "")

  console.log("T: ", links)
  return (
    <div className="relative">
      <div className="flex flex-col">

        <Formik
          initialValues={{
            name: profile.name,
            bio: profile.bio,
            socialLinks: links
          }}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values, { setSubmitting, setFieldError }) => {

          }}
        >
          {({ errors, isSubmitting, values, setFieldError }) => (
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
                          <textarea className="form-textarea w-full" type="textarea" placeholder={"Add a bio"} {...field} value={""}/>
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
                                    name={`socialLink.${index}`}
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
                <button className="btn-xs h-8 w-14 bg-emerald-500 hover:bg-emerald-600 text-white">Save</button>
                <button className="btn-xs h-8 w-14 bg-gray-500 hover:bg-gray-600 text-white" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
