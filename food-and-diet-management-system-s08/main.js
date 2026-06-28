// ============================================
// NUTRITION TRACKER - MAIN JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('NutriTracker initialized');
    
    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('mealModal');
    if (event.target == modal) {
        modal.classList.remove('active');
    }
}

// Format number with 2 decimals
function formatNumber(num) {
    return (Math.round(num * 100) / 100).toFixed(2);
}

// Get nutrition data for a specific date
async function getNutritionData(date) {
    try {
        const response = await fetch(`/api/daily-nutrition/${date}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error fetching nutrition data:', error);
    }
    return null;
}

// Search foods
function searchFoods(query) {
    const food_list = document.getElementById('food_list');
    
    if (query.length < 2) {
        // Reset to showing all foods
        fetch(`/api/foods?limit=20`)
            .then(r => r.json())
            .then(foods => {
                food_list.innerHTML = '';
                foods.forEach(food => {
                    food_list.innerHTML += `
                        <div class="food-item" onclick="selectFood(${food.id}, '${food.name}', ${food.calories})">
                            <h4>${food.name}</h4>
                            <div class="food-calories">${food.calories} cal</div>
                            <div class="food-detail">
                                P: ${food.protein || 0}g | C: ${food.carbs || 0}g | F: ${food.fat || 0}g
                            </div>
                        </div>
                    `;
                });
            });
        return;
    }
    
    fetch(`/api/foods?search=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(foods => {
            food_list.innerHTML = '';
            if (foods.length === 0) {
                food_list.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No foods found matching your search.</p>';
                return;
            }
            
            foods.forEach(food => {
                food_list.innerHTML += `
                    <div class="food-item" onclick="selectFood(${food.id}, '${food.name}', ${food.calories})">
                        <h4>${food.name}</h4>
                        <div class="food-calories">${food.calories} cal</div>
                        <div class="food-detail">
                            P: ${food.protein || 0}g | C: ${food.carbs || 0}g | F: ${food.fat || 0}g
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => console.error('Error searching foods:', error));
}

// Add event listener to food search if it exists
const foodSearch = document.getElementById('food_search');
if (foodSearch) {
    foodSearch.addEventListener('input', function() {
        searchFoods(this.value);
    });
}

// Calculate nutrition percentages
function calculateMacroPercentages(protein, carbs, fat) {
    const total = protein * 4 + carbs * 4 + fat * 9;
    
    return {
        protein: ((protein * 4 / total) * 100).toFixed(1),
        carbs: ((carbs * 4 / total) * 100).toFixed(1),
        fat: ((fat * 9 / total) * 100).toFixed(1)
    };
}

// Show notification
function showNotification(message, type = 'success') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.querySelector('.container').insertBefore(alert, document.querySelector('.container').firstChild);
    
    setTimeout(() => alert.remove(), 3000);
}

// Update water intake
async function updateWaterIntake(amount) {
    const today = new Date().toISOString().split('T')[0];
    
    try {
        const response = await fetch(`/api/daily-nutrition/${today}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                water_intake: amount
            })
        });
        
        if (response.ok) {
            showNotification('Water intake updated! 💧', 'success');
            location.reload();
        }
    } catch (error) {
        console.error('Error updating water intake:', error);
        showNotification('Error updating water intake', 'error');
    }
}

// Export nutrition data
function exportNutritionData() {
    const data = [];
    const table = document.querySelector('table tbody');
    
    if (table) {
        table.querySelectorAll('tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            data.push({
                date: cells[0].textContent,
                calories: cells[1].textContent,
                protein: cells[2].textContent,
                carbs: cells[3].textContent,
                fat: cells[4].textContent,
                water: cells[5].textContent
            });
        });
    }
    
    const csv = [
        ['Date', 'Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)', 'Water (L)'],
        ...data.map(d => [d.date, d.calories, d.protein, d.carbs, d.fat, d.water])
    ]
    .map(row => row.join(','))
    .join('\n');
    
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    link.download = 'nutrition_data.csv';
    link.click();
}

// Validate form
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value) {
            input.style.borderColor = '#e63946';
            isValid = false;
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Set theme preference
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Get theme preference
function getTheme() {
    return localStorage.getItem('theme') || 'light';
}

// Initialize theme
document.addEventListener('DOMContentLoaded', function() {
    setTheme(getTheme());
});