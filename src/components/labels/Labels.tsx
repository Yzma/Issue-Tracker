import { Label } from '@prisma/client'
import { PropsWithChildren } from 'react'

type LabelTypes = {
  labels: Pick<Label, 'name' | 'color'>[]
}

export default function Labels(props: PropsWithChildren<LabelTypes>) {
  const { labels, ...other } = props
  return (
    <div className="flex gap-x-1">
      {labels.map((label, index) => (
        <a
          {...other}
          className="text-sm text-center font-semibold px-1.5 rounded-full"
          style={{
            color: 'white',
            background: `#${label.color}`,
          }}
          key={index}
        >
          {label.name}
        </a>
      ))}
    </div>
  )
}
