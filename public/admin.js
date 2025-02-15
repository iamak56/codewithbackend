document.addEventListener('DOMContentLoaded', function() {
    // Initialize animation for table containers
    const tableContainers = document.querySelectorAll('.table-container');
    tableContainers.forEach((container, index) => {
        container.style.animationDelay = `${index * 0.2}s`;
    });

    // Add row highlight effect
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'scale(1.01)';
        });

        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.remove();
            }, 500);
        }, 5000);
    });

    // Add smooth scrolling to table containers
    document.querySelectorAll('h2').forEach(header => {
        header.addEventListener('click', function() {
            const container = this.closest('.table-container');
            container.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Add data refresh functionality (if needed)
    function refreshData() {
        // Add your refresh logic here
        const refreshAnimation = document.createElement('div');
        refreshAnimation.className = 'refresh-animation';
        document.body.appendChild(refreshAnimation);
        
        setTimeout(() => {
            refreshAnimation.remove();
        }, 1000);
    }

    // Optional: Add automatic refresh every 5 minutes
    // setInterval(refreshData, 300000);

    // Update dashboard title
    const dashboardTitle = document.querySelector('h1');
    dashboardTitle.classList.add('dashboard-title');
});
