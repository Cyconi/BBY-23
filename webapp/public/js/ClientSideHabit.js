/**
 * This script manages the interactions on the habit management page,
 * including deleting, editing, and adding habits, as well as handling modals for feedback.
 */

document.addEventListener('DOMContentLoaded', function () {
    const deleteForms = document.querySelectorAll('.delete-form');

    if (deleteForms.length > 0) {
        deleteForms.forEach(form => {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                //Gets the value to delete a certain habit.
                const habitID = form.querySelector('input[name="habitID"]').value;
                const habitGood = form.querySelector('input[name="habitGood"]').value;
                //Deletes the habit in the database.
                fetch('/habit/deleteHabit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        habitID: habitID,
                        habitGood: habitGood
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        //Shows a modal for successful deletion.
                        const modalElement = document.getElementById('modalDelete');
                        if (modalElement) {
                            const modal = new bootstrap.Modal(modalElement);
                            document.querySelector('.habitName').textContent = data.habit;
                            modal.show();
                        }
                    } else {
                        alert('Failed to delete habit. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to delete habit. Please try again.');
                });
            });
        });

        const modalButton = document.querySelector('#modalDelete button[data-bs-dismiss="modal"]');
        if (modalButton) {
            modalButton.addEventListener('click', function () {
                location.reload();  
            });
        }
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const response = await fetch('/habit/name', { method: "POST" });
        const userData = await response.json();
        nameElement.textContent = userData.name;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const editForms = document.querySelectorAll('.edit-form');
    //pops up an edit modal when the user presses a edit button.
    if (editForms.length > 0) {
        editForms.forEach(form => {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                //gets the values of the habits.
                const habitID = form.querySelector('input[name="habitID"]').value;
                const habitGood = form.querySelector('input[name="habitGood"]').value;
                const habitName = form.querySelector('input[name="habitName"]').value;
                const habitQuestion = form.querySelector('input[name="habitQuestion"]').value;
                //Actually edits the habit in the database.
                fetch('/habit/editHabit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        habitID: habitID,
                        habitGood: habitGood,
                        habit: habitName,
                        question: habitQuestion
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const modalElement = document.getElementById('modalSignin');
                        if (modalElement) {
                            const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                            modal.hide();
                            location.reload();
                        }
                    } else {
                        alert('Failed to edit habit. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to edit habit. Please try again.');
                });
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const editButtons = document.querySelectorAll('.edit-button');
    //Simply add a edit button for each habit.
    if (editButtons.length > 0) {
        editButtons.forEach(button => {
            button.addEventListener('click', function () {
                const habitID = this.querySelector('input[name="habitID"]').value;
                const habitGood = this.querySelector('input[name="habitGood"]').value;
                const habitName = this.querySelector('input[name="habitName"]').value;
                const habitQuestion = this.querySelector('input[name="habitQuestion"]').value;

                document.getElementById('editHabitID').value = habitID;
                document.getElementById('editHabitGood').value = habitGood;
                document.getElementById('editHabitName').value = habitName;
                document.getElementById('editHabitQuestion').value = habitQuestion;
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const habitForm = document.getElementById('habitForm');
    let addHabitAnyway = false;

    if (habitForm) {
        habitForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const habit = document.getElementById('habit').value;
            const question = document.getElementById('question').value;

            // Check for existing habit
            const checkResponse = await fetch('/habit/existingHabitCheck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ habit, question, goodOrBad })
            });
            const checkData = await checkResponse.json();

            if (checkData.error && !addHabitAnyway) {
                // Show the duplicate modal with the error message
                const duplicateModalBody = document.getElementById('duplicateModalBody');
                if (duplicateModalBody) {
                    duplicateModalBody.textContent = checkData.message;
                    const duplicateModal = new bootstrap.Modal(document.getElementById('duplicateModal'));
                    if (duplicateModal) {
                        duplicateModal.show();
                    }
                }
            } else {
                // Proceed to add the habit
                const addResponse = await fetch('/habit/addAHabit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ habit, question, goodOrBad })
                });
                const addData = await addResponse.json();

                if (addData.success) {
                    // Hide the duplicate modal if it is visible
                    const duplicateModalInstance = bootstrap.Modal.getInstance(document.getElementById('duplicateModal'));
                    if (duplicateModalInstance) {
                        duplicateModalInstance.hide();
                    }

                    // Show the success modal
                    const successModal = new bootstrap.Modal(document.getElementById('modalSuccess'));
                    if (successModal) {
                        successModal.show();
                    }
                } else {
                    alert('Error adding habit. Please try again.');
                }
            }
        });

        const addAnywayButton = document.getElementById('addAnywayButton');
        if (addAnywayButton) {
            addAnywayButton.addEventListener('click', function () {
                addHabitAnyway = true;
                habitForm.dispatchEvent(new Event('submit'));
            });
        }

        const successButton = document.getElementById('successButton');
        if (successButton) {
            successButton.addEventListener('click', function () {
                window.location.href = `/habit/habitList?good=${goodOrBad}`;
            });
        }
    }
});

/**
 * Submits a form by creating a new form element and submitting it.
 * Disables all buttons within the same card to prevent multiple submissions.
 * @param {HTMLElement} button - The button element that triggered the form submission.
 * @param {string} actionUrl - The URL to which the form will be submitted.
 */
function submitForm(button, actionUrl) {
    // Disable all buttons within the same card
    const card = button.closest('.card-body');
    card.querySelectorAll('button').forEach(btn => {
        btn.disabled = true;
    });

    // Create a new form and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = actionUrl;

    const habitID = document.createElement('input');
    habitID.type = 'hidden';
    habitID.name = 'habitID';
    habitID.value = button.closest('form').querySelector('input[name="habitID"]').value;

    form.appendChild(habitID);
    document.body.appendChild(form);
    form.submit();
}
