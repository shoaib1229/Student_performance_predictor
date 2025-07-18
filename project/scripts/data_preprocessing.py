import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import seaborn as sns

def load_and_preprocess_data():
    """
    Load and preprocess student performance data
    """
    # Generate sample data (in real scenario, load from CSV or database)
    np.random.seed(42)
    n_samples = 1000
    
    data = {
        'attendance_rate': np.random.normal(80, 15, n_samples).clip(0, 100),
        'study_hours_per_week': np.random.exponential(12, n_samples).clip(0, 40),
        'sleep_duration': np.random.normal(7, 1.5, n_samples).clip(4, 12),
        'health_status': np.random.choice(['excellent', 'good', 'fair', 'poor'], n_samples, p=[0.2, 0.4, 0.3, 0.1]),
        'family_support': np.random.choice(['high', 'medium', 'low'], n_samples, p=[0.4, 0.4, 0.2]),
        'internet_access': np.random.choice(['yes', 'no'], n_samples, p=[0.85, 0.15]),
        'parental_education': np.random.choice(['primary', 'secondary', 'higher'], n_samples, p=[0.2, 0.5, 0.3]),
        'previous_performance': np.random.normal(2.8, 0.8, n_samples).clip(0, 4),
        'class_participation': np.random.choice(['high', 'medium', 'low'], n_samples, p=[0.3, 0.5, 0.2]),
        'extracurricular_activities': np.random.choice(['high', 'medium', 'low', 'none'], n_samples, p=[0.2, 0.3, 0.3, 0.2])
    }
    
    df = pd.DataFrame(data)
    
    # Create target variable based on features (realistic correlation)
    performance_score = (
        df['attendance_rate'] * 0.3 +
        df['study_hours_per_week'] * 2 +
        df['sleep_duration'] * 5 +
        df['previous_performance'] * 20 +
        (df['health_status'] == 'excellent').astype(int) * 10 +
        (df['family_support'] == 'high').astype(int) * 8 +
        (df['internet_access'] == 'yes').astype(int) * 5 +
        (df['class_participation'] == 'high').astype(int) * 6 +
        np.random.normal(0, 10, n_samples)  # Add some noise
    )
    
    # Convert to pass/fail based on threshold
    df['performance'] = (performance_score > performance_score.median()).astype(int)
    
    return df

def encode_categorical_features(df):
    """
    Encode categorical features for machine learning
    """
    df_encoded = df.copy()
    
    # Label encoding for ordinal features
    ordinal_mappings = {
        'health_status': {'poor': 0, 'fair': 1, 'good': 2, 'excellent': 3},
        'family_support': {'low': 0, 'medium': 1, 'high': 2},
        'parental_education': {'primary': 0, 'secondary': 1, 'higher': 2},
        'class_participation': {'low': 0, 'medium': 1, 'high': 2},
        'extracurricular_activities': {'none': 0, 'low': 1, 'medium': 2, 'high': 3}
    }
    
    for feature, mapping in ordinal_mappings.items():
        df_encoded[feature] = df_encoded[feature].map(mapping)
    
    # Binary encoding
    df_encoded['internet_access'] = (df_encoded['internet_access'] == 'yes').astype(int)
    
    return df_encoded

def prepare_features_and_target(df):
    """
    Prepare features and target for machine learning
    """
    feature_columns = [
        'attendance_rate', 'study_hours_per_week', 'sleep_duration',
        'health_status', 'family_support', 'internet_access',
        'parental_education', 'previous_performance', 'class_participation',
        'extracurricular_activities'
    ]
    
    X = df[feature_columns]
    y = df['performance']
    
    return X, y

def main():
    """
    Main preprocessing pipeline
    """
    print("Loading and preprocessing student data...")
    
    # Load data
    df = load_and_preprocess_data()
    print(f"Loaded {len(df)} student records")
    
    # Display basic statistics
    print("\nDataset Info:")
    print(df.info())
    print("\nTarget Distribution:")
    print(df['performance'].value_counts())
    
    # Encode categorical features
    df_encoded = encode_categorical_features(df)
    
    # Prepare features and target
    X, y = prepare_features_and_target(df_encoded)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print(f"\nTraining set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")
    
    # Save processed data
    processed_data = {
        'X_train': X_train_scaled,
        'X_test': X_test_scaled,
        'y_train': y_train,
        'y_test': y_test,
        'feature_names': X.columns.tolist(),
        'scaler': scaler
    }
    
    print("Data preprocessing completed successfully!")
    return processed_data

if __name__ == "__main__":
    main()
