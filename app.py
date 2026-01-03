
from flask import Flask, render_template, request, jsonify, send_file
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here-change-in-production'

@app.route('/')
def index():
    """Render the main portfolio page"""
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submissions"""
    try:
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        message = request.form.get('message', '').strip()
        
        if not name or not email or not message:
            return jsonify({
                'success': False,
                'message': 'All fields are required!'
            }), 400
        
        if '@' not in email or '.' not in email:
            return jsonify({
                'success': False,
                'message': 'Please enter a valid email address!'
            }), 400
        
        print(f"Contact Form Submission:")
        print(f"Name: {name}")
        print(f"Email: {email}")
        print(f"Message: {message}")
        
        return jsonify({
            'success': True,
            'message': 'Thank you for your message! I will get back to you soon.'
        }), 200
        
    except Exception as e:
        print(f"Error processing contact form: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'An error occurred. Please try again later.'
        }), 500

@app.route('/download_resume')
def download_resume():
    """Serve the resume PDF file for download"""
    try:
        resume_path = os.path.join(app.root_path, 'static', 'resume', 'M_Dan_Babi_Resume.pdf')
        
        if not os.path.exists(resume_path):
            return jsonify({
                'success': False,
                'message': 'Resume file not found!'
            }), 404
        
        return send_file(
            resume_path,
            as_attachment=True,
            download_name='M_Dan_Babi_Resume.pdf',
            mimetype='application/pdf'
        )
    except Exception as e:
        print(f"Error downloading resume: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error downloading resume. Please try again.'
        }), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return render_template('index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)