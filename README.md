"""
This Google Colab notebook processes and analyzes air quality data from six stations in Hanoi, Vietnam. It aims to clean, pre-process, and prepare the data for further analysis and modeling.

The code follows these steps:

I. Data Preparation and Analysis:
    - Reads raw air quality data from an Excel file, including station locations.
    - Selects relevant pollutant columns (PM2.5, O3, CO, NO2).
    - Performs exploratory data analysis, including visualization and correlation analysis.
    - Removes stations with excessive missing data (stations 1 and 5) and rows with continuous missing data for 24 hours.
    - Creates separate dataframes for each pollutant to facilitate individual analysis.
    - Calculates data ranges for each pollutant and station to assess data variability.

II. Outlier Adjustment and Smoothing:
    - Analyzes data dispersion (standard deviation and mean) to determine the need for outlier correction.
    - Corrects outliers using a dynamic Interquartile Range (IQR) method, considering daily variations.
    - Smooths data using a Moving Average (MA) filter to reduce noise and highlight trends.
    - Visualizes the results of outlier adjustment and smoothing.

III. Missing Data Imputation with Random Forest:
    - Imputes missing data using a Random Forest model, leveraging spatial and temporal correlations between stations and pollutants.
    - Evaluates imputation performance using metrics like RMSE, MAE, and R2.

IV. Pre-training a Model for AQI Prediction:
    - Creates lagged features to capture temporal dependencies in the data.
    - Applies data scaling (e.g., MinMaxScaler) to standardize feature ranges.
    - Prepares data for modeling by splitting into training and testing sets.
    - Trains a base model (e.g., Random Forest or XGBoost) for AQI prediction.

V. Hybrid LSTM + CNN Model:
    - Develops a hybrid model combining Long Short-Term Memory (LSTM) and Convolutional Neural Network (CNN) layers.
    - Trains the hybrid model on the preprocessed data.
    - Evaluates the model's performance using appropriate metrics (e.g., RMSE, MAE, R2).
    - Fine-tunes model hyperparameters using techniques like Grid Search or Randomized Search.


Addition Models

"""