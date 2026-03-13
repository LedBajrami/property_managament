<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px;">
<h2>Rent Payment Reminder</h2>

<p>Hi {{ $resident_name }},</p>

<p>This is a friendly reminder that your rent payment is due soon:</p>

<ul>
    <li><strong>Amount:</strong> ${{ number_format($amount, 2) }}</li>
    <li><strong>Due Date:</strong> {{ date('F j, Y', strtotime($due_date)) }}</li>
    <li><strong>Unit:</strong> {{ $unit_number }}</li>
</ul>

<p>Please ensure payment is submitted by the due date to avoid late fees.</p>

<p>Thank you,<br>Property Management Team</p>
</body>
</html>
