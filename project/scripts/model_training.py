import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report, confusion_matrix
import xgboost as xgb
import matplotlib.pyplot as plt
import seaborn as sns
from data_preprocessing import main as preprocess_data

def train_logistic_regression(X_train, y_train):
    """
    Train Logistic Regression model
    """
    model = LogisticRegression(random_state=42, max_iter=1000)
    model.fit(X_train, y_train)
    return model

def train_random_forest(X_train, y_train):
    """
    Train Random Forest model
    """
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    return model

def train_svm(X_train, y_train):
    """
    Train Support Vector Machine model
    """
    model = SVC(kernel='rbf', random_state=42, probability=True)
    model.fit(X_train, y_train)
    return model

def train_knn(X_train, y_train):
    """
    Train K-Nearest Neighbors model
    """
    model = KNeighborsClassifier(n_neighbors=5)
    model.fit(X_train, y_train)
    return model

def train_xgboost(X_train, y_train):
    """
    Train XGBoost model
    """
    model = xgb.XGBClassifier(random_state=42, eval_metric='logloss')
    model.fit(X_train, y_train)
    return model

def evaluate_model(model, X_test, y_test, model_name):
    """
    Evaluate model performance
    """
    y_pred = model.predict(X_test)
    
    metrics = {
        'model_name': model_name,
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred),
        'recall': recall_score(y_test, y_pred),
        'f1_score': f1_score(y_test, y_pred)
    }
    
    return metrics

def plot_feature_importance(model, feature_names, model_name):
    """
    Plot feature importance for tree-based models
    """
    if hasattr(model, 'feature_importances_'):
        importance = model.feature_importances_
        feature_importance = pd.DataFrame({
            'feature': feature_names,
            'importance': importance
        }).sort_values('importance', ascending=False)
        
        plt.figure(figsize=(10, 6))
        sns.barplot(data=feature_importance, x='importance', y='feature')
        plt.title(f'Feature Importance - {model_name}')
        plt.xlabel('Importance')
        plt.tight_layout()
        plt.show()
        
        return feature_importance
    else:
        print(f"Feature importance not available for {model_name}")
        return None

def main():
    """
    Main training pipeline
    """
    print("Starting model training pipeline...")
    
    # Load preprocessed data
    data = preprocess_data()
    X_train = data['X_train']
    X_test = data['X_test']
    y_train = data['y_train']
    y_test = data['y_test']
    feature_names = data['feature_names']
    
    # Define models to train
    models = {
        'Logistic Regression': train_logistic_regression,
        'Random Forest': train_random_forest,
        'Support Vector Machine': train_svm,
        'K-Nearest Neighbors': train_knn,
        'XGBoost': train_xgboost
    }
    
    results = []
    trained_models = {}
    
    # Train and evaluate each model
    for model_name, train_func in models.items():
        print(f"\nTraining {model_name}...")
        
        # Train model
        model = train_func(X_train, y_train)
        trained_models[model_name] = model
        
        # Evaluate model
        metrics = evaluate_model(model, X_test, y_test, model_name)
        results.append(metrics)
        
        print(f"Accuracy: {metrics['accuracy']:.3f}")
        print(f"Precision: {metrics['precision']:.3f}")
        print(f"Recall: {metrics['recall']:.3f}")
        print(f"F1-Score: {metrics['f1_score']:.3f}")
        
        # Plot feature importance for applicable models
        if model_name in ['Random Forest', 'XGBoost']:
            plot_feature_importance(model, feature_names, model_name)
    
    # Create results summary
    results_df = pd.DataFrame(results)
    print("\n" + "="*50)
    print("MODEL COMPARISON SUMMARY")
    print("="*50)
    print(results_df.round(3))
    
    # Find best model
    best_model_name = results_df.loc[results_df['accuracy'].idxmax(), 'model_name']
    best_accuracy = results_df['accuracy'].max()
    
    print(f"\nBest performing model: {best_model_name}")
    print(f"Best accuracy: {best_accuracy:.3f}")
    
    return trained_models, results_df

if __name__ == "__main__":
    trained_models, results = main()
