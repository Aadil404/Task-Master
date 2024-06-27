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
    setTodos([{ id: uuidv4(), todo, isCompleted: false, added: new Date().toLocaleString(),completed:"pending"}, ...todos])
    setTodo("")
  }

  //connecting add button with enter kay
  const handleKeyDown = (e) => {
    if (e.key == 'Enter'){
      e.preventDefault();
      handleAdd()
    }
      
  }

  //handle edit button
  const handleEdit = (e, id) => {
    if(!window.confirm('Are you sure you want to edit this todo?')) {
      return;
    }
    let t = todos.filter(i => i.id == id)
    setTodo(t[0].todo)
    handleDelete(e, id,true);
  }

  //handle delete button
  const handleDelete = (e, id,deleteforEdit=false) => {
    if(!deleteforEdit && !window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }
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
        temp.completed = temp.completed==="pending"?new Date().toLocaleString():"pending"
      }
    }

    setTodos(newTodos)
  }

  //set show finished
  const toggleFinished = (e) => {
    setshowFinished(!showFinished);

  }


  return (
    <>
      <Navbar />

      <div className="container bg-blue-100 rounded-xl md:p-5 p-1 md:pl-8 my-8 min-h-[75vh] mx-auto md:w-[88%] w-[98%]">

        <div className="addtodo my-3">
          <h1 className='text-2xl font-bold mb-3'>Add a Task</h1>

          <div className='flex items-center'>
            <textarea onChange={handleChange} onKeyDown={handleKeyDown} value={todo} type="text" 
            className='w-3/4 type p-1 rounded-md break-words bg-gray-100' placeholder='type here...'/>

            <button onClick={handleAdd} disabled={todo.length < 1}
              className='bg-blue-800 text-white font-bold p-3 py-2 rounded-md hover:bg-blue-700 ml-4 disabled:bg-blue-400'>Add</button>
          </div>
        </div>
          
        <div className='text-end' >
        <input onChange={toggleFinished} type="checkbox" checked={showFinished} /> Show completed Tasks
        </div>
  
        <h1 className='text-2xl font-bold'>{!showFinished?"Tasks to be done" : "Completed Tasks"}</h1>

        <div className="todos">
          {todos.length === 0 && <div className='m-5 text-2xl text-gray-500'>No Tasks to display!</div>}

          {todos.map(item => {
            if((!showFinished && !item.isCompleted) || (showFinished && item.isCompleted))
              return  <div key={item.id} className={`todo mt-3 flex bg-blue-200 md:w-[95%] w-full p-3 pb-1 rounded-md ${item.isCompleted && 'bg-green-300'}`}>

                <div>
                  <input className='mr-2 mt-2' type="checkbox" onChange={handleCheckBox} checked={item.isCompleted} name={item.id} />
                </div>

                <div className='w-[85%] break-words sm:text-lg '>
                  <div className='font-serif'>{item.todo}</div>
                  <div className={`sm:text-sm text-xs flex gap-[20vw]  mt-2 font-semibold  text-gray-500`}>
                    <div>added: {item.added}</div>               
                    <div>completed : {item.completed}</div>
                  </div>
                </div>

                <div className="btns flex sm:flex-row flex-col">
                  <button onClick={(e) => { handleEdit(e, item.id) }} disabled={todo.length>0} 
                  className='h-10 bg-blue-800 text-white font-bold p-3 py-2 rounded-md hover:bg-blue-700 md:ml-4 ml-1 mb-1 disabled:bg-blue-400'><FaEdit /></button>
                  <button onClick={(e) => { handleDelete(e, item.id) }} 
                  className='h-10 bg-blue-800 text-white font-bold p-3 py-2 rounded-md hover:bg-blue-700 md:ml-4 ml-1 mb-1'><MdDelete /></button>
                </div>
              </div>
          })}
        </div>
      </div>
    </>
  )
}

export default App
