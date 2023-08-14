import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookBookmark } from '@fortawesome/free-solid-svg-icons'

import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogFooter } from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

type RemoveMemberDialogProps = {
  name: string
}

export function RemoveMemberDialog({ name }: RemoveMemberDialogProps) {
  return (
    <Dialog>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-y-10 py-4">
          <div className="text-center space-y-6">
            <FontAwesomeIcon icon={faBookBookmark} className="text-4xl" />
            <div className="text-xl">Invite a user to join {name}</div>
          </div>

          <div className="gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Enter a username"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Invite Member</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
