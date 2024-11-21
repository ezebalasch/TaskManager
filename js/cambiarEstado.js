document.getElementById('cambiarEstadoLink').addEventListener('click', function (event) {
    event.preventDefault(); 

    Swal.fire({
        title: 'Cambiar estado de la tarea',
        html: `
            <label for="taskId">ID de la tarea:</label>
            <input type="text" id="taskId" class="swal2-input" placeholder="Ingrese el ID de la tarea">
            <label for="taskStatus">Nuevo estado:</label>
            <select id="taskStatus" class="swal2-input">
                <option value="false">Pendiente</option>
                <option value="true">Finalizado</option>
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        preConfirm: () => {
            const taskId = document.getElementById('taskId').value;
            const status = JSON.parse(document.getElementById('taskStatus').value);


            updateTaskStatus(taskId, status);
        }
    });
});
