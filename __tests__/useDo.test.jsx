import React from 'react'

import { fireEvent, render } from '@testing-library/react'

import useDo from '../src/useDo'

function ComponentUnderTest({ input }) {
  const [value, setValue, undo, redo, canUndo, canRedo] = useDo(input)

  return (
    <div>
      <label htmlFor="text-input">
        Enter value
        <input
          id="text-input"
          name="text"
          onChange={evt => setValue(evt.target.value)}
          type="text"
          value={value}
        />
      </label>
      <input
        id="undo-button"
        type="button"
        value="Undo"
        onClick={undo}
        disabled={!canUndo}
      />
      <input
        id="redo-button"
        type="button"
        value="Redo"
        onClick={redo}
        disabled={!canRedo}
      />
      <input type="button" value="Undo2" onClick={undo} />
      <input type="button" value="Redo2" onClick={redo} />
    </div>
  )
}

describe('#useDo', () => {
  it('should change the text', () => {
    const { getByLabelText } = render(<ComponentUnderTest input="foo" />)
    const input = getByLabelText('Enter value')
    fireEvent.change(input, { target: { value: 'bar' } })
    expect(input.value).toBe('bar')
  })

  it('should enable the undo button', () => {
    const { getByText, getByLabelText } = render(
      <ComponentUnderTest input="foo" />,
    )
    const input = getByLabelText('Enter value')
    const undoButton = getByText('Undo')
    fireEvent.change(input, { target: { value: 'bar' } })
    expect(input.value).toBe('bar')
    expect(undoButton.disabled).toBe(false)
  })

  it('should undo and redo', () => {
    const { getByText, getByLabelText } = render(
      <ComponentUnderTest input="foo" />,
    )
    const input = getByLabelText('Enter value')
    const undoButton = getByText('Undo')
    const redoButton = getByText('Redo')

    // enter text
    fireEvent.change(input, { target: { value: 'bar' } })
    expect(input.value).toBe('bar')
    expect(undoButton.disabled).toBe(false)

    // click undo
    fireEvent.click(undoButton)
    expect(input.value).toBe('foo')
    expect(redoButton.disabled).toBe(false)

    // click redo
    fireEvent.click(redoButton)
    expect(input.value).toBe('bar')
  })

  it('should reset redo', () => {
    const { getByText, getByLabelText } = render(
      <ComponentUnderTest input="foo" />,
    )
    const input = getByLabelText('Enter value')
    const undoButton = getByText('Undo')
    const redoButton = getByText('Redo')

    // enter text
    fireEvent.change(input, { target: { value: 'bar' } })
    fireEvent.change(input, { target: { value: 'baz' } })
    expect(input.value).toBe('baz')
    expect(undoButton.disabled).toBe(false)

    // click undo
    fireEvent.click(undoButton)
    fireEvent.click(undoButton)
    expect(input.value).toBe('foo')
    expect(redoButton.disabled).toBe(false)

    // input
    fireEvent.change(input, { target: { value: 'bat' } })
    expect(redoButton.disabled).toBe(true)
  })

  describe('when nothing has been done', () => {
    it('should have disabled buttons', () => {
      const { getByText } = render(<ComponentUnderTest input="foo" />)
      const undoButton = getByText('Undo')
      const redoButton = getByText('Redo')
      expect(undoButton.disabled).toBe(true)
      expect(redoButton.disabled).toBe(true)
    })

    it('click on undo/redo should be a noop', () => {
      const { getByText, getByLabelText } = render(<ComponentUnderTest />)
      const input = getByLabelText('Enter value')
      const undoButton = getByText('Undo2')
      const redoButton = getByText('Redo2')
      fireEvent.click(undoButton)
      fireEvent.click(redoButton)
      expect(input.value).toBe('')
    })
  })
})
