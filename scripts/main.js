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
		idSort = document.querySelector('.list-head li div:first-child');
		subjectSort = document.querySelector('.list-head li div:nth-child(2)');
		markSort = document.querySelector('.list-head li div:nth-child(3)');
		teacherSort = document.querySelector('.list-head li div:nth-child(4)');

	clearButton.addEventListener('click', function(e) {
		localStorage.setItem('currentID', 1);
		id = 1;
		localStorage.setItem('examsDB', JSON.stringify([]));
		exams = [];
		render();
	});

	listHead.addEventListener('click',function(e){
		var node = e.target;

	});

	addButton.addEventListener('click', function() {
		addExam(id, subjectInput.value, markInput.value, teacherInput.value);
		id++;
		localStorage.setItem('currentID', id);
	});

	

	view.addEventListener('click', function(e) {
		var node = e.target;
		var index;

		if (node.classList.contains('remove')) {
			index = getIndex(node);
			removeExamByIndex(index);
		}
	});

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
				<p contenteditable="true">' + exam.subject + '</p>\
			</div>\
			<div>\
				<p contenteditable="true">' + exam.mark + '</p>\
			</div>\
			<div>\
				<p contenteditable="true">' + exam.teacher + '</p>\
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