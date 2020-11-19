import { Switch } from './Switch'

export const Normal = () => (
  <>
    <Switch>Toggle dark mode</Switch>
  </>
)

export const Disabled = () => (
  <>
    <Switch disabled checked={false}>
      Unchecked
    </Switch>
    <Switch className="mt-3" disabled checked>
      Checked
    </Switch>
  </>
)

export default {
  title: 'Switch',
  component: Switch,
}
