import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBVLZoN43sOvKG1oBZJD_z3H6tLC3fThgM",
  authDomain: "sisters-birthday-site.firebaseapp.com",
  projectId: "sisters-birthday-site",
  storageBucket: "sisters-birthday-site.firebasestorage.app",
  messagingSenderId: "545636768227",
  appId: "1:545636768227:web:5d4a849bfe8e454af7e8d6"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const IMGBB_API_KEY    = "20a4ab9bbe83537aec6420abea8f6862";
const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

const wishForm          = document.getElementById("wish-form");
const inputName         = document.getElementById("input-name");
const inputMessage      = document.getElementById("input-message");
const inputAvatar       = document.getElementById("input-avatar");
const inputThrowbacks   = document.getElementById("input-throwbacks");
const avatarUploadBox   = document.getElementById("avatar-upload-box");
const throwbackUploadBox= document.getElementById("throwback-upload-box");
const avatarCountBadge  = document.getElementById("avatar-count-badge");
const throwbackCountBadge = document.getElementById("throwback-count-badge");
const submitBtn         = document.getElementById("submit-btn");
const successModal      = document.getElementById("success-modal");
const modalCloseBtn     = document.getElementById("modal-close-btn");
const uploadProgress    = document.getElementById("upload-progress");
const progressLabel     = document.getElementById("progress-label");
const progressBarFill   = document.getElementById("progress-bar-fill");
const errorBanner       = document.getElementById("error-banner");
const errorMessage      = document.getElementById("error-message");

const btnTabInstructions = document.getElementById("btn-tab-instructions");
const btnTabForm        = document.getElementById("btn-tab-form");
const sectionInstructions = document.getElementById("section-instructions");
const sectionForm       = document.getElementById("section-form");
const getStartedBtn     = document.getElementById("get-started-btn");
const avatarPreviewContainer = document.getElementById("avatar-preview-container");
const throwbackPreviewContainer = document.getElementById("throwback-preview-container");

let selectedThrowbackFiles = [];

function switchTab(target) {
  if (target === "instructions") {
    btnTabInstructions.classList.add("active");
    btnTabForm.classList.remove("active");
    sectionInstructions.classList.add("active");
    sectionForm.classList.remove("active");
  } else {
    btnTabInstructions.classList.remove("active");
    btnTabForm.classList.add("active");
    sectionInstructions.classList.remove("active");
    sectionForm.classList.add("active");
  }
}

btnTabInstructions.addEventListener("click", () => switchTab("instructions"));
btnTabForm.addEventListener("click", () => switchTab("form"));
getStartedBtn.addEventListener("click", () => switchTab("form"));

inputAvatar.addEventListener("change", () => {
  avatarPreviewContainer.innerHTML = "";
  const files = inputAvatar.files;
  if (files && files.length > 0) {
    const file = files[0];
    avatarUploadBox.classList.add("has-file");
    avatarCountBadge.textContent = "1 photo selected ✓";
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const wrapper = document.createElement("div");
      wrapper.className = "preview-item";
      wrapper.innerHTML = `
        <img src="${e.target.result}" alt="Profile preview" />
        <button type="button" class="remove-preview-btn">&times;</button>
      `;
      wrapper.querySelector(".remove-preview-btn").addEventListener("click", () => {
        inputAvatar.value = "";
        avatarUploadBox.classList.remove("has-file");
        avatarCountBadge.textContent = "";
        avatarPreviewContainer.innerHTML = "";
      });
      avatarPreviewContainer.appendChild(wrapper);
    };
    reader.readAsDataURL(file);
  } else {
    avatarUploadBox.classList.remove("has-file");
    avatarCountBadge.textContent = "";
  }
});

function renderThrowbackPreviews() {
  throwbackPreviewContainer.innerHTML = "";
  if (selectedThrowbackFiles.length > 0) {
    throwbackUploadBox.classList.add("has-file");
    throwbackCountBadge.textContent = `${selectedThrowbackFiles.length} photo${selectedThrowbackFiles.length === 1 ? "" : "s"} selected ✓`;
  } else {
    throwbackUploadBox.classList.remove("has-file");
    throwbackCountBadge.textContent = "";
  }

  selectedThrowbackFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wrapper = document.createElement("div");
      wrapper.className = "preview-item";
      wrapper.innerHTML = `
        <img src="${e.target.result}" alt="Memory preview" />
        <button type="button" class="remove-preview-btn" data-index="${index}">&times;</button>
      `;
      wrapper.querySelector(".remove-preview-btn").addEventListener("click", (el) => {
        const idx = parseInt(el.target.getAttribute("data-index"));
        selectedThrowbackFiles.splice(idx, 1);
        syncThrowbackInput();
        renderThrowbackPreviews();
      });
      throwbackPreviewContainer.appendChild(wrapper);
    };
    reader.readAsDataURL(file);
  });
}

function syncThrowbackInput() {
  const dataTransfer = new DataTransfer();
  selectedThrowbackFiles.forEach(file => dataTransfer.items.add(file));
  inputThrowbacks.files = dataTransfer.files;
}

inputThrowbacks.addEventListener("change", () => {
  if (!inputThrowbacks.files) return;
  const newFiles = Array.from(inputThrowbacks.files);
  if (selectedThrowbackFiles.length + newFiles.length > 3) {
    showError("You can only upload up to 3 throwback photos. Please select fewer images.");
    inputThrowbacks.value = "";
    syncThrowbackInput();
    return;
  }
  selectedThrowbackFiles = selectedThrowbackFiles.concat(newFiles);
  syncThrowbackInput();
  renderThrowbackPreviews();
  hideError();
});

function showError(msg) {
  errorMessage.textContent = msg;
  errorBanner.classList.add("visible");
}

function hideError() {
  errorBanner.classList.remove("visible");
}

function setProgress(percent, label) {
  uploadProgress.classList.add("visible");
  progressBarFill.style.width = `${percent}%`;
  if (label) progressLabel.textContent = label;
}

function resetProgress() {
  uploadProgress.classList.remove("visible");
  progressBarFill.style.width = "0%";
  progressLabel.textContent = "Uploading images...";
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.classList.toggle("loading", isLoading);
}

async function uploadToImgBB(file, description) {
  const base64String = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });

  const formData = new FormData();
  formData.append("image", base64String);

  let response;
  try {
    response = await fetch(IMGBB_UPLOAD_URL, {
      method: "POST",
      body: formData
    });
  } catch (networkError) {
    throw new Error(`Network error while uploading ${description}: ${networkError.message}`);
  }

  if (!response.ok) {
    let errorText = "";
    try {
      const errJson = await response.json();
      errorText = errJson.error ? `: ${errJson.error.message}` : "";
    } catch {
      errorText = ` (Status: ${response.status})`;
    }
    throw new Error(`ImgBB rejected the upload for ${description}${errorText}`);
  }

  let json;
  try {
    json = await response.json();
  } catch (parseError) {
    throw new Error(`Could not parse ImgBB response for ${description}.`);
  }

  if (!json.success || !json.data || !json.data.url) {
    const apiMessage = json.error ? json.error.message : "Unknown ImgBB error";
    throw new Error(`ImgBB upload failed for ${description}: ${apiMessage}`);
  }

  return json.data.url;
}

// Form Validation
function validateForm() {
  const name    = inputName.value.trim();
  const message = inputMessage.value.trim();

  if (name.length === 0) {
    showError("Please enter your full name before sending.");
    inputName.focus();
    return false;
  }

  if (name.length > 100) {
    showError("Your name is too long. Please keep it under 100 characters.");
    inputName.focus();
    return false;
  }

  if (message.length === 0) {
    showError("Please write a birthday message before sending.");
    inputMessage.focus();
    return false;
  }

  if (message.length > 3000) {
    showError("Your message is too long. Please keep it under 3000 characters.");
    inputMessage.focus();
    return false;
  }

  if (selectedThrowbackFiles.length > 3) {
    showError("You can only upload up to 3 throwback photos.");
    return false;
  }

  return true;
}

wishForm.addEventListener("submit", async event => {
  event.preventDefault();
  hideError();

  if (!validateForm()) return;

  setLoading(true);

  const name          = inputName.value.trim();
  const message       = inputMessage.value.trim();
  const avatarFiles   = inputAvatar.files ? Array.from(inputAvatar.files) : [];

  const totalUploads = avatarFiles.length + selectedThrowbackFiles.length;
  let uploadsDone    = 0;

  let avatarUrl      = "";
  const throwbackUrls = [];

  try {
    if (avatarFiles.length > 0) {
      const avatarFile = avatarFiles[0];
      setProgress(
        Math.round((uploadsDone / Math.max(totalUploads, 1)) * 90),
        `Uploading your profile photo... (1 of ${totalUploads})`
      );
      avatarUrl = await uploadToImgBB(avatarFile, "profile picture");
      uploadsDone++;
      setProgress(
        Math.round((uploadsDone / totalUploads) * 90),
        `Profile photo uploaded! ✓`
      );
    }

    for (let i = 0; i < selectedThrowbackFiles.length; i++) {
      const file       = selectedThrowbackFiles[i];
      const totalLabel = totalUploads;
      setProgress(
        Math.round((uploadsDone / totalLabel) * 90),
        `Uploading memory photo ${i + 1} of ${selectedThrowbackFiles.length}...`
      );
      const url = await uploadToImgBB(file, `throwback photo ${i + 1}`);
      throwbackUrls.push(url);
      uploadsDone++;
      setProgress(
        Math.round((uploadsDone / totalLabel) * 90),
        `Memory photo ${i + 1} uploaded! ✓`
      );
    }

    const wishPayload = {
      name:          name,
      message:       message,
      avatarUrl:     avatarUrl,
      throwbackUrls: throwbackUrls,
      timestamp:     serverTimestamp()
    };

    setProgress(95, "Saving your wish...");
    await addDoc(collection(db, "wishes"), wishPayload);
    setProgress(100, "Wish saved! ✓");

    setTimeout(() => {
      resetProgress();
      setLoading(false);
      openSuccessModal();
      resetForm();
    }, 500);

  } catch (err) {
    console.error("Submission error:", err);
    resetProgress();
    setLoading(false);
    showError(
      err.message && err.message.length < 200
        ? err.message
        : "Something went wrong. Please check your connection and try again."
    );
  }
});

function resetForm() {
  wishForm.reset();
  selectedThrowbackFiles = [];
  avatarUploadBox.classList.remove("has-file");
  throwbackUploadBox.classList.remove("has-file");
  avatarCountBadge.textContent = "";
  throwbackCountBadge.textContent = "";
  avatarPreviewContainer.innerHTML = "";
  throwbackPreviewContainer.innerHTML = "";
  hideError();
}

function openSuccessModal() {
  successModal.classList.add("open");
  document.body.style.overflow = "hidden";
  modalCloseBtn.focus();
}

function closeSuccessModal() {
  successModal.classList.remove("open");
  document.body.style.overflow = "";
  inputName.focus();
}

modalCloseBtn.addEventListener("click", closeSuccessModal);

successModal.addEventListener("click", e => {
  if (e.target === successModal) closeSuccessModal();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && successModal.classList.contains("open")) {
    closeSuccessModal();
  }
});