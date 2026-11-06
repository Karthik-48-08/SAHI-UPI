import os
import sqlite3
import json
import uuid
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sahi_upi.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Transactions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS transactions (
        transaction_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        receiver_name TEXT,
        receiver_upi_id TEXT,
        receiver_type TEXT DEFAULT 'Merchant',
        amount REAL NOT NULL,
        timestamp TEXT NOT NULL,
        status TEXT NOT NULL,
        risk_score REAL NOT NULL,
        risk_level TEXT NOT NULL,
        is_fraud INTEGER DEFAULT 0,
        risk_indicators TEXT,
        features_used TEXT,
        ai_analysis TEXT,
        payment_app TEXT DEFAULT 'GPay',
        location_name TEXT DEFAULT 'Hyderabad, TS',
        device_type TEXT DEFAULT 'Android',
        is_elderly INTEGER DEFAULT 0
    )
    ''')

    # 2. Users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        age_group TEXT NOT NULL,
        is_elderly INTEGER DEFAULT 0,
        city TEXT DEFAULT 'Hyderabad',
        city_tier TEXT DEFAULT 'Tier 1',
        kyc_status TEXT DEFAULT 'Verified',
        avg_transaction_value REAL DEFAULT 850.0,
        avg_monthly_transactions INTEGER DEFAULT 28,
        is_frozen INTEGER DEFAULT 0,
        emergency_contact TEXT DEFAULT '+91 98490 12345',
        linked_bank TEXT DEFAULT 'State Bank of India •••• 4821'
    )
    ''')

    # 3. Fraud Incident Reports table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS fraud_reports (
        report_id TEXT PRIMARY KEY,
        transaction_id TEXT,
        user_id TEXT,
        suspect_upi_id TEXT,
        scam_category TEXT,
        description TEXT,
        reported_at TEXT,
        complaint_ack_no TEXT,
        status TEXT DEFAULT 'Submitted to 1930 Cyber Cell'
    )
    ''')

    # 4. Frozen Accounts table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS frozen_accounts (
        user_id TEXT PRIMARY KEY,
        frozen_at TEXT NOT NULL,
        reason TEXT,
        frozen_by TEXT DEFAULT 'User Emergency Action'
    )
    ''')

    conn.commit()

    # Check if users already seeded
    cursor.execute('SELECT COUNT(*) FROM users')
    if cursor.fetchone()[0] == 0:
        _seed_initial_data(conn)

    conn.close()

def _seed_initial_data(conn):
    print("-> Seeding initial users and historical transactions into SQLite...")
    cursor = conn.cursor()

    users_seed = [
        ('user_001', 'Karthik Sharma', '55+', 1, 'Hyderabad', 'Tier 1', 'Verified', 1250.0, 32, 0, '+91 98490 54321', 'SBI •••• 4821'),
        ('USR00101', 'Savitri Devi', '55+', 1, 'Warangal', 'Tier 2', 'Verified', 620.0, 18, 0, '+91 94401 22334', 'Andhra Bank •••• 1092'),
        ('USR00102', 'Ramesh Rao', '55+', 1, 'Vijayawada', 'Tier 2', 'Verified', 980.0, 22, 0, '+91 98480 99887', 'HDFC Bank •••• 5543'),
        ('USR00103', 'Priya Reddy', '25-34', 0, 'Hyderabad', 'Tier 1', 'Verified', 2400.0, 65, 0, '+91 97012 34567', 'ICICI Bank •••• 3321'),
        ('USR00104', 'Arjun Verma', '35-44', 0, 'Bengaluru', 'Tier 1', 'Verified', 3800.0, 48, 0, '+91 99887 76655', 'Axis Bank •••• 7712')
    ]

    cursor.executemany('''
    INSERT OR REPLACE INTO users (
        user_id, name, age_group, is_elderly, city, city_tier, kyc_status,
        avg_transaction_value, avg_monthly_transactions, is_frozen, emergency_contact, linked_bank
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', users_seed)

    # Seed initial transactions
    initial_txs = [
        (
            'TXN-INIT-001', 'user_001', 'Electricity Board Bill', 'spdcl.billpay@sbi', 'Merchant',
            1450.0, datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'Verified', 0.08, 'LOW RISK', 0,
            json.dumps([]), json.dumps({"amount": 1450.0, "transaction_velocity": 1, "is_elderly": 1}),
            json.dumps({"reason_english": "Regular monthly utility bill payment.", "warning_english": "Safe transaction", "warning_hindi": "सुरक्षित लेनदेन", "warning_telugu": "సురక్షితమైన లావాదేవీ"}),
            'GPay', 'Hyderabad, TS', 'Android', 1
        ),
        (
            'TXN-INIT-002', 'user_001', 'Apollo Pharmacy', 'apollomed@icici', 'Merchant',
            820.0, datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'Verified', 0.12, 'LOW RISK', 0,
            json.dumps([]), json.dumps({"amount": 820.0, "transaction_velocity": 1, "is_elderly": 1}),
            json.dumps({"reason_english": "Verified registered health merchant.", "warning_english": "Safe transaction", "warning_hindi": "सुरक्षित लेनदेन", "warning_telugu": "సురక్షితమైన లావాదేవీ"}),
            'PhonePe', 'Hyderabad, TS', 'Android', 1
        ),
        (
            'TXN-INIT-003', 'user_001', 'KBC Lottery Support', 'win_prize98@ybl', 'User',
            25000.0, datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'Blocked', 0.89, 'HIGH RISK', 1,
            json.dumps(["Unrecognized Device Login (New Hardware ID)", "IP Geolocation Mismatch from Registered City", "Elderly User Vulnerability Safeguard Triggered"]),
            json.dumps({"amount": 25000.0, "transaction_velocity": 4, "is_elderly": 1, "new_device_flag": 1, "ip_location_mismatch": 1}),
            json.dumps({
                "reason_english": "Urgent collect request from an unverified lottery account. UPI PIN is only needed to send money, not receive prizes!",
                "warning_english": "Danger! Entering UPI PIN will immediately deduct ₹25,000 from your bank account! Do not enter PIN.",
                "warning_hindi": "सावधान! यह धोखाधड़ी हो सकती है। UPI पिन डालने से आपके खाते से पैसे कट जाएंगे!",
                "warning_telugu": "హెచ్చరిక! మీ UPI పిన్ నమోదు చేస్తే మీ ఖాతా నుండి ₹25,000 కట్ అవుతాయి. పిన్ ఎంటర్ చేయకండి!"
            }),
            'Paytm', 'Remote/VPN', 'Web', 1
        )
    ]

    cursor.executemany('''
    INSERT OR REPLACE INTO transactions (
        transaction_id, user_id, receiver_name, receiver_upi_id, receiver_type,
        amount, timestamp, status, risk_score, risk_level, is_fraud,
        risk_indicators, features_used, ai_analysis, payment_app, location_name, device_type, is_elderly
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', initial_txs)

    conn.commit()
    print("-> Database initialized and seeded successfully.")
