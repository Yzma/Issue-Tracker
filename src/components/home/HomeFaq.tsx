import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HomeSectionDescription, HomeSectionTitle } from './HomeSection'

export default function HomeFaq() {
  return (
    <div className="space-y-3">
      <HomeSectionTitle>Frequently Asked Questions</HomeSectionTitle>
      <HomeSectionDescription className="text-center">
        Heres a list of frequently asked questions some members had about the
        project.
      </HomeSectionDescription>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left">
            Whats an Organization?
          </AccordionTrigger>
          <AccordionContent>
            An organization is essentially a group of members who can create and
            share projects with other members within the organization
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left">
            Who can view my private projects?
          </AccordionTrigger>
          <AccordionContent>
            Private projects are exclusively accessible to members who have
            received direct invitations to join that specific project or to
            individuals who are part of the same organization for which the
            project was created. This means you can invite members from outside
            your organization to participate in certain organization projects
            without inviting them to the organization itself and giving them
            access to all projects. organization.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left">
            How are issues formatted?
          </AccordionTrigger>
          <AccordionContent>
            We utilize a library called{' '}
            <a
              className="text-blue-600 hover:underline"
              href="https://github.com/remarkjs/react-markdown"
            >
              React-Markdown
            </a>
            , allowing users to apply Markdown formatting to style issues and
            comments
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
