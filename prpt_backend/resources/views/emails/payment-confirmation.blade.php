<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px;">
<h2>Payment Confirmation</h2>

<p>Hi {{ $resident_name }},</p>

<p>We have received your rent payment. Your receipt is attached to this email.</p>

<ul>
    <li><strong>Receipt Number:</strong> {{ $receipt_number }}</li>
    <li><strong>Amount Paid:</strong> ${{ number_format($amount_paid, 2) }}</li>
    <li><strong>Payment Date:</strong> {{ $payment_date->format('F j, Y') }}</li>
    <li><strong>Payment Method:</strong> {{ ucfirst(str_replace('_', ' ', $payment_method)) }}</li>
    <li><strong>Unit:</strong> {{ $unit_number }}</li>
</ul>

<p>Please keep this receipt for your records.</p>

<p>Thank you,<br>Property Management Team</p>
</body>
</html>
