(function() {
	'use strict';

	var
		view = document.querySelector('.items'),
		exams = JSON.parse(localStorage.getItem('examsDB') || '[]'),
		id = localStorage.getItem('currentID') || 1,
		addButton = document.querySelector('#addButton'),
		clearButton = document.querySelector('ul li div:last-child'),
		subjectInput = document.querySelector('#subjectInput'),
		markInput = document.querySelector('#markInput'),
		teacherInput = document.querySelector('#teacherInput'),
		idSort = document.querySelector('.list-head li div:first-child'),
		subjectSort = document.querySelector('.list-head li div:nth-child(2)'),
		markSort = document.querySelector('.list-head li div:nth-child(3)'),
		teacherSort = document.querySelector('.list-head li div:nth-child(4)'),
		inputSection = document.querySelector('.input-section'),
		directionUp = false;


	inputSection.onkeypress = function(event) {
		if (event.keyCode == 13) {
			addData();
		}
	}

	function sortBy(array, criterion, directionUp) {

		array.sort(function(a, b) {
			if (a[criterion] < b[criterion]) {
				return directionUp ? -1 : 1;
			} else if (a[criterion] > b[criterion]) {
				return directionUp ? 1 : -1;
			} else {
				return 0;
			}
		});
	}

	idSort.addEventListener('click', function(e) {
		directionUp = !directionUp;
		sortBy(exams, 'id', directionUp);
		localStorage.setItem('examsDB', exams);
		render();
	});
	subjectSort.addEventListener('click', function(e) {
		directionUp = !directionUp;
		sortBy(exams, 'subject', directionUp);
		localStorage.setItem('examsDB', exams);
		render();
	});
	markSort.addEventListener('click', function(e) {
		directionUp = !directionUp;
		sortBy(exams, 'mark', directionUp);
		localStorage.setItem('examsDB', exams);
		render();
	});
	teacherSort.addEventListener('click', function(e) {
		directionUp = !directionUp;
		sortBy(exams, 'teacher', directionUp);
		localStorage.setItem('examsDB', exams);
		render();
	});

	clearButton.addEventListener('click', function(e) {
		localStorage.setItem('currentID', 1);
		id = 1;
		localStorage.setItem('examsDB', JSON.stringify([]));
		exams = [];
		render();
	});

	addButton.addEventListener('click', function() {
		addData();
	});



	view.addEventListener('click', function(e) {
		var node = e.target;
		var index;

		if (node.classList.contains('remove')) {
			index = getIndex(node);
			removeExamByIndex(index);
		}
	});
	view.addEventListener('blur', function(e) {
		var node = e.target;

		if (node.hasAttribute('contenteditable')) {
			updateData(node);
		}
	}, true);

	view.onkeypress = function(e) {
		if (e.keyCode == 13) {
			var node = e.target;
			if (node.hasAttribute('contenteditable')) {
				updateData(node);
			}
			e.target.blur();
			return false;
		}
	}

	function updateData(item) {
		var index;
		var className;
		index = getIndex(item);
		className = item.getAttribute('class');
		exams[index][className] = item.innerHTML;
		localStorage.setItem('examsDB', JSON.stringify(exams));
	}

	function addData() {
		if (/^[aA-zZ]*(\s\b[aA-zZ]*\b)?$/.test(subjectInput.value) && /^([0-9]|10)$/.test(markInput.value) && /^[A-z]*\s[A-Z].[A-Z].$/.test(teacherInput.value)) {
			addExam(id, subjectInput.value, markInput.value, teacherInput.value);
			id++;
			localStorage.setItem('currentID', id);
		} else {
			subjectInput.value = '';
			markInput.value = '';
			teacherInput.value = '';
		}
	}

	function render() {
		view.innerHTML = '';
		exams.forEach(renderExam);
	}

	function renderExam(exam) {
		/* jshint multistr:true */
		var html = '\
		<li>\
			<div>\
				<p>' + exam.id + '</p>\
			</div>\
			<div>\
				<p class="subject" contenteditable="true">' + exam.subject + '</p>\
			</div>\
			<div>\
				<p class="mark" contenteditable="true">' + exam.mark + '</p>\
			</div>\
			<div>\
				<p class="teacher" contenteditable="true">' + exam.teacher + '</p>\
			</div>\
			<div>\
				<button class="remove">Remove</button>\
			</div>\
		</li>\
		';

		view.innerHTML += html;
	}

	function addExam(id, subject, mark, teacher) {
		var exam = new Exam(id, subject, mark, teacher);
		exams.push(exam);
		localStorage.setItem('examsDB', JSON.stringify(exams));
		render();
	}

	function changeExamByIndex(id) {

	}

	function removeExamByIndex(index) {
		exams.splice(index, 1);
		localStorage.setItem('examsDB', JSON.stringify(exams));
		render();
	}

	function getIndex(item) {
		var li = item.parentNode.parentNode;
		return Array.prototype.indexOf.call(li.parentNode.children, li);
	}
	return render();

}());