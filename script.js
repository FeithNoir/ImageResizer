const imageUploader = document.getElementById("imageUploader");
const imageWidthInput = document.getElementById("imageWidth");
const imageHeightInput = document.getElementById("imageHeight");
const imageSizeInput = document.getElementById("imageSize");
const maintainAspectCheckbox = document.getElementById("maintainAspect");
const downloadButton = document.getElementById("downloadButton");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let originalImage = new Image();
let aspectRatio = 1;

imageUploader.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.onload = () => {
                aspectRatio = originalImage.width / originalImage.height;
                imageWidthInput.value = originalImage.width;
                imageHeightInput.value = originalImage.height;
                imageSizeInput.value = (file.size / 1024).toFixed(2);

                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
                ctx.drawImage(originalImage, 0, 0);

                // Display the uploaded image on the page
                const previewContainer = document.getElementById("imagePreview");
                previewContainer.innerHTML = ""; // Clear any previous content
                const imgElement = document.createElement("img");
                imgElement.src = e.target.result;
                imgElement.alt = "Uploaded Image";
                imgElement.style.maxWidth = "100%";
                imgElement.style.border = "1px solid #ccc";
                previewContainer.appendChild(imgElement);
            };
            originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

imageWidthInput.addEventListener("input", () => {
    if (maintainAspectCheckbox.checked) {
        imageHeightInput.value = Math.round(imageWidthInput.value / aspectRatio);
    }
    resizeImage();
});

imageHeightInput.addEventListener("input", () => {
    if (maintainAspectCheckbox.checked) {
        imageWidthInput.value = Math.round(imageHeightInput.value * aspectRatio);
    }
    resizeImage();
});

maintainAspectCheckbox.addEventListener("change", () => {
    if (maintainAspectCheckbox.checked) {
        imageHeightInput.value = Math.round(imageWidthInput.value / aspectRatio);
    }
});

downloadButton.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "resized-image.png";
    link.href = canvas.toDataURL();
    link.click();
});

function resizeImage() {
    const width = parseInt(imageWidthInput.value, 10);
    const height = parseInt(imageHeightInput.value, 10);

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(originalImage, 0, 0, width, height);

    canvas.toBlob((blob) => {
        if (blob) {
            imageSizeInput.value = (blob.size / 1024).toFixed(2);
        }
    }, "image/png");
}
