import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import ProjectItem from './ProjectItem'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Project } from '@/server/routers/common'

type ProjectListProps = {
  projects: Project[]
  projectCreationButton: JSX.Element | undefined
}

export default function ProjectList({
  projects,
  projectCreationButton,
}: ProjectListProps) {
  return (
    <div>
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-y-5 p-10 text-4xl">
          No projects found
          {projectCreationButton !== undefined && projectCreationButton}
        </div>
      ) : (
        <>
          <div className="mb-5 flex content-start gap-x-1 pt-6">
            <div className="flex w-full gap-x-2 gap-y-2 max-md:flex-col">
              <Input
                id="app-search"
                type="search"
                placeholder="Find a project..."
              />

              <div className="flex flex-row gap-x-2">
                <div>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Button size="sm">
                        Type
                        <FontAwesomeIcon icon={faCaretDown} className="pl-1" />
                      </Button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="z-20 min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                        sideOffset={5}
                        side="bottom"
                        alignOffset={3}
                      >
                        <DropdownMenu.Item className="group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
                          All
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className="group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
                          Private
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className="group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
                          Public
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>

                <div>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Button size="sm">
                        Sort
                        <FontAwesomeIcon icon={faCaretDown} className="pl-1" />
                      </Button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="z-20 min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                        sideOffset={5}
                        side="bottom"
                        alignOffset={3}
                      >
                        <DropdownMenu.Item className="group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
                          Name
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className="group relative flex h-[25px] select-none items-center rounded-[3px] px-[5px] pl-[25px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
                          Last Updated
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              </div>
            </div>

            {projectCreationButton !== undefined && (
              <div className="flex flex-row content-start align-top">
                {projectCreationButton}
              </div>
            )}
          </div>

          <hr className="mx-auto w-full border-gray-300" />
          {projects.map((project) => {
            return <ProjectItem key={project.id} project={project} />
          })}
        </>
      )}
    </div>
  )
}
