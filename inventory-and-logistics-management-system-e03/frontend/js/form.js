// --- ADD SUPPLIER FORM AND VALIDATION ---
let selectedFormRating = 5.0;

function setupRatingStars() {
  const ratingStarsContainer = document.getElementById('rating-stars-container');
  const formRatingVal = document.getElementById('form-rating-val');
  if (!ratingStarsContainer || !formRatingVal) return;

  const stars = ratingStarsContainer.querySelectorAll('.star-option');
  
  function updateStarsUI(val) {
    stars.forEach(star => {
      const starVal = parseInt(star.getAttribute('data-value'));
      if (starVal <= val) {
        star.classList.add('selected');
        star.querySelector('svg').style.fill = 'var(--color-pending)';
        star.querySelector('svg').style.stroke = 'var(--color-pending)';
      } else {
        star.classList.remove('selected');
        star.querySelector('svg').style.fill = 'transparent';
        star.querySelector('svg').style.stroke = 'var(--text-dim)';
      }
    });
    formRatingVal.textContent = parseFloat(val).toFixed(1);
    selectedFormRating = parseFloat(val);
  }
  
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const val = star.getAttribute('data-value');
      updateStarsUI(val);
    });
    star.addEventListener('mouseenter', () => {
      const val = star.getAttribute('data-value');
      stars.forEach(s => {
        const sVal = parseInt(s.getAttribute('data-value'));
        if (sVal <= val) {
          s.querySelector('svg').style.stroke = 'var(--color-pending)';
        }
      });
    });
    star.addEventListener('mouseleave', () => {
      updateStarsUI(selectedFormRating);
    });
  });
  
  // Default to 5 stars
  updateStarsUI(5);
}

function resetAddSupplierForm() {
  const addSupplierForm = document.getElementById('add-supplier-form');
  const ratingStarsContainer = document.getElementById('rating-stars-container');
  const formRatingVal = document.getElementById('form-rating-val');
  if (!addSupplierForm) return;

  addSupplierForm.reset();
  // Reset selected rating to 5
  selectedFormRating = 5;
  if (ratingStarsContainer && formRatingVal) {
    const stars = ratingStarsContainer.querySelectorAll('.star-option');
    stars.forEach(star => {
      star.classList.add('selected');
      star.querySelector('svg').style.fill = 'var(--color-pending)';
      star.querySelector('svg').style.stroke = 'var(--color-pending)';
    });
    formRatingVal.textContent = '5.0';
  }
  
  // Remove all invalid classes
  const formGroups = addSupplierForm.querySelectorAll('.form-group');
  formGroups.forEach(group => group.classList.remove('invalid'));
}

// Form field input listeners for real-time validation
function initRealtimeValidation() {
  const addSupplierForm = document.getElementById('add-supplier-form');
  if (!addSupplierForm) return;

  const inputs = addSupplierForm.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group && group.classList.contains('invalid') && validateField(input)) {
        group.classList.remove('invalid');
      }
    });
  });
}

function validateField(input) {
  const name = input.name;
  const val = input.value.trim();
  switch(name) {
    case 'name':
      return val.length >= 2;
    case 'category':
      return val !== '';
    case 'contactPerson':
      return val.length >= 2;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val);
    case 'phone':
      return val.length >= 7;
    case 'leadTime':
      return val.length >= 2;
    case 'address':
      return val.length >= 10;
    default:
      return true;
  }
}

function setupFormListeners() {
  const addSupplierForm = document.getElementById('add-supplier-form');
  const btnCancelAddSupplier = document.getElementById('btn-cancel-add-supplier');

  if (addSupplierForm) {
    addSupplierForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let formIsValid = true;
      const inputs = addSupplierForm.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        const group = input.closest('.form-group');
        if (group) {
          if (!validateField(input)) {
            group.classList.add('invalid');
            formIsValid = false;
          } else {
            group.classList.remove('invalid');
          }
        }
      });
      
      if (!formIsValid) {
        if (typeof showToast === 'function') showToast('Please correct the validation errors in the form.', 'error');
        return;
      }
      
      // Generate new supplier data
      const formData = new FormData(addSupplierForm);
      const newSupplierPayload = {
        name: formData.get('name').trim(),
        category: formData.get('category'),
        contactPerson: formData.get('contactPerson').trim(),
        email: formData.get('email').trim(),
        phone: formData.get('phone').trim(),
        leadTime: formData.get('leadTime').trim(),
        status: formData.get('status'),
        rating: selectedFormRating,
        address: formData.get('address').trim()
      };

      let newSupplier = null;
      try {
        const res = await fetch(`${API_BASE_URL}/suppliers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSupplierPayload)
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        newSupplier = await res.json();
        console.log('Supplier saved to backend database:', newSupplier);
      } catch (err) {
        console.warn('Failed to save supplier to backend, using local fallback:', err);
        const newIdNum = (suppliers.length + 1).toString().padStart(3, '0');
        newSupplier = {
          id: `SUP-${newIdNum}`,
          ...newSupplierPayload,
          joiningDate: new Date().toISOString().split('T')[0]
        };
      }
      
      suppliers.unshift(newSupplier);
      saveSuppliersToStorage();
      
      // Show toast & spawn system alert
      if (typeof showToast === 'function') showToast(`Supplier "${newSupplier.name}" added successfully.`, 'success');
      if (typeof spawnNotification === 'function') {
        spawnNotification('success', 'Supplier Registered', `New supplier "${newSupplier.name}" (${newSupplier.id}) added under ${newSupplier.category} category.`);
      }
      
      // Reset form and redirect
      resetAddSupplierForm();
      window.location.hash = '#suppliers';
    });
  }

  if (btnCancelAddSupplier) {
    btnCancelAddSupplier.addEventListener('click', () => {
      resetAddSupplierForm();
      window.location.hash = '#suppliers';
    });
  }
}
