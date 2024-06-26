import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setshowFinished] = useState(false)



  //retrive todos from local-storage on refresh or restart of browser
  useEffect(() => {
    const temp = JSON.parse(localStorage.getItem('todos'))
    if (temp) {
      setTodos(temp)
    }
  }, [])


  const saveToLS = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  useEffect(() => {
    saveToLS(); // Save to local storage whenever todos change
  }, [todos]);


  ///handle add button
  const handleAdd = () => {
    setTodos([{ id: uuidv4(), todo, isCompleted: false }, ...todos])
    setTodo("")
  }

  //connecting add button with enter kay
  const handleKeyDown = (e) => {
    if (e.key == 'Enter') handleAdd()
  }

  //handle edit button
  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id == id)
    setTodo(t[0].todo)
    handleDelete(e, id);
  }

  //handle delete button
  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => {
      return item.id !== id;
    })
    setTodos(newTodos)
  }

  //take input from textearea
  const handleChange = (e) => {
    setTodo(e.target.value)

  }

  //handle checkbox when task completed
  const handleCheckBox = (e) => {
    let ide = e.target.name;
    let newTodos = [...todos]
    for (let temp of newTodos) {
      if (temp.id === ide) {
        temp.isCompleted = !temp.isCompleted
      }
    }
    setTodos(newTodos)
  }

  //set show finished
  const toggleFinished = (e) => {
    console.log(showFinished)
    setshowFinished(!showFinished);

  }


  return (
    <>
      <Navbar />

      <div className="container bg-blue-100 rounded-xl p-5 my-8 min-h-[75vh] mx-auto md:w-[88%] w-[98%]">

        <div className="addtodo my-3">
          <h1 className='text-2xl font-bold mb-3'>Add a Todo</h1>

          <div className='flex items-center'>
            <textarea onChange={handleChange} onKeyDown={handleKeyDown} value={todo} type="text" 
            className='w-3/4 type p-1 rounded-md break-words' placeholder='add a task...'/>

            <button onClick={handleAdd} disabled={todo.length < 1}
              className='bg-blue-800 text-white font-bold p-3 py-2 rounded-md hover:bg-blue-700 ml-4 disabled:bg-blue-400'>Add</button>
          </div>
        </div>
          

        <input onChange={toggleFinished} type="checkbox" checked={showFinished} /> Show finished Todos
  
        <h1 className='text-2xl font-bold'>Your Todos</h1>

        <div className="todos">
          {todos.length === 0 && <div className='m-5 text-2xl text-gray-500'>No Todos to display!</div>}

          {todos.map(item => {
            if((!showFinished && !item.isCompleted) || (showFinished && item.isCompleted))
              return  <div key={item.id} className="todo mt-2 flex bg-blue-200 w-[90%] p-3 rounded-md">

                <div>
                  <input className='mr-2 mt-2' type="checkbox" onChange={handleCheckBox} checked={item.isCompleted} name={item.id} />
                </div>


                <div className='w-[80%] break-words text-lg'>
                  <div className={item.isCompleted ? "line-through" : ""} >{item.todo}</div>
                </div>

                <div className="btns">
                  <button onClick={(e) => { handleEdit(e, item.id) }} disabled={todo.length>0} className='bg-blue-800 text-white font-bold p-3 py-2 rounded-md hover:bg-blue-700 ml-4'><FaEdit /></button>
                  <button onClick={(e) => { handleDelete(e, item.id) }} className='bg-blue-800 text-white font-bold p-3 py-2 rounded-md hover:bg-blue-700 ml-4'><MdDelete /></button>
                </div>
              </div>
          })}
        </div>
      </div>
    </>
  )
}

export default App
