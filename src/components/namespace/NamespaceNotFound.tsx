import DefaultLayout from '../ui/DefaultLayout'

function NamespaceNotFound() {
  return (
    <DefaultLayout>
      <div className="md:flex gap-x-7 px-3 ">
        <div className="w-full">The page you are looking for isnt here</div>
      </div>
    </DefaultLayout>
  )
}

export default NamespaceNotFound
