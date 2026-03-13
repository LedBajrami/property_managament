<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px;">
<h2>Lease Renewal Reminder</h2>

<p>Hi {{ $resident_name }},</p>

<p>Your lease is expiring soon. Here are the details:</p>

<ul>
    <li><strong>Unit:</strong> {{ $unit_number }}</li>
    <li><strong>Lease End Date:</strong> {{ date('F j, Y', strtotime($end_date)) }}</li>
    <li><strong>Days Remaining:</strong> {{ $days_remaining }} days</li>
</ul>

<p>If you would like to renew your lease, please contact us within the next 30 days.</p>

<p>We look forward to continuing to serve you!</p>

<p>Best regards,<br>Property Management Team</p>
</body>
</html>
