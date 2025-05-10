import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const TaskBoard = ({ tasks: initialTasks, onTaskUpdate }) => {
  const [columns, setColumns] = useState({
    pending: {
      title: 'Pending',
      items: initialTasks.filter(task => task.status === 'pending')
    },
    in_progress: {
      title: 'In Progress',
      items: initialTasks.filter(task => task.status === 'in_progress')
    },
    completed: {
      title: 'Completed',
      items: initialTasks.filter(task => task.status === 'completed')
    }
  });

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // If dropped in the same column but different position
    if (source.droppableId === destination.droppableId) {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    } else {
      // If dropped in a different column
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      
      // Update task status
      const updatedTask = { ...removed, status: destination.droppableId };
      
      try {
        // Update task status in the backend
        await axios.put(`/api/tasks/${updatedTask.id}`, {
          status: destination.droppableId
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        destItems.splice(destination.index, 0, updatedTask);

        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems
          }
        });

        if (onTaskUpdate) {
          onTaskUpdate(updatedTask);
        }
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'danger'
    };
    return <Badge bg={colors[priority]}>{priority}</Badge>;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="row">
        {Object.entries(columns).map(([columnId, column]) => (
          <div className="col-md-4" key={columnId}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">{column.title}</h5>
                <Badge bg="secondary">{column.items.length}</Badge>
              </Card.Header>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="task-list p-2"
                    style={{ minHeight: '500px' }}
                  >
                    {column.items.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="mb-2"
                          >
                            <Card.Body>
                              <div
                                {...provided.dragHandleProps}
                                className="drag-handle mb-2"
                              >
                                <FontAwesomeIcon icon={faGripVertical} />
                              </div>
                              <Card.Title>{task.title}</Card.Title>
                              <Card.Text>{task.description}</Card.Text>
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  {getPriorityBadge(task.priority)}
                                </div>
                                <small className="text-muted">
                                  Due: {new Date(task.due_date).toLocaleDateString()}
                                </small>
                              </div>
                            </Card.Body>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Card>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard; 