// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Toggle between hamburger and close icon
            const icon = this.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-menu') && !e.target.closest('#mobile-menu-btn')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Reset icon to hamburger
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // Close menu when a nav link is clicked (for single page navigation)
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Reset icon to hamburger
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
});
