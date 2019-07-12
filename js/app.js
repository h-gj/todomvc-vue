(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!
	var todos = [
		{
			id: 1,
			title: '吃饭',
			completed: true
		},
		{
			id: 2,
			title: '睡觉',
			completed: true
		},
		{
			id: 3,
			title: '健身',
			completed: false
		}
	]

	const app = new Vue({
		data: {
			todos: JSON.parse(window.localStorage.getItem('todos') || '[]'),
			currentEditing: null,
			filterCondition: ''
		},
		computed: {
			remainingTodos () {
				return this.todos.filter(todo => ! todo.completed).length
			},

			isChecked: {
				get () {
					return this.todos.every(todo => todo.completed)
				},
				set () {
					var isChecked = !this.isChecked
					this.todos.forEach(todo => todo.completed = isChecked)
				}
			},

			filteredTodos () {
				switch (this.filterCondition) {
					case 'active':
						return this.todos.filter(todo => !todo.completed)
						break
					case 'completed':
						return this.todos.filter(todo => todo.completed)
						break
					default:
						return this.todos
				}
			}

		},
		watch: {
			todos: {
				handler (val, oldVal) {
					window.localStorage.setItem('todos', JSON.stringify(val))
				},
				deep: true
			}
		},
		methods: {
			handleKeyUp (e) {
				var target = e.target
				var todos = this.todos
				if (!target.value.trim()) {
					return
				}
				var id = todos.length ? todos[todos.length -1].id + 1 : 0
				todos.push({
					id: id,
					title: target.value,
					completed: false
				})
				target.value = ''
			},
			handleToggle (e) {
				var checked = e.target.checked
				this.todos.forEach(item => {
					item.completed = checked
				})
			},
			handleRomove (index, event) {
				this.todos.splice(index, 1)
			},

			handleClick (todo) {
				this.currentEditing = todo
			},


			handleSave (index, item, event) {
				var target = event.target
				var value = target.value
				if (!value.trim()) {
					this.todos.splice(index, 1)
					return
				}
				item.title = value
				this.currentEditing = null
			},

			handleDiscardSave () {
				this.currentEditing = null
			},

			handleClear () {
				this.todos = this.todos.filter(t => !t.completed)
			}
		}
	}).$mount('#app')

	window.onhashchange = handlerHashChange

	handlerHashChange()

	function handlerHashChange () {
		var hash = window.location.hash.substr(2)
		app.filterCondition = hash
	}


})(window);
