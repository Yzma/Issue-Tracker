import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookBookmark, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import {
  ProjectList,
  ProjectListEmpty,
  ProjectListHeader,
  ProjectListInputButton,
  ProjectListInputSearch,
  ProjectListItem,
} from './ProjectList'
import { ProjectListLoading } from './ProjectListLoading'
import { SharedProjectListProps } from './types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'

export default function SharedProjectList({
  loading,
  createProjectLink,
  projects,
}: SharedProjectListProps) {
  return (
    <div>
      {loading ? (
        <ProjectListLoading />
      ) : (
        <ProjectList>
          {projects.length === 0 ? (
            <ProjectListEmpty>
              {createProjectLink && (
                <Button className="flex w-48" size="lg" asChild>
                  <Link href={createProjectLink}>
                    <FontAwesomeIcon
                      size="lg"
                      icon={faBookBookmark}
                      className="pr-3"
                    />
                    Create Project
                  </Link>
                </Button>
              )}
            </ProjectListEmpty>
          ) : (
            <ProjectListHeader>
              <ProjectListInputSearch />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ProjectListInputButton>
                    Type
                    <FontAwesomeIcon icon={faCaretDown} className="pl-1" />
                  </ProjectListInputButton>
                </DropdownMenuTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuContent
                    sideOffset={5}
                    side="bottom"
                    alignOffset={3}
                  >
                    <DropdownMenuItem>All</DropdownMenuItem>
                    <DropdownMenuItem>Private</DropdownMenuItem>
                    <DropdownMenuItem>Public</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ProjectListInputButton>
                    Sort
                    <FontAwesomeIcon icon={faCaretDown} className="pl-1" />
                  </ProjectListInputButton>
                </DropdownMenuTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuContent
                    sideOffset={5}
                    side="bottom"
                    alignOffset={3}
                  >
                    <DropdownMenuItem>Name</DropdownMenuItem>
                    <DropdownMenuItem>Last Updated</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>

              {createProjectLink && (
                <ProjectListInputButton asChild>
                  <Link href={createProjectLink}>
                    <FontAwesomeIcon
                      size="lg"
                      icon={faBookBookmark}
                      className="pr-3"
                    />
                    New
                  </Link>
                </ProjectListInputButton>
              )}
            </ProjectListHeader>
          )}
          {projects &&
            projects.map((project) => {
              return <ProjectListItem key={project.name} project={project} />
            })}
        </ProjectList>
      )}
    </div>
  )
}
