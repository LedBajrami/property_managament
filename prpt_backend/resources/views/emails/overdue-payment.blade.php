<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px;">
<h2 style="color: #dc2626;">Overdue Payment Notice</h2>

<p>Hi {{ $resident_name }},</p>

<p>Your rent payment is now overdue:</p>

<ul>
    <li><strong>Amount Due:</strong> ${{ number_format($amount, 2) }}</li>
    <li><strong>Late Fee:</strong> ${{ number_format($late_fee, 2) }}</li>
    <li><strong>Total Due:</strong> ${{ number_format($amount + $late_fee, 2) }}</li>
    <li><strong>Original Due Date:</strong> {{ date('F j, Y', strtotime($due_date)) }}</li>
</ul>

<p style="color: #dc2626;"><strong>Please submit payment immediately to avoid further penalties.</strong></p>

<p>If you have questions, please contact us.</p>

<p>Property Management Team</p>
</body>
</html>
