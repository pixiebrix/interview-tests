## Mod Developer Interview

### Interview Format

- Skill: Can they use the Javascript brick
- Skill: Can they style a panel with CSS
- Skill: Can they implement basic error handling for a network request
- Competency: Communication/Business Sense: can they tie what they're doing to the business context

### Interview Setup

- Review solution file in `solution.html` file

```bash
npm install
npm start
```

### Interview Sequence

Bug 1: why isn't Add Task button doing anything?

- Solution: $todoInput is using "#" instead of "." selector
- Skills tested: basic CSS selectors

Bug 2: how can I center the container?

- Solution: use flexbox on the body
- Skills tested: flexbox, centering

Bug 3: how can I add spacing above the first task?

- Solution: include margin-top on `.todo-item`
- Skills tested: margin
- Questions: why do I get 20px between the items instead of 10px (answer: margins collapse)

Bug 4: why isn't the task sometimes being added to the list?

- Solution: the network endpoint is flakey
- Skills tested: Chrome network tab, checking for error code
- Hint: the fetch response has a `ok` and `status` property
- Questions: if checking status code, what status codes would be error codes (answer: 4xx, 5xx)

Bug 5: why isn't the task staying deleted? (Part 1)

- Solution: method is using "GET" instead of "DELETE" 
- Skills tested: Chrome network tab, basic HTTP methods

Bug 6: why isn't the task staying deleted? (Part 2)

- Solution: Move the server call before the UI call. Show an alert if the server call fails.
- Skills tested: have the explain error handling UX approaches

Task 7: write a "retry" method and apply it to the POST/DELETE methods

- Solution: Wrap in try/catch and retry
- Skills tested: async/await, try/catch, writing a method that takes another method

Task 8: prevent user from submitting a task that already exists

- Solution: select all tasks on the page, don't add if it's already on the page. Or they can keep track of array
- Skills tested: basic CSS selectors, basic array lookup
- Hints: JQuery syntax for `.get` and `textContent`