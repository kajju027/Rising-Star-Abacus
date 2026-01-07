const form = document.querySelector("#admissionForm");
const modal = document.querySelector("#successModal");
const fileSizeWarning = document.getElementById('fileSizeWarning');
const MAX_FILE_SIZE_MB = 10; // Netlify limit

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    
    // Check total file size before sending
    let totalFileSize = 0;
    const fileInputs = [
        document.getElementById('student_photo'),
        document.getElementById('guardian_signature'),
        document.getElementById('guardian_id')
    ];

    fileInputs.forEach(input => {
        if (input.files.length > 0) {
            totalFileSize += input.files[0].size;
        }
    });

    // Convert bytes to MB
    const totalFileSizeMB = totalFileSize / (1024 * 1024);

    if (totalFileSizeMB > MAX_FILE_SIZE_MB) {
        fileSizeWarning.style.display = 'block';
        alert(`Submission Failed: Total file size (${totalFileSizeMB.toFixed(2)}MB) exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB.`);
        return; // Stop form submission
    } else {
        fileSizeWarning.style.display = 'none';
    }
    
    // Proceed with submission if file size is okay
    fetch("/", {
        method: "POST",
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            modal.style.display = "flex";
            form.reset();
        } else {
            // Log response status if submission fails
            console.error('Netlify Server Response Status:', response.status);
            throw new Error(`Submission failed with status: ${response.status}`);
        }
    })
    .catch((error) => {
        alert("Submission Failed! File size too large, or check your internet connection.");
        console.error('Form submission error:', error);
    });
});
