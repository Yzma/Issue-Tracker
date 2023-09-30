export type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  items: {
    href: string
    title: string
    shouldRender?: boolean
  }[]
}
