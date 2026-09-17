/* ==========================================================================
   Resume Website Interactive Logic - Chandra Sekhar Nandikolla
   Features: Theme Switcher, Live Photo Upload, Inline Text Editor, Skill Filter
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 1. Theme Switcher Logic
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeLabel = document.getElementById('themeLabel');
  const themes = ['dark', 'light', 'cyber'];
  let currentThemeIndex = 0;

  // Saved theme preference
  const savedTheme = localStorage.getItem('cs_resume_theme') || 'dark';
  currentThemeIndex = themes.indexOf(savedTheme) !== -1 ? themes.indexOf(savedTheme) : 0;
  applyTheme(themes[currentThemeIndex]);

  themeToggleBtn.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const nextTheme = themes[currentThemeIndex];
    applyTheme(nextTheme);
    localStorage.setItem('cs_resume_theme', nextTheme);
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const label = theme.charAt(0).toUpperCase() + theme.slice(1) + ' Theme';
    themeLabel.textContent = label;
  }

  // 2. Profile Photo Upload & LocalStorage Persistence
  const avatarFileInput = document.getElementById('avatarFileInput');
  const profileImage = document.getElementById('profileImage');

  // Load saved photo if exists
  const savedPhoto = localStorage.getItem('cs_profile_photo');
  if (savedPhoto) {
    profileImage.src = savedPhoto;
  }

  avatarFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Img = event.target.result;
        profileImage.src = base64Img;
        localStorage.setItem('cs_profile_photo', base64Img);
        showToast('Profile photo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  });

  // 3. Live Skill Search & Filter
  const skillSearchInput = document.getElementById('skillSearchInput');
  const skillCategoryCards = document.querySelectorAll('.skill-category-card');

  if (skillSearchInput) {
    skillSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      skillCategoryCards.forEach(card => {
        const tags = card.querySelectorAll('.skill-tag');
        let cardHasMatch = false;

        tags.forEach(tag => {
          const text = tag.textContent.toLowerCase();
          if (text.includes(query)) {
            tag.style.display = 'inline-flex';
            cardHasMatch = true;
          } else {
            tag.style.display = 'none';
          }
        });

        // Hide entire category card if no tags match
        if (cardHasMatch || query === '') {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 4. Live Inline Edit Mode Logic
  const editModeBtn = document.getElementById('editModeBtn');
  const editBanner = document.getElementById('editBanner');
  const saveEditBtn = document.getElementById('saveEditBtn');
  const resetEditBtn = document.getElementById('resetEditBtn');
  const editableElements = document.querySelectorAll('.editable');

  let isEditMode = false;

  // Restore saved edits on load
  const savedEditsJSON = localStorage.getItem('cs_resume_edits');
  if (savedEditsJSON) {
    try {
      const savedEdits = JSON.parse(savedEditsJSON);
      editableElements.forEach(el => {
        const key = el.getAttribute('data-key');
        if (key && savedEdits[key]) {
          el.innerHTML = savedEdits[key];
        }
      });
    } catch (err) {
      console.error('Failed to parse saved edits:', err);
    }
  }

  editModeBtn.addEventListener('click', () => {
    isEditMode = !isEditMode;
    toggleEditState(isEditMode);
  });

  function toggleEditState(active) {
    if (active) {
      document.body.classList.add('editable-active');
      editBanner.classList.add('active');
      editableElements.forEach(el => el.setAttribute('contenteditable', 'true'));
      showToast('Live Edit Mode Enabled! Click any highlighted text.');
    } else {
      document.body.classList.remove('editable-active');
      editBanner.classList.remove('active');
      editableElements.forEach(el => el.removeAttribute('contenteditable'));
    }
  }

  saveEditBtn.addEventListener('click', () => {
    const editsToSave = {};
    editableElements.forEach(el => {
      const key = el.getAttribute('data-key');
      if (key) {
        editsToSave[key] = el.innerHTML;
      }
    });

    localStorage.setItem('cs_resume_edits', JSON.stringify(editsToSave));
    toggleEditState(false);
    isEditMode = false;
    showToast('All custom text edits saved permanently!');
  });

  resetEditBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all custom text to original resume defaults?')) {
      localStorage.removeItem('cs_resume_edits');
      location.reload();
    }
  });

  // 5. Contact Form Submission Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const senderName = document.getElementById('contactName').value;
      showToast(`Thank you ${senderName}! Message received.`);
      contactForm.reset();
    });
  }

  // 6. Toast Notification Helper
  function showToast(message) {
    const toast = document.getElementById('toastMessage');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
});
