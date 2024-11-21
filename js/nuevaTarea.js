document.getElementById('nuevaTareaLink').addEventListener('click', function(event) {
    event.preventDefault();

    Swal.fire({
        title: 'Crear una nueva tarea',
        html: `
            <input id="taskTitle" class="swal2-input" placeholder="Título de la tarea">
            <textarea id="taskDescription" class="swal2-textarea" placeholder="Detalle de la tarea"></textarea>
            <select id="taskStatus" class="swal2-select">
                <option value="false">Pendiente</option>
                <option value="true">Finalizado</option>
            </select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar tarea',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const title = document.getElementById('taskTitle').value;
            const description = document.getElementById('taskDescription').value;
            const status = document.getElementById('taskStatus').value;
            const date = new Date(new Date().setHours(new Date().getHours() + 21)).toISOString();

            if (!title || !description) {
                Swal.showValidationMessage('Por favor, completa todos los campos');
                return false;
            }

            const taskData = {
                titulo: title,
                descripcion: description,
                estado: JSON.parse(status),
                fechaCreacion: date,
                fechaConclusion: ""
            };

            return taskData;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const taskData = result.value;

            fetch('https://66ff18222b9aac9c997e3f80.mockapi.io/TaskManager', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            })
            .then(response => response.json())
            .then(data => {
                Swal.fire(
                    'Tarea creada!',
                    'Tu tarea se ha guardado correctamente.',
                    'success'
                );
            })
            .catch(error => {
                Swal.fire(
                    'Error',
                    'Hubo un problema al guardar la tarea.',
                    'error'
                );
                console.error('Error al enviar la tarea:', error);
            });
        }
    });
});
