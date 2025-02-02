"""
This Google Colab notebook processes and analyzes air quality data from six stations in Ho Chi Minh City, Vietnam. It aims to clean, pre-process, and prepare the data for further analysis and modeling.

The code follows these steps:

I. Data Preparation and Analysis:
    - Read raw air quality data from an Excel file, including station locations.
    - Select relevant pollutant columns (PM2.5, O3, CO, NO2).
    - Perform exploratory data analysis, including visualization and correlation analysis.
    - Remove stations with excessive missing data (stations 1 and 5) and rows with continuous missing data for 24 hours.
    - Create separate data frames for each pollutant to facilitate individual analysis.
    - Calculate data ranges for each pollutant and station to assess data variability.

II. Outlier Adjustment and Smoothing:
    - Analyze data dispersion (standard deviation and mean) to determine the need for outlier correction.
    - Correct outliers using a dynamic Interquartile Range (IQR) method, considering daily variations.
    - Smooth data using a Moving Average (MA) filter to reduce noise and highlight trends.
    - Visualize the results of outlier adjustment and smoothing.

III. Missing Data Imputation with Random Forest:
    - Impute missing data using a Random Forest model, leveraging spatial and temporal correlations between stations and pollutants.
    - Evaluate imputation performance using metrics like RMSE, MAE, and R2.

IV. Pre-training a Model for AQI Prediction:
    - Create lagged features to capture temporal dependencies in the data.
    - Apply data scaling (e.g., MinMaxScaler) to standardize feature ranges.
    - Prepare data for modeling by splitting it into training and testing sets.
    - Train a base model (e.g., Random Forest or XGBoost) for AQI prediction.

V. Hybrid LSTM + CNN Model:
    - Develop a hybrid model combining Long Short-Term Memory (LSTM) and Convolutional Neural Network (CNN) layers.
    - Train the hybrid model on the preprocessed data.
    - Evaluate the model's performance using appropriate metrics (e.g., RMSE, MAE, R2).
    - Fine-tune model hyperparameters using techniques like Grid Search or Randomized Search.


Addition Models

"""
