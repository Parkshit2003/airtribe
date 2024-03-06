import React, { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { faTrash, faEdit, faSave, faTimes , faPlus} from '@fortawesome/free-solid-svg-icons';

const initialTasks = [
  { id: 1, title: 'card 4', status: 'Not started', description: 'Description of Task 4' },
  { id: 2, title: 'card 1', status: 'Not started', description: 'Description of Task 1' },
  { id: 3, title: 'card 5', status: 'Not started', description: 'Description of Task 5' },
  { id: 4, title: 'card 2', status: 'In progress', description: 'Description of Task 2' },
  { id: 5, title: 'card 3', status: 'Completed', description: 'Description of Task 3' }
];



function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [statuses,setStatuses] = useState(['Not started', 'In progress', 'Completed']);
  const colors = ['rgb(232, 126, 110)', 'rgb(232, 211, 110)', 'rgb(107, 234, 205)'];
  const [colorIndex, setColorIndex] = useState(0);



  const onDragEnd = (result) => {
    const { source, destination } = result;
  
    // Dropped outside the list or in the same position
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }
  
    // If dropped within the same column
    if (source.droppableId === destination.droppableId) {
      const updatedTasks = [...tasks];
      const [removed] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, removed);
      setTasks(updatedTasks);
    } else {
      // If dropped in a different column
      const draggedTask = tasks.find(task => task.id.toString() === result.draggableId);
      const updatedTasks = tasks.map(task =>
        task.id === draggedTask.id ? { ...task, status: destination.droppableId } : task
      );
      setTasks(updatedTasks);
    }
  };
  
  

  const addTask = (status) => {
    let cardName = newCardName.trim();
    if (!cardName) {
      cardName = prompt('Enter the name for the new card:') || `card ${tasks.length + 1}`;
    }

    const newTask = {
      id: tasks.length + 1,
      title: cardName,
      status,
      description: ''
    };
    setTasks([...tasks, newTask]);
    setNewCardName('');
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  const showTaskDetails = (id) => {
    const task = tasks.find(task => task.id === id);
    setSelectedTask(task);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedDescription(selectedTask.description);
    setEditedTitle(selectedTask.title)
  };


  const handleSave = () => {
    const updatedTasks = tasks.map(task => {
      if (task.id === selectedTask.id) {
        return {
          ...task,
          status: editedStatus || task.status, // Use editedStatus if available, otherwise keep the existing status
          title: editedTitle || task.title, // Use editedTitle if available, otherwise keep the existing title
          description: editedDescription, // Always update description
        };
      }
      return task;
    });
  
    setTasks(updatedTasks);
    setIsEditing(false);
    setSelectedTask(null);
  };
  

  const handleClose = () => {
    setSelectedTask(null);
  };

  const handleDoubleClick = (task) => {
    const newName = prompt('Enter new card name:', task.title);
    if (newName) {
      const updatedTasks = tasks.map(t =>
        t.id === task.id ? { ...t, title: newName } : t
      );
      setTasks(updatedTasks);
    }
  };
  const addStatus = (statusName, index) => {
    const newStatuses = [...statuses];
    const newStatus = statusName.trim(); // Trim any leading or trailing whitespace
    if (newStatus && !statuses.includes(newStatus)) {
      newStatuses.splice(index + 1, 0, newStatus);
      setStatuses(newStatuses);
      setNewStatus('');
    } else {
      alert('Please enter a valid and unique status name.');
    }
  };
  

  const deleteStatus = (status) => {
    const updatedStatuses = statuses.filter(s => s !== status);
    setStatuses(updatedStatuses);
  };
  
  
  


  return (
    <div className="app">
      <div className='nav'><h1>Airtribe's Todo Application</h1></div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {statuses.map((status, index) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div className="column" {...provided.droppableProps} ref={provided.innerRef}>
                  <h2><span style={{ backgroundColor: colors[(index + colorIndex) % colors.length], padding: '0 5px' }}>{status}</span> {tasks.filter(task => task.status === status).length} 
                  {index !== statuses.length && ( 
                     <button onClick={() => {
                      const statusName = prompt('Enter the name for the new status:');
                      if (statusName !== null) { // Check if user cancelled prompt
                        addStatus(statusName, index); // Pass the index of the current status
                      }
                    }}><FontAwesomeIcon icon={faPlus} /></button>  
                    )}
                     
                      <button onClick={() => deleteStatus(status)}><FontAwesomeIcon icon={faTrash} /></button>
                    </h2>
                  {tasks.map((task, index) => (
                    task.status === status && (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="card"
                            onDoubleClick={() => handleDoubleClick(task)}
                          >
                            <p onClick={() => showTaskDetails(task.id)}>{task.title}</p>
                            <FontAwesomeIcon icon={faTrash} onClick={() => deleteTask(task.id)} />
                          </div>
                        )}
                      </Draggable>
                    )
                  ))}
                  {provided.placeholder}
                  <button onClick={() => addTask(status)}>+ New</button>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      {selectedTask && (
  <div className="modal">
    <div className="modal-content">
      <h3>Task Details</h3>
      <div>
        <h4>Title:</h4>
        {isEditing ? (
          <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
        ) : (
          <p>{selectedTask.title}</p>
        )}
      </div>
      <div>
        <h4>Status:</h4>
        {isEditing ? (
          <select value={editedStatus} onChange={(e) => setEditedStatus(e.target.value)}>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        ) : (
          <p>{selectedTask.status}</p>
        )}
      </div>
      <div>
        <h4>Description:</h4>
        {isEditing ? (
          <textarea value={editedDescription} onChange={e => setEditedDescription(e.target.value)} />
        ) : (
          <p>{selectedTask.description}</p>
        )}
      </div>
      {isEditing && (
        <button onClick={handleSave}><FontAwesomeIcon icon={faSave} />Save</button>
      )}
      {!isEditing && (
        <>
          <button onClick={handleEdit}><FontAwesomeIcon icon={faEdit} />Edit</button>
          <button onClick={() => { deleteTask(selectedTask.id); handleClose(); }}><FontAwesomeIcon icon={faTrash} /> Delete</button>
          <button onClick={handleClose}><FontAwesomeIcon icon={faTimes} /> Close</button>
          
        </>
      )}
      
    </div>
  </div>
)}

    </div>
  );
}

export default App;



