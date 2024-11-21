const apiUrl = 'https://66ff18222b9aac9c997e3f80.mockapi.io/TaskManager'; 

async function fetchTasks() {
    try {
        const response = await fetch(apiUrl);
        const tasks = await response.json();

        tasks.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

        const notCompletedTasks = tasks.filter(task => !task.estado);
        const completedTasks = tasks.filter(task => task.estado);

        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML = '';

        const createTaskCard = (task) => {
            return `
            <div class="mt-3 text-center">
                <div class="justify-content-center">
                    <div class="d-flex justify-content-center">
                        <div class="col-md-4">
                            <div class="card task-card">
                                <div style="background-color:${!task.estado ? 'transparent' : '#ddffdd'}" class="d-flex">
                                    <div class="card-body">
                                        <h5 style="color:${!task.estado ? 'black' : 'grey'}" class="task-title">${task.titulo}</h5>
                                        <p style="color:${!task.estado ? 'black' : 'grey'}" class="task-date">${task.fechaCreacion.substring(0, 19).replace('T', ' ')}</p>
                                        <p><span>Id: ${task.id}. </span>Detalle: ${task.descripcion}</p>
                                    </div>
                                    <div class="card-body">
                                         ${!task.estado ? `<button class=" play-task-btn" style="border:none; background-color:white" data-id="${task.id}" data-title="${task.titulo}" data-detail="${task.descripcion}">
                                            <i class="bi bi-play-circle-fill" style="font-size:66px;color:darkblue"></i>
                                         </button>` : '<i class="bi bi-check-circle-fill" style="font-size:66px; color:green"></i>'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        };

        notCompletedTasks.forEach(task => {
            tasksList.innerHTML += createTaskCard(task);
        });

        completedTasks.forEach(task => {
            tasksList.innerHTML += createTaskCard(task);
        });

        document.querySelectorAll('.play-task-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const title = e.target.closest('button').dataset.title;
                const detail = e.target.closest('button').dataset.detail;
                
                console.log('Reproduciendo:', { title, detail });
        
                playTaskAudio(title, detail);
            });
        });

    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

window.onload = fetchTasks;

async function updateTaskStatus(taskId, newStatus) {
    try {
        const date = new Date(new Date().setHours(new Date().getHours() + 21)).toISOString();
        const updatedTask = {
            estado: newStatus,
            fechaConclusion: newStatus === 'finalizado' ? date : null
        };

        const response = await fetch(`${apiUrl}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask)
        });

        const updatedData = await response.json();
        
        Swal.fire({
            title: 'Tarea actualizada',
            text: `El estado de la tarea ha sido actualizado a ${newStatus}`,
            icon: 'success'
        });

        fetchTasks();
    } catch (error) {
        console.error('Error updating task status:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al actualizar la tarea.',
            icon: 'error'
        });
    }
}
