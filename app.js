// Chart.js global configuration
Chart.defaults.font.family = 'Roboto';
Chart.defaults.color = '#223354';
Chart.defaults.borderColor = 'rgba(0, 0, 0, 0.1)';

// Common gauge options
const gaugeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    circumference: 180,
    rotation: 270,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            enabled: false
        }
    }
};

// Create ESI Gauge
function createESIGauge(data) {
    const ctx = document.getElementById('fci-esiGauge').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [data.current, 100 - data.current],
                backgroundColor: ['#22aaff', 'rgba(34, 170, 255, 0.1)'],
                borderWidth: 0
            }]
        },
        options: {
            ...gaugeOptions,
            plugins: {
                ...gaugeOptions.plugins,
                title: {
                    display: true,
                    text: `${data.current}`,
                    font: {
                        size: 24,
                        weight: 'bold'
                    },
                    position: 'bottom',
                    color: '#22aaff'
                }
            }
        }
    });
}

// Create Financial Anxiety Gauge
function createAnxietyGauge(data) {
    const ctx = document.getElementById('fci-anxietyGauge').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [data.current, 100 - data.current],
                backgroundColor: ['#ff3366', 'rgba(255, 51, 102, 0.1)'],
                borderWidth: 0
            }]
        },
        options: {
            ...gaugeOptions,
            plugins: {
                ...gaugeOptions.plugins,
                title: {
                    display: true,
                    text: `${data.current}%`,
                    font: {
                        size: 24,
                        weight: 'bold'
                    },
                    position: 'bottom',
                    color: '#ff3366'
                }
            }
        }
    });
}

// Create Hope vs Despair Gauge
function createHopeDespairGauge(data) {
    const ctx = document.getElementById('fci-hopeDespairGauge').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [data.current, 100 - data.current],
                backgroundColor: ['#88dd11', 'rgba(136, 221, 17, 0.1)'],
                borderWidth: 0
            }]
        },
        options: {
            ...gaugeOptions,
            plugins: {
                ...gaugeOptions.plugins,
                title: {
                    display: true,
                    text: `${data.current}`,
                    font: {
                        size: 24,
                        weight: 'bold'
                    },
                    position: 'bottom',
                    color: '#88dd11'
                }
            }
        }
    });
}

// Create Layoff Mentions Gauge
function createLayoffGauge(data) {
    const ctx = document.getElementById('fci-layoffGauge').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [data.current, 100 - data.current],
                backgroundColor: ['#ee44ee', 'rgba(238, 68, 238, 0.1)'],
                borderWidth: 0
            }]
        },
        options: {
            ...gaugeOptions,
            plugins: {
                ...gaugeOptions.plugins,
                title: {
                    display: true,
                    text: `${data.current}%`,
                    font: {
                        size: 24,
                        weight: 'bold'
                    },
                    position: 'bottom',
                    color: '#ee44ee'
                }
            }
        }
    });
}

// Create Consumer Behavior Gauge
function createConsumerGauge(data) {
    const ctx = document.getElementById('fci-consumerGauge').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [data.current, 100 - data.current],
                backgroundColor: ['#aa77ff', 'rgba(170, 119, 255, 0.1)'],
                borderWidth: 0
            }]
        },
        options: {
            ...gaugeOptions,
            plugins: {
                ...gaugeOptions.plugins,
                title: {
                    display: true,
                    text: `${data.current}`,
                    font: {
                        size: 24,
                        weight: 'bold'
                    },
                    position: 'bottom',
                    color: '#aa77ff'
                }
            }
        }
    });
}

// Common chart options
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            backgroundColor: 'rgba(34, 42, 84, 0.9)',
            padding: 12,
            displayColors: false,
            callbacks: {
                title: () => '',
                label: (context) => `${context.parsed.y}`
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawBorder: false
            },
            ticks: {
                padding: 10,
                font: {
                    size: 12
                }
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                padding: 10,
                font: {
                    size: 12
                }
            }
        }
    },
    elements: {
        line: {
            tension: 0.3
        },
        point: {
            radius: 0,
            hoverRadius: 6,
            hoverBorderWidth: 2
        }
    }
};

// Fetch and process data
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        // Update last updated time
        document.getElementById('lastUpdated').textContent = new Date(data.lastUpdated).toLocaleString();
        
        // Create charts
        createESIChart(data.metrics.esi);
        createESIGauge(data.metrics.esi);
        createAnxietyChart(data.metrics.financialAnxiety);
        createAnxietyGauge(data.metrics.financialAnxiety);
        createHopeDespairChart(data.metrics.hopeDespair);
        createHopeDespairGauge(data.metrics.hopeDespair);
        createLayoffChart(data.metrics.layoffMentions);
        createLayoffGauge(data.metrics.layoffMentions);
        createConsumerChart(data.metrics.consumerBehavior);
        createConsumerGauge(data.metrics.consumerBehavior);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Create ESI Chart
function createESIChart(data) {
    const ctx = document.getElementById('fci-esiChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.trend,
                borderColor: '#22aaff',
                backgroundColor: 'rgba(34, 170, 255, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Index Score',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            },
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: `Current ESI: ${data.current}`,
                    font: {
                        size: 14,
                        weight: '500'
                    },
                    padding: {
                        bottom: 20
                    }
                }
            }
        }
    });
}

// Create Financial Anxiety Chart
function createAnxietyChart(data) {
    const ctx = document.getElementById('fci-anxietyChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.trend,
                borderColor: '#ff3366',
                backgroundColor: 'rgba(255, 51, 102, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Percentage',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            },
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: `Current Score: ${data.current}%`,
                    font: {
                        size: 14,
                        weight: '500'
                    },
                    padding: {
                        bottom: 20
                    }
                }
            }
        }
    });
}

// Create Hope vs Despair Chart
function createHopeDespairChart(data) {
    const ctx = document.getElementById('fci-hopeDespairChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.trend,
                borderColor: '#88dd11',
                backgroundColor: 'rgba(136, 221, 17, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Ratio',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            },
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: `Current Ratio: ${data.current}`,
                    font: {
                        size: 14,
                        weight: '500'
                    },
                    padding: {
                        bottom: 20
                    }
                }
            }
        }
    });
}

// Create Layoff Mentions Chart
function createLayoffChart(data) {
    const ctx = document.getElementById('fci-layoffChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.trend,
                borderColor: '#ee44ee',
                backgroundColor: 'rgba(238, 68, 238, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Mentions (%)',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            },
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: `Current Mentions: ${data.current}%`,
                    font: {
                        size: 14,
                        weight: '500'
                    },
                    padding: {
                        bottom: 20
                    }
                }
            }
        }
    });
}

// Create Consumer Behavior Chart
function createConsumerChart(data) {
    const ctx = document.getElementById('fci-consumerChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.trend,
                borderColor: '#aa77ff',
                backgroundColor: 'rgba(170, 119, 255, 0.1)',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            ...commonOptions,
            scales: {
                ...commonOptions.scales,
                y: {
                    ...commonOptions.scales.y,
                    title: {
                        display: true,
                        text: 'Index Score',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            },
            plugins: {
                ...commonOptions.plugins,
                title: {
                    display: true,
                    text: `Current Index: ${data.current}`,
                    font: {
                        size: 14,
                        weight: '500'
                    },
                    padding: {
                        bottom: 20
                    }
                }
            }
        }
    });
}

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