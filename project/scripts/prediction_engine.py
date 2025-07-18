import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib
from data_preprocessing import encode_categorical_features

class StudentPerformancePredictor:
    """
    Student Performance Prediction Engine
    """
    
    def __init__(self, model=None, scaler=None):
        self.model = model
        self.scaler = scaler
        self.feature_names = [
            'attendance_rate', 'study_hours_per_week', 'sleep_duration',
            'health_status', 'family_support', 'internet_access',
            'parental_education', 'previous_performance', 'class_participation',
            'extracurricular_activities'
        ]
    
    def preprocess_input(self, student_data):
        """
        Preprocess input data for prediction
        """
        # Convert to DataFrame
        if isinstance(student_data, dict):
            df = pd.DataFrame([student_data])
        else:
            df = student_data.copy()
        
        # Encode categorical features
        df_encoded = encode_categorical_features(df)
        
        # Select features in correct order
        X = df_encoded[self.feature_names]
        
        # Scale features
        if self.scaler:
            X_scaled = self.scaler.transform(X)
        else:
            X_scaled = X.values
        
        return X_scaled
    
    def predict(self, student_data):
        """
        Make prediction for student performance
        """
        if self.model is None:
            raise ValueError("Model not loaded. Please load a trained model first.")
        
        # Preprocess input
        X = self.preprocess_input(student_data)
        
        # Make prediction
        prediction = self.model.predict(X)[0]
        probability = self.model.predict_proba(X)[0]
        
        # Calculate confidence and risk level
        confidence = max(probability)
        risk_level = self._calculate_risk_level(student_data, probability)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(student_data)
        
        result = {
            'predicted_performance': 'Pass' if prediction == 1 else 'At Risk',
            'confidence': confidence,
            'risk_level': risk_level,
            'recommendations': recommendations,
            'probability_pass': probability[1] if len(probability) > 1 else probability[0]
        }
        
        return result
    
    def _calculate_risk_level(self, student_data, probability):
        """
        Calculate risk level based on prediction probability and key factors
        """
        prob_pass = probability[1] if len(probability) > 1 else probability[0]
        
        # Consider key risk factors
        risk_factors = 0
        
        if student_data.get('attendance_rate', 100) < 70:
            risk_factors += 2
        elif student_data.get('attendance_rate', 100) < 85:
            risk_factors += 1
        
        if student_data.get('study_hours_per_week', 20) < 8:
            risk_factors += 2
        elif student_data.get('study_hours_per_week', 20) < 12:
            risk_factors += 1
        
        if student_data.get('previous_performance', 4.0) < 2.0:
            risk_factors += 2
        elif student_data.get('previous_performance', 4.0) < 2.5:
            risk_factors += 1
        
        # Combine probability and risk factors
        if prob_pass > 0.8 and risk_factors == 0:
            return 'low'
        elif prob_pass > 0.6 and risk_factors <= 1:
            return 'medium'
        else:
            return 'high'
    
    def _generate_recommendations(self, student_data):
        """
        Generate personalized recommendations based on student data
        """
        recommendations = []
        
        # Attendance recommendations
        attendance = student_data.get('attendance_rate', 100)
        if attendance < 70:
            recommendations.append("Critical: Improve class attendance immediately - aim for at least 85%")
        elif attendance < 85:
            recommendations.append("Improve class attendance to at least 85% for better outcomes")
        else:
            recommendations.append("Maintain excellent attendance record")
        
        # Study hours recommendations
        study_hours = student_data.get('study_hours_per_week', 20)
        if study_hours < 8:
            recommendations.append("Significantly increase study time - aim for 12-15 hours per week")
        elif study_hours < 12:
            recommendations.append("Increase weekly study hours to 12-15 for optimal performance")
        elif study_hours > 25:
            recommendations.append("Consider reducing study hours to avoid burnout - quality over quantity")
        else:
            recommendations.append("Maintain current study schedule")
        
        # Sleep recommendations
        sleep = student_data.get('sleep_duration', 8)
        if sleep < 6:
            recommendations.append("Critical: Get more sleep - aim for 7-8 hours per night")
        elif sleep < 7:
            recommendations.append("Increase sleep duration to 7-8 hours for better cognitive performance")
        elif sleep > 9:
            recommendations.append("Consider if excessive sleep indicates underlying health issues")
        
        # Health and lifestyle
        health = student_data.get('health_status', 'good')
        if health in ['poor', 'fair']:
            recommendations.append("Focus on improving physical health through exercise and proper nutrition")
        
        # Family support
        family_support = student_data.get('family_support', 'high')
        if family_support == 'low':
            recommendations.append("Seek additional academic support from teachers or tutoring services")
        
        # Class participation
        participation = student_data.get('class_participation', 'medium')
        if participation == 'low':
            recommendations.append("Increase class participation and engagement with course material")
        
        # Previous performance
        prev_performance = student_data.get('previous_performance', 3.0)
        if prev_performance < 2.5:
            recommendations.append("Consider academic counseling to address fundamental learning gaps")
        
        return recommendations
    
    def batch_predict(self, students_data):
        """
        Make predictions for multiple students
        """
        results = []
        for student_data in students_data:
            result = self.predict(student_data)
            results.append(result)
        return results
    
    def save_model(self, filepath):
        """
        Save the trained model and scaler
        """
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'feature_names': self.feature_names
        }
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath):
        """
        Load a trained model and scaler
        """
        model_data = joblib.load(filepath)
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.feature_names = model_data['feature_names']
        print(f"Model loaded from {filepath}")

def main():
    """
    Example usage of the prediction engine
    """
    # Example student data
    sample_student = {
        'attendance_rate': 75,
        'study_hours_per_week': 10,
        'sleep_duration': 6,
        'health_status': 'fair',
        'family_support': 'medium',
        'internet_access': 'yes',
        'parental_education': 'secondary',
        'previous_performance': 2.3,
        'class_participation': 'low',
        'extracurricular_activities': 'low'
    }
    
    # Initialize predictor (in real scenario, load trained model)
    predictor = StudentPerformancePredictor()
    
    # Note: In actual implementation, you would load a trained model
    # predictor.load_model('trained_model.pkl')
    
    print("Student Performance Prediction Engine")
    print("="*40)
    print("Sample student data:")
    for key, value in sample_student.items():
        print(f"{key}: {value}")
    
    # Make prediction (would work with actual trained model)
    # result = predictor.predict(sample_student)
    # print("\nPrediction Results:")
    # print(f"Performance: {result['predicted_performance']}")
    # print(f"Confidence: {result['confidence']:.2%}")
    # print(f"Risk Level: {result['risk_level']}")
    # print("\nRecommendations:")
    # for i, rec in enumerate(result['recommendations'], 1):
    #     print(f"{i}. {rec}")

if __name__ == "__main__":
    main()
