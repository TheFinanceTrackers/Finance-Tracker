from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)  # Allow all routes and credentials

# Configure SQLite
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'database.sqlite')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Transaction Model
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.String(50), nullable=False)

# Create database tables
with app.app_context():
    db.create_all()

@app.route('/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    return jsonify([{
        'id': t.id,
        'description': t.description,
        'amount': t.amount,
        'category': t.category,
        'date': t.date
    } for t in transactions])

@app.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    new_transaction = Transaction(
        description=data['description'],
        amount=data['amount'],
        category=data['category'],
        date=data['date']
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction added!', 'id': new_transaction.id}), 201

@app.route('/transactions/<int:id>', methods=['DELETE', 'OPTIONS'])
def delete_transaction(id):
    if request.method == 'OPTIONS':  # Handle preflight request
        response = jsonify({'message': 'Preflight request successful'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'DELETE, GET, POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response, 200
    
    transaction = Transaction.query.get(id)
    if transaction:
        db.session.delete(transaction)
        db.session.commit()
        response = jsonify({'message': 'Transaction deleted successfully'})
    else:
        response = jsonify({'error': 'Transaction not found'}), 404

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True, port=5000)
