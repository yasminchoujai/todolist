document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('newtask');
    const addProjectButton = document.getElementById('newproject');
    const taskModal = document.getElementById('taskModal');
    const projectModal = document.getElementById('projectModal');
    const taskForm = document.getElementById('taskForm');
    const projectForm = document.getElementById('projectForm');
    const mainContent = document.querySelector('.main');
    const sidecontent = document.querySelector('.sidenav');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let projects = JSON.parse(localStorage.getItem('projects')) || [];

    tasks.forEach(task => displayTask(task));
    projects.forEach(project => displayProject(project));

    addTaskButton.addEventListener('click', (event) => {
        event.preventDefault();
        taskModal.style.display = 'block';
    });

    document.querySelector('.close-button').addEventListener('click', () => {
        taskModal.style.display = 'none';
    });

    addProjectButton.addEventListener('click', (event) => {
        event.preventDefault();
        projectModal.style.display = 'block';
    });

    // Event listener to close project modal
    document.querySelector('.close-button-project').addEventListener('click', () => {
        projectModal.style.display = 'none';
    });

    // Event listener for submitting task form
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Gather task data
        const taskName = document.getElementById('taskName').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('dueDate').value;
        const priority = document.getElementById('priority').value;
        const parentProject = document.getElementById('parentProject').value;

        // Create task object
        const newTask = {
            id: Date.now(), // Unique identifier using timestamp
            taskName,
            description,
            dueDate,
            priority,
            parentProject,
            done: false // Default to not done
        };

        // Add new task to tasks array
        tasks.push(newTask);

        // Save tasks array to local storage
        localStorage.setItem('tasks', JSON.stringify(tasks));

        // Reset form and close modal
        taskForm.reset();
        taskModal.style.display = 'none';

        // Display new task
        displayTask(newTask);
    });

    // Event listener for submitting project form
    projectForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Gather project data
        const projectName = document.getElementById('projectName').value;

        // Create project object
        const newProject = {
            id: Date.now(), // Unique identifier using timestamp
            projectName
        };

        projects.push(newProject);

        localStorage.setItem('projects', JSON.stringify(projects));

        projectForm.reset();
        projectModal.style.display = 'none';

        displayProject(newProject);
    });

    // Function to display a task
    
    function displayTask(task) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task-item');
        taskDiv.dataset.taskId = task.id; // Set data attribute for identification
        taskDiv.innerHTML = `
         <input type="checkbox" id="done-${task.id}" class="task-done">
            <label for="done-${task.id}" class="check-box"></label>
            <h3>${task.taskName}</h3>
            <p class="project-text">${task.description}</p>
            <p class="project-text"> ${task.dueDate}</p>
            <p class="project-text"> ${task.priority}</p>
            <button class="delete-task">✖</button>
        `;

        // Add event listener for task completion
        const doneCheckbox = taskDiv.querySelector('.task-done');
        doneCheckbox.checked = task.done; // Set checkbox state based on task status
        doneCheckbox.addEventListener('change', () => {
            task.done = !task.done;
            updateTaskInLocalStorage(task);
            if (task.done) {
                taskDiv.classList.add('task-done');
            } else {
                taskDiv.classList.remove('task-done');
            }
        });

        // Add event listener for task deletion
        const deleteButton = taskDiv.querySelector('.delete-task');
        deleteButton.addEventListener('click', () => {
            deleteTask(task.id);
            taskDiv.remove();
        });
        mainContent.appendChild(taskDiv);
    }

    // Function to display a project
    function displayProject(project) {

        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project-item');
        projectDiv.dataset.projectId = project.id; // Set data attribute for identification
        projectDiv.innerHTML = `
            <h3>${project.projectName}</h3>
            <button class="delete-project">Delete</button>
        `;

        // Add event listener for project deletion
        const deleteButton = projectDiv.querySelector('.delete-project');
        deleteButton.addEventListener('click', () => {
            deleteProject(project.id);
            projectDiv.remove();
        });
        sidenav.appendChild(projectDiv);
    }

    // Function to update a task in local storage
    function updateTaskInLocalStorage(updatedTask) {
        tasks = tasks.map(task => {
            if (task.id === updatedTask.id) {
                return updatedTask;
            }
            return task;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to delete a task
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to delete a project
    function deleteProject(projectId) {
        projects = projects.filter(project => project.id !== projectId);
        localStorage.setItem('projects', JSON.stringify(projects));
    }
});
