//Shows the session modal that we successfully logged your session into the database.
document.getElementById('logSessionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle the form submission
    const formData = new FormData(document.getElementById('logSessionForm'));
    const data = {};
    formData.forEach((value, key) => { data[key] = value });
    //Actually put it into the database.
    fetch('/study/logSession', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            //Only then show the modal.
            const successModal = new bootstrap.Modal(document.getElementById('studyLoggedModal'));
            successModal.show();
            document.getElementById('successButton').addEventListener('click', function() {
                window.location.href = "/study/studyLog";
            });
        } else {
            const modalBody = document.getElementById('responseModalBody');
            modalBody.textContent = data.message;

            const errorModal = new bootstrap.Modal(document.getElementById('responseModal'));
            errorModal.show();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});