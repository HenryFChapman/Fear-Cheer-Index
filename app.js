// Chart.js global configuration
Chart.defaults.font.family = 'Roboto';
Chart.defaults.color = '#223354';
Chart.defaults.borderColor = 'rgba(0, 0, 0, 0.1)';

// Common options for all charts
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            backgroundColor: 'rgba(34, 42, 84, 0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 12,
            displayColors: false,
            intersect: false,
            mode: 'index',
            callbacks: {
                label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y.toFixed(3)}`;
                }
            }
        }
    },
    interaction: {
        mode: 'index',
        intersect: false
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
                maxTicksLimit: 8,
                autoSkip: true
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                display: false
            },
            title: {
                display: true,
                text: 'Value'
            }
        }
    }
};

// Store chart instances
const chartInstances = {};

// Create ESI Chart
function createESIChart(data) {
    const ctx = document.getElementById('fci-esiChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(34, 170, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(34, 170, 255, 0)');
    
    const options = {
        ...commonOptions,
        scales: {
            ...commonOptions.scales,
            y: {
                ...commonOptions.scales.y,
                title: {
                    display: true,
                    text: 'Percentage'
                },
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        }
    };
    
    if (chartInstances.esi) {
        chartInstances.esi.destroy();
    }
    chartInstances.esi = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...data.metrics.esi.labels].reverse(),
            datasets: [{
                label: 'Economic Sentiment Index',
                data: [...data.metrics.esi.trend].reverse(),
                borderColor: '#22aaff',
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0
            }]
        },
        options: options
    });
}

// Create Anxiety Chart
function createAnxietyChart(data) {
    const ctx = document.getElementById('fci-anxietyChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(255, 51, 102, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 51, 102, 0)');
    
    const options = {
        ...commonOptions,
        scales: {
            ...commonOptions.scales,
            y: {
                ...commonOptions.scales.y,
                title: {
                    display: true,
                    text: 'Percentage'
                },
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        }
    };
    
    if (chartInstances.anxiety) {
        chartInstances.anxiety.destroy();
    }
    chartInstances.anxiety = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...data.metrics.financialAnxiety.labels].reverse(),
            datasets: [{
                label: 'Financial Anxiety Score',
                data: [...data.metrics.financialAnxiety.trend].reverse(),
                borderColor: '#ff3366',
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0
            }]
        },
        options: options
    });
}

// Create Hope vs Despair Chart
function createHopeDespairChart(data) {
    const ctx = document.getElementById('fci-hopeDespairChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(136, 221, 17, 0.3)');
    gradient.addColorStop(1, 'rgba(136, 221, 17, 0)');
    
    const options = {
        ...commonOptions,
        scales: {
            ...commonOptions.scales,
            y: {
                ...commonOptions.scales.y,
                title: {
                    display: true,
                    text: 'Ratio'
                }
            }
        },
        plugins: {
            ...commonOptions.plugins,
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: 1,
                        yMax: 1,
                        borderColor: 'rgba(136, 221, 17, 0.5)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            content: 'Hope > Despair',
                            enabled: true,
                            position: 'right',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            color: '#223354',
                            font: {
                                size: 12,
                                weight: 'bold'
                            },
                            padding: 6,
                            borderRadius: 4,
                            xAdjust: 10,
                            yAdjust: -5
                        }
                    },
                    line2: {
                        type: 'line',
                        yMin: 1,
                        yMax: 1,
                        borderColor: 'rgba(136, 221, 17, 0.5)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            content: 'Despair > Hope',
                            enabled: true,
                            position: 'left',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            color: '#223354',
                            font: {
                                size: 12,
                                weight: 'bold'
                            },
                            padding: 6,
                            borderRadius: 4,
                            xAdjust: -10,
                            yAdjust: -5
                        }
                    }
                }
            }
        }
    };
    
    if (chartInstances.hopeDespair) {
        chartInstances.hopeDespair.destroy();
    }
    chartInstances.hopeDespair = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...data.metrics.hopeDespairRatio.labels].reverse(),
            datasets: [{
                label: 'Hope vs Despair Ratio',
                data: [...data.metrics.hopeDespairRatio.trend].reverse(),
                borderColor: '#88dd11',
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0
            }]
        },
        options: options
    });
}

// Create Layoff Chart
function createLayoffChart(data) {
    const ctx = document.getElementById('fci-layoffChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(238, 68, 238, 0.3)');
    gradient.addColorStop(1, 'rgba(238, 68, 238, 0)');
    
    const options = {
        ...commonOptions,
        scales: {
            ...commonOptions.scales,
            y: {
                ...commonOptions.scales.y,
                title: {
                    display: true,
                    text: 'Percentage'
                },
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        }
    };
    
    if (chartInstances.layoff) {
        chartInstances.layoff.destroy();
    }
    chartInstances.layoff = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...data.metrics.layoffMentions.labels].reverse(),
            datasets: [{
                label: 'Layoff Mentions',
                data: [...data.metrics.layoffMentions.trend].reverse(),
                borderColor: '#ee44ee',
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0
            }]
        },
        options: options
    });
}

// Create Consumer Chart
function createConsumerChart(data) {
    const ctx = document.getElementById('fci-consumerChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(170, 119, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(170, 119, 255, 0)');
    
    const options = {
        ...commonOptions,
        scales: {
            ...commonOptions.scales,
            y: {
                ...commonOptions.scales.y,
                title: {
                    display: true,
                    text: 'Percentage'
                },
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        }
    };
    
    if (chartInstances.consumer) {
        chartInstances.consumer.destroy();
    }
    chartInstances.consumer = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...data.metrics.consumerBehavior.labels].reverse(),
            datasets: [{
                label: 'Consumer Behavior Index',
                data: [...data.metrics.consumerBehavior.trend].reverse(),
                borderColor: '#aa77ff',
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0
            }]
        },
        options: options
    });
}

// Load and display data
function loadData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Format the date to be more readable
            const date = new Date(data.lastUpdated);
            const formattedDate = date.toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            document.getElementById('lastUpdated').textContent = formattedDate;
            
            // Get the first and last dates from the labels
            const labels = data.metrics.esi.labels;
            const startDate = labels[labels.length - 1];
            const endDate = labels[0];
            
            // Add the current year to the dates
            const currentYear = new Date().getFullYear();
            document.getElementById('datasetStart').textContent = `${startDate}, ${currentYear}`;
            document.getElementById('datasetEnd').textContent = `${endDate}, ${currentYear}`;
            
            // Create all charts
            createESIChart(data);
            createAnxietyChart(data);
            createHopeDespairChart(data);
            createLayoffChart(data);
            createConsumerChart(data);
        })
        .catch(error => console.error('Error loading data:', error));
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', loadData);

// Handle navigation active state
function updateActiveNav() {
    const sections = document.querySelectorAll('.fci-section');
    const navLinks = document.querySelectorAll('.fci-toc-link');
    const scrollPosition = window.scrollY + 100; // Offset for better accuracy

    let currentSection = null;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (currentSection && link.getAttribute('href') === `#${currentSection.id}`) {
            link.classList.add('active');
        }
    });
}

// Update active section on page load
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateActiveNav();
    
    // Update on scroll with debounce
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNav, 50);
    });
});

function createLineChart(canvasId, data, color) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.trend,
                borderColor: color,
                backgroundColor: color + '20',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(1)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        maxTicksLimit: 7,
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        maxTicksLimit: 5,
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });
} 