import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { Project } from '@/types/types'
import ProjectItem from './ProjectItem'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

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
        <div className="flex flex-col gap-y-5 justify-center items-center p-10 text-4xl">
          No projects found
          {projectCreationButton !== undefined && (
            <button
              className="btn-xs h-8 shrink bg-emerald-500 hover:bg-emerald-600 text-white"
              type="button"
            >
              Create Project
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="flex mb-5 content-start pt-6 gap-x-1">
            <div className="flex max-md:flex-col gap-x-2 gap-y-2 w-full">
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
                        className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-20"
                        sideOffset={5}
                        side="bottom"
                        alignOffset={3}
                      >
                        <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                          All
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                          Private
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
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
                        className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-20"
                        sideOffset={5}
                        side="bottom"
                        alignOffset={3}
                      >
                        <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
                          Name
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1">
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

          <hr className="border-gray-300 mx-auto w-full" />
          {projects.map((project) => {
            return <ProjectItem key={project.id} project={project} />
          })}
        </>
      )}
    </div>
  )
}
