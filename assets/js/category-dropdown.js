// Wait for everything to be fully loaded
window.addEventListener('load', function() {
    console.log('Page fully loaded');
    
    // Give a small delay to ensure all elements are available
    setTimeout(function() {
        console.log('Initializing category dropdown...');
        
        const categoryToggle = document.getElementById('categoryToggle');
        const categoryMenu = document.getElementById('categoryMenu');
        
        if (!categoryToggle) {
            console.error('Category toggle button not found!');
            return;
        }
        
        if (!categoryMenu) {
            console.error('Category menu not found!');
            return;
        }
        
        console.log('All elements found!');
        
        // Make sure the menu is hidden initially
        categoryMenu.style.display = 'none';
        
        // Add click event to toggle button
        categoryToggle.addEventListener('click', function(e) {
            console.log('Toggle clicked!');
            e.preventDefault();
            e.stopPropagation();
            
            if (categoryMenu.style.display === 'block') {
                categoryMenu.style.display = 'none';
                categoryToggle.classList.remove('active');
                console.log('Menu hidden');
            } else {
                categoryMenu.style.display = 'block';
                categoryToggle.classList.add('active');
                console.log('Menu shown');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.category-dropdown')) {
                categoryMenu.style.display = 'none';
                categoryToggle.classList.remove('active');
                console.log('Menu closed (click outside)');
            }
        });
        
        // Handle category selection
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        console.log('Found', dropdownItems.length, 'dropdown items');
        
        dropdownItems.forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.getAttribute('data-category');
                console.log('Selected category:', category);
                
                // Update active state
                dropdownItems.forEach(function(i) {
                    i.classList.remove('active');
                });
                this.classList.add('active');
                
                // Update toggle text
                const categoryName = this.textContent.trim();
                categoryToggle.innerHTML = `카테고리: ${categoryName} <i class="fas fa-chevron-down"></i>`;
                
                // Close menu
                categoryMenu.style.display = 'none';
                categoryToggle.classList.remove('active');
                
                // Navigate to the selected category
                if (category === 'all') {
                    window.location.href = '/index.html';
                } else {
                    window.location.href = `/index.html?category=${category}`;
                }
            });
        });
        
        console.log('Category dropdown initialized successfully!');
        
    }, 100); // Small delay to ensure everything is ready
});
