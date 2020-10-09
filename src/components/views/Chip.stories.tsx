import React from 'react'

import { Chip } from './Chip'

export const DefaultChip = () => (
  <>
    <Chip>Default color</Chip>
    <Chip className="ml-3" size="small">
      Default color small
    </Chip>
  </>
)

export const GreenChip = () => (
  <>
    <Chip color="green">Hello</Chip>
    <Chip color="green" className="ml-3" size="small">
      Hello small
    </Chip>
  </>
)
export const GreenInvertedChip = () => (
  <>
    <Chip color="green" inverted>
      Hello
    </Chip>
    <Chip color="green" className="ml-3" size="small" inverted>
      Hello small
    </Chip>
  </>
)

export const VioletChip = () => (
  <>
    <Chip color="violet">Hello</Chip>
    <Chip color="violet" className="ml-3" size="small">
      Hello small
    </Chip>
  </>
)
export const VioletInvertedChip = () => (
  <>
    <Chip color="violet" inverted>
      Hello
    </Chip>
    <Chip color="violet" className="ml-3" size="small" inverted>
      Hello small
    </Chip>
  </>
)

export const RedChip = () => (
  <>
    <Chip color="red">Hello</Chip>
    <Chip color="red" className="ml-3" size="small">
      Hello small
    </Chip>
  </>
)
export const RedInvertedChip = () => (
  <>
    <Chip color="red" inverted>
      Hello
    </Chip>
    <Chip color="red" className="ml-3" size="small" inverted>
      Hello small
    </Chip>
  </>
)

export const PrimaryChip = () => (
  <>
    <Chip color="primary">Hello</Chip>
    <Chip color="primary" className="ml-3" size="small">
      Hello small
    </Chip>
  </>
)
export const PrimaryInvertedChip = () => (
  <>
    <Chip color="primary" inverted>
      Hello
    </Chip>
    <Chip color="primary" className="ml-3" size="small" inverted>
      Hello small
    </Chip>
  </>
)

export default {
  title: 'Chip',
  component: Chip,
}
