import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add a new journal entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Choose journal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gratitude">Gratitude</SelectItem>
              <SelectItem value="work-log">Work Log</SelectItem>
            </SelectContent>
          </Select>
          <Textarea placeholder="Type a new entry..." />
          <Button>Save entry</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add a todo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Type a todo..." />
          <Button>Add todo</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <span className="font-semibold">Gratitude</span>
              <p className="text-sm text-gray-500">Today I am grateful for a sunny day</p>
            </li>
            <li>
              <span className="font-semibold">Work Log</span>
              <p className="text-sm text-gray-500">Reviewed Q1 goals with the team</p>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
