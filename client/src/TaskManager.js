import React, { useEffect, useState } from 'react';
import { FaCheck, FaPencilAlt, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import { CreateTask, DeleteTaskById, GetAllTasks, UpdateTaskById } from './api';
import { notify } from './utils';
function TaskManager() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [tasks, setTasks] = useState([]);
    const [updateTask, setUpdateTask] = useState(null);

    const handleTask = () => {
        if (updateTask && title && description && dueDate) {
            //upadte api call
            console.log('update api call');
            const obj = {
                title: title,
                description: description,
                dueDate: dueDate,
                isDone: updateTask.isDone,
                _id: updateTask._id
            }
            handleUpdateItem(obj);
        } else if (updateTask === null && title && description && dueDate) {
            console.log('create api call')
            //create api call
            handleAddTask();
        }
        setTitle('')
        setDescription('')
        setDueDate('')
        fetchAllTasks()
    }

    useEffect(() => {
        if (updateTask) {
            setTitle(updateTask.title);
            setDescription(updateTask.description);
            setDueDate(updateTask.dueDate);
        }
    }, [updateTask])


    ////////////////////////////////

    const handleAddTask = async () => {
        const obj = {
            title,
            description,
            dueDate,
            isDone: false
        }
        try {
            const { success, message } =
                await CreateTask(obj);
            if (success) {
                //show success toast
                notify(message, 'success')
            } else {
                //show error toast
                notify(message, 'error')
            }
            setTitle('')
            setDescription('')
            setDueDate('')
            fetchAllTasks()
        } catch (err) {
            console.error(err);
            notify('Failed to create task', 'error')
        }
    }

    ///////////////////////////////////////

    const fetchAllTasks = async () => {
        try {
            const { data } =
                await GetAllTasks();
                setTasks(data);
            // setCopyTasks(data);
            // console.log(data);
        } catch (err) {
            console.error(err);
            notify('Failed to Fetch task', 'error')
        }
    }
    useEffect(() => {
        fetchAllTasks()
    }, [])

    /////////////////////////////////

    const handleDeleteTask = async (id) => {
        try {
            const { success, message } = await DeleteTaskById(id);
            if (success) {
                //show success toast
                notify(message, 'success')
            } else {
                //show error toast
                notify(message, 'error')
            }
            fetchAllTasks()
        } catch (err) {
            console.error(err);
            notify('Failed to create task', 'error')
        }
    }

    const handleCheckAndUncheck = async (item) => {
        const { _id, isDone, title, description, dueDate } = item;
        const obj = {
            title,
            description,
            dueDate,
            isDone: !isDone
        }
        try {
            const { success, message } = await UpdateTaskById(_id, obj);
            if (success) {
                //show success toast
                notify(message, 'success')
            } else {
                //show error toast
                notify(message, 'error')
            }
            fetchAllTasks()
        } catch (err) {
            console.error(err);
            notify('Failed to create task', 'error')
        }
    }

    const handleUpdateItem = async (item) => {
        const { _id, isDone, title, description, dueDate } = item;
        const obj = {
            title,
            description,
            dueDate,
            isDone: isDone
        }
        try {
            const { success, message } = await UpdateTaskById(_id, obj);
            if (success) {
                //show success toast
                notify(message, 'success')
            } else {
                //show error toast
                notify(message, 'error')
            }
            fetchAllTasks()
        } catch (err) {
            console.error(err);
            notify('Failed to create task', 'error')
        }
    }
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    
    return (
        <div className='d-flex flex-column align-items-center
        w-50 m-auto mt-5'>
            <h2 className='mb-4'>Task Manager App</h2>
            {/* Input and Search box */}
            <div className='d-flex justify-content-between
            align-items-center mb-4 w-100'>
                <div className='input-group flex-grow-1 me-2'>
                    <input type='text'
                        value={title}
                        onChange={
                            (e) => setTitle(e.target.value)}
                        className='form-control me-1'
                        placeholder='Task Tittle'
                    />
                    <input type='text'
                        value={description}
                        onChange={
                            (e) => setDescription(e.target.value)}
                        className='form-control me-1'
                        placeholder='Task Description'
                    />
                    <input
                        type='date'
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className='form-control me-1'
                        placeholder='Due Date'
                    />
                    <button
                        onClick={handleTask}
                        className='btn btn-success btn-sm me-2'
                    >
                        <FaPlus className='m-2' />
                    </button>
                </div>
            </div>

            {/* List of items */}
            <div className='d-flex flex-column w-100'>
                {
                    tasks.map((item) => (
                        <div key={item._id} className='m-2 p-2 border bg-light
                w-100 rounded-3 d-flex justify-content-between
                align-items-center'>
                            <span
                                className={item.isDone ? 'text-decoration-line-through' : ''}
                            ><strong>Title:</strong> {item.title}
                            <br/>
                            <strong>Description:</strong> {item.description}
                            <br/>
                            <strong>Due Date:</strong> {formatDate(item.dueDate)}
                            </span>

                            <div className=''>
                                <button
                                    onClick={() => handleCheckAndUncheck(item)}
                                    className='btn btn-success
                            btn-sm me-2'
                                    type='button'>
                                    <FaCheck />
                                </button>
                                <button
                                    onClick={() => setUpdateTask(item)}
                                    className='btn btn-primary
                            btn-sm me-2'
                                    type='button'>
                                    <FaPencilAlt />
                                </button>
                                <button
                                    onClick={() => handleDeleteTask(item._id)}
                                    className='btn btn-danger
                            btn-sm me-2'
                                    type='button'>
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Toastify */}
            <ToastContainer
                position='top-right'
                autoClose={3000}
                hideProgressBar={false}
            /> 
        </div>
    )
}

export default TaskManager