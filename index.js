const $todoInput = $("#todo-input");

// Listen For Custom Events
document.addEventListener("onTelemetry", function (e) {
    console.log("[TELEMETRY] - Event Received", e.eventData);
});


// Fetch Abstraction
function apiRequest({ url, callback, method = 'GET', body = null }) {
    const state = {
        isLoading: true,
        isSuccess: false,
        isError: false,
        data: null,
        error: null,
        isFetching: false
    };

    try {
        state.isFetching = true;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        callback(state);

        fetch(url, options).then((response) => {

            // we are still loading, fetching has completed
            state.isFetching = false;
            state.isSuccess = response.ok;

            if (response.status === 204) {
                state.isLoading = false;
                callback(state);
                return;
            }

            callback(state);

            response.json().then(data => {

                state.data = data;
                state.isLoading = false;
                callback(state);

            }).catch(error => {
                state.isError = true;
                state.error = error;
                state.isLoading = false;
                state.isFetching = false;
                callback(state);
            })
        }).catch(error => {
            state.isError = true;
            state.error = error;
            state.isLoading = false;
            state.isFetching = false;
            callback(state);
        });


        return {
            ...state,
            isLoading: false,
            isSuccess: true,
            data,
            isFetching: false
        };
    } catch (err) {
        return {
            ...state,
            isLoading: false,
            isError: true,
            error: err,
            isFetching: false
        };
    }
}

function addTodoRow({ id, title }) {
    const listItem = $(`
  <li id="todo-${id}" class="todo-item">
    <span class="title">${title}</span>
    <button>Delete</button>
  </li>
`);

    $(".todo-list").append(listItem);

    listItem.find("button").on("click", async () => {

        const callback = state => {
            if (state.isSuccess && !state.isLoading) {
                listItem.remove();
            } else if (state.isError === true) {
                console.error('Failed to delete task:', state.error);
            }
        }

        apiRequest({
            url: `/api/tasks/${id}/`,
            method: 'GET',
            callback
        });
    });
}

$(".add-btn").on("click", async (e) => {

    e.preventDefault();

    const title = $todoInput.val().trim();
    const callback = state => {
        if (state.isSuccess && !state.isLoading) {
            addTodoRow(state.data);

            const event = new CustomEvent('onTelemetry', {
                eventData: { ...state.data }
            });

            document.dispatchEvent(event);

            $todoInput.val("");
        } else if (state.isError === true) {
            console.error('Failed to create task:', state.error);
        }
    }

    if (title) {
        apiRequest({
            url: '/api/tasks',
            method: 'POST',
            body: { title },
            callback
        });
    }
});

// Fetch Initial Data
const initializeData = async () => {

    const callback = state => {

        if (state.isSuccess && !state.isLoading && state.data) {
            for (const task of state.data) {
                addTodoRow(task);
            }
        } else if (state.isError) {
            console.error('Failed to fetch tasks:', state.error);
        }

    }

    apiRequest({ url: '/api/tasks', callback });
}

initializeData();