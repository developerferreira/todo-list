const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
const taskDone = JSON.parse(localStorage.getItem('taskDone') || '[]');

// pegando as tarefas salvas no localStorage
tasks.forEach(task => {
    createTask(task);
});

// verificando quais tarefas estão marcadas como feitas e atualizando a interface
if (taskDone.length > 0) {
    taskDone.forEach(t => {
        if (t.includes(' - done')) {
            const taskElements = document.querySelectorAll('.task-text');

            taskElements.forEach(el => {
                if (el.textContent === t.replace(' - done', '')) {
                    el.classList.add('task-text-done');
                    const doneBtn = el.nextElementSibling.querySelector('.done-btn');
                    doneBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
                }
            });
        }
    });
}

function addTask() {
    const input = document.querySelector('#task-input');

    if (input.value.trim() === '') {
        alert('Descreva sua tarefa primeiro.');
        return;
    }

    // add a tarefa ao array
    tasks.push(input.value.trim());
    createTask(input.value.trim());
    updateTasks();

    input.value = '';
}

function createTask(taskName) {
    // pegando a ul para add a tarefa
    const ul = document.querySelector('#task-list');

    // criando os elementos
    const li = document.createElement('li');
    const span = document.createElement('span');
    const div = document.createElement('div');
    const doneBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');

    // definindo as classes
    li.className = 'task-item';
    span.className = 'task-text';
    div.className = 'task-actions';
    doneBtn.className = 'done-btn';
    deleteBtn.className = 'delete-btn';

    // definindo a estrutura
    ul.appendChild(li);
    li.appendChild(span);
    li.appendChild(div);
    div.appendChild(doneBtn);
    div.appendChild(deleteBtn);

    // add ícones aos botões
    doneBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
    deleteBtn.innerHTML = '<i class="bi bi-trash3"></i>';

    span.textContent = taskName;

    deleteBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja deletar essa tarefa?')) {
            deleteTask(taskName);
            ul.removeChild(li);
            return;
        } else {
            return;
        }
    });

    doneBtn.addEventListener('click', () => {
        span.classList.toggle('task-text-done');
        span.classList.contains('task-text-done') 
            ? doneBtn.innerHTML = '<i class="bi bi-x-lg"></i>' 
            : doneBtn.innerHTML = '<i class="bi bi-check-lg"></i>';

        // atualizando o localStorage com o estado da tarefa (feita ou não)
        const isTaskDone = span.classList.contains('task-text-done');
        tasks.map(task => {
            if (task === taskName) {
                if (isTaskDone) {
                    if (!taskDone.includes(task + ' - done')) {
                        taskDone.push(task + ' - done');
                    }
                } else {
                    const index = taskDone.indexOf(task + ' - done');

                    if (index !== -1) {
                        taskDone.splice(index, 1);
                    }
                }

                localStorage.setItem('taskDone', JSON.stringify(taskDone));
            }
        })
    });
}

function updateTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTask(taskName) {
    // procurando a tarefa no localStorage e deletando ela
    const getTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const newTasks = getTasks.filter(task => task !== taskName);
    
    // deletando as tarefas feitas também
    const getTasksDone = JSON.parse(localStorage.getItem('taskDone')) || [];
    const newTasksDone = getTasksDone.filter(task => task !== taskName + ' - done');
    
    // atualizando o localStorage com as tarefas que sobraram
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    localStorage.setItem('taskDone', JSON.stringify(newTasksDone));

    tasks.splice(tasks.indexOf(taskName), 1);
    taskDone.splice(taskDone.indexOf(taskName + ' - done'), 1);
}

// ação ao pressionar enter
onkeydown = (e) => {
    const taskInput = document.querySelector('#task-input');
    
    if (e.key === 'Enter' && document.activeElement === taskInput) {
        addTask();
    } else {
        return;
    }
}