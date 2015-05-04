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
		directionUp = false,
		status = document.querySelector('.status'),
		patterns = {
			subject: /^[aA-zZ]*(\s\b[aA-zZ]*\b)?$/,
			mark: /^([0-9]|10)$/,
			teacher: /^[A-z]*\s[A-Z].[A-Z].$/,
		};


	inputSection.onkeypress = function(event) {
		if (event.keyCode == 13) {
			addData();
		}
	}


	idSort.addEventListener('click', function(e) {
		directionUp = !directionUp;
		sortBy(exams, 'id', directionUp);
		if(directionUp){
			setStatus('Sorted by id up');
		} else{
			setStatus('Sorted by id down');
		}
		localStorage.setItem('examsDB', exams);
		render();
	});
	subjectSort.addEventListener('click', function(e) {
		directionUp = !directionUp;
		sortBy(exams, 'subject', directionUp);
		if(directionUp){
			setStatus('Sorted by subject up');
		} else{
			setStatus('Sorted by subject down');
		}
		localStorage.setItem('examsDB', exams);
		render();
	});
	markSort.addEventListener('click', function(e) {
		directionUp = !directionUp;
		sortBy(exams, 'mark', directionUp);
		if(directionUp){
			setStatus('Sorted by mark up');
		} else{
			setStatus('Sorted by mark down');
		}
		localStorage.setItem('examsDB', exams);
		render();
	});
	teacherSort.addEventListener('click', function(e) {
		directionUp = !directionUp;
		sortBy(exams, 'teacher', directionUp);
		if(directionUp){
			setStatus('Sorted by teacher up');
		} else{
			setStatus('Sorted by teacher down');
		}
		localStorage.setItem('examsDB', exams);
		render();
	});

	clearButton.addEventListener('click', function(e) {
		localStorage.setItem('currentID', 1);
		id = 1;
		localStorage.setItem('examsDB', JSON.stringify([]));
		exams = [];
		setStatus('Database was reseted');
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

	function updateData(item) {
		var index;
		var className;
		if (checkUpdate(item)) {
			index = getIndex(item);
			className = item.getAttribute('class');
			exams[index][className] = item.innerHTML;
			setStatus("Field " + className.toUpperCase() + " at № " + ++index + " was succesfully updated!");
			localStorage.setItem('examsDB', JSON.stringify(exams));
		}
	}

	function checkUpdate(item) {
		var className;
		className = item.classList[0];
		if (patterns[className].test(item.innerHTML)) {
			item.classList.remove('error');
			return true;
		} else {
			item.classList.add('error');
			if (className == 'subject') {
				setStatus('Wrong subject data! For subject field use english letters.');
			} else if (className == 'Mark') {
				setStatus("Wrong mark data! For mark field use numbers 0-10");
			} else {
				setStatus("Wrong teacher data! For teacher field use Surname and Initials, for ex. 'Fedorov K.A.'");
			}
			item.focus()
			return false;
		}
	}

	function addData() {
		if (checkInput()) {
			addExam(id, subjectInput.value, markInput.value, teacherInput.value);
			id++;
			localStorage.setItem('currentID', id);
		}
	}

	function checkInput() {
		if(patterns.subject.test(subjectInput.value)) {
			subjectInput.classList.remove('error');
		}
		if(patterns.mark.test(markInput.value)){
			markInput.classList.remove('error');
		}
		if(patterns.teacher.test(teacherInput.value)){
			teacherInput.classList.remove('error');
		}
		if (!patterns.subject.test(subjectInput.value)) {
			subjectInput.classList.add('error');
			subjectInput.focus();
			setStatus('Wrong subject data! For subject field use english letters.');
			return false;
		} 
		if (!patterns.mark.test(markInput.value)) {
			markInput.classList.add('error');
			markInput.focus();
			setStatus("Wrong mark data! For mark field use numbers 0-10.");
			return false;
		}
		if (!patterns.teacher.test(teacherInput.value)) {
			teacherInput.classList.add('error');
			teacherInput.focus();
			setStatus("Wrong teacher data! For teacher field use Surname and Initials, for ex. 'Fedorov K.A.'");
			return false;
		} 
		return true;
	}

	function setStatus(text) {
		status.innerHTML = text;
		statusClean();
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
		setStatus('New exam added!');
		render();
	}


	function removeExamByIndex(index) {
		exams.splice(index, 1);
		setStatus('Deleted exam at index ' + index);
		localStorage.setItem('examsDB', JSON.stringify(exams));
		render();
	}

	function getIndex(item) {
		var li = item.parentNode.parentNode;
		return Array.prototype.indexOf.call(li.parentNode.children, li);
	}

	function statusClean() {
		setTimeout(function() {
			status.innerHTML = 'Status';
		}, 5000);
	}
	return render();

}());