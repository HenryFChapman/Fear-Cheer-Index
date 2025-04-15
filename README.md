# Fear-Cheer Index (FCI)

A real-time sentiment analysis dashboard that tracks economic and market sentiment through various key indicators. The FCI provides a comprehensive view of market sentiment by analyzing multiple data sources and presenting them in an intuitive, interactive interface.

## Features

- **Real-time Data Visualization**: Interactive charts displaying key economic indicators
- **Multiple Metrics**:
  - Economic Sentiment Index (ESI)
  - Hope vs Despair Ratio
  - Layoff Trends
  - Consumer Confidence Metrics
- **Responsive Design**: Optimized for desktop and mobile viewing
- **Clean, Modern UI**: Minimalist design with intuitive data presentation
- **Automatic Data Updates**: Python script for regular data collection and processing

## Project Structure

```
Fear-Cheer-Index/
├── app.js              # Main application logic and chart rendering
├── index.html          # Main HTML structure
├── styles.css          # Custom styling and theme
├── data.json           # Data storage
├── update_data.py      # Data collection and processing script
└── api_token.txt       # API credentials (not tracked in git)
```

## Technologies Used

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript
  - Chart.js for data visualization
- **Backend**:
  - Python 3.x
  - Various data APIs for economic indicators

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Fear-Cheer-Index.git
   cd Fear-Cheer-Index
   ```

2. Set up Python environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Configure API credentials:
   - Create an `api_token.txt` file in the root directory
   - Add your API token (not tracked in git)

4. Run the data update script:
   ```bash
   python update_data.py
   ```

5. Open `index.html` in your web browser to view the dashboard

## Data Sources

The FCI aggregates data from multiple sources:
- Economic Sentiment Index (ESI)
- Market sentiment indicators
- Consumer confidence metrics
- Employment and layoff data

## Data Processing

The `update_data.py` script:
- Fetches data from various APIs
- Processes and normalizes the data
- Calculates growth metrics and trends
- Updates the `data.json` file
- Can be scheduled to run automatically

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Chart.js for the visualization library
- Various data providers for economic indicators
- Contributors and maintainers

## Contact

For questions or suggestions, please open an issue in the repository. 