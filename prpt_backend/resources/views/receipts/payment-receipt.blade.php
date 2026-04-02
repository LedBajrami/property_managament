<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payment Receipt</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
            margin: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            color: #2563eb;
        }
        .info-section {
            margin-bottom: 20px;
        }
        .info-section h3 {
            margin-bottom: 10px;
            color: #1e40af;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
        }
        .label {
            font-weight: bold;
            width: 40%;
        }
        .value {
            width: 60%;
            text-align: right;
        }
        .payment-details {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .total {
            font-size: 18px;
            font-weight: bold;
            color: #059669;
            text-align: right;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px solid #333;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
    </style>
</head>
<body>
<div class="header">
    <h1>PAYMENT RECEIPT</h1>
    <p>Receipt #{{ $receipt_number }}</p>
    <p>Date: {{ $transaction->payment_date->format('F j, Y') }}</p>
</div>

<div class="info-section">
    <h3>Company Information</h3>
    <div class="info-row">
        <span class="label">Company Name:</span>
        <span class="value">{{ $company->name }}</span>
    </div>
    <div class="info-row">
        <span class="label">Email:</span>
        <span class="value">{{ $company->email }}</span>
    </div>
    <div class="info-row">
        <span class="label">Phone:</span>
        <span class="value">{{ $company->phone }}</span>
    </div>
</div>

<div class="info-section">
    <h3>Resident Information</h3>
    <div class="info-row">
        <span class="label">Name:</span>
        <span class="value">{{ $resident->first_name }} {{ $resident->last_name }}</span>
    </div>
    <div class="info-row">
        <span class="label">Email:</span>
        <span class="value">{{ $resident->email }}</span>
    </div>
    <div class="info-row">
        <span class="label">Unit:</span>
        <span class="value">{{ $lease->unit->unit_number }}</span>
    </div>
</div>

<div class="payment-details">
    <h3 style="margin-top: 0;">Payment Details</h3>
    <div class="info-row">
        <span class="label">Payment Date:</span>
        <span class="value">{{ $transaction->payment_date->format('F j, Y') }}</span>
    </div>
    <div class="info-row">
        <span class="label">Payment Method:</span>
        <span class="value">{{ ucfirst(str_replace('_', ' ', $transaction->payment_method)) }}</span>
    </div>
    @if($transaction->transaction_id)
        <div class="info-row">
            <span class="label">Transaction ID:</span>
            <span class="value">{{ $transaction->transaction_id }}</span>
        </div>
    @endif
    <div class="info-row">
        <span class="label">Period:</span>
        <span class="value">{{ $schedule->due_date->format('F Y') }}</span>
    </div>
</div>

<div class="info-section">
    <h3>Payment Breakdown</h3>
    <div class="info-row">
        <span class="label">Rent Amount:</span>
        <span class="value">${{ number_format($schedule->amount, 2) }}</span>
    </div>
    @if($schedule->late_fee)
        <div class="info-row">
            <span class="label">Late Fee:</span>
            <span class="value">${{ number_format($schedule->late_fee, 2) }}</span>
        </div>
    @endif
    <div class="total">
        TOTAL PAID: ${{ number_format($transaction->amount_paid, 2) }}
    </div>
</div>

<div class="footer">
    <p>Thank you for your payment!</p>
    <p>This is a computer-generated receipt and does not require a signature.</p>
    <p>For questions, please contact {{ $company->email }}</p>
</div>
</body>
</html>
