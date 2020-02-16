import React from 'react'

import useDo from '../src/useDo'

function Todo() {
  const [tasks, setTasks, undo, redo, canUndo, canRedo] = useDo([
    { task: 'Buy milk', completed: true },
    { task: 'Buy baguette', completed: false },
    { task: 'Walk dog', completed: false },
    { task: 'Go to the gym', completed: false },
  ])

  const onChange = evt => {
    const { name: taskId } = evt.target
    setTasks(
      tasks.map(({ task, completed }, idx) => ({
        task,
        completed: `${idx}` === taskId ? !completed : completed,
      })),
    )
  }

  return (
    <div>
      <ul>
        {tasks.map(({ task, completed }, idx) => (
          <li key={task}>
            <input
              type="checkbox"
              name={idx}
              checked={completed}
              onChange={onChange}
            />
            <span style={{ textDecoration: completed ? 'line-through' : '' }}>
              {task}
            </span>
          </li>
        ))}
      </ul>
      <input type="button" value="Undo" onClick={undo} disabled={!canUndo} />
      <input type="button" value="Redo" onClick={redo} disabled={!canRedo} />
    </div>
  )
}

function Form() {
  const [state, setState, undo, redo, canUndo, canRedo] = useDo({
    name: 'Alice',
    age: '20',
    city: 'Paris',
  })

  const onChange = evt => {
    const { name, value } = evt.target
    setState({
      ...state,
      [name]: value,
    })
  }

  return (
    <form>
      <div>
        <label htmlFor="name">
          Name
          <input
            type="text"
            onChange={onChange}
            value={state.name}
            name="name"
          />
        </label>
      </div>
      <div>
        <label htmlFor="age">
          Age
          <input type="text" onChange={onChange} value={state.age} name="age" />
        </label>
      </div>
      <div>
        <label htmlFor="city">
          City
          <input
            type="text"
            onChange={onChange}
            value={state.city}
            name="city"
          />
        </label>
      </div>
      <input type="button" onClick={undo} value="Undo" disabled={!canUndo} />
      <input type="button" onClick={redo} value="Redo" disabled={!canRedo} />
    </form>
  )
}

export default { title: 'Undo and Redo' }
export { Form, Todo }
