import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from data_preprocessing import main as preprocess_data

def create_performance_dashboard():
    """
    Create comprehensive data visualization dashboard
    """
    # Set style
    plt.style.use('seaborn-v0_8')
    sns.set_palette("husl")
    
    # Load data
    print("Loading data for visualization...")
    data = preprocess_data()
    
    # Create sample DataFrame for visualization
    np.random.seed(42)
    n_samples = 1000
    
    df = pd.DataFrame({
        'attendance_rate': np.random.normal(80, 15, n_samples).clip(0, 100),
        'study_hours_per_week': np.random.exponential(12, n_samples).clip(0, 40),
        'sleep_duration': np.random.normal(7, 1.5, n_samples).clip(4, 12),
        'health_status': np.random.choice(['excellent', 'good', 'fair', 'poor'], n_samples, p=[0.2, 0.4, 0.3, 0.1]),
        'family_support': np.random.choice(['high', 'medium', 'low'], n_samples, p=[0.4, 0.4, 0.2]),
        'previous_performance': np.random.normal(2.8, 0.8, n_samples).clip(0, 4),
        'performance': np.random.choice([0, 1], n_samples, p=[0.3, 0.7])
    })
    
    # Create dashboard
    fig = plt.figure(figsize=(20, 15))
    
    # 1. Attendance vs Performance
    plt.subplot(3, 3, 1)
    attendance_bins = pd.cut(df['attendance_rate'], bins=[0, 60, 70, 80, 90, 100], labels=['0-60%', '60-70%', '70-80%', '80-90%', '90-100%'])
    attendance_performance = df.groupby(attendance_bins)['performance'].mean()
    attendance_performance.plot(kind='bar', color='skyblue')
    plt.title('Pass Rate by Attendance Range')
    plt.ylabel('Pass Rate')
    plt.xlabel('Attendance Range')
    plt.xticks(rotation=45)
    
    # 2. Study Hours Distribution
    plt.subplot(3, 3, 2)
    plt.hist(df['study_hours_per_week'], bins=20, alpha=0.7, color='lightgreen')
    plt.title('Distribution of Study Hours per Week')
    plt.xlabel('Study Hours per Week')
    plt.ylabel('Frequency')
    
    # 3. Sleep Duration vs Performance
    plt.subplot(3, 3, 3)
    sleep_bins = pd.cut(df['sleep_duration'], bins=[0, 5, 6, 7, 8, 12], labels=['<5h', '5-6h', '6-7h', '7-8h', '>8h'])
    sleep_performance = df.groupby(sleep_bins)['performance'].mean()
    sleep_performance.plot(kind='bar', color='orange')
    plt.title('Pass Rate by Sleep Duration')
    plt.ylabel('Pass Rate')
    plt.xlabel('Sleep Duration')
    plt.xticks(rotation=45)
    
    # 4. Health Status Impact
    plt.subplot(3, 3, 4)
    health_performance = df.groupby('health_status')['performance'].mean()
    health_performance.plot(kind='bar', color='lightcoral')
    plt.title('Pass Rate by Health Status')
    plt.ylabel('Pass Rate')
    plt.xlabel('Health Status')
    plt.xticks(rotation=45)
    
    # 5. Family Support Impact
    plt.subplot(3, 3, 5)
    family_performance = df.groupby('family_support')['performance'].mean()
    family_performance.plot(kind='bar', color='plum')
    plt.title('Pass Rate by Family Support')
    plt.ylabel('Pass Rate')
    plt.xlabel('Family Support Level')
    plt.xticks(rotation=45)
    
    # 6. Previous Performance vs Current Performance
    plt.subplot(3, 3, 6)
    plt.scatter(df['previous_performance'], df['performance'], alpha=0.5, color='teal')
    plt.title('Previous vs Current Performance')
    plt.xlabel('Previous Performance (GPA)')
    plt.ylabel('Current Performance (Pass=1, Fail=0)')
    
    # 7. Correlation Heatmap
    plt.subplot(3, 3, 7)
    # Encode categorical variables for correlation
    df_corr = df.copy()
    df_corr['health_status'] = df_corr['health_status'].map({'poor': 0, 'fair': 1, 'good': 2, 'excellent': 3})
    df_corr['family_support'] = df_corr['family_support'].map({'low': 0, 'medium': 1, 'high': 2})
    
    correlation_matrix = df_corr[['attendance_rate', 'study_hours_per_week', 'sleep_duration', 
                                  'health_status', 'family_support', 'previous_performance', 'performance']].corr()
    sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0, square=True)
    plt.title('Feature Correlation Matrix')
    
    # 8. Performance Distribution
    plt.subplot(3, 3, 8)
    performance_counts = df['performance'].value_counts()
    plt.pie(performance_counts.values, labels=['Fail', 'Pass'], autopct='%1.1f%%', colors=['lightcoral', 'lightgreen'])
    plt.title('Overall Performance Distribution')
    
    # 9. Study Hours vs Attendance Scatter
    plt.subplot(3, 3, 9)
    colors = ['red' if x == 0 else 'green' for x in df['performance']]
    plt.scatter(df['study_hours_per_week'], df['attendance_rate'], c=colors, alpha=0.6)
    plt.title('Study Hours vs Attendance (Red=Fail, Green=Pass)')
    plt.xlabel('Study Hours per Week')
    plt.ylabel('Attendance Rate (%)')
    
    plt.tight_layout()
    plt.show()
    
    return df

def create_feature_analysis():
    """
    Create detailed feature analysis plots
    """
    df = create_performance_dashboard()
    
    # Feature importance simulation (based on typical ML results)
    features = ['Previous Performance', 'Attendance Rate', 'Study Hours/Week', 
                'Family Support', 'Sleep Duration', 'Health Status']
    importance = [0.28, 0.22, 0.18, 0.12, 0.08, 0.06]
    
    plt.figure(figsize=(12, 8))
    
    # Feature importance plot
    plt.subplot(2, 2, 1)
    plt.barh(features, importance, color='steelblue')
    plt.title('Feature Importance in Student Performance Prediction')
    plt.xlabel('Importance Score')
    
    # Box plot for numerical features
    plt.subplot(2, 2, 2)
    df_melted = pd.melt(df[['attendance_rate', 'study_hours_per_week', 'sleep_duration', 'performance']], 
                        id_vars=['performance'], var_name='feature', value_name='value')
    sns.boxplot(data=df_melted, x='feature', y='value', hue='performance')
    plt.title('Distribution of Numerical Features by Performance')
    plt.xticks(rotation=45)
    
    # Performance by multiple factors
    plt.subplot(2, 2, 3)
    # Create performance categories
    df['attendance_category'] = pd.cut(df['attendance_rate'], bins=[0, 70, 85, 100], labels=['Low', 'Medium', 'High'])
    df['study_category'] = pd.cut(df['study_hours_per_week'], bins=[0, 8, 15, 40], labels=['Low', 'Medium', 'High'])
    
    pivot_table = df.groupby(['attendance_category', 'study_category'])['performance'].mean().unstack()
    sns.heatmap(pivot_table, annot=True, cmap='RdYlGn', center=0.5)
    plt.title('Pass Rate by Attendance and Study Hours')
    plt.ylabel('Attendance Category')
    plt.xlabel('Study Hours Category')
    
    # Risk factor analysis
    plt.subplot(2, 2, 4)
    risk_factors = []
    for _, row in df.iterrows():
        risk_count = 0
        if row['attendance_rate'] < 70: risk_count += 1
        if row['study_hours_per_week'] < 8: risk_count += 1
        if row['sleep_duration'] < 6: risk_count += 1
        if row['previous_performance'] < 2.0: risk_count += 1
        risk_factors.append(risk_count)
    
    df['risk_factors'] = risk_factors
    risk_performance = df.groupby('risk_factors')['performance'].mean()
    risk_performance.plot(kind='bar', color='coral')
    plt.title('Pass Rate by Number of Risk Factors')
    plt.xlabel('Number of Risk Factors')
    plt.ylabel('Pass Rate')
    plt.xticks(rotation=0)
    
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    print("Creating Student Performance Visualization Dashboard...")
    create_performance_dashboard()
    print("\nCreating Feature Analysis...")
    create_feature_analysis()
    print("Visualization complete!")
